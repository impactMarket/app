import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
import config from '../../config';
import useCommunities from '../hooks/useCommunities';
import useCommunity from '../hooks/useCommunity';

const fetcher = (url: string, headers: any | {}) => fetch(config.baseApiUrl + url, headers).then((res) => res.json());

const MyCommunity: React.FC<{ isLoading?: boolean; }> = (props) => {
    const { isLoading } = props;
    const router = useRouter()    
    const { user } = useSelector(selectCurrentUser);

    const filters = {
        limit: 999,
        review: "pending"
    }

    //  Pending Manager / Community
    const { communities, loadingCommunities } = useCommunities(filters, fetcher);
    const pendingCommunity = communities?.data?.rows?.filter((community: { requestByAddress: string; }) => community?.requestByAddress === user?.address)

    //  Community already accepted
    const { community, loadingCommunity } = useCommunity(user?.manager ? user?.manager?.community : user?.beneficiary && user?.beneficiary?.community, fetcher);

    useEffect(() => {
        if (!user?.roles?.includes('pendingManager')){
            if (community){
                const path = community?.id ? `/communities/${community?.id}` : '/communities';

                router.push(path)
            }
        }  
        if (user?.roles?.includes('pendingManager')){
            if (pendingCommunity?.length > 0){
                const path = pendingCommunity[0]?.id ? `/communities/${pendingCommunity[0]?.id}` : '/communities';

                router.push(path)
            }  
        }           
    }, [loadingCommunities, loadingCommunity])
    
    return (
        <ViewContainer isLoading={isLoading || loadingCommunities || loadingCommunity}/>
    );
};

export default MyCommunity;
