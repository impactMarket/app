/* eslint-disable no-nested-ternary */
import { Table as BaseTable, TableProps as BaseTableProps, Box, Pagination } from '@impact-market/ui';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

import useBeneficiaries from '../hooks/useBeneficiaries';

type Partial<BaseTableProps> = {
    [P in keyof BaseTableProps]?: BaseTableProps[P];
};

type TableProps = {
    callback?: Function;
    callbackProps?: Object;
    itemsPerPage: number;
    prefix: string;
    refresh?: Date;
};

const sortToString = (sort: any) => {
    if(sort?.key) {
        return `${sort.key}:${sort.sortDesc ? 'desc' : 'asc'}`;
    }

    return '';
}

const Table: React.FC<TableProps & Partial<BaseTableProps>> = props => {
    const { columns, callback, callbackProps, itemsPerPage, prefix, refresh, ...forwardProps } = props; 

    const tableRef = useRef<null | HTMLDivElement>(null);
    const [sortKey, setSortKey] = useState({}) as any;
    
    const { t } = useTranslations();
    const { clear, update, getByKey } = useFilters();
    const page = getByKey('page') ? parseInt(getByKey('page').toString(), 10) : 0;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(actualPage * itemsPerPage || 0);
    const [currentPage, setCurrentPage] = useState(actualPage);
    const router = useRouter();
    const { asPath, query: { search, state } } = router;
    
    const { data, loading } = useBeneficiaries(prefix, {
        limit: itemsPerPage,
        offset: itemOffset,
        orderBy: getByKey('orderBy') ? getByKey('orderBy').toString() : 'since:desc',
        search: getByKey('search') ? getByKey('search') : '',
        state: getByKey('state'),
        ...callbackProps
    });

    useEffect(() => {
        const page = getByKey('page') ? parseInt(getByKey('page').toString(), 10) : 0;
        const actualPage = page - 1 >= 0 ? page - 1 : 0;

        setItemOffset(actualPage * itemsPerPage || 0);
    }, [asPath]);

    // When filtering the results, the page must reset to the first one
    // Refresh is a variable passed down to force the refresh of the results (If we add a new record for example)
    useEffect(() => {
        if(!!search || !!state) {
            clear('page');

            setCurrentPage(0);
            setItemOffset(0);
        }
    }, [search, state, refresh]);

    const handlePageClick = (event: any, direction?: number) => {
        let pageChanged = false;

        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % (data?.count || 0);

            pageChanged = true;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % (data?.count || 0);

            pageChanged = true;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < (data?.count / itemsPerPage) - 1 || 0) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % (data?.count || 0);

            pageChanged = true;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }

        if (pageChanged && tableRef && tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSort = (key: string) => {
        const newSort = { key, sortDesc: sortKey?.key === key ? !sortKey?.sortDesc : false };

        update('orderBy', sortToString(newSort));

        setSortKey(newSort);
    };

    return (
        <Box ref={tableRef} {...forwardProps}>
            <BaseTable 
                columns={columns}
                handleSort={handleSort}
                isLoading={loading || !data}
                noResults={t('noResults')}
                pagination={
                    <Pagination
                        currentPage={currentPage}
                        disabled={false}
                        handlePageClick={handlePageClick}
                        nextIcon="arrowRight"
                        nextLabel={t('next')}
                        pageCount={Math.ceil(data?.count / itemsPerPage) || 0}
                        previousIcon="arrowLeft"
                        previousLabel={t('previous')}
                    />
                }
                rows={data?.rows}
                sortKey={sortKey}
            />
        </Box>
    );
}

export default Table;
