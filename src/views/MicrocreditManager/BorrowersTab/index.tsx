import {
    Box,
} from '@impact-market/ui';
import { FlexibleTab } from 'src/components/FlexibleTab';
import BorrowersList from './BorrowersList';
import React, { useEffect, useState } from 'react';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';



const itemsPerPage = 7;

const BorrowersTab: React.FC = () => {

    const { t } = useTranslations();
    const { update, clear, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrowers, count, loadingBorrowers } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        `${getByKey('filter') ? `filter=${getByKey('filter')}` : ''}`
    ]);

    const { count: countAll } = useMicrocreditBorrowers();
    const { count: countNeedHelp } = useMicrocreditBorrowers([
        'filter=need-help'
    ]);
    const { count: countFullyRepaid } = useMicrocreditBorrowers([
        'filter=repaid'
    ]);
    const { count: countOntrack } = useMicrocreditBorrowers(['filter=ontrack']);

    useEffect(() => {
        update({ page: 1 });
        clear('filter');
    }, []);

    const tabs = [
        {
            number: countAll || 0,
            onClick: () => {
                update({ page: 1 });
                clear('filter');
            },
            title: t('all')
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
        }
    ];

    return(
   
         
        <Box mt={0.5}>
            <FlexibleTab tabs={tabs} />
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

    )

}

export default BorrowersTab;
