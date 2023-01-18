import {
    Box,
    Display,
    DropdownMenu,
    Pagination,
    Tab,
    TabList,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { tabRouter } from './Helpers';
import { useEffect, useState } from 'react';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Filters from '../../components/Filters';
import LevelsTable from './LevelsTable';
import Metrics from './Metrics';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import styled from 'styled-components';
import useFilters from '../../hooks/useFilters';
import useLevels from '../../hooks/learn-and-earn/useLevels';
import useSWR from 'swr';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const ITEMS_PER_PAGE = 3;

const Dropdown = styled(DropdownMenu)`
    > div {
        width: 100%;
    }
`;

const LearnAndEarn = (props: any) => {
    const { prismic, lang } = props;
    const { view } = usePrismicData();
    const { t } = useTranslations();
    const {
        headingTitle: heading,
        headingContent: content,
        claimAvailable = null,
        claimDisabled = null
    } = view.data;

    const { levels, categories } = prismic;
    const auth = useSelector(selectCurrentUser);
    const { update, getByKey, clear } = useFilters();
    const [currentPage, setCurrentPage] = useState(+getByKey('page') ?? 0);
    const [search, setSearch] = useState(getByKey('search') ?? '');
    const [state, setState] = useState(getByKey('state') || 'available');
    const { data, levelsLoading } = useLevels(levels);

    const filteredData = data
        .filter((item: any) => item.title.toLowerCase().indexOf(search) !== -1)
        .filter((el: any) => el.status === state)
        .filter((el: any) =>
            !!getByKey('category') ? el.category === getByKey('category') : el
        );

    const loggedTabs = auth.type ? ['started', 'completed'] : [];
    const TabItems = ['available', ...loggedTabs];

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
            ?.title || t('category');

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
        <ViewContainer isLoading={levelsLoading && !laeData && !filteredData}>
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
            <Tabs
                defaultIndex={tabRouter(
                    getByKey('state')?.toString() ?? 'available'
                )}
            >
                <TabList>
                    {TabItems.map((el: string) => (
                        <Tab
                            onClick={() => {
                                setState(el);
                                update({ page: 0, state: el });
                                setCurrentPage(0);
                            }}
                            title={t(el)}
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

                <LevelsTable
                    data={filteredData}
                    categories={categories}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    lang={lang}
                />

                <Pagination
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                    mt={2}
                    nextIcon="arrowRight"
                    nextLabel={t('next')}
                    pageCount={totalPages(filteredData.length)}
                    pb={2}
                    previousIcon="arrowLeft"
                    previousLabel={t('previous')}
                />
            </Tabs>
        </ViewContainer>
    );
};

export default LearnAndEarn;
