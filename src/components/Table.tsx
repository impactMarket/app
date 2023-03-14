/* eslint-disable no-nested-ternary */
import {
    Table as BaseTable,
    TableProps as BaseTableProps,
    Box,
    Pagination
} from '@impact-market/ui';
import { currencyFormat } from '../utils/currencies';
import { selectCurrentUser } from '../state/slices/auth';
import { selectRates } from '../state/slices/rates';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import useBeneficiaries from '../hooks/useBeneficiaries';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

type Partial<BaseTableProps> = {
    [P in keyof BaseTableProps]?: BaseTableProps[P];
};

type TableProps = {
    callback?: Function;
    callbackProps?: Object;
    count?: number;
    itemsPerPage: number;
    prefix: string;
    refresh?: Date;
    thegraph?: any;
};

const sortToString = (sort: any) => {
    if (sort?.key) {
        return `${sort.key}:${sort.sortDesc ? 'desc' : 'asc'}`;
    }

    return '';
};

const Table: React.FC<TableProps & Partial<BaseTableProps>> = (props) => {
    const {
        columns,
        count,
        callback,
        callbackProps,
        itemsPerPage,
        prefix,
        refresh,
        thegraph,
        ...forwardProps
    } = props;

    const tableRef = useRef<null | HTMLDivElement>(null);
    const [sortKey, setSortKey] = useState({}) as any;

    const { t } = useTranslations();
    const {update, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 0;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(
        actualPage * itemsPerPage || 0
    );
    const [currentPage, setCurrentPage] = useState(actualPage);
    const router = useRouter();
    const {
        asPath,
        query: { search, state }
    } = router;

    const { data, loading } = useBeneficiaries(prefix, {
        limit: itemsPerPage,
        offset: itemOffset,
        orderBy: getByKey('orderBy')
            ? getByKey('orderBy').toString()
            : 'since:desc',
        search: search ?? '',
        state: state ?? 0,
        ...callbackProps
    });

    const activeTab = !!data?.count
        ? Object.keys(data?.count)[+getByKey('state')]
        : 'beneficiaries';

    const activeCount = !!data?.count ? data?.count[activeTab] : 0;

    // If data comes from thegraph
    const [thegraphData, setThegraphData] = useState(null);

    useEffect(() => {
        !!thegraph
            ? setThegraphData(
                  thegraph?.slice(itemOffset, itemOffset + itemsPerPage)
              )
            : setThegraphData(null);
    }, [itemOffset, asPath, thegraph]);

    useEffect(() => {
        const page = getByKey('page')
            ? +getByKey('page')
            : 0;
        const actualPage = page - 1 >= 0 ? page - 1 : 0;

        setItemOffset(actualPage * itemsPerPage || 0);
    }, [asPath]);

    useEffect(() => {
        setCurrentPage(0);
    }, [getByKey('state')]);

    useEffect(() => {
        setCurrentPage(page - 1);
    }, [getByKey('page')]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset =
                (event.selected * itemsPerPage) % (activeCount || 0);

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % (activeCount || 0);

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (
            (direction === 2 && currentPage < activeCount / itemsPerPage - 1) ||
            0
        ) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % (activeCount || 0);

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

    const auth = useSelector(selectCurrentUser);
    const rates = useSelector(selectRates);

    const localeCurrency = new Intl.NumberFormat(
        auth?.user.currency.language || 'en-US',
        {
            currency: auth?.user.currency || 'USD',
            style: 'currency'
        }
    );

    if (!!thegraphData) {
        thegraphData?.map((row: any) => {
            row.claimedFormatted = currencyFormat(
                row?.claimed,
                localeCurrency,
                rates
            );
        });
    }

    return (
        <Box ref={tableRef} {...forwardProps}>
            <BaseTable
                columns={columns}
                handleSort={handleSort}
                isLoading={
                    loading ||
                    thegraph?.loading ||
                    (thegraph ? !thegraphData : !data)
                }
                noResults={t('noResults')}
                pagination={
                    <Pagination
                        currentPage={currentPage}
                        disabled={false}
                        handlePageClick={handlePageClick}
                        nextIcon="arrowRight"
                        nextLabel={t('next')}
                        pageCount={Math.ceil(activeCount / itemsPerPage) || 0}
                        previousIcon="arrowLeft"
                        previousLabel={t('previous')}
                    />
                }
                rows={thegraph ? thegraphData : data?.rows}
                sortKey={sortKey}
            />
        </Box>
    );
};

export default Table;
