/* eslint-disable no-nested-ternary */
import { Box, Pagination, Row, Spinner, Text } from '@impact-market/ui';
import {
    PendingCommunities,
    useGetPendingCommunitiesMutation
} from '../../api/community';
import Community from './Community';
import React, { useEffect, useState } from 'react';
import String from '../../libs/Prismic/components/String';

const AddCommunityPage = ({ setRequestsCount }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState<PendingCommunities>();
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();
    const limit = 2;
    
    // Pagination
    const [offset, setItemOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(totalCount / limit);

    useEffect(() => {
        const getCommunitiesMethod = async () => {
            try {
                setIsLoading(true);
                const response = await getPendingCommunities({
                    limit,
                    offset
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
    }, [offset]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * limit) % totalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        }
    };

    const removeIndex = (id: number) => {
        setCommunities((oldCommunities: { count: number, rows: any }) => ({
            count: oldCommunities.rows.filter((community: any) => id !== community.id).length,
            rows: oldCommunities.rows.filter((community: any) => id !== community.id)})
        );

        setRequestsCount(totalCount - 1);
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
                                <Community data={community} key={index} {...community} removeIndex={removeIndex} />
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
