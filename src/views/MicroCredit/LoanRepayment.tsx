/* eslint-disable no-nested-ternary */
import {
    Box,
    Button,
    Card,
    Display,
    Icon,
    Input,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { GetNetworkResult } from '@wagmi/core';
import {
    getPACTTradingMetrics,
    useBorrower,
    useCUSDBalance,
    useRewards
} from '@impact-market/utils';
import { localeFormat } from '../../utils/currencies';
import { mq } from 'styled-gen';
import { useEffect, useState } from 'react';
import { useMicrocreditBorrower } from 'src/hooks/useMicrocredit';
import BigNumber from 'bignumber.js';

import { useNetwork } from 'wagmi';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import processTransactionError from '../../utils/processTransactionError';
import styled, { css } from 'styled-components';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const PerformanceWarning = styled(Card)<{ performance: number }>`
    box-shadow: none;
    margin-top: 2rem;
    background-color: ${(props) =>
        props.performance < 50
            ? colors.e50
            : props.performance < 100
            ? colors.w50
            : props.performance >= 100 && '#DCFAE6'};
`;

const PerformanceIcon = styled.div<{ performance: number }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) =>
        props.performance < 50
            ? '#FF4405'
            : props.performance < 100
            ? colors.w300
            : props.performance >= 100 && colors.s300};
`;

const BorderWrapper = styled(Box)`
    padding: 0.6rem;
    border: 1px solid ${colors.g300};
    border-radius: 8px;
`;

const ActionWrapper = styled(Box)`
    ${mq.from(
        'xs',
        css`
            flex-direction: column;

            > .approve,
            .repay {
                width: 100%;
            }

            > svg {
                transform: rotate(90deg);
            }
        `
    )}

    ${mq.from(
        'md',
        css`
            flex-direction: row;

            > .approve {
                flex: 1;
            }

            > svg {
                transform: rotate(0deg);
            }
        `
    )}
`;

function useTokenPriceUSD(network: GetNetworkResult) {
    const [priceUSD, setPriceUSD] = useState<number | null>(null);

    useEffect(() => {
        async function fetchPrice() {
            const response = await getPACTTradingMetrics(network?.chain.id);

            setPriceUSD(parseFloat(response.priceUSD));
        }

        fetchPrice();
    }, [network]);

    return priceUSD;
}

const LoanRepayment = (props: any) => {
    const {
        data,
        isOverviewOpen,
        overviewData,
        repayLoan,
        loanId,
        loan,
        userAddress,
        pactPriceUSD,
        rewards
    } = props;
    const { t } = useTranslations();
    const balanceCUSD = useCUSDBalance();
    const { approve } = useBorrower();
    const formattedBalance = localeFormat(balanceCUSD, {
        maximumFractionDigits: 6,
        maximumSignificantDigits: 6
    });
    const { estimateDonationRewards, rewards } = useRewards();
    const {
        repayLoanTitle,
        repayLoanDescription,
        repayLoanImage,
        repayLoanButton,
        repayLoanApproveTip,
        repayLoanReady,
        repayLoanApproveLabel,
        repayLoanApprovedLabel,
        repayLoanAmountToPay,
        repayLoanPerformanceWarningTitle,
        repayLoanPerformanceHigh,
        repayLoanPerformanceMedium,
        repayLoanPerformanceLow
    } = data;

    const [amount, setAmount] = useState('');
    const [approved, setApproved] = useState(false);
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [isLoadingRepay, setIsLoadingRepay] = useState(false);
    const network = useNetwork();

    const pactPriceUSD = useTokenPriceUSD(network);

    useEffect(() => {
        console.debug(loan);
        const result = new BigNumber(
            (
                (loan.amountRepayed + loan.currentDebt - loan.amountBorrowed) *
                10 *
                30 *
                3
            ).toFixed(0)
        ).toString();

        estimateDonationRewards(result);
    }, [loan]);

    useEffect(() => {
        console.debug(rewards, pactPriceUSD);
    }, [rewards.estimated, pactPriceUSD]);

    const { borrower, loadingBorrower } = useMicrocreditBorrower([
        `address=${userAddress}`
    ]);

    const repay = async () => {
        setIsLoadingRepay(true);

        try {
            toast.info(<Message id="connectWallet" />);
            const response = await repayLoan(loanId, amount);

            if (response.status) {
                toast.success(<Message id="generatedSuccess" />);
                setAmount('');
                setApproved(false);
            }
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'repay_loan');
            toast.error(<Message id="errorOccurred" />);
        }

        setIsLoadingRepay(false);
    };

    const handleApprove = async () => {
        setIsLoadingApprove(true);
        const token = config.cUSDAddress;

        try {
            toast.info(<Message id="approveTransaction" />);
            const response = await approve(token, amount);

            if (response.status) {
                setApproved(true);
                toast.success(<Message id="generatedSuccess" />);
            }
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'approve_loan');
            toast.error(<Message id="errorOccurred" />);
        }

        setIsLoadingApprove(false);
    };

    return (
        <Box
            flex
            fDirection={{ sm: 'row', xs: 'column' }}
            padding={{ sm: '4rem', xs: '1rem' }}
        >
            <Box style={{ flexBasis: '50%' }} center order={{ sm: 0, xs: 1 }}>
                <Display g800 medium>
                    {repayLoanTitle}
                </Display>
                <RichText
                    content={repayLoanDescription}
                    g500
                    small
                    mt={0.5}
                    variables={{
                        currentDebt: loan.currentDebt.toFixed(3),
                        debtAccrues: (
                            loan.currentDebt *
                            (loan.dailyInterest / 100)
                        ).toFixed(3),
                        estimatedFiatRewards: (
                            (Number(rewards) ?? 0) * pactPriceUSD
                        ).toFixed(3),
                        estimatedRewards: Number(rewards).toFixed(3),
                        totalToPay: loan.currentDebt.toFixed(3)
                    }}
                />
                {!loadingBorrower && (
                    <PerformanceWarning
                        performance={borrower?.lastLoanPerformance}
                    >
                        <Box
                            flex
                            fLayout="center"
                            fWrap="wrap"
                            style={{ gap: '0.5rem' }}
                            mb={0.5}
                        >
                            <PerformanceIcon
                                performance={borrower?.lastLoanPerformance}
                            />
                            <RichText
                                content={repayLoanPerformanceWarningTitle}
                                variables={{
                                    value: borrower?.lastLoanPerformance
                                }}
                                g900
                                semibold
                                w="fit-content"
                            />
                        </Box>
                        <RichText
                            content={
                                borrower?.lastLoanPerformance < 50
                                    ? repayLoanPerformanceLow
                                    : borrower?.lastLoanPerformance < 100
                                    ? repayLoanPerformanceMedium
                                    : borrower?.lastLoanPerformance >= 100 &&
                                      repayLoanPerformanceHigh
                            }
                            g600
                            small
                        />
                    </PerformanceWarning>
                )}

                <LoanOverview
                    overviewData={overviewData}
                    open={isOverviewOpen}
                />

                <Box mt={1.25}>
                    <BorderWrapper>
                        <Box fLayout="between center" flex>
                            <Input
                                label="Repay"
                                name="value"
                                onChange={(e: any) => {
                                    if (e.target.value > formattedBalance) {
                                        setAmount(formattedBalance);
                                    }

                                    if (e.target.value > loan.currentDebt) {
                                        setAmount(loan.currentDebt);
                                    } else {
                                        setAmount(e.target.value);
                                    }
                                }}
                                placeholder={repayLoanAmountToPay}
                                rules={{ required: true }}
                                style={{ fontSize: '1rem' }}
                                type="number"
                                value={amount}
                                wrapperProps={{
                                    padding: { xs: 0 },
                                    style: {
                                        boxShadow: 'none',
                                        flex: 1,
                                        fontSize: '5.5rem'
                                    }
                                }}
                            />
                            <Box fLayout="center" flex>
                                <Text regular small />
                                <Text regular small>
                                    {' cUSD'}
                                </Text>
                            </Box>
                        </Box>
                    </BorderWrapper>
                </Box>

                <Text g500 small mt={0.4}>
                    {`${t('balance')}: ${formattedBalance} cUSD`}
                </Text>

                <Box mt={2} mb={1.5}>
                    {!approved && (
                        <RichText content={repayLoanApproveTip} g500 small />
                    )}

                    {approved && (
                        <RichText content={repayLoanReady} g500 small />
                    )}
                </Box>
                <ActionWrapper flex fLayout="center" fWrap="wrap">
                    <Button
                        className="approve"
                        h={3.8}
                        onClick={handleApprove}
                        isLoading={isLoadingApprove}
                        disabled={approved || amount.length === 0}
                        // this is temporary!
                        // disabled={approved || +amount === 0}
                    >
                        <Icon icon="checkCircle" mr={0.5} />
                        <Text large medium>
                            {!approved
                                ? repayLoanApproveLabel
                                : repayLoanApprovedLabel}
                        </Text>
                    </Button>
                    <Icon
                        icon="chevronRight"
                        g400
                        size={[2, 2]}
                        ml={0.3}
                        mr={0.3}
                    />
                    <Button
                        className="repay"
                        h={3.8}
                        onClick={repay}
                        isLoading={isLoadingRepay}
                        disabled={!approved}
                    >
                        <Text large medium>
                            {repayLoanButton}
                        </Text>
                    </Button>
                </ActionWrapper>
            </Box>
            <Box
                style={{ flexBasis: '50%' }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <Image {...repayLoanImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default LoanRepayment;
