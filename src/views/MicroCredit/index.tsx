import { Box, Card, Display, Label, ViewContainer } from '@impact-market/ui';
import { FormStatus } from '../../utils/formStatus';
import { LoanStatus, useBorrower } from '@impact-market/utils';
import { dateHelpers } from '../../helpers/dateHelpers';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ClaimLoan from './ClaimLoan';
import LoanCompleted from './LoanCompleted';
// import LoanInReview from './LoanInReview';
import LoanRepayment from './LoanRepayment';
import RepaymentHistory from './RepaymentHistory';
import String from '../../libs/Prismic/components/String';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
// import LoanRejected from './LoanRejected';
// import InfoAccordion from './InfoAccordion';

import {
    useGetBorrowerFormsMutation,
} from '../../api/microcredit';

const MicroCredit = (props: any) => {
    const { data, view: viewName } = props;
    const [getBorrowerForms] = useGetBorrowerFormsMutation();
    const [loanId, setLoanId] = useState(0);
    const [isOverviewOpen, setIsOverviewOpen] = useState(false);
    const auth = useSelector(selectCurrentUser);
    const { getActiveLoanId, loan, repayLoan, claimLoan, isReady } =
        useBorrower();

        // console.log(isReady);
        
        // debugger
    const router = useRouter();
    const { getByKey } = useFilters();
    const { t } = useTranslations();
    const {
        amountBorrowedLabel,
        amountBorrowedTooltip,
        amountToPayLabel,
        amountToPayTooltip,
        headingContractTitle,
        headingTitle,
        interestRateLabel,
        interestRateTooltip,
        loanDurationLabel,
        loanDurationTooltip,
        monthlyInstalementsLabel,
        monthlyInstalementsTooltip,
        totalAmountDueLabel,
        totalAmountDueTooltip,
        typeRateLabel,
        typeRateTooltip
    } = data[viewName].data;

    const monthlyInterestRate = (dailyInterest: number) => {
        return ((Math.pow(1 + dailyInterest / 100, 30) - 1) * 100).toFixed(2);
    };

    const loanData = [
        {
            label: amountBorrowedLabel,
            tooltip: amountBorrowedTooltip,
            value: `${loan.amountBorrowed} cUSD`
        },
        {
            label: amountToPayLabel,
            tooltip: amountToPayTooltip,
            value: `${(loan.currentDebt + loan.amountRepayed).toFixed(4)} cUSD`
        },
        // {
        //     label: 'Monthly installments',
        //     tooltip:
        //         'This is total loan amount approved and initially deposited in your wallet.',
        //     value: '40cUSD'
        // },
        {
            label: loanDurationLabel,
            tooltip: loanDurationTooltip,
            value: `${dateHelpers.secondsToMonth(loan.period)} months`
        },
        {
            label: interestRateLabel,
            tooltip: interestRateTooltip,
            value: `${loan.dailyInterest}% ${t(
                'daily'
            )} / ${monthlyInterestRate(loan.dailyInterest)}% Monthly`
        },
        {
            label: typeRateLabel,
            tooltip: typeRateTooltip,
            value: 'FIXED'
        },
        {
            label: monthlyInstalementsLabel,
            tooltip: monthlyInstalementsTooltip,
            value: `${loan.amountRepayed} cUSD`
        },
        {
            highlight: true,
            label: totalAmountDueLabel,
            tooltip: totalAmountDueTooltip,
            value: `${loan.currentDebt.toFixed(3)} cUSD`
        }
    ];

    useEffect(() => {
        const getLoans = async () => {
            if (!!auth?.user?.address) {
                const activeLoanId = await getActiveLoanId(
                    auth?.user?.address?.toString()
                );

                // debugger

                if (activeLoanId === -1) {
                    // Verificar se tem form:
                    const { data: formData } = await getBorrowerForms(
                        auth?.user?.address
                    ) as any;

                    // - Se não tiver -> apply
                    console.log(FormStatus);
                    console.log(formData?.forms);
                    console.log(formData?.forms?.length);
                    
                    if (!formData?.forms?.length) {
                        router.push('/microcredit/apply');
                    } else {
                        const form = formData?.forms[0];

                        if (form.status === FormStatus.DRAFT ||
                            form.status === FormStatus.PENDING) {
                            // - Tem form submited false -> form
                            router.push('/microcredit/application');
                        } else if (form.status === FormStatus.IN_REVIEW) {
                            // - Tem form submited -> success
                            router.push(`/microcredit/apply?success=true&formId=${form?.id}`);
                        }
                        
                    }

                    // - Tem form requested_review -> page requested changes
                    
                    // Loan rejected 
                    // router.push('/');
                } else {
                    setLoanId(activeLoanId);
                }
            } else {
                router.push('/');
            }
        };

        getLoans();
    }, []);

    useEffect(() => {
        setIsOverviewOpen(loan.startDate === 0);
    }, [isReady]);

    return (
        <ViewContainer {...({} as any)} isLoading={!isReady}>
            {/* <Alert
                warning
                icon="alertTriangle"
                mb={1.5}
                message={'This is a warning'}
            /> */}
            {getByKey('contractAddress') && (
                <Box as="a" onClick={() => router.back()}>
                    <Label
                        content={<String id="back" />}
                        icon="arrowLeft"
                        mb={0.625}
                        bgColor="transparent"
                    />
                </Box>
            )}
            <Display g900 medium>
                {getByKey('contractAddress')
                    ? headingContractTitle
                    : headingTitle}
            </Display>
            <Box></Box>
            <Card mt="2rem" mb="2rem" padding={0}>
                {/* <LoanInReview data={data[viewName].data} loanId={loanId} /> */}
                {loan.loanStatus === LoanStatus.PENDING_CLAIM && (
                    <ClaimLoan
                        data={data[viewName].data}
                        loan={loan}
                        claimLoan={() => claimLoan(loanId)}
                        overviewData={loanData}
                    />
                )}
                {loan.loanStatus === LoanStatus.LOAN_CLAIMED && (
                    <>
                        <LoanRepayment
                            data={data[viewName].data}
                            isOverviewOpen={isOverviewOpen}
                            loan={loan}
                            repayLoan={repayLoan}
                            loanId={loanId}
                            overviewData={loanData}
                        />
                        <RepaymentHistory />
                    </>
                )}
                {loan.loanStatus === LoanStatus.LOAN_FULL_REPAID && (
                    <LoanCompleted
                        data={data[viewName].data}
                        overviewData={loanData}
                    />
                )}

                {/* {loan.loanStatus ===   && (
                    <LoanRejected
                        data={data[viewName].data}
                    />
                )} */}
            </Card>
            {/* {loan.loanStatus ===   && (
                <InfoAccordion
                    data={data[viewName].data}
                />
            )}  */}
        </ViewContainer>
    );
};

export default MicroCredit;
