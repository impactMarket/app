import { Box, Button, Card, openModal, toast } from '@impact-market/ui';
import { FlexibleTab, TabItem } from '../../../components/FlexibleTab';
import { getCookie } from 'cookies-next';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import BorrowersList from './BorrowersList';
import Message from 'src/libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from 'src/libs/Prismic/components/RichText';
import config from '../../../../config';
import processTransactionError from 'src/utils/processTransactionError';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditApplications from 'src/hooks/useMicrocreditApplications';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const rejectLoan = async (auth: any, selected: any, mutate: any) => {
    let requestData: object[] = [];

    if (typeof selected === 'object') {
        if (Array.isArray(selected)) {
            requestData = selected?.map((item) => {
                if (item?.application && item?.application.id) {
                    return {
                        applicationId: item.application.id,
                        status: 5
                    };
                }
            });
        }
    } else if (typeof selected === 'number') {
        requestData = [
            {
                applicationId: selected,
                status: 5
            }
        ];
    }

    try {
        const result = await fetch(
            `${config.baseApiUrl}/microcredit/applications`,
            {
                body: JSON.stringify(requestData),
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                    message: getCookie('MESSAGE').toString(),
                    signature: getCookie('SIGNATURE').toString()
                },
                method: 'PUT'
            }
        );

        if (result.status === 201) {
            mutate();
            toast.success('Loan(s) rejected successfully');
        } else {
            toast.error(<Message id="errorOccurred" />);
        }
    } catch (error) {
        console.log(error);
        toast.error(<Message id="errorOccurred" />);
        processTransactionError(error, 'reject_loan');
    }
};

const DecisionCard: React.FC<{ selected: object; mutate: any }> = (props) => {
    const { selected, mutate }: any = props;
    const { extractFromView } = usePrismicData();
    const {
        selectBeneficiaryToApproveOrRejectLoan,
        microcreditApplicants,
        rejectSelectedLoans,
        approveSelectedLoans
    } = extractFromView('messages') as any;
    const auth = useSelector(selectCurrentUser);

    const selectedAddresses = selected?.map(
        (obj: { address: string }) => obj.address
    );

    const { managerDetails } = useLoanManager();

    const limitReach =
        managerDetails?.currentLentAmount >=
        managerDetails?.currentLentAmountLimit;

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
                <RichText
                    content={microcreditApplicants}
                    semibold
                    base
                    mb={0.5}
                />
                <RichText
                    content={selectBeneficiaryToApproveOrRejectLoan}
                    extrasmall
                />
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
                    onClick={() => {
                        rejectLoan(auth, selected, mutate);
                    }}
                >
                    <RichText small content={rejectSelectedLoans} />
                </Button>
                {!limitReach && (
                    <Button
                        default
                        icon="plus"
                        ml={1}
                        onClick={() => {
                            openModal('approveLoan', {
                                address: selectedAddresses
                            });
                        }}
                    >
                        <RichText small content={approveSelectedLoans} />
                    </Button>
                )}
            </Box>
        </Card>
    );
};

const ApproveRejectTab: React.FC<{}> = () => {
    const [selected, setSelected] = useState([]);

    const { t } = useTranslations();

    const { update, clear, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    const { applications, count, loadingApplications, mutate } =
        useMicrocreditApplications([
            `limit=${itemsPerPage}`,
            `offset=${itemOffset}`,
            // `orderBy=${getByKey('orderBy') || 'appliedOn'}`,
            `${getByKey('status') ? `status=${getByKey('status')}` : ''}`
        ]);

    const { count: countAll } = useMicrocreditApplications();
    const { count: countPending } = useMicrocreditApplications(['status=1']);
    const { count: countReqChanges } = useMicrocreditApplications(['status=3']);
    const { count: countApproved } = useMicrocreditApplications(['status=4']);
    const { count: countRejected } = useMicrocreditApplications(['status=5']);

    const tabs: TabItem[] = [
        {
            number: countAll || 0,
            onClick: () => {
                update({ page: 1 });
                clear('status');
            },
            title: t('all')
        },
        {
            number: countPending || 0,
            onClick: () => update({ page: 1, status: '1' }),
            title: t('pending')
        },
        {
            number: countApproved || 0,
            onClick: () => update({ page: 1, status: '4' }),
            title: t('approved')
        },
        {
            number: countRejected || 0,
            onClick: () => update({ page: 1, status: '5' }),
            title: t('rejected')
        },
        {
            number: countReqChanges || 0,
            onClick: () => update({ page: 1, status: '3' }),
            title: 'In Revision'
        }
    ];

    return (
        <Box>
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
                {selected.length > 0 && (
                    <DecisionCard selected={selected} mutate={mutate} />
                )}

                <BorrowersList
                    setSelected={setSelected}
                    selected={selected}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    actualPage={actualPage}
                    count={count}
                    loadingApplications={loadingApplications}
                    applications={applications}
                    setItemOffset={setItemOffset}
                    rejectLoan={rejectLoan}
                    mutate={mutate}
                />
            </Box>
        </Box>
    );
};

export default ApproveRejectTab;
