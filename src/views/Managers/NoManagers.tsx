import { Box, CircledIcon, Text } from '@impact-market/ui';
import React from 'react';

// TODO: add texts to Prismic

const NoManagers: React.FC = () => {
    return (
        <Box column fLayout="center" flex h="80vh">
            <CircledIcon icon="userCross" info medium /> 
            <Text center g900 medium mt={1}>
                No managers found.
            </Text> 
            <Text center g500 mt={0.25} small>
                This community hasn`t yet onboarded any manager.
            </Text>
        </Box>
    );
};
 
export default NoManagers;
