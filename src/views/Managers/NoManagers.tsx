import { Box, CircledIcon, Text } from '@impact-market/ui';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import String from '../../libs/Prismic/components/String';

const NoManagers: React.FC = () => {
    return (
        <Box column fLayout="center" flex h="80vh">
            <CircledIcon icon="userCross" info medium />
            <Text center g900 medium mt={1}>
                <String id="noManagersFound" />
            </Text>
            <Message center g500 id="communityHasntOnboarded" mt={0.25} small />
        </Box>
    );
};

export default NoManagers;
