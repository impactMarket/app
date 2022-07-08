import { ViewContainer } from '@impact-market/ui';
import { useGetCommunityContractMutation, useGetCommunityMutation } from '../../api/community';
import { useRouter } from 'next/router';
import EditPending from './EditPending';
import EditValid from './EditValid';
import React, { useEffect, useState } from 'react';

const EditCommunity: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);
    const [community, setCommunity] = useState({}) as any;
    const [contract, setContract] = useState({}) as any;

    const router = useRouter();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityContract] = useGetCommunityContractMutation();

    useEffect(() => {
        const init = async () => {
            try {
                const id = router?.query?.id as any;
                const communityData = await getCommunity(id).unwrap();
                const contractData = await getCommunityContract(id).unwrap();

                setCommunity(communityData);
                setContract(contractData?.data);
                toggleLoadingCommunity(false);
            }
            catch (error) {
                console.log(error);

                toggleLoadingCommunity(false);

                router.push('/communities');

                return false;
            }
        };

        init();
    }, []);

    return (
        <ViewContainer isLoading={isLoading || loadingCommunity}>
            {community?.status === 'valid' ?
                <EditValid community={community} />
                :
                <EditPending community={community} contract={contract} />
            }
        </ViewContainer>
    );
};

export default EditCommunity;
