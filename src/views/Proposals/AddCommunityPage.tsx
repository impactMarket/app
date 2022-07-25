/* eslint-disable no-nested-ternary */
import { Box, Pagination, Row, Spinner, Text } from '@impact-market/ui';
import {
    PendingCommunities,
    useGetPendingCommunitiesMutation
} from '../../api/community';
import Community from './Community';
import React, { useEffect, useState } from 'react';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';

const AddCommunityPage = ({ setRequestsCount, requestsCount }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState<PendingCommunities>();
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const limit = 10;
    const { update, getByKey } = useFilters();
    const [changed, setChanged] = useState<Date>(new Date());
    const [ready, setReady] = useState(false);
    
    // Pagination
    const [offset, setItemOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalCount / limit);

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if(!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * limit);
            setChanged(new Date());
            setCurrentPage(page - 1);
        }

        setReady(true);
    }, []);

    useEffect(() => {
        const getCommunitiesMethod = async () => {
            try {
                setIsLoading(true);
                const response = await getPendingCommunities({
                    limit,
                    offset,
                    orderBy: 'updated:DESC'
                }).unwrap();

                setTotalCount(response?.count);
                setCommunities(response);
                setIsLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        getCommunitiesMethod();
    }, [offset, ready, changed]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }
    };

    return (
        <>
            {isLoading || !communities ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : totalCount === 0 ? (
                <Box mt="25vh">
                    <Row fLayout="center">
                        <Text>
                            <String id="noCommunities" />
                        </Text>
                    </Row>
                </Box>
            ) : (
                <Box pb={2}>
                    <Box>
                        <Box mt={2}>
                            {communities.rows.map((community, index) => (
                                <Community data={community} key={index} {...community} requestsCount={requestsCount} setRequestsCount={setRequestsCount}/>
                            ))}
                        </Box>
                    </Box>
                    <Pagination
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        mt={2}
                        nextIcon="arrowRight"
                        nextLabel="Next"
                        pageCount={pageCount}
                        previousIcon="arrowLeft"
                        previousLabel="Previous" />
                </Box>
            )}
        </>
    );
};

export default AddCommunityPage;
