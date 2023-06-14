import {
    Box, 
    Tabs,
    TabList,
    Tab,
    Input,
    Card,
    Display,
    Divider,
    Text
} from '@impact-market/ui';
import RequestList from './RequestList';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';
import React, { useState } from 'react';
import useFilters from 'src/hooks/useFilters';

const itemsPerPage = 7;

const RequestTab: React.FC<{}> = () => {
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;

    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);
    const { borrowers, count, loadingBorrowers } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`
    ]);
    return(
        <Box mt={0.5}>
            {/* TODO: Make it into its one component that takes an array of names and functions */}
            {/*  */}
                <Tabs>
                    <TabList>
                        <Tab onClick={() => console.log("all")} title={'All'} />
                        <Tab onClick={() => console.log("pending")} title={'Pending'} />
                        <Tab onClick={() => console.log("Approved")} title={'Approved'} />
                        <Tab onClick={() => console.log("Rejected")} title={'Rejected'} />
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
            <Box mt={0.5}>
                <Card>
                    <Display>
                    My Awesome Title!
                    </Display>
                    <Divider />
                    <Text small>
                    Use generated props and play with me...
                    </Text>
                </Card>
                <RequestList 
                borrowers={borrowers} 
                count={count} 
                loadingBorrowers={loadingBorrowers} 
                itemsPerPage={itemsPerPage} 
                setItemOffset={setItemOffset}
                page={page}
                actualPage={actualPage}
            />

            </Box>
        </Box>
    )
};

export default RequestTab;