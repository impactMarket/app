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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Filters from '../../components/Filters';
import Metrics from './Metrics';
import RichText from '../../libs/Prismic/components/RichText';
import useFilters from '../../hooks/useFilters';
import useLevels from '../../hooks/learn-and-earn/useLevels';

const ITEMS_PER_PAGE = 3;

const LearnAndEarn = (props: any) => {
    const { prismic, lang } = props;
    const { levels, categories } = prismic;
    const router = useRouter();
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(
        getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0
    );
    const [search, setSearch] = useState(getByKey('search') ?? '');
    const { data } = useLevels(levels);
    const filteredData = data.filter(
        (item) => item.title.toLowerCase().indexOf(search) !== -1
    );

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = getByKey('page')
            ? parseInt(getByKey('page')[0], 10)
            : 0;
        let page = currentPage;

        if (event.selected >= 0) {
            update({ page: event.selected });
            page = event.selected;
        } else if (direction === 1) {
            page = currentPage - 1;
            update({ page });
        } else if (direction === 2) {
            page = currentPage + 1;
            update({ page });
        }

        setCurrentPage(page);
    };

    const totalPages = (items: number) => {
        const pages = Math.floor(items / ITEMS_PER_PAGE);

        return items % ITEMS_PER_PAGE > 0 ? pages + 1 : pages;
    };

    const pageStart = currentPage * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE;

    const filterLevels = (filter: string) => {
        console.log(data.filter((el) => el.status === filter));

        return data.filter((el) => el.status === filter);
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
            <Display g900 medium mb=".25rem">
                {'Learn & Earn'}
            </Display>

            <RichText
                content={
                    'Earn PACT tokens by reading educational content that you about projects and financial habits. Learn more...'
                }
                g500
                small
            />

            <Box flex style={{ justifyContent: 'space-between' }}>
                <Metrics />
            </Box>

            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab
                        onClick={() => {
                            console.log('Avalaible');
                        }}
                        title={'Avalaible'}
                        number={data.length}
                    />
                    <Tab
                        onClick={() => filterLevels('completed')}
                        title={'Completed'}
                        number={filterLevels('completed').length}
                    />
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

                    <Filters
                        property="search"
                        // action={(e: any) => setFilters(e.target.value)}
                    />
                </Box>

                <Grid colSpan={1.5} cols={{ lg: 3, xs: 1 }}>
                    {filteredData &&
                        filteredData
                            .slice(pageStart, pageEnd)
                            .map((elem: any) => {
                                return (
                                    <ComposedCard
                                        heading={elem?.title || ''}
                                        content={`Level 1 · ${elem?.totalLessons} lessons`}
                                        image={
                                            elem.data?.image?.url ||
                                            'https://picsum.photos/300'
                                        }
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
                                                            ? `?id=${elem?.id}`
                                                            : ''
                                                    }`
                                                )
                                            }
                                        >
                                            {`Earn up to ${elem.totalReward} PACTS`}
                                        </Button>
                                        {/* <TextLink
                                        href={`/${lang}/learn-and-earn/${elem?.uid}`}
                                    >
                                        {`Earn up to ${elem?.totalReward} PACTS`}
                                    </TextLink> */}
                                        {/* <Test href={`/${lang}/learn-and-earn/${elem?.uid}?id=${elem?.id}`}>
                                        {`Earn up to ${elem?.totalReward} PACTS`}
                                    </Test> */}
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
