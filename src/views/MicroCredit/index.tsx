import { Alert, Box, Card, Display, ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useMicroCredit } from '@impact-market/utils';
import { useSelector } from 'react-redux';
import ClaimLoan from './ClaimLoan';
import LoanCompleted from './LoanCompleted';
import LoanRepayment from './LoanRepayment';

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

    const loanData = [
        {
            label: 'Total loan amount',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: `${loan.amountBorrowed}cUSD`
        },
        {
            label: 'Total loan to pay',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: `${loan.currentDebt + loan.amountRepayed}cUSD`
        },
        {
            label: 'Monthly installments',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: '40cUSD'
        },
        {
            label: 'Term lenght',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: '6 months'
        },
        {
            label: 'Daily Interest rate',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: `${loan.dailyInterest}%`
        },
        {
            label: 'Type of rate',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: 'FIXED'
        },
        {
            label: 'Total amount due',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: `${loan.currentDebt}cUSD`
        }
    ];

    useEffect(() => {
        const getLoans = async () => {
            if (!!auth.user.address) {
                const activeLoanId = await getActiveLoanId(auth.user.address.toString());

                setLoanId(activeLoanId);
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
            <Alert
                warning
                icon="alertTriangle"
                mb={1.5}
                message={'This is a warning'}
            />
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
