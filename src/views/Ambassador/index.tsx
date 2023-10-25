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
import {
    getCommunityBeneficiaries,
    getCommunityEntities,
    getCommunityEntity
} from '../../graph/community';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import Activity from './Activity';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import ShimmerEffect from '../../components/ShimmerEffect';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useSuspiciousReports from '../../hooks/useSuspiciousReports';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

type Cards = {
    number: number;
    title: any;
    type: string;
    url: string;
    loading: boolean;
};

const Ambassador: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [loading, setLoading] = useState(false);
    const [myCommunities, setMyCommunities] = useState([]);
    const [currentCommunity, setCurrentCommunity] = useState(null) as any;
    const [getCommunities] = useGetCommunitiesMutation();
    const { view } = usePrismicData();
    const auth = useSelector(selectCurrentUser);
    const { update, getByKey } = useFilters();
    const isNotViewAll = !(
        getByKey('view') === 'myCommunities' || !getByKey('view')
    );
    const { t } = useTranslations();
    const language = auth?.user?.language || 'en-US';
    const [activitySortDesc, setActivitySortDesc] = useState(true);

    const communityEntity = useQuery(getCommunityEntity, {
        variables: { address: getByKey('view')?.toString().toLowerCase() }
    });
    const { data: communityEntities, loading: entitiesLoading } = useQuery(
        getCommunityEntities,
        {
            variables: {
                ids: auth?.user?.ambassador?.communities,
                orderDirection: activitySortDesc ? 'desc' : 'asc'
            }
        }
    );

    const { data: beneficiariesCount, loading: beneficiariesLoading } =
        useQuery(getCommunityBeneficiaries, {
            variables: {
                ids:
                    getByKey('view') === 'myCommunities' || !getByKey('view')
                        ? auth?.user?.ambassador?.communities
                        : [getByKey('view')?.toString().toLowerCase()]
            }
        });

    const totalBeneficiaries = beneficiariesCount?.communityEntities?.reduce(
        (acc: any, el: any) => acc + el.beneficiaries,
        0
    );

    const community: any = myCommunities.find(
        (el: any) => getByKey('view') && el.value === getByKey('view')
    );

    const { data, loadingReports } = useSuspiciousReports(
        community ? community.id : null
    );

    useEffect(() => {
        const getSuspiciousActivitiesReportsMethod = async () => {
            try {
                setLoading(true);

                const communities: any = await getCommunities({
                    ambassadorAddress: auth?.user?.address,
                    limit: 999
                });

                const myCommunities = communities?.data?.rows?.map(
                    (el: any) => {
                        return {
                            currency: el.currency,
                            id: el.id,
                            label: el.name,
                            value: el.contractAddress
                        };
                    }
                );

                setCurrentCommunity(
                    myCommunities.find(
                        (el: any) =>
                            getByKey('view') && el.value === getByKey('view')
                    )
                );

                setMyCommunities(myCommunities);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getSuspiciousActivitiesReportsMethod();
    }, []);

    const cards = [
        {
            loading: loadingReports,
            number: data?.count,
            title: <String id="reportedSuspiciousActivity" />,
            type: 'SuspiciousReports',
            url: `/ambassador/reports?community=${
                currentCommunity ? currentCommunity.id : ''
            }`
        },
        {
            loading: beneficiariesLoading,
            number: totalBeneficiaries,
            title: 'Beneficiaries',
            type: 'Beneficiaries',
            url: `/manager/beneficiaries?community=${
                currentCommunity ? currentCommunity.id : ''
            }&state=0`
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
                            <ShimmerEffect
                                isLoading={card?.loading}
                                style={{ height: '2rem', width: '20%' }}
                            >
                                {card.number ? card.number : 0}
                            </ShimmerEffect>
                        </Display>
                    </Box>
                    {(isNotViewAll ||
                        (!isNotViewAll &&
                            card.type === 'SuspiciousReports')) && (
                        <Box w="100%">
                            <Divider />
                            <Box fLayout="end" flex pl={1.5} pr={1.5}>
                                <Link href={card.url}>{t('viewAll')}</Link>
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>
        );
    };

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading || loading}>
            <Display medium>
                <String id="dashboard" />
            </Display>
            <RichText
                content={view?.data?.messageCommunitiesPerforming}
                g500
                mt={0.25}
            />

            <Grid {...({} as any)} cols={1} pt={1}>
                <Box pr={{ sm: 0.75, xs: 0 }} w={{ sm: '50%', xs: '100%' }}>
                    <Select
                        callback={(value: any) => {
                            const gotoCommunity: any = myCommunities.find(
                                (el: any) => el.value === value
                            );

                            setCurrentCommunity(gotoCommunity);
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
                <Grid
                    {...({} as any)}
                    cols={{ md: 4, sm: 2, xs: 1 }}
                    fWrap="wrap"
                    flex
                    pt={1}
                >
                    {cards.map((el, key) => (
                        <Col key={key}>{renderCard(el)}</Col>
                    ))}
                </Grid>
                {!currentCommunity && (
                    <Activity
                        activitySort={activitySortDesc}
                        data={communityEntities?.communityEntities}
                        loading={entitiesLoading}
                        myCommunities={myCommunities}
                        setActivitySort={setActivitySortDesc}
                    />
                )}
                {currentCommunity && (
                    <ProgressBar
                        communityEntity={communityEntity?.data?.communityEntity}
                        currency={currentCommunity?.currency}
                        language={language}
                    />
                )}
            </Grid>
        </ViewContainer>
    );
};

export default Ambassador;
