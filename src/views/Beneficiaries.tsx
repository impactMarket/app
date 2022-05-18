import { Box, Button, CircledIcon, Display, Text, ViewContainer, openModal } from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
// import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../utils/users';
import React from 'react';

// TODO: remove after implementing request to get beneficiares
const hasUsers = false;

const Beneficiaries: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    // TODO: load information from prismic and use it in the content
    // const { view } = usePrismicData();

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    // TODO: load texts from Prismic

    return (
        <ViewContainer isLoading={isLoading}>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex>
                <Box>
                    <Display g900  medium>
                        Beneficiaries
                    </Display>
                    <Text g500 mt={0.25} >
                        Manage community beneficiaries.
                    </Text>
                </Box>
                {
                    hasUsers &&
                    <Button icon="plus" mt={{ sm: 0, xs: 1 }} onClick={() => openModal('addBeneficiary')}>
                        Add Beneficiary
                    </Button>
                }
            </Box>
            {
                !hasUsers &&
                <Box column fLayout="center" flex h="80vh">
                    <CircledIcon icon="userCross" info medium /> 
                    <Text center g900 medium mt={1}>
                        No beneficiaries found.
                    </Text> 
                    <Text center g500 mt={0.25} small>
                        This community hasn`t yet onboarded any beneficiary.
                    </Text>
                    <Button icon="plus" mt={1.5} onClick={() => openModal('addBeneficiary')}>
                        Add Beneficiary
                    </Button>
                </Box>
            }
        </ViewContainer>
    );
};

export default Beneficiaries;
