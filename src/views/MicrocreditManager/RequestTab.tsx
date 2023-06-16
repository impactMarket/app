import {
    Box,
    Tabs,
    TabList,
    Tab,
    Input,
    Card,
    Text,
    Button
} from '@impact-market/ui';
import RequestList from './RequestList';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';
import React, { useState } from 'react';
import useFilters from 'src/hooks/useFilters';

const itemsPerPage = 7;

const DecisionCard: React.FC<{}> = () => {
    return (
        <Card
            flex
            fDirection={{ sm: 'row', xs: 'column' }}
            pt={'1.5rem'}
            pb={'1.5rem'}
            style={{
                justifyContent: 'space-between',
                alignItems: 'center'
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
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
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

    return (
        <Box mt={0.5}>
            {/* TODO: Make it into its one component that takes an array of names and functions */}
            {/*  */}
            <Tabs>
                <TabList>
                    <Tab onClick={() => console.log('all')} title={'All'} />
                    <Tab
                        onClick={() => console.log('pending')}
                        title={'Pending'}
                    />
                    <Tab
                        onClick={() => console.log('Approved')}
                        title={'Approved'}
                    />
                    <Tab
                        onClick={() => console.log('Rejected')}
                        title={'Rejected'}
                    />
                </TabList>
            </Tabs>
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
            {/*  */}
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
