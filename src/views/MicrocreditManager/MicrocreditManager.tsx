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
import { useEffect } from 'react';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import ApproveRejectTab from './ApproveRejectTab';
import RepaymentsTab from './RepaymentsTab';
import RichText from 'src/libs/Prismic/components/RichText';
import Select from 'src/components/Select';
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

    const obj = [
        {
            label: 'Antigua and Barbuda',
            value: 'AG'
        },
        {
            label: 'Aruba',
            value: 'AW'
        },
        {
            label: 'Bolivia',
            value: 'BO'
        },
        {
            label: 'Brazil',
            value: 'BR'
        },
        {
            label: 'France',
            value: 'FR'
        },
        {
            label: 'French Guiana',
            value: 'GF'
        },
        {
            label: 'Germany',
            value: 'DE'
        },
        {
            label: 'India',
            value: 'IN'
        },
        {
            label: 'Namibia',
            value: 'NA'
        },
        {
            label: 'Peru',
            value: 'PE'
        },
        {
            label: 'Portugal',
            value: 'PT'
        },
        {
            label: 'Romania',
            value: 'RO'
        }
    ];

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
                                limit: managerDetails?.currentLentAmountLimit.toString()
                            }}
                        />
                    }
                />
            )}
            <Row>
                <Col colSize={{ sm: 8, xs: 12 }}>
                    <Display g900 medium>
                        {title}
                    </Display>

                    <Box mt={0.25}>
                        <RichText content={content} g500 mt={0.25} />
                    </Box>
                </Col>

                <Col
                    colSize={{ sm: 4, xs: 12 }}
                    pt={{ sm: 1, xs: 0 }}
                    tAlign={{ sm: 'right', xs: 'left' }}
                    style={{
                        height: 'fit-content'
                    }}
                >
                    <Row>
                        <Col colSize={{ sm: 6, xs: 12 }} pr={0.5}>
                            <Select
                                // callback={(value: any) => {
                                //     setSelectedCountries(value);
                                //     update({ country: value.join(';'), page: 0 });
                                // }}
                                initialValue="EN"
                                isClearable
                                isMultiple
                                options={obj}
                                placeholder="Country (All)"
                                showFlag
                                value="wat"
                                withOptionsSearch
                            />
                        </Col>
                        <Col colSize={{ sm: 6, xs: 12 }} pl={0.5}>
                            <Select
                                // callback={(value: any) => {
                                //     setSelectedCountries(value);
                                //     update({ country: value.join(';'), page: 0 });
                                // }}
                                initialValue="EN"
                                isClearable
                                isMultiple
                                options={obj}
                                placeholder="MC Manager (All)"
                                showFlag
                                value="wat"
                                withOptionsSearch
                            />
                        </Col>
                    </Row>
                </Col>
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
