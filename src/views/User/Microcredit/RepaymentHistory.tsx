import { Text } from '@impact-market/ui';
import { currencyFormat } from 'src/utils/currencies';
import { dateHelpers } from '../../../helpers/dateHelpers';
import { selectCurrentUser } from 'src/state/slices/auth';
import { selectRates } from 'src/state/slices/rates';
import {
    useMicrocreditBorrower,
    useMicrocreditBorrowerRepaymentHistory
} from 'src/hooks/useMicrocredit';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Table from 'src/components/Table';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 4;

const getColumns = () => {
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { repayment, currentDebt, loanRepayment } = extractFromView(
        'microcredit'
    ) as any;

    const auth = useSelector(selectCurrentUser);
    const rates = useSelector(selectRates);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        maximumFractionDigits: 3,
        style: 'currency'
    });

    return [
        {
            minWidth: 12,
            render: (data: any) => (
                <Text g900 small medium>
                    {`${loanRepayment} #${data?.rowIndex}`}
                </Text>
            ),
            title: loanRepayment,
            value: 'repayment',
            width: '60%'
        },
        {
            minWidth: 8,
            render: (data: any) => (
                <Text g900 small medium>
                    {currencyFormat(data?.amount, localeCurrency, rates)}
                </Text>
            ),
            title: repayment,
            value: 'amount',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Text g900 small medium>
                        {!!data?.debt
                            ? currencyFormat(data?.debt, localeCurrency, rates)
                            : '--'}
                    </Text>
                );
            },
            title: currentDebt,
            value: 'debt',
            width: '10%'
        },
        {
            minWidth: 10,
            render: (data: any) => {
                return (
                    <>
                        <Text g900 small medium>
                            {dateHelpers.compactFromUnix(data?.timestamp)}
                        </Text>
                        <Text g500 small medium>
                            {dateHelpers.hours(data?.timestamp)}
                        </Text>
                    </>
                );
            },
            title: t('date'),
            value: 'timestamp',
            width: '15%'
        }
    ];
};

const RepaymentHistory = (props: { user: any }) => {
    const { user } = props;
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrower } = useMicrocreditBorrower([`address=${user?.address}`]);

    const { repaymentHistory, loadingRepaymentHistory, count } =
        useMicrocreditBorrowerRepaymentHistory([
            `borrower=${borrower?.address}`,
            `limit=${itemsPerPage}`,
            `offset=${itemOffset}`
        ]);

    // Add to repaymentHistory array, the index of each row
    const modifiedRepaymentHistory = repaymentHistory?.map(
        (item: any, index: number) => {
            return {
                ...item,
                rowIndex: repaymentHistory?.length - index
            };
        }
    );

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns()}
            itemsPerPage={itemsPerPage}
            isLoading={loadingRepaymentHistory}
            mt={1.25}
            page={page}
            count={count}
            pb={6}
            prefix={modifiedRepaymentHistory}
            setItemOffset={setItemOffset}
        />
    );
};

export default RepaymentHistory;
