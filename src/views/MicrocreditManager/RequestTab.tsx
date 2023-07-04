import { Box, Button, Card } from '@impact-market/ui';
import { FlexibleTab, TabItem } from './FlexibleTab';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React, { useState} from 'react';
import RequestList from './RequestList';
import RichText from 'src/libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';



const itemsPerPage = 7;


const DecisionCard: React.FC<{}> = () => {

    const { extractFromView } = usePrismicData();
    const { selectBeneficiaryToApproveOrRejectLoan,
            microcreditApplicants,
            rejectSelectedLoans,
            approveSelectedLoans
        } = extractFromView('messages') as any;

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
                <RichText content={microcreditApplicants} semibold base mb={0.5}/>
                <RichText content={selectBeneficiaryToApproveOrRejectLoan} extrasmall/>
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
                    <RichText small content={rejectSelectedLoans} />
                </Button>
                <Button
                    default
                    icon="plus"
                    ml={1}
                    onClick={() => {}}
                >
                    <RichText small content={approveSelectedLoans} />
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
