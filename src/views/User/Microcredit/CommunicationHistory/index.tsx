import {
    Box,
    Card,
    Pagination
} from '@impact-market/ui';
import ManagerNote from './ManagerNote';
import React, { useEffect, useState } from 'react';

const itemsPerPage = 3;

const CommunicationHistory = (props: { borrower: any }) => {
    const { borrower } = props;

    const [pageCount, setPageCount] = useState(Math.ceil(borrower?.notes?.length / itemsPerPage));
    const [currentPage, setCurrentPage] = useState(0);

    const [currentItems, setCurrentItems] = useState([]) as any;
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        setPageCount(Math.ceil(borrower?.notes?.length / itemsPerPage));
    }, [borrower]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % borrower?.notes?.length;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % borrower?.notes?.length;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % borrower?.notes?.length;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        const slicedItems = borrower?.notes?.slice(itemOffset, endOffset);

        if (slicedItems && slicedItems.length > 0) {
            setCurrentItems(slicedItems);
        }
    }, [itemOffset, borrower?.notes]);

    useEffect(() => {
        setCurrentItems(borrower?.notes?.slice(0, itemsPerPage));
    }, [borrower]);

    return (
        <Card>
            <Box>
                {
                    currentItems?.map((item: any, index: number) => (
                        <ManagerNote key={`mn-${index}`} note={item} />
                    ))
                }
            </Box>
            <Box>
                {pageCount > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        nextIcon="arrowRight"
                        nextLabel="Next"
                        pageCount={pageCount}
                        previousIcon="arrowLeft"
                        previousLabel="Previous"
                    />
                )}
            </Box>
        </Card>
    );
};

export default CommunicationHistory;

