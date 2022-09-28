import React, { useEffect, useState } from 'react';

import { ViewContainer, toast } from '@impact-market/ui';
import { gql, useQuery } from '@apollo/client';
import config from '../../../config';

import {
    useGetClaimsLocationsMutation,
    useGetCommunityMutation,
    useGetPendingCommunitiesMutation,
    useUpdateReviewMutation
} from '../../api/community';
import useAmbassador from "../../hooks/useAmbassador";
import useContract from "../../hooks/useContract";
import useManagers from "../../hooks/useManagers";
import useMerchants from "../../hooks/useMerchants";
import usePromoter from "../../hooks/usePromoter";

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
    const [claimsLocation, setClaimsLocation]= useState({}) as any;

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

    //  Get Ambassador
    const { ambassador, loadingAmbassador } = useAmbassador(community?.id, fetcher);
    
    //  Get Promoter
    const { promoter, loadingPromoter } = usePromoter(community?.id, fetcher);

    //  Get Contract
    const { contract, loadingContract } = useContract(community?.id, fetcher);

    //  Get Merchants
    const { merchants, loadingMerchants } = useMerchants(community?.id, fetcher);

    //  Get Managers
    const { managers, loadingManagers } = useManagers(community?.id, 
        [
            'limit=999',
            'orderBy=state',
        ], 
        fetcher);

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [getClaimsLocation] = useGetClaimsLocationsMutation();
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)

                //  Get calims location
                const claimsLocation = await getClaimsLocation(community?.id).unwrap();

                if (community.status === 'pending') {
                    const response = await getPendingCommunities({limit: null, offset: 0}).unwrap();

                    const foundResults = response?.rows.filter((row: any) => {
                        return row.id === community.id
                    })

                    if (foundResults.length > 0) setCommunity({...community, isPendingProposal: true});
                }

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

    const loadingData = loading || isLoading || refreshingPage || loadingManagers || loadingMerchants || loadingAmbassador || loadingPromoter || loadingContract;

    return (
        <ViewContainer isLoading={loadingData}>
            <Header
                buttonLoading={buttonLoading}
                community={community}
                updateReview={functionUpdateReview}
            />
            <CommunityDetails
                claimsLocation={claimsLocation}
                community={community}
                data={data?.communityEntity ?? contract}
                promoter={promoter}
            />
            <RolesTabs
                //  If community exists in thegraph (it has contract address) get the data from thegraph.
                //  If not, get from API
                ambassador={ambassador}
                community={ !!data?.communityEntity ? data?.communityEntity : contract }
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
