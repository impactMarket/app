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
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Filters from '../../components/Filters';
import Metrics from './Metrics';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import styled from 'styled-components';
import useFilters from '../../hooks/useFilters';
import useLevels from '../../hooks/learn-and-earn/useLevels';
import useSWR from 'swr';

const ITEMS_PER_PAGE = 3;

const Dropdown = styled(DropdownMenu)`
    > div {
        width: 100%;
    }
`;

const ClickableCard = styled(ComposedCard)`
    cursor: pointer;
`;

const LearnAndEarn = (props: any) => {
    const { prismic, lang } = props;
    const { view } = usePrismicData();
    const {
        headingTitle: heading,
        headingContent: content,
        claimAvailable = null,
        claimDisabled = null
    } = view.data;

    console.log(view.data);

    const { levels, categories } = prismic;
    const router = useRouter();
    const auth = useSelector(selectCurrentUser);
    const { update, getByKey, clear } = useFilters();
    const [currentPage, setCurrentPage] = useState(+getByKey('page') ?? 0);
    const [search, setSearch] = useState(getByKey('search') ?? '');
    const [state, setState] = useState(getByKey('state') || 'available');
    const { data } = useLevels(levels);
    const filteredData = data
        .filter((item: any) => item.title.toLowerCase().indexOf(search) !== -1)
        .filter((el: any) => el.status === state)
        .filter((el: any) =>
            !!getByKey('category') ? el.category === getByKey('category') : el
        );

    const loggedTabs = auth.type ? ['started', 'completed'] : [];
    const TabItems = ['available', ...loggedTabs];
    const tabRouter = (state: string) => {
        switch (state) {
            case 'available':
                return 0;
            case 'started':
                return 1;
            case 'completed':
                return 2;
            default:
                return 0;
        }
    }

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
    const { data: laeData, error } = useSWR(`/learn-and-earn`, fetcher);

    const totalPages = (items: number) => {
        const pages = Math.floor(items / ITEMS_PER_PAGE);

        return items % ITEMS_PER_PAGE > 0 ? pages + 1 : pages;
    };

    const pageStart = currentPage * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE;

    const filterLevels = (filter: string) => {
        return data.filter((el: any) => el.status === filter);
    };

    const categoryItems = [
        { id: '', onClick: () => clear('category'), title: 'All' },
        ...new Set(
            Object.values(categories).map((item: any, idx: number) => {
                const value = Object.keys(categories)[idx];

                return {
                    id: value,
                    onClick: () => update({ category: value }),
                    title: item.title
                };
            })
        )
    ];

    const selectedCategory =
        categoryItems.find((el) => el.id === getByKey('category') ?? '')
            ?.title || 'Category';

    useEffect(() => {
        setCurrentPage(
            /* eslint-disable no-nested-ternary */
            !!getByKey('search')
                ? 0
                : !!getByKey('page')
                ? +getByKey('page')
                : 0
        );
        setSearch(getByKey('search')?.toString().toLowerCase() || '');
    }, [getByKey('search')]);

    return (
        <ViewContainer isLoading={!data && !error && !laeData && !filteredData}>
            <Box flex style={{ justifyContent: 'space-between' }}>
                <Box flex fDirection={'column'}>
                    <Display g900 medium mb=".25rem">
                        {heading}
                    </Display>

                    <RichText content={content} g500 small />
                </Box>
            </Box>

            {auth.type && (
                <Metrics
                    claimRewards={laeData?.data?.claimRewards[0] ?? {}}
                    copy={{ failed: claimDisabled, success: claimAvailable }}
                />
            )}
            <Tabs defaultIndex={tabRouter(getByKey('state')?.toString() ?? 'available')}>
                <TabList>
                    {TabItems.map((el: string) => (
                        <Tab
                            onClick={() => {
                                setState(el);
                                update({ state: el });
                            }}
                            // ADD TAB TITLE TO TRANSLATIONS
                            title={el}
                            number={filterLevels(el).length}
                        />
                    ))}
                </TabList>

                <Box flex fWrap={'wrap'} mb="1rem">
                    <Box padding=".5rem 0rem">
                        <Dropdown
                            asButton
                            headerProps={{
                                fLayout: 'center between'
                            }}
                            icon="chevronDown"
                            items={categoryItems}
                            title={selectedCategory}
                            wrapperProps={{
                                mr: 1,
                                w: 15
                            }}
                        />
                    </Box>

                    <Box padding=".5rem 0rem" fGrow={1}>
                        <Filters property="search" />
                    </Box>
                </Box>

                <Grid colSpan={1.5} cols={{ lg: 3, xs: 1 }}>
                    {filteredData &&
                        filteredData
                            .slice(pageStart, pageEnd)
                            .map((elem: any) => {
                                return (
                                    <ClickableCard
                                        heading={elem?.title || ''}
                                        content={`${elem?.totalLessons} lessons`}
                                        image={elem.data?.image?.url}
                                        label={
                                            categories[elem?.category]?.title
                                        }
                                        // ADD ON UI SIDE
                                        // onClick={() =>
                                        //     router.push(
                                        //         `/${lang}/learn-and-earn/${
                                        //             elem?.uid
                                        //         }${
                                        //             elem?.id
                                        //                 ? `?levelId=${elem?.id}`
                                        //                 : ''
                                        //         }`
                                        //     )
                                        // }
                                    >
                                        <Button 
                                            fluid
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
                                            secondary 
                                            xl
                                        >
                                            {`Earn up to ${elem.totalReward} PACTS`}
                                        </Button>
                                    </ClickableCard>
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
