import React, { useEffect, useState } from 'react';

import { ViewContainer, toast } from '@impact-market/ui';
import { gql, useQuery } from '@apollo/client';
import config from '../../../config';

import {
    useGetClaimsLocationsMutation,
    useGetCommunityAmbassadorMutation,
    useGetCommunityContractMutation,
    useGetCommunityMutation,
    useGetPendingCommunitiesMutation,
    useGetPromoterMutation,
    useUpdateReviewMutation
} from '../../api/community';
import useCommunitiesManagers from "../../hooks/useCommunitiesManagers";
import useMerchants from "../../hooks/useMerchants";

import CommunityDetails from './CommunityDetails';
import Dashboard from './Dashboard';
import Header from './Header';
import Message from '../../libs/Prismic/components/Message';
import RolesTabs from './RolesTabs';

const fetcher = (url: string, headers: any | {}) => fetch(config.baseApiUrl + url, headers).then((res) => res.json());

//  Get community data from thegraph
//  Temporarily removing non existent fields from the query
const communityQuery = gql`
query communityQuery($id: String!, $todayDayId: Int, $daysBefore: Int) {
    communityEntity(id: $id) {
        id
        beneficiaries
        claimAmount
        maxClaim
        incrementInterval
    }
    communityDailyEntities(where: {community: $id, dayId_lte: $todayDayId, dayId_gte: $daysBefore} orderBy: dayId, orderDirection: asc) {
        beneficiaries
        claimed
        claims
        contributed
        contributors
        volume
        transactions
        reach
        fundingRate
        dayId
    }
}
`;

const daysInterval = 30;

const Community: React.FC<{ isLoading?: boolean; communityData: any; }> = (props) => {
    const { communityData, isLoading } = props;

    const [communityId] = useState(communityData.id);
    const [community, setCommunity]= useState(communityData) as any;
    const [contractData, setContractData]= useState({}) as any;
    const [ambassador, setAmbassador]= useState({}) as any;
    const [claimsLocation, setClaimsLocation]= useState({}) as any;
    const [promoter, setPromoter]= useState({}) as any;

    const { data } = useQuery(communityQuery, {
        variables: { 
            daysBefore: Math.floor(new Date().getTime()/1000/86400) - daysInterval,
            id: communityData?.contractAddress?.toLowerCase(), 
            todayDayId: Math.floor(new Date().getTime()/1000/86400)
        },
    });    

    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState({
        button: '',
        state: false
    });
    const [refreshingPage, setRefreshingPage] = useState(false);

    //  Get Managers
    const { managers, loadingManagers } = useCommunitiesManagers(community?.id, 
        [
            'limit=999',
            'state=0'
        ], 
        fetcher);

    //  Get Merchants
    const { merchants, loadingMerchants } = useMerchants(community?.id, fetcher);

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityContract] = useGetCommunityContractMutation();
    const [getClaimsLocation] = useGetClaimsLocationsMutation();
    const [getPromoter] = useGetPromoterMutation();
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const [getCommunityAmbassador] = useGetCommunityAmbassadorMutation();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)

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
            setButtonLoading({
                button:review,
                state:true
            })

            await updateReview({
                body: {
                    review
                },
                id: communityId
            });

            const community: any = await getCommunity(communityId);

            setCommunity(community.data);

            setButtonLoading({
                button:'',
                state:false
            })

            toast.success(<Message id="communityState" variables={{ review }} />);

        } catch (error) {
            console.log(error);

            toast.error(<Message id="errorOcurred"/>);

            setButtonLoading({
                button:'',
                state:false
            })

            return false;
        }

        setButtonLoading({
            button:'',
            state:false
        })
    };

    return (
        <ViewContainer isLoading={loading || isLoading || refreshingPage || loadingManagers || loadingMerchants}>
            <Header
                buttonLoading={buttonLoading}
                community={community}
                updateReview={functionUpdateReview}
            />
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
                merchants={merchants}
                requestedCommunity={!(!!data?.communityEntity)}
                setRefreshingPage={setRefreshingPage}
                status={communityData?.status}
            />
            <Dashboard 
                data={data?.communityDailyEntities}
                daysInterval={daysInterval}
            />
        </ViewContainer>
    );
};

export default Community;
