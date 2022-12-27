import {
    Box,
    Button,
    ComposedCard,
    Display,
    DropdownMenu,
    Grid,
    Pagination,
    Tab,
    TabList,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useLearnAndEarch } from '@impact-market/utils/useLearnAndEarn';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Filters from '../../components/Filters';
import Metrics from './Metrics';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import useFilters from '../../hooks/useFilters';
import useLevels from '../../hooks/learn-and-earn/useLevels';
import useSWR from 'swr';

const ITEMS_PER_PAGE = 3;

const LearnAndEarn = (props: any) => {
    const { prismic, lang } = props;
    const { view } = usePrismicData();
    const { headingTitle: heading, headingContent: content } = view.data;

    const { levels, categories } = prismic;
    const router = useRouter();
    const auth = useSelector(selectCurrentUser);
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(
        getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0
    );
    const [search, setSearch] = useState(getByKey('search') ?? '');
    // console.log(getByKey('state'));

    const [state, setState] = useState(getByKey('state') || 'available');
    const { data } = useLevels(levels);
    const filteredData = data
        .filter((item: any) => item.title.toLowerCase().indexOf(search) !== -1)
        .filter((el: any) => el.status === state);

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        let page;

        if (event.selected >= 0) {
            page = event.selected;
        } else if (direction === 1) {
            page = currentPage - 1;
        } else if (direction === 2) {
            page = currentPage + 1;
        }

        setCurrentPage(page);
        update({ page });
    };

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());
    const { data: laeData } = useSWR(`/learn-and-earn`, fetcher);
    const { amount, levelId, signature: signatures } =
        laeData?.data?.claimRewards[0] ?? {};
    const { claimRewardForLevels } = useLearnAndEarch();

    const totalPages = (items: number) => {
        const pages = Math.floor(items / ITEMS_PER_PAGE);

        return items % ITEMS_PER_PAGE > 0 ? pages + 1 : pages;
    };

    const pageStart = currentPage * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE;

    const filterLevels = (filter: string) => {
        return data.filter((el: any) => el.status === filter);
    };

    useEffect(() => {
        setCurrentPage(
            /* eslint-disable no-nested-ternary */
            !!getByKey('search')
                ? 0
                : !!getByKey('page')
                ? parseInt(getByKey('page')[0], 10)
                : 0
        );
        setSearch(getByKey('search')?.toString().toLowerCase() || '');
    }, [getByKey('search')]);

    return (
        <ViewContainer>
            <Box flex style={{ justifyContent: 'space-between' }}>
                <Box flex fDirection={'column'}>
                    <Display g900 medium mb=".25rem">
                        {heading}
                    </Display>

                    <RichText content={content} g500 small />
                </Box>
                {amount && levelId && signatures && (
                    <Box>
                        <Button
                            onClick={async () => {
                                console.log(auth.user.address);

                                const response = await claimRewardForLevels(
                                    auth.user.address,
                                    levelId,
                                    amount,
                                    signatures
                                );

                                console.log(response);
                                
                            }}
                        >
                            {'Claim'}
                        </Button>
                    </Box>
                )}
            </Box>

            {auth.type && (
                <Box flex>
                    <Metrics />
                </Box>
            )}

            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab
                        onClick={() => {
                            setState('available');
                            update({ state: 'available' });
                        }}
                        title={'Available'}
                        number={filterLevels('available').length}
                    />
                    {auth.type && (
                        <>
                            <Tab
                                onClick={() => {
                                    setState('started');
                                    update({ state: 'started' });
                                }}
                                title={'Started'}
                                number={filterLevels('started').length}
                            />
                            <Tab
                                onClick={() => {
                                    setState('completed');
                                    update({ state: 'completed' });
                                }}
                                title={'Completed'}
                                number={filterLevels('completed').length}
                            />
                        </>
                    )}
                </TabList>

                <Box flex padding=".5rem 0rem 1.5rem">
                    <Box>
                        <DropdownMenu
                            asButton
                            headerProps={{
                                fLayout: 'center between'
                            }}
                            icon="chevronDown"
                            items={[
                                {
                                    icon: 'loader',
                                    onClick: () => {
                                        console.log('clicked');
                                    },
                                    title: ''
                                }
                            ]}
                            title={'Category'}
                            wrapperProps={{
                                mr: 1,
                                w: 15
                            }}
                        />
                    </Box>

                    <Filters property="search" />
                </Box>

                {console.log([
                    ...new Set(
                        Object.values(categories).map((item: any) => item.title)
                    )
                ])}
                {/* {
                    Object.entries(categories).reduce((item) => {
                        debugger
                    }, {})
                } */}

                <Grid colSpan={1.5} cols={{ lg: 3, xs: 1 }}>
                    {filteredData &&
                        filteredData
                            .slice(pageStart, pageEnd)
                            .map((elem: any) => {
                                return (
                                    <ComposedCard
                                        heading={elem?.title || ''}
                                        content={`${elem?.totalLessons} lessons`}
                                        image={elem.data?.image?.url}
                                        label={
                                            categories[elem?.category]?.title
                                        }
                                    >
                                        <Button
                                            fluid
                                            secondary
                                            xl
                                            onClick={() =>
                                                router.push(
                                                    `/${lang}/learn-and-earn/${
                                                        elem?.uid
                                                    }${
                                                        elem?.id
                                                            ? `?levelId=${elem?.id}`
                                                            : ''
                                                    }`
                                                )
                                            }
                                        >
                                            {`Earn up to ${elem.totalReward} PACTS`}
                                        </Button>
                                    </ComposedCard>
                                );
                            })}
                </Grid>

                <Pagination
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                    mt={2}
                    nextIcon="arrowRight"
                    nextLabel="Next"
                    pageCount={totalPages(filteredData.length)}
                    pb={2}
                    previousIcon="arrowLeft"
                    previousLabel="Previous"
                />
            </Tabs>
        </ViewContainer>
    );
};

export default LearnAndEarn;
