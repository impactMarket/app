import { Display, ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userBeneficiary } from '../utils/userTypes';
import React from 'react';

const Home: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();

    // If the User is a Beneficiary, send to the Beneficiary page
    // TODO: Check if this verification is supposed to stay here 
    if(auth?.user?.type?.includes(userBeneficiary)) {
        router.push('/beneficiary');

        return null;
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>
                Welcome home
            </Display>
        </ViewContainer>
    );
};

export default Home;