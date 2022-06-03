/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, CircledIcon, Text, openModal } from '@impact-market/ui';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import String from '../../libs/Prismic/components/String';

const NoBeneficiaries: React.FC = () => {
    return (
        <Box column fLayout="center" flex h="80vh">
            <CircledIcon icon="userCross" info medium /> 
            <Text center g900 medium mt={1}>
                <String id="neBeneficiaries" />
            </Text> 
            <Text center g500 mt={0.25} small>
                <Message center g500 id="onboardedBeneficiary" mt={0.25} small />
            </Text>
            <Button icon="plus" mt={1.5} onClick={() => openModal('addBeneficiary')}>
                <String id="addBeneficiary" />
            </Button>
        </Box>
    );
};

export default NoBeneficiaries;
