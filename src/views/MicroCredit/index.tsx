import { Box, Card, Display, Label, ViewContainer } from '@impact-market/ui';
import { FormStatus } from '../../utils/formStatus';
import { LoanStatus, useBorrower, useLoanRewards } from '@impact-market/utils';
import { dateHelpers } from '../../helpers/dateHelpers';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useLazyGetBorrowerQuery } from '../../api/microcredit';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ClaimLoan from './ClaimLoan';
import ConnectWallet from 'src/components/ConnectWallet';
import LoanCompleted from './LoanCompleted';
import LoanRejected from './LoanRejected';
import LoanRepayment from './LoanRepayment';
import RepaymentHistory from './RepaymentHistory';
import RequestChanges from './Form/RequestChanges';
import String from '../../libs/Prismic/components/String';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
// import InfoAccordion from './InfoAccordion';
import BigNumber from 'bignumber.js';
import processTransactionError from 'src/utils/processTransactionError';
import usePactPriceUSD from 'src/hooks/usePactPriceUSD';

const MicroCredit = (props: any) => {
    const { data, view: viewName } = props;
    const [
        getBorrower,
        { isError: isErrorGetBorrower, error: errorGetBorrower }
    ] = useLazyGetBorrowerQuery();
    const [loanId, setLoanId] = useState(0);
    const [isOverviewOpen, setIsOverviewOpen] = useState(false);
    const [formState, setFormState] = useState(-1);
    const auth = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(true);
    const { getActiveLoanId, loan, repayLoan, claimLoan, isReady } =
        useBorrower();
    const {
        rewards,
        isReady: isRewardsReady,
        getEstimatedLoanRewards
    } = useLoanRewards();
    const { priceUSD, isReady: isPactPriceReady } = usePactPriceUSD();

    useEffect(() => {
        const result = new BigNumber(
            (
                (loan.amountRepayed + loan.currentDebt - loan.amountBorrowed) *
                10 *
                30 *
                3
            ).toFixed(0)
        ).toString();

        getEstimatedLoanRewards(result);
    }, [loan, auth?.user?.address]);

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
        if (isErrorGetBorrower) {
            processTransactionError(errorGetBorrower, 'loading_borrower_page');
        }
    }, [isErrorGetBorrower, auth?.user?.address]);

    useEffect(() => {
        const getLoans = async () => {
            if (auth?.user?.address) {
                const activeLoanId = await getActiveLoanId(auth.user.address);

                if (activeLoanId === -1) {
                    const { data: formData } = await getBorrower({
                        address: auth.user.address
                    });

                    if (!formData?.forms?.length) {
                        router.push('/microcredit/apply');
                    } else {
                        const form = formData?.forms[0];

                        setFormState(form.status);

                        if (
                            form.status === FormStatus.DRAFT ||
                            form.status === FormStatus.PENDING
                        ) {
                            router.push('/microcredit/application');
                        } else if (
                            form.status === FormStatus.IN_REVIEW ||
                            form.status === FormStatus.INTERVIEW
                        ) {
                            router.push(
                                `/microcredit/apply?success=true&formId=${form?.id}`
                            );
                        } else {
                            setLoading(false);
                        }
                    }
                } else {
                    setLoanId(activeLoanId);
                }
            }
        };

        getLoans().catch((e) => {
            console.log(e);
            processTransactionError(e, 'loading_borrower_page');
        });
    }, [auth?.user?.address]);

    useEffect(() => {
        setIsOverviewOpen(loan.startDate === 0);
    }, [isReady, auth?.user?.address]);

    if (!auth?.user?.address) return <ConnectWallet title={headingTitle} />;

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={
                (!isReady && loading) || !isPactPriceReady || !isRewardsReady
            }
        >
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
                {!!formState && formState === FormStatus.REQUEST_CHANGES && (
                    <RequestChanges data={data[viewName].data} />
                )}
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
                            rewards={rewards}
                            pactPriceUSD={priceUSD}
                            repayLoan={repayLoan}
                            loanId={loanId}
                            overviewData={loanData}
                            userAddress={auth?.user?.address}
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

                {!!formState && formState === FormStatus.REJECTED && (
                    <LoanRejected data={data[viewName].data} />
                )}
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
