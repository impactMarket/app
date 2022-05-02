import {
    Display,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Text,
    ViewContainer
} from '@impact-market/ui';
import AddCommunityPage from './AddCommunityPage';
import ProposalsPage from './ProposalsPage';
import React from 'react';

const Proposals: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>Proposals</Display>
            <Text g500>
                Authorized $PACT holders can vote on proposals to accept or
                decline communities.
            </Text>

            <Tabs>
                <TabList>
                    <Tab title="Proposals" />
                    <Tab title="Requests" />
                </TabList>
                <TabPanel>
                    <ProposalsPage />
                </TabPanel>
                <TabPanel>
                    <AddCommunityPage />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default Proposals;
