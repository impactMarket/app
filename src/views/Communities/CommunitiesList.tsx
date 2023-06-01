import { Box, Grid, Pagination, TabPanel, Tabs } from '@impact-market/ui';
import React, { useEffect, useState } from 'react';

import CommunityCard from '../../components/CommunityCard';
import String from '../../libs/Prismic/components/String';
import useCommunities from '../../hooks/useCommunities';
import useFilters from '../../hooks/useFilters';

const CommunitiesList = (props: any) => {
    const { communitiesTabs, filters } = props;
    const { update, getByKey } = useFilters();
    const { communities, loadingCommunities, pageCount, itemsPerPage } =
        useCommunities(filters);
    const [currentPage, setCurrentPage] = useState<number>(
        +getByKey('page') || 0
    );

    useEffect(() => {
        if (currentPage !== +getByKey('page') && !!getByKey('page')) {
            setCurrentPage(+getByKey('page'));
        }
    }, [getByKey('page')]);

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        let page;

        if (event.selected >= 0) {
            page = event.selected;
        } else if (direction === 1 && currentPage > 0) {
            page = currentPage - 1;
        } else if (direction === 2 && currentPage < pageCount - 1) {
            page = currentPage + 1;
        }

        setCurrentPage(page);
        update({ page });
    };

    return (
        <Tabs defaultIndex={getByKey('type') === 'myCommunities' ? 1 : 0}>
            {loadingCommunities ? (
                <Grid
                    {...({} as any)}
                    colSpan={1.5}
                    cols={{ lg: 4, sm: 2, xs: 1 }}
                    mt="1.3rem"
                >
                    {[...Array(itemsPerPage)].map((key: number) => (
                        <CommunityCard community={{}} isLoading key={key} />
                    ))}
                </Grid>
            ) : (
                communitiesTabs.map((key: number) => (
                    <TabPanel key={key}>
                        <>
                            <Grid
                                {...({} as any)}
                                colSpan={1.5}
                                cols={{ lg: 4, sm: 2, xs: 1 }}
                            >
                                {communities?.data?.count === 0 ? (
                                    <String id="noCommunities" />
                                ) : (
                                    communities?.data?.rows?.map(
                                        (community: any, key: number) => (
                                            <CommunityCard
                                                community={community}
                                                key={key}
                                            />
                                        )
                                    )
                                )}
                            </Grid>
                            <Box pb={6}>
                                <Pagination
                                    currentPage={currentPage}
                                    handlePageClick={handlePageClick}
                                    mt={2}
                                    nextIcon="arrowRight"
                                    nextLabel="Next"
                                    pageCount={pageCount}
                                    previousIcon="arrowLeft"
                                    previousLabel="Previous"
                                />
                            </Box>
                        </>
                    </TabPanel>
                ))
            )}
        </Tabs>
    );
};

export default CommunitiesList;
