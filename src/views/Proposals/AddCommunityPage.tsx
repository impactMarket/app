import { Box, Pagination, Row, Spinner, Text } from '@impact-market/ui';
import { useGetPendingCommunitiesMutation } from '../../api/community';
import Community from './Community';
import React, { useEffect, useState } from 'react';
import String from '../../libs/Prismic/components/String';

const AddCommunityPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);
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

                setTotalCount(response?.data?.count);
                setCommunities(response?.data?.rows || []);
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

    return (
        <>
            {!communities && !isLoading && (
                <Box mt="25vh">
                    <Row fLayout="center">
                        <Text>
                            <String id="noCommunities" />
                        </Text>
                    </Row>
                </Box>
            )}
            {isLoading ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                <Box pb={2}>
                    <Box>
                        <Box style={{ marginTop: 32 }}>
                            {communities.map((community, index) => (
                                <Community key={index} {...community} />
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
                        previousLabel="Previous"
                    />
                </Box>
            )}
        </>
    );
};

export default AddCommunityPage;
