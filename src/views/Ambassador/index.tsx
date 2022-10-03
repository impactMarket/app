import {
    Box,
    Card,
    Col,
    Display,
    Divider,
    Grid,
    Text,
    ViewContainer
} from '@impact-market/ui';
import { ReportsType, useGetAmbassadorReportsMutation } from '../../api/user';
import { getCommunityBeneficiaries } from '../../graph/community';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import ShimmerEffect from '../../components/ShimmerEffect';
import String from '../../libs/Prismic/components/String';
import useBeneficiariesCount from '../../hooks/useBeneficiariesCount';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

type Cards = {
    number: any;
    title: any;
    url: string;
    loading: boolean;
};

const Ambassador: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [loading, setLoading] = useState(false);
    const [myCommunities, setMyCommunities] = useState([]);
    const [reports, setReports] = useState<ReportsType>();
    const [getReports] = useGetAmbassadorReportsMutation();
    const [getCommunities] = useGetCommunitiesMutation();
    const { view } = usePrismicData();
    const auth = useSelector(selectCurrentUser);
    const { update, getByKey } = useFilters();
    const isNotViewAll = !(getByKey('view') === 'myCommunities' || !getByKey('view'));
    let query;

    const { t } = useTranslations();
    const [beneficiariesUrl, setBeneficiariesUrl] = useState('');

    if (getByKey('view') === 'myCommunities' || !getByKey('view')) {
        query = [getCommunityBeneficiaries, { ids: auth?.user?.ambassador?.communities }];
    } else {
        query = [getCommunityBeneficiaries, { ids: [getByKey('view').toString().toLowerCase()] }];
    };

    const { beneficiariesCount, loading: beneficiariesLoading } = useBeneficiariesCount(query);
    

    useEffect(() => {
        const getSuspiciousActivitiesReportsMethod = async () => {
            try {
                setLoading(true);

                const reportsRequest = (await getReports({
                    limit: 1,
                    offset: 0
                }).unwrap()) as any;

                const communities: any = await getCommunities({
                    ambassadorAddress: auth?.user?.address
                });

                const myCommunities = communities?.data?.rows?.map(
                    (el: any) => {
                        return { 
                            id: el.id,
                            label: el.name,
                            value: el.contractAddress 
                        };
                    }
                );

                const currentCommunity = myCommunities.find((el: any) => getByKey('view') && el.value === getByKey('view'));

                setBeneficiariesUrl(`/manager/beneficiaries?community=${currentCommunity ? currentCommunity.id : ''}&state=0`);

                setMyCommunities(myCommunities);

                setReports(reportsRequest?.count);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getSuspiciousActivitiesReportsMethod();
    }, []);

    const cards = [
        {
            loading,
            number: reports || '--',
            title: <String id="reportedSuspiciousActivity" />,
            url: ''
        },
        {
            loading: beneficiariesLoading,
            number: beneficiariesCount,
            title: 'Beneficiaries',
            url: beneficiariesUrl
        }
    ];

    const renderCard = (card: Cards) => {
        return (
            <Box h="100%">
                <Card
                    column
                    fLayout="start between"
                    flex
                    pl={0}
                    pr={0}
                    pt={1.5}
                >
                    <Box h="100%" pl={1.5} pr={1.5} w="100%">
                        <Text g500 medium small>
                            {card.title}
                        </Text>
                        <Display
                            flex
                            g900
                            mt="0.5"
                            semibold
                            small
                            style={{ alignItems: 'center' }}
                        >
                            <ShimmerEffect isLoading={card.loading} style={{height: '2rem', width: '20%'}}>
                                {card.number}
                            </ShimmerEffect>
                        </Display>
                    </Box>
                    {isNotViewAll && <Box w="100%">
                        <Divider />
                        <Box fLayout="end" flex pl={1.5} pr={1.5}>
                            <Link href={card.url}>{t('viewAll')}</Link>
                        </Box>
                    </Box>}
                </Card>
            </Box>
        );
    };

    return (
        <ViewContainer isLoading={isLoading || loading}>
            <Display medium>
                <String id="dashboard" />
            </Display>
            <RichText
                content={view?.data?.messageCommunitiesPerforming}
                g500
                mt={0.25}
            />

            <Grid cols={1} pt={1}>
                <Box pr={{ sm: 0.75, xs: 0 }} w={{ sm: '50%', xs: '100%' }}>
                    <Select
                        callback={(value: any) => {
                            const gotoCommunity =  myCommunities.find((el: any) => el.value === value);

                            setBeneficiariesUrl(`/manager/beneficiaries?community=${gotoCommunity ? gotoCommunity.id : ''}&state=0`);
                            update({ view: value });
                        }}
                        disabled={isLoading}
                        initialValue={getByKey('view') || 'myCommunities'}
                        isMultiple={false}
                        maxW="13rem"
                        name="view"
                        options={[
                            { label: 'My Communities', value: 'myCommunities' },
                            ...myCommunities
                        ]}
                    />
                </Box>
                <Grid cols={{md: 4, sm: 2, xs: 1}} fWrap="wrap" flex pt={1}>
                    {cards.map((el, key) => (
                        <Col key={key}>{renderCard(el)}</Col>
                    ))}
                </Grid>
            </Grid>
        </ViewContainer>
    );
};

export default Ambassador;
