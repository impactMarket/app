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
import { selectCurrentUser } from 'src/state/slices/auth';
import { useEffect } from 'react';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import ApproveRejectTab from './ApproveRejectTab';
import RepaymentsTab from './RepaymentsTab';
import RichText from 'src/libs/Prismic/components/RichText';
import Signature from 'src/components/Signature';
import useFilters from 'src/hooks/useFilters';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const MicrocreditManager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { update, getByKey } = useFilters();
    const { title, content } = extractFromView('heading') as any;
    const { signature } = useSelector(selectCurrentUser);

    useEffect(() => {
        if (!getByKey('tab')) {
            update('tab', 'repayments');
        }
    }, []);

    const { managerDetails } = useLoanManager();

    const limitReach =
        managerDetails?.currentLentAmount >=
        managerDetails?.currentLentAmountLimit;

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            {signature && limitReach && (
                <Alert
                    icon="alertCircle"
                    mb={1.5}
                    title="Microcredit limit reach"
                    message={`You microcredit limit of $${managerDetails?.currentLentAmountLimit} has been reached.`}
                    error
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
            {!signature && <Signature />}
            {signature && (
                <Tabs
                    defaultIndex={getByKey('tab') === 'approveReject' ? 1 : 0}
                >
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
                            title="Approve/Reject"
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
            )}
        </ViewContainer>
    );
};

export default MicrocreditManager;
