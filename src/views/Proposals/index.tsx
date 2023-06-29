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
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Proposals: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const [requestsCount, setRequestsCount] = useState<number>();
    const { isReady } = useImpactMarketCouncil();
    const [loading, setLoading] = useState(false);
    const { view } = usePrismicData();
    const { t } = useTranslations();
    const { update, getByKey } = useFilters();

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
            }
        };

        getCommunities();
    }, []);

    const handleTab = () => {
        if (getByKey('tab') === 'proposals' || getByKey('tab') === undefined) {
            return 0;
        } else if (getByKey('tab') === 'requests') {
            return 1;
        }
    };

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={isLoading || loading || !isReady}
        >
            <Display>
                <String id="proposals" />
            </Display>
            <RichText content={view.data.messageVoteOnProposals} g500 />

            <Tabs defaultIndex={handleTab()}>
                <TabList>
                    <Tab
                        onClick={() => update({ page: 1, tab: 'proposals' })}
                        title={t('proposals')}
                    />
                    <Tab
                        number={requestsCount}
                        onClick={() => update({ page: 1, tab: 'requests' })}
                        title={t('requests')}
                    />
                </TabList>
                <TabPanel>
                    <ProposalsPage />
                </TabPanel>
                <TabPanel>
                    <AddCommunityPage
                        requestsCount={requestsCount}
                        setRequestsCount={setRequestsCount}
                    />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default Proposals;
