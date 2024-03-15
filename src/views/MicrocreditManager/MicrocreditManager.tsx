import {
    Alert,
    Box,
    Col,
    Display,
    Row,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useEffect, useState } from 'react';
import { useLoanManager } from '@impact-market/utils';
import {
    useMicrocreditCountries,
    useMicrocreditManagersByCountry
} from 'src/hooks/useMicrocreditManagersCountry';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import ApproveRejectTab from './ApproveRejectTab';
import RepaymentsTab from './RepaymentsTab';
import RichText from 'src/libs/Prismic/components/RichText';
import Select from 'src/components/Select';
import config from '../../../config';
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
    const auth = useSelector(selectCurrentUser);

    useEffect(() => {
        if (!getByKey('tab')) {
            update('tab', 'repayments');
        }
    }, []);

    const { managerDetails, isReady } = useLoanManager();

    const limitReach =
        managerDetails?.currentLentAmount >=
        managerDetails?.currentLentAmountLimit;

    const [selectedCountry, setSelectedCountry] = useState(getByKey('country'));
    const [selectedManager, setSelectedManager] = useState(getByKey('manager'));

    const { countries, loadingCountries } = useMicrocreditCountries();
    const { managers } = useMicrocreditManagersByCountry(selectedCountry);

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={isLoading || !isReady || loadingCountries}
        >
            {limitReach && (
                <Alert
                    icon="alertCircle"
                    mb={1.5}
                    title={microcreditLimitReachTitle}
                    message={
                        <RichText
                            content={microcreditLimitReachMessage}
                            variables={{
                                limit: managerDetails?.currentLentAmountLimit.toString()
                            }}
                        />
                    }
                />
            )}
            <Row>
                <Col
                    colSize={{
                        sm:
                            auth?.user?.address ===
                                config.microcreditManagerAdmin && 7,
                        xs: 12
                    }}
                >
                    <Display g900 medium>
                        {title}
                    </Display>

                    <Box mt={0.25}>
                        <RichText content={content} g500 mt={0.25} />
                    </Box>
                </Col>

                {auth?.user?.address === config.microcreditManagerAdmin && (
                    <Col
                        colSize={{ sm: 5, xs: 12 }}
                        pt={{ sm: 1, xs: 0 }}
                        tAlign={{ sm: 'right', xs: 'left' }}
                        style={{
                            gap: '1rem',
                            height: 'fit-content'
                        }}
                        flex
                        fLayout={{ sm: 'center end' }}
                    >
                        <Select
                            callback={(value: any) => {
                                setSelectedCountry(value);
                                update({ country: value, manager: '' });
                            }}
                            isClearable
                            initialValue={getByKey('country')}
                            options={countries}
                            placeholder="Country (All)"
                            showFlag
                            value={selectedCountry}
                            withOptionsSearch
                            smaller
                        />
                        <Select
                            callback={(value: any) => {
                                setSelectedManager(value);
                                update({ manager: value });
                            }}
                            initialValue={getByKey('manager')}
                            isClearable
                            options={managers}
                            placeholder="MC Manager (All)"
                            value={selectedManager}
                            withOptionsSearch
                            rtl
                            disabled={!selectedCountry}
                            smaller
                        />
                    </Col>
                )}
            </Row>
            <Tabs defaultIndex={getByKey('tab') === 'approveReject' ? 1 : 0}>
                <TabList>
                    <Tab
                        title={t('repayments')}
                        onClick={() => {
                            update({
                                filter: '',
                                orderBy: '',
                                page: '',
                                search: ' ',
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
                                search: ' ',
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
