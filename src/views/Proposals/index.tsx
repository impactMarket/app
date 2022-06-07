import {
    Display,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { useGetPendingCommunitiesMutation } from '../../api/community';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import AddCommunityPage from './AddCommunityPage';
import ProposalsPage from './ProposalsPage';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Proposals: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const [requestsCount, setRequestsCount] = useState<number>();
    const { isReady } = useImpactMarketCouncil();
    const [loading, setLoading] = useState(false);
    const { view } = usePrismicData();
    const { t } = useTranslations();

    const limit = 1;
    const offset = 0;

    useEffect(() => {
        const getCommunities = async () => {
            try {
                setLoading(true);

                const response = await getPendingCommunities({
                    limit,
                    offset
                }).unwrap();

                setRequestsCount(response?.count);
                setLoading(false);
            } catch (error) {
                console.log(error);
                
                return false;
            };      
        };

            getCommunities();
    }, []);

    return (
        <ViewContainer isLoading={isLoading || loading || !isReady}>
            <Display>
                <String id="proposal" />
            </Display>
            <RichText content={view.data.messageVoteOnProposals} g500 />

            <Tabs>
                <TabList>
                    <Tab title={t('proposals')} />
                    <Tab number={requestsCount} title={t('requests')}  />
                </TabList>
                <TabPanel>
                    <ProposalsPage />
                </TabPanel>
                <TabPanel>
                    <AddCommunityPage setRequestsCount={setRequestsCount} />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default Proposals;
