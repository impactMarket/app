import { Box, Button, Card, Input, Text } from '@impact-market/ui';
import React, { useState } from 'react';
import { TabItem, FlexibleTab } from './FlexibleTab';
import RequestList from './RequestList';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';

const itemsPerPage = 7;

const DecisionCard: React.FC<{}> = () => {
    return (
        <Card
            flex
            fDirection={{ sm: 'row', xs: 'column' }}
            pt={'1.5rem'}
            pb={'1.5rem'}
            style={{
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <Box>
                <Text semibold weight="semibold" base mb={0.5}>
                    Microcredit Applicants
                </Text>
                <Text extrasmall>
                    Select beneficiary to Approve or Reject Loan.
                </Text>
            </Box>
            <Box
                flex
                fDirection={{ sm: 'row', xs: 'column' }}
                style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}
            >
                <Button
                    default
                    gray
                    icon="upload"
                    onClick={() => console.log('Reject all selected loans')}
                >
                    <Text small>Reject Selected Loans</Text>
                </Button>
                <Button
                    default
                    icon="plus"
                    ml={1}
                    onClick={() => console.log('Approve all selected loans')}
                >
                    <Text small>Approve Selected Loans</Text>
                </Button>
            </Box>
        </Card>
    );
};

const RequestTab: React.FC<{}> = () => {
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;

    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);
    const { borrowers, count, loadingBorrowers } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`
    ]);
    const [selected, setSelected] = useState([]);

    const tabs: TabItem[] = [
        {
            number: 10,
            onClick: () => console.log('all'),
            title: 'All'
        },
        {
            number: 5,
            onClick: () => console.log('pending'),
            title: 'Pending'
        },
        {
            number: 3,
            onClick: () => console.log('Approved'),
            title: 'Approved'
        },
        {
            number: 2,
            onClick: () => console.log('Rejected'),
            title: 'Rejected'
        }
    ];

    return (
        <Box mt={0.5}>
            <FlexibleTab tabs={tabs} />
            <Input
                hint=""
                icon="search"
                placeholder="Search by name or wallet address"
                prefix=""
                rows={0}
                suffix=""
                wrapperProps={{
                    mt: 2
                }}
            />
            <Box mt={2}>
                {selected.length > 0 && <DecisionCard />}

                <RequestList
                    borrowers={borrowers}
                    count={count}
                    loadingBorrowers={loadingBorrowers}
                    itemsPerPage={itemsPerPage}
                    setItemOffset={setItemOffset}
                    page={page}
                    actualPage={actualPage}
                    setSelected={setSelected}
                    selected={selected}
                />
            </Box>
        </Box>
    );
};

export default RequestTab;
