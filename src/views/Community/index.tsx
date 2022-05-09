import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import {
    ViewContainer,
    toast
} from '@impact-market/ui';

import { useGetCommunityContractMutation, useGetCommunityMutation, useUpdateReviewMutation } from '../../api/community';
import Beneficiaries from './Beneficiaries'
import Header from './Header'
import Managers from './Managers'
import getManagers from './mockData'

import { gql, useQuery } from '@apollo/client';

//  Get community data from thegraph
const communityQuery = gql`
query communityQuery($id: String!) {
    communityEntity(id: $id) {
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

    const { loading: queryLoading, data } = useQuery(communityQuery, {
        variables: { id: !!communityData?.contractAddress },
    });

    const [communityId] = useState(communityData.id);
    const [community, setCommunity]= useState(communityData) as any;
    const [managers, setManagers]= useState(null);
    const [contractData, setContractData]= useState({}) as any;
     
    const [loading, setLoading] = useState(true);

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [getContractData] = useGetCommunityContractMutation();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)

                //  Get managers
                const managersData = await getManagers();

                //  Get community's contract data
                const contractData = await getContractData(community?.id).unwrap()

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

            toast.success('Successfully changed community review state!');

            //  Send to /requests if community was declined
            review === 'declined' && router.push('/requests')

        } catch (error) {
            console.log(error);

            toast.error('Please try again later.');

            return false;
        }
    };

    return (
        <ViewContainer isLoading={loading || isLoading}>
            <Header community={community} updateReview={functionUpdateReview}/>
            <Beneficiaries 
                data={
                    //  If community has address (it means it was accepted in proposals) get the data from thegraph. 
                    //  If not, get from API
                    !!communityData?.contractAddress ? (!queryLoading && data?.communityEntity) : contractData.data
                }
            />
            {community?.review === 'accepted' &&
                <Managers community={community} managers={managers}/> 
            }
        </ViewContainer>
    );
};

export default Community;
