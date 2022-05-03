import { Display, ViewContainer } from '@impact-market/ui';
import { checkUserPermission, userBeneficiary } from '../utils/users';
import { useRouter } from 'next/router';
import React from 'react';

const Home: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const router = useRouter();

    // If the User is a Beneficiary, send to the Beneficiary page
    // TODO: Check if this verification is supposed to stay here 
    if(checkUserPermission([userBeneficiary])) {
        router.push('/beneficiary');

        return null;
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>Welcome home</Display>
        </ViewContainer>
    );
};

export default Home;
