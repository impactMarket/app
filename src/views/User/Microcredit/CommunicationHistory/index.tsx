import { Box, Card, Icon, Pagination, Spinner, Text } from '@impact-market/ui';
import { useMicrocreditBorrower } from 'src/hooks/useMicrocredit';
import ManagerNote from './ManagerNote';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useTranslations from '../../../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 3;

const StyledBox = styled(Box)`
    justify-content: center;
`;

const CommunicationHistory = (props: { user: any }) => {
    const { user } = props;

    const { t } = useTranslations();
    const { borrower, loadingBorrower } = useMicrocreditBorrower([
        `address=${user?.address}`,
        `include=notes`
    ]);

    const [pageCount, setPageCount] = useState(
        Math.ceil(borrower?.notes?.length / itemsPerPage)
    );
    const [currentPage, setCurrentPage] = useState(0);

    const [currentItems, setCurrentItems] = useState([]) as any;
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        setPageCount(Math.ceil(borrower?.notes?.length / itemsPerPage));
    }, [borrower]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset =
                (event.selected * itemsPerPage) % borrower?.notes?.length;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset =
                (newPage * itemsPerPage) % borrower?.notes?.length;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset =
                (newPage * itemsPerPage) % borrower?.notes?.length;

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
        <Card flex fLayout="center start" fDirection="column">
            {loadingBorrower && <Spinner isActive g700 />}

            {!loadingBorrower &&
                (!borrower?.notes || borrower?.notes.length === 0) && (
                    <StyledBox
                        fLayout="center start"
                        flex
                        w="100%"
                        h="100px"
                        fDirection="column"
                    >
                        <StyledBox flex fLayout="center" w="100%">
                            <StyledBox flex fLayout="center start">
                                <Text mr="0.4rem" g700>
                                    {t('noResults')}
                                </Text>
                                <Icon icon="sad" g700 />
                            </StyledBox>
                        </StyledBox>
                    </StyledBox>
                )}

            {!loadingBorrower &&
                borrower?.notes &&
                borrower?.notes.length > 0 && (
                    <>
                        <Box w="100%">
                            {currentItems?.map((item: any, index: number) => (
                                <ManagerNote key={`mn-${index}`} note={item} />
                            ))}
                        </Box>
                        <Box w="100%">
                            {pageCount > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    handlePageClick={handlePageClick}
                                    nextIcon="arrowRight"
                                    nextLabel={t('next')}
                                    pageCount={pageCount}
                                    previousIcon="arrowLeft"
                                    previousLabel={t('previous')}
                                />
                            )}
                        </Box>
                    </>
                )}
        </Card>
    );
};

export default CommunicationHistory;
