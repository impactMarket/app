import {
    Alert,
    Box,
    Display,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { useEffect } from 'react';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import ApproveRejectTab from './ApproveRejectTab';
import RepaymentsTab from './RepaymentsTab';
import RichText from 'src/libs/Prismic/components/RichText';
import useFilters from 'src/hooks/useFilters';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const MicrocreditManager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { update, getByKey } = useFilters();
    const { title, content } = extractFromView('heading') as any;
    const {
        microcreditLimitReachTitle,
        microcreditLimitReachMessage,
        approveReject
    } = extractFromView('messages') as any;

    useEffect(() => {
        if (!getByKey('tab')) {
            update('tab', 'repayments');
        }
    }, []);

    const { managerDetails, isReady } = useLoanManager();

    const limitReach =
        managerDetails?.currentLentAmount >=
        managerDetails?.currentLentAmountLimit;

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading || !isReady}>
            {limitReach && (
                <Alert
                    icon="alertCircle"
                    mb={1.5}
                    title={microcreditLimitReachTitle}
                    message={
                        <RichText
                            content={microcreditLimitReachMessage}
                            variables={{
                                limit: managerDetails?.currentLentAmountLimit
                            }}
                        />
                    }
                />
            )}
            <Box
                fDirection={{ sm: 'row', xs: 'column' }}
                fLayout="start between"
                flex
            >
                <Box>
                    <Display g900 medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
            </Box>
            <Tabs defaultIndex={getByKey('tab') === 'approveReject' ? 1 : 0}>
                <TabList>
                    <Tab
                        title={t('repayments')}
                        onClick={() => {
                            update({
                                filter: '',
                                orderBy: '',
                                page: '',
                                status: '',
                                tab: 'repayments'
                            });
                        }}
                    />
                    <Tab
                        title={approveReject}
                        onClick={() => {
                            update({
                                filter: '',
                                orderBy: '',
                                page: '',
                                status: '',
                                tab: 'approveReject'
                            });
                        }}
                    />
                </TabList>
                <TabPanel>
                    <RepaymentsTab />
                </TabPanel>
                <TabPanel>
                    <ApproveRejectTab />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default MicrocreditManager;