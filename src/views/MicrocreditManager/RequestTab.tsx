import { Box, Button, Card, Input, Text } from '@impact-market/ui';
import React, { useState} from 'react';
import { TabItem, FlexibleTab } from './FlexibleTab';
import RequestList from './RequestList';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

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
    
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState(null);
    const [counts, setCounts] = useState([]);
    const { t } = useTranslations();

   
    const tabs: TabItem[] = [
        {
            number: counts[0],
            onClick: () => setFilter(null),
            title: t('all')
        },
        {
            number: counts[1],
            onClick: () => setFilter('pending'),
            title: t('pending')
        },
        {
            number: counts[2],
            onClick: () => setFilter('approved'),
            title: t('approved')
        },
        {
            number: counts[3],
            onClick: () => setFilter('rejected'),
            title: t('rejected')
        }
    ];

    return (
        <Box mt={0.5}>
            <FlexibleTab tabs={tabs} />
            <Input

                icon="search"
                placeholder="Search by name or wallet address"
                rows={0}
                wrapperProps={{
                    mt: 2
                }}
            />
            <Box mt={2}>
                {selected.length > 0 && <DecisionCard />}

                <RequestList
                    filter={filter}
                    setSelected={setSelected}
                    selected={selected}
                    itemsPerPage={itemsPerPage}
                />
            </Box>
        </Box>
    );
};

export default RequestTab;
