import { ViewContainer } from '@impact-market/ui';
import { checkUserPermission, userBeneficiary, userManager } from '../utils/users';
import { useRouter } from 'next/router';
import React from 'react';

const Home: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const router = useRouter();

    // TODO: Check if this verification is supposed to stay here 

    if(checkUserPermission([userBeneficiary])) {
        router.push('/beneficiary');

        return null;
    }
    else if(checkUserPermission([userManager])) {
        router.push('/manager');

        return null;
    }

    router.push('/communities?type=all');

    return (
        <ViewContainer isLoading={isLoading} />
    );
};

export default Home;
