/* eslint-disable no-nested-ternary */
import { Table as BaseTable, TableProps as BaseTableProps, Box, Pagination } from '@impact-market/ui';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

type Partial<BaseTableProps> = {
    [P in keyof BaseTableProps]?: BaseTableProps[P];
};

type TableProps = {
    callback: Function;
    itemsPerPage: number;
};

const sortToString = (sort: any) => {
    if(sort?.key) {
        return `${sort.key}:${sort.sortDesc ? 'desc' : 'asc'}`;
    }

    return '';
}

const sortToObject = (sort: string) => {
    if(!!sort && sort.includes(':')) {
        const parts = sort.split(':');

        return {
            key: parts[0],
            sortDesc: parts[1] === 'desc'
        };
    }

    return {};
}

const Table: React.FC<TableProps & Partial<BaseTableProps>> = props => {
    const { columns, callback, itemsPerPage, ...forwardProps } = props; 

    const tableRef = useRef<null | HTMLDivElement>(null);
    const [sortKey, setSortKey] = useState({}) as any;
    const [currentPage, setCurrentPage] = useState(0);
    const [rows, setRows] = useState([]) as any;
    const [totalItems, setTotalItems] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [changed, setChanged] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [isReady, setReady] = useState(false);
    
    const { t } = useTranslations();
    const { clear, update, getByKey } = useFilters();
    const router = useRouter();
    const { asPath, query: { search, state } } = router;

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if(!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * itemsPerPage);
            setChanged(new Date());
            setCurrentPage(page - 1);
        }

        if(!!getByKey('orderBy')) {
            const orderBy = getByKey('orderBy') as any;

            setSortKey(sortToObject(orderBy));
        }

        setReady(true);
    }, []);

    // When filtering the results, the page must reset to the first one
    useEffect(() => {
        if(isReady && (!!search || !!state)) {
            clear('page');

            setCurrentPage(0);
            setItemOffset(0);
            setChanged(new Date());
        }
    }, [search, state]);

    // Load results
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const filters = asPath.split('?')?.[1];
                
                const data = await callback({
                    filters,
                    limit: itemsPerPage,
                    offset: itemOffset
                }).unwrap();

                setRows(data?.rows || []);
                setTotalItems(data?.count || 0);
                setPageCount(Math.ceil(data?.count / itemsPerPage) || 0);

                setLoading(false);
            }
            catch (error) {
                console.log(error);

                setLoading(false);
            }
        };

        if(isReady) {
            init();
        }
    }, [itemOffset, changed, asPath, isReady]);    

    const handlePageClick = (event: any, direction?: number) => {
        let pageChanged = false;

        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % totalItems;

            pageChanged = true;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % totalItems;

            pageChanged = true;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % totalItems;

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
    
    // TODO: add text to Prismic
    /* 
    * TODO: when it's loading results, it's showing the NoResults message, but it's already fixed in UI, just needs a new release
    * After it's released edit the line "noResults": 
    *   noResults={!loading && "There are no results to show!"}
    *   »
    *   noResults={"There are no results to show!"}
    */

    return (
        <Box ref={tableRef} {...forwardProps}>
            <BaseTable 
                columns={columns}
                handleSort={handleSort}
                isLoading={loading}
                noResults={!loading && "There are no results to show!"}
                pagination={
                    <Pagination
                        currentPage={currentPage}
                        disabled={loading}
                        handlePageClick={handlePageClick}
                        nextIcon="arrowRight"
                        nextLabel={t('next')}
                        pageCount={pageCount}
                        previousIcon="arrowLeft"
                        previousLabel={t('previous')}
                    />
                }
                rows={rows}
                sortKey={sortKey}
            />
        </Box>
    );
}

export default Table;
