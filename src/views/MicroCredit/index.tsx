import { Box, Card, Display, ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useMicroCredit } from '@impact-market/utils';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ClaimLoan from './ClaimLoan';
import LoanCompleted from './LoanCompleted';
import LoanRepayment from './LoanRepayment';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const MicroCredit = (props: any) => {
    const { data, view: viewName } = props;
    const [loanId, setLoanId] = useState(0);
    const auth = useSelector(selectCurrentUser);
    const {
        getActiveLoanId,
        loan,
        repayLoan,
        claimLoan,
        isReady
    } = useMicroCredit();
    const router = useRouter();
    const { t } = useTranslations();
    const {
        amountBorrowedLabel,
        amountBorrowedTooltip,
        amountToPayLabel,
        amountToPayTooltip,
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

    const convertToDate = (timeframeInSeconds: string) => {
        const seconds = Number(timeframeInSeconds);
        const secondsInMonth = 2592000;
        const result = seconds / secondsInMonth;

        return `${result} months`;
    };

    const loanData = [
        {
            label: amountBorrowedLabel,
            tooltip: amountBorrowedTooltip,
            value: `${loan.amountBorrowed}cUSD`
        },
        {
            label: amountToPayLabel,
            tooltip: amountToPayTooltip,
            value: `${loan.currentDebt + loan.amountRepayed}cUSD`
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
            value: `${convertToDate(loan.period)}`
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
            value: `${loan.amountRepayed}cUSD`
        },
        {
            label: totalAmountDueLabel,
            tooltip: totalAmountDueTooltip,
            value: `${loan.currentDebt}cUSD`
        }
    ];

    useEffect(() => {
        const getLoans = async () => {
            if (!!auth.user.address) {
                const activeLoanId = await getActiveLoanId(
                    auth.user.address.toString()
                );

                if (activeLoanId === -1) {
                    router.push('/');
                } else {
                    setLoanId(activeLoanId);
                }
            }
        };

        getLoans();
    }, []);

    const loanNotClaimed = loan.amountBorrowed > 0 && loan.startDate === 0;
    const loanOnGoing =
        loan.amountBorrowed > 0 && loan.startDate > 0 && loan.currentDebt > 0;
    const LoanPaymentCompleted =
        loan.amountBorrowed > 0 && loan.startDate > 0 && loan.currentDebt === 0;

    return (
        <ViewContainer isLoading={!isReady}>
            {/* <Alert
                warning
                icon="alertTriangle"
                mb={1.5}
                message={'This is a warning'}
            /> */}
            <Display g900 medium>
                {'MicroCredit'}
            </Display>
            <Box></Box>
            <Card mt="2rem" padding={{ sm: '4rem', xs: '1rem' }}>
                {loanNotClaimed && (
                    <ClaimLoan
                        data={data[viewName].data}
                        loan={loan}
                        claimLoan={() => claimLoan(loanId)}
                        overviewData={loanData}
                    />
                )}
                {loanOnGoing && (
                    <LoanRepayment
                        data={data[viewName].data}
                        loan={loan}
                        repayLoan={repayLoan}
                        loanId={loanId}
                        overviewData={loanData}
                    />
                )}
                {LoanPaymentCompleted && (
                    <LoanCompleted
                        data={data[viewName].data}
                        overviewData={loanData}
                    />
                )}
            </Card>
            <Box padding="2rem" />
        </ViewContainer>
    );
};

export default MicroCredit;
