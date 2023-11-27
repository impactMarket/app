import { Box } from '@impact-market/ui';
import { FlexibleTab } from 'src/components/FlexibleTab';
import { useMicrocreditBorrowers } from 'src/hooks/useMicrocredit';
import BorrowersList from './BorrowersList';
import React, { useEffect, useState } from 'react';
import SearchFilter from '../../../components/Filters';
import useFilters from 'src/hooks/useFilters';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const RepaymentsTab: React.FC = () => {
    const { t } = useTranslations();
    const { update, clear, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrowers, count, loadingBorrowers } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        `${getByKey('search') ? `search=${getByKey('search')}` : ''}`,
        `orderBy=${getByKey('orderBy') || 'lastRepayment'}`,
        `${getByKey('filter') ? `filter=${getByKey('filter')}` : ''}`,
        `${
            getByKey('manager')
                ? `loanManagerAddress=${getByKey('manager')}`
                : ''
        }`
    ]);

    const useMicrocreditBorrowersCountWithFilter = (filter: string) => {
        const { count } = useMicrocreditBorrowers([
            filter,
            `${
                getByKey('manager')
                    ? `loanManagerAddress=${getByKey('manager')}`
                    : ''
            }`
        ]);

        return count;
    };

    const countAll = useMicrocreditBorrowersCountWithFilter('');
    const countUrgent = useMicrocreditBorrowersCountWithFilter('filter=urgent');
    const countNeedHelp =
        useMicrocreditBorrowersCountWithFilter('filter=need-help');
    const countFullyRepaid =
        useMicrocreditBorrowersCountWithFilter('filter=repaid');
    const countOntrack =
        useMicrocreditBorrowersCountWithFilter('filter=ontrack');
    const countNotClaimed =
        useMicrocreditBorrowersCountWithFilter('filter=not-claimed');
    const countFailedRepayment = useMicrocreditBorrowersCountWithFilter(
        'filter=failed-repayment'
    );
    const countDefaulters =
        useMicrocreditBorrowersCountWithFilter('filter=in-default');

    const tabs = [
        {
            number: countAll || 0,
            onClick: () => {
                clear(['filter', 'page']);
            },
            title: t('all')
        },
        {
            number: countUrgent || 0,
            onClick: () => update({ filter: 'urgent', page: 1 }),
            title: t('urgent')
        },
        {
            number: countOntrack || 0,
            onClick: () => update({ filter: 'ontrack', page: 1 }),
            title: t('ontrack')
        },
        {
            number: countNeedHelp || 0,
            onClick: () => update({ filter: 'need-help', page: 1 }),
            title: t('needHelp')
        },
        {
            number: countFullyRepaid || 0,
            onClick: () => update({ filter: 'repaid', page: 1 }),
            title: t('fullyRepaid')
        },
        {
            number: countNotClaimed || 0,
            onClick: () => update({ filter: 'not-claimed', page: 1 }),
            title: t('unclaimed')
        },
        {
            number: countFailedRepayment || 0,
            onClick: () => update({ filter: 'failed-repayment', page: 1 }),
            title: t('failedRepayment')
        },
        {
            number: countDefaulters || 0,
            onClick: () => update({ filter: 'in-default', page: 1 }),
            title: t('defaulters')
        }
    ];

    const tabsIndex = (() => {
        switch (getByKey('filter')) {
            case 'urgent':
                return 1;
            case 'ontrack':
                return 2;
            case 'need-help':
                return 3;
            case 'repaid':
                return 4;
            case 'not-claimed':
                return 5;
            case 'failed-repayment':
                return 6;
            case 'in-default':
                return 7;
            default:
                return 0;
        }
    })();

    useEffect(() => {
        update({ page: 0 });
    }, [getByKey('search')]);

    return (
        <Box>
            <FlexibleTab tabs={tabs} index={tabsIndex} />
            <SearchFilter
                margin="2 0 2 0"
                property="search"
                placeholder={t('searchByNameOrWalletAddress')}
            />
            <Box>
                <BorrowersList
                    actualPage={actualPage}
                    itemsPerPage={itemsPerPage}
                    loadingBorrowers={loadingBorrowers}
                    page={page}
                    count={count}
                    borrowers={borrowers}
                    setItemOffset={setItemOffset}
                />
            </Box>
        </Box>
    );
};

export default RepaymentsTab;
