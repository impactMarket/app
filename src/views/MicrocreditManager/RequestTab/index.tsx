import { Box, Button, Card } from '@impact-market/ui';
import { FlexibleTab, TabItem } from '../../../components/FlexibleTab';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import React, { useEffect, useState} from 'react';
import RequestList from './RequestList';
import RichText from 'src/libs/Prismic/components/RichText';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditApplications from 'src/hooks/useMicrocreditApplications';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';



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
    
    
    const { t } = useTranslations();

    const { update, clear, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);


    const { applications, count, loadingApplications} = useMicrocreditApplications([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        `${getByKey('filter') ? `filter=${getByKey('filter')}` : ''}`
    ]);

    const { count: countAll } = useMicrocreditApplications();
    const { count: countPending } = useMicrocreditApplications([
        'filter=pending'
    ]);
    const { count: countApproved } = useMicrocreditApplications([
        'filter=approved'
    ]);
    const { count: countRejected} = useMicrocreditApplications([
        'filter=rejected'
    ]);

    useEffect(() => {
        update({ page: 1 });
        clear('filter');
    }, []);
   
    const tabs: TabItem[] = [
        {
            number: countAll || 0,
            onClick: () => {
                update({ page: 1 });
                clear('filter');
            },
            title: t('all')
        },
        {
            number: countPending || 0,
            onClick: () => update({ filter: 'pending', page: 1 }),
            title: t('pending')
        },
        {
            number: countApproved || 0,
            onClick: () => update({ filter: 'approved', page: 1 }),
            title: t('approved')
        },
        {
            number: countRejected || 0,
            onClick: () => update({ filter: 'rejected', page: 1 }),
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
                    setSelected={setSelected}
                    selected={selected}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    actualPage={actualPage}
                    count={count}
                    loadingApplications={loadingApplications}
                    applications={applications}
                    setItemOffset={setItemOffset}
                />
            </Box>
        </Box>
    );
};

export default RequestTab;