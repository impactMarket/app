import {
    Box,
    Card,
    Col,
    Display,
    Divider,
    Grid,
    Text,
    TextLink,
    ViewContainer
} from '@impact-market/ui';
import { ReportsType, useGetAmbassadorReportsMutation } from '../../api/user';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import ShimmerEffect from '../../components/ShimmerEffect';
import String from '../../libs/Prismic/components/String';
import useBeneficiariesCount from '../../hooks/useBeneficiariesCount';
import useFilters from '../../hooks/useFilters';

import {
    getBeneficiaries,
    getCommunityBeneficiaries
} from '../../graph/community';

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
    const isNotViewAll = !(getByKey('view') === 'viewAll' || !getByKey('view'));

    let query;

    if (getByKey('view') === 'myCommunities') {
        query = [getCommunityBeneficiaries, { ids: auth?.user?.ambassador?.communities }];
    } else if (isNotViewAll) {
        query = [getCommunityBeneficiaries, { ids: [getByKey('view').toString().toLowerCase()] }];
    } else {
        query = [getBeneficiaries];
    }

    const { beneficiariesCount, loading: load } = useBeneficiariesCount(query);

    const cards = [
        {
            loading: false,
            number: '--',
            title: 'Suspicious Transactions',
            url: '',
        },
        {
            loading: false,
            number: reports || '--',
            title: <String id="reportedSuspiciousActivity" />,
            url: '',
        },
        {
            loading: load,
            number: beneficiariesCount,
            title: 'Beneficiaries',
            url: '/manager/beneficiaries',
        },
        {
            loading: false,
            number: '--',
            title: 'Inactive beneficiaries',
            url: '',
        }
    ];

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
                        return { label: el.name, value: el.contractAddress };
                    }
                );

                setMyCommunities(myCommunities);

                setReports(reportsRequest?.count);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getSuspiciousActivitiesReportsMethod();
    }, []);

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
                            <ShimmerEffect isLoading={card.loading}>
                                {card.number}
                            </ShimmerEffect>
                        </Display>
                    </Box>
                    {isNotViewAll && <Box w="100%">
                        <Divider />
                        <Box fLayout="end" flex pl={1.5} pr={1.5}>
                            <TextLink href={card.url} medium p700 small>
                                <String id="viewAll" />
                            </TextLink>
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
                            update({ view: value });
                        }}
                        disabled={isLoading}
                        initialValue={getByKey('view') || 'viewAll'}
                        isMultiple={false}
                        maxW="13rem"
                        name="view"
                        options={[
                            { label: 'View all', value: 'viewAll' },
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
