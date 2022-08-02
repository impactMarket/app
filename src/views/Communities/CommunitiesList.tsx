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
import useCommunities from '../../hooks/useCommunities';
import useFilters from '../../hooks/useFilters';

const CommunitiesList = (props: any) => {
    const { communitiesTabs, filters } = props;
    const { update, getByKey } = useFilters();
    const { communities, loadingCommunities, pageCount } = useCommunities(filters);

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0;
 
        if (event.selected >= 0) {
            update({ page: event.selected });
        } else if (direction === 1 && currentPage > 0) {
            update({ page: currentPage - 1 });
        } else if (direction === 2 && currentPage < pageCount - 1) {
            update({ page: currentPage + 1 });
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
