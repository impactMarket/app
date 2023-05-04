import { Box, Display, Tab, TabList, Tabs, ViewContainer } from '@impact-market/ui';
import BorrowersList from './BorrowersList';
import React from 'react';
import RichText from 'src/libs/Prismic/components/RichText';

const MicrocreditManager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    return (
        <ViewContainer isLoading={isLoading}>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex>
                <Box>
                    <Display g900  medium>
                        Microcredit Manager
                    </Display>
                    <RichText content="Overall view of all Microcredit programs being deployed right now and managed by you." g500 mt={0.25} />
                </Box>
            </Box>
            <Tabs>
                <TabList>
                    <Tab
                        title="Repayments"
                    />
                </TabList>
            </Tabs>
            <Box mt={0.5}>
                <BorrowersList />
            </Box>
        </ViewContainer>
    );
};

export default MicrocreditManager;
