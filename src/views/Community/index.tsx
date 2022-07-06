import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ViewContainer, toast } from '@impact-market/ui';
import { gql, useQuery } from '@apollo/client';

import {
    useGetClaimsLocationsMutation,
    useGetCommunityAmbassadorMutation,
    useGetCommunityContractMutation,
    useGetCommunityManagersMutation,
    useGetCommunityMutation,
    useGetPendingCommunitiesMutation,
    useGetPromoterMutation,
    useUpdateReviewMutation
} from '../../api/community';

import CommunityDetails from './CommunityDetails';
import Header from './Header';
import Message from '../../libs/Prismic/components/Message';
import RolesTabs from './RolesTabs';

//  Get community data from thegraph
const communityQuery = gql`
query communityQuery($id: String!) {
    communityEntity(id: $id) {
        id
        beneficiaries
        claimAmount
        maxClaim
        minTranche
        maxTranche
        incrementInterval
    }
}
`;

const Community: React.FC<{ isLoading?: boolean; communityData: any; }> = (props) => {
    const { communityData, isLoading } = props;
    const router = useRouter();

    const [communityId] = useState(communityData.id);
    const [community, setCommunity]= useState(communityData) as any;
    const [managers, setManagers]= useState(null);
    const [contractData, setContractData]= useState({}) as any;
    const [ambassador, setAmbassador]= useState({}) as any;
    const [claimsLocation, setClaimsLocation]= useState({}) as any;
    const [promoter, setPromoter]= useState({}) as any;
    
    const { data } = useQuery(communityQuery, {
        variables: { id: communityData?.contractAddress?.toLowerCase() },
    });

    const [loading, setLoading] = useState(true);
    const [refreshingPage, setRefreshingPage] = useState(false);

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityContract] = useGetCommunityContractMutation();
    const [getCommunityManagers] = useGetCommunityManagersMutation();
    const [getClaimsLocation] = useGetClaimsLocationsMutation();
    const [getPromoter] = useGetPromoterMutation();
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const [getCommunityAmbassador] = useGetCommunityAmbassadorMutation();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                
                //  Get managers
                const managersData = await getCommunityManagers({ community: community?.id }).unwrap();

                //  Get community's contract data
                const contractData = await getCommunityContract(community?.id).unwrap();

                //  Get calims location
                const claimsLocation = await getClaimsLocation(community?.id).unwrap();
                
                //  Get community's promoter
                const promoter = await getPromoter(community?.id).unwrap();

                //  Get community's ambassador
                const ambassador = await getCommunityAmbassador(community?.id).unwrap();

                if (community.status === 'pending') {
                    const response = await getPendingCommunities({limit: null, offset: 0}).unwrap();

                    const foundResults = response?.rows.filter((row: any) => {
                        return row.id === community.id
                    })

                    if (foundResults.length > 0) setCommunity({...community, isPendingProposal: true});
                }
                
                setManagers(managersData);
                setContractData(contractData);
                setAmbassador(ambassador);
                setPromoter(promoter);
                setClaimsLocation(claimsLocation);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getData()
    }, [refreshingPage]);

    
    //  Update community review state and get new data
    const functionUpdateReview = async (review: string) => {
        try {
            setLoading(true);
            
            setRefreshingPage(true)

            await updateReview({
                body: {
                    review
                },
                id: communityId
            });

            const community: any = await getCommunity(communityId);

            setCommunity(community.data);

            setLoading(false);

            toast.success(<Message id="communityState" variables={{ review }} />);

            //  Send to /requests if community was declined
            review === 'declined' && router.push('/requests')

        } catch (error) {
            console.log(error);

            toast.error(<Message id="errorOcurred"/>);

            setRefreshingPage(false)

            return false;
        }

        setRefreshingPage(false)
    };  

    return (
        <ViewContainer isLoading={loading || isLoading || refreshingPage}>
            <Header community={community} updateReview={functionUpdateReview}/>
            <CommunityDetails
                claimsLocation={claimsLocation}
                community={community}
                data={data?.communityEntity ?? contractData.data}
                promoter={promoter}
            />
            <RolesTabs 
                //  If community exists in thegraph (it has contract address) get the data from thegraph. 
                //  If not, get from API
                ambassador={ambassador}
                community={ !!data?.communityEntity ? data?.communityEntity : contractData.data }
                managers={managers?.rows}
                setRefreshingPage={setRefreshingPage}
                status={communityData?.status}
            /> 
        </ViewContainer>
    );
};

export default Community;
