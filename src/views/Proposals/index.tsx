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
    const { clear, update, getByKey } = useFilters();

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
                <String id="proposals" />
            </Display>
            <RichText content={view.data.messageVoteOnProposals} g500 />

            <Tabs defaultIndex={getByKey('requests') ? 1 : 0}>
                <TabList>
                    <Tab onClick={() => clear('requests')} title={t('proposals')}/>
                    <Tab number={requestsCount} onClick={() => update('requests', requestsCount)} title={t('requests')}/>
                </TabList>
                <TabPanel>
                    <ProposalsPage />
                </TabPanel>
                <TabPanel>
                    <AddCommunityPage requestsCount={requestsCount} setRequestsCount={setRequestsCount} />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default Proposals;
