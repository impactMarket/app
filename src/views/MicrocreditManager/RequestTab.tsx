import { Box, Button, Card, Text } from '@impact-market/ui';
import { FlexibleTab, TabItem } from './FlexibleTab';
import React, { useState} from 'react';
import RequestList from './RequestList';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';



const itemsPerPage = 7;


const DecisionCard: React.FC<{}> = () => {
    const { t } = useTranslations();

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
                    {t('microcreditApplicants')}
                </Text>
                <Text extrasmall>
                    {t('selectBeneficiaryToApproveOrRejectLoan.')}
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
                    onClick={() => {}}
                >
                    <Text small> {t('rejectSelectedLoans')} </Text>
                </Button>
                <Button
                    default
                    icon="plus"
                    ml={1}
                    onClick={() => {}}
                >
                    <Text small>{t('approveSelectedLoans')}</Text>
                </Button>
            </Box>
        </Card>
    );
};

const RequestTab: React.FC<{}> = () => {
    
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState(null);
    // const [counts, setCounts] = useState([]);
    const { t } = useTranslations();

    
   
    const tabs: TabItem[] = [
        {
            number: null,
            onClick: () => setFilter(null),
            title: t('all')
        },
        {
            number: null,
            onClick: () => setFilter('pending'),
            title: t('pending')
        },
        {
            number: null,
            onClick: () => setFilter('approved'),
            title: t('approved')
        },
        {
            number: null,
            onClick: () => setFilter('rejected'),
            title: t('rejected')
        }
    ];

    return (
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
                {selected.length > 0 && <DecisionCard  />}

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
