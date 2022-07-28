import {
    Grid,
    Pagination,
    Row,
    Spinner,
    TabPanel,
    Tabs
} from '@impact-market/ui';

import Community from './Community';
import String from '../../libs/Prismic/components/String';
import useCommunities from './communties';
import useFilters from '../../hooks/useFilters';

const CommunitiesList = (props: any) => {
    const { communitiesTabs, filters } = props;
    const { update, getByKey } = useFilters();
    const { communities, loadingCommunities, pageCount, itemsPerPage } = useCommunities(filters);
    const evaluateOffset = (page: number) =>
        (page * itemsPerPage) % communities?.data?.count;

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0;
        let newOffset, newPage;

        if (event.selected >= 0) {
            newOffset = evaluateOffset(event.selected);
            newPage = event.selected;
        } else if (direction === 1 && currentPage > 0) {
            newPage = currentPage - 1;
            newOffset = evaluateOffset(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            newPage = currentPage + 1;
            newOffset = evaluateOffset(newPage);
        }

        if (newOffset !== undefined) {
            update({ offset: newOffset, page: newPage });
        }
    };

    return (
        <Tabs defaultIndex={getByKey('type') === 'myCommunities' ? 1 : 0}>
            {loadingCommunities ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                communitiesTabs.map((key: number) => (
                    <TabPanel key={key}>
                        <>
                            <Grid colSpan={1.5} cols={{ lg: 4, sm: 2, xs: 1 }}>
                                {communities?.data?.count === 0 ? (
                                    <String id="noCommunities" />
                                ) : (
                                    communities?.data?.rows?.map(
                                        (community: any, key: number) => (
                                            <Community
                                                community={community}
                                                key={key}
                                            />
                                        )
                                    )
                                )}
                            </Grid>
                            <Pagination
                                currentPage={
                                    getByKey('page')
                                        ? parseInt(getByKey('page')[0], 10)
                                        : 0
                                }
                                handlePageClick={handlePageClick}
                                mt={2}
                                nextIcon="arrowRight"
                                nextLabel="Next"
                                pageCount={pageCount}
                                pb={2}
                                previousIcon="arrowLeft"
                                previousLabel="Previous"
                            />
                        </>
                    </TabPanel>
                ))
            )}
        </Tabs>
    );
};

export default CommunitiesList;
