import {
    Table as BaseTable,
    TableProps as BaseTableProps,
    Box,
    Pagination
} from '@impact-market/ui';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const TableWrapper = styled(Box)`
    > div > div {
        overflow-y: hidden;
    }

    td {
        padding: 1rem 1.25rem;
    }

    .dropdown > :nth-child(2) {
        right: 0;
        left: auto;
    }

    tr:nth-last-child(-n + 3) {
        .dropdown > :nth-child(2) {
            top: unset;
            left: unset;
            bottom: 30px;
            right: 0;
        }
    }

    tr:last-child {
        .tooltip {
            bottom: 23px;
            top: unset;
        }
    }
`;

type Partial<BaseTableProps> = {
    [P in keyof BaseTableProps]?: BaseTableProps[P];
};

type TableProps = {
    actualPage: number;
    callback?: Function;
    callbackProps?: Object;
    count?: number;
    itemsPerPage?: number;
    isLoading: boolean;
    page: number;
    prefix: any;
    refresh?: Date;
    setItemOffset: Function;
};

const sortToString = (sort: any) => {
    if (sort?.key) {
        return `${sort.key}:${sort.sortDesc ? 'desc' : 'asc'}`;
    }

    return '';
};

const Table: React.FC<TableProps & Partial<BaseTableProps>> = (props) => {
    const {
        actualPage,
        callback,
        callbackProps,
        columns,
        count,
        itemsPerPage,
        isLoading,
        page,
        prefix: data,
        refresh,
        setItemOffset,
        ...forwardProps
    } = props;

    const tableRef = useRef<null | HTMLDivElement>(null);

    const { t } = useTranslations();
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(actualPage);
    const router = useRouter();
    const { asPath } = router;
    const [sortKey, setSortKey] = useState({}) as any;

    useEffect(() => {
        const page = getByKey('page') ? +getByKey('page') : 0;
        const actualPage = page - 1 >= 0 ? page - 1 : 0;

        setItemOffset(actualPage * itemsPerPage || 0);
    }, [asPath]);

    useEffect(() => {
        page > 0 && setCurrentPage(page - 1);
    }, [getByKey('page')]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % (count || 0);

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % (count || 0);

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < count / itemsPerPage - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % (count || 0);

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }
    };

    const handleSort = (key: string) => {
        const newSort = {
            key,
            sortDesc: sortKey?.key === key ? !sortKey?.sortDesc : false
        };

        update('orderBy', sortToString(newSort));

        setSortKey(newSort);
    };

    // Add .last class to the last dropdown
    useEffect(() => {
        const elements = document.querySelectorAll('.dropdown');

        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];

            lastElement.classList.add('last');
        }
    }, [data]);

    return (
        <TableWrapper ref={tableRef} {...forwardProps}>
            <BaseTable
                columns={columns}
                isLoading={isLoading}
                noResults={t('noResults')}
                handleSort={handleSort}
                pagination={
                    <Pagination
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        nextIcon="arrowRight"
                        nextLabel={t('next')}
                        pageCount={Math.ceil(count / itemsPerPage) || 0}
                        previousIcon="arrowLeft"
                        previousLabel={t('previous')}
                    />
                }
                rows={data}
                sortKey={sortKey}
            />
        </TableWrapper>
    );
};

export default Table;
