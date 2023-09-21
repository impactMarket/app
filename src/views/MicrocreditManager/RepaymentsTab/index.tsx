import { Box } from '@impact-market/ui';
import { FlexibleTab } from 'src/components/FlexibleTab';
import { useMicrocreditBorrowers } from 'src/hooks/useMicrocredit';
import BorrowersList from './BorrowersList';
import React, { useState } from 'react';
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
        `orderBy=${getByKey('orderBy') || 'lastRepayment'}`,
        `${getByKey('filter') ? `filter=${getByKey('filter')}` : ''}`
    ]);

    const { count: countAll } = useMicrocreditBorrowers();
    const { count: countUrgent } = useMicrocreditBorrowers(['filter=urgent']);
    const { count: countNeedHelp } = useMicrocreditBorrowers([
        'filter=need-help'
    ]);
    const { count: countFullyRepaid } = useMicrocreditBorrowers([
        'filter=repaid'
    ]);
    const { count: countOntrack } = useMicrocreditBorrowers(['filter=ontrack']);

    const { count: countNotClaimed } = useMicrocreditBorrowers([
        'filter=not-claimed'
    ]);

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
            default:
                return 0;
        }
    })();

    return (
        <Box>
            <FlexibleTab tabs={tabs} index={tabsIndex} />
            {/* <Input

                icon="search"
                placeholder="Search by name or wallet address"
                rows={0}
                wrapperProps={{
                    mt: 2
                }}
            /> */}
            <Box mt={2}>
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
