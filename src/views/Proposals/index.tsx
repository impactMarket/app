import {
    Display,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Text,
    ViewContainer
} from '@impact-market/ui';
import { useGetPendingCommunitiesMutation } from '../../api/community';
import AddCommunityPage from './AddCommunityPage';
import ProposalsPage from './ProposalsPage';
import React, { useEffect, useState } from 'react';

const Proposals: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const [requestsCount, setRequestsCount] = useState<number>();

    useEffect(() => {
        const getCommunities = async () => {
            try {
                const response = await getPendingCommunities().unwrap();

                setRequestsCount(response?.count);
            } catch (error) {
                console.log(error);

                return false;
            };      
        };

        getCommunities();
    }, []);

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
                    <Tab number={requestsCount} title="Requests"  />
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
