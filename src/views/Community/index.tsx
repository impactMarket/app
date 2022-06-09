import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ViewContainer, toast } from '@impact-market/ui';
import { gql, useQuery } from '@apollo/client';

import { useGetCommunityContractMutation, useGetCommunityManagersMutation, useGetCommunityMutation, useUpdateReviewMutation } from '../../api/community';
import CanBeRendered from '../../components/CanBeRendered';
import CommunityDetails from './CommunityDetails';
import Header from './Header';
import Managers from './Managers';
import Message from '../../libs/Prismic/components/Message';

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
    const router = useRouter()
    
    const { data } = useQuery(communityQuery, {
        variables: { id: communityData?.contractAddress?.toLowerCase() },
    });

    const [communityId] = useState(communityData.id);
    const [community, setCommunity]= useState(communityData) as any;
    const [managers, setManagers]= useState(null);
    const [contractData, setContractData]= useState({}) as any;
     
    const [loading, setLoading] = useState(true);

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityContract] = useGetCommunityContractMutation()
    const [getCommunityManagers] = useGetCommunityManagersMutation()

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                
                //  Get managers
                const managersData = await getCommunityManagers({ community: community?.id }).unwrap()

                //  Get community's contract data
                const contractData = await getCommunityContract(community?.id).unwrap()

                setManagers(managersData);
                setContractData(contractData)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }

        getData()
    }, []);

    
    //  Update community review state and get new data
    const functionUpdateReview = async (review: string) => {
        try {
            setLoading(true);

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

            return false;
        }
    };
    
    return (
        <ViewContainer isLoading={loading || isLoading}>
            <Header community={community} updateReview={functionUpdateReview}/>
            <CommunityDetails
                community={community}
                data={data?.communityEntity ?? contractData.data}
            />
            {community?.review === 'accepted' &&
                <CanBeRendered types={['ambassador']}>
                    <Managers 
                        //  If community exists in thegraph (it has contract address) get the data from thegraph. 
                        //  If not, get from API
                        community={ !!data?.communityEntity ? data?.communityEntity : contractData.data }
                        managers={managers?.rows}
                        status={communityData?.status}
                    /> 
                </CanBeRendered>
            }
        </ViewContainer>
    );
};

export default Community;
