import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
import { useGetCommunityMutation } from '../api/community'


const MyCommunity: React.FC<{ isLoading?: boolean; }> = (props) => {
    const { isLoading } = props;
    const [loading, setLoading] = useState(true);
    const router = useRouter()    
    const { user } = useSelector(selectCurrentUser);
    const [getCommunity] = useGetCommunityMutation();

    useEffect(() => {
        const getCommunityFunc = async () => {
            try {
                setLoading(true);

                const community: any = await getCommunity(
                    user?.manager ? 
                        user?.manager?.community : 
                    user?.beneficiary &&
                        user?.beneficiary?.community
                )

                const path = community?.data?.id ? `/communities/${community?.data?.id}` : '/communities';

                router.push(path)

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getCommunityFunc();
    }, []);
    
    return (
        <ViewContainer isLoading={isLoading || loading}/>
    );
};

export default MyCommunity;
