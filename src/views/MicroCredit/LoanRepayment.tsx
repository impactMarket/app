import {
    Box,
    Button,
    Display,
    Icon,
    Input,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { localeFormat } from '../../utils/currencies';
import { useCUSDBalance, useMicroCredit } from '@impact-market/utils';
import { useState } from 'react';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import styled from 'styled-components';

const BorderWrapper = styled(Box)`
    padding: 0.6rem;
    border: 1px solid ${colors.g300};
    border-radius: 8px;
`;

const LoanRepayment = (props: any) => {
    const { data, overviewData, repayLoan, loanId, loan } = props;
    const balanceCUSD = useCUSDBalance();
    const { approve } = useMicroCredit();
    const formattedBalance = localeFormat(balanceCUSD, {
        maximumFractionDigits: 6,
        maximumSignificantDigits: 6
    });
    const { repayLoanTitle, repayLoanDescription, repayLoanImage } = data;

    console.log(data);

    const [amount, setAmount] = useState('0');
    const [approved, setApproved] = useState(false);
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [isLoadingRepay, setIsLoadingRepay] = useState(false);

    const repay = async () => {
        setIsLoadingRepay(true);

        try {
            toast.success(<Message id="connectWallet" />);
            const response = await repayLoan(loanId, amount);

            if (response.status) {
                toast.success(<Message id="generatedSuccess" />);
                setApproved(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }

        setIsLoadingRepay(false);
    };

    const handleApprove = async () => {
        const token = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';

        setIsLoadingApprove(true);

        try {
            toast.success(<Message id="connectWallet" />);
            const response = await approve(token, amount);

            if (response.status) {
                setApproved(true);
                toast.success(<Message id="generatedSuccess" />);
            }
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }

        setIsLoadingApprove(false);
    };

    return (
        <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
            <Box style={{ flexBasis: '50%' }} center order={{ sm: 0, xs: 1 }}>
                <Display g800 medium>
                    {repayLoanTitle}
                </Display>
                <RichText content={repayLoanDescription} small mt={0.5} />

                <LoanOverview overviewData={overviewData} />

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
                    {`Balance: ${formattedBalance} cUSD`}
                </Text>

                <Box mt={2}>
                    <Text g500 small>
                        {!approved &&
                            'Click Approve Transaction and check your wallet. Troubleshoot if needed.'}

                        {approved && 'Transaction approved. You can repay now.'}
                    </Text>
                </Box>
                <Box mt={1.5} flex fLayout="center" fWrap="wrap">
                    <Button
                        h={3.8}
                        onClick={handleApprove}
                        isLoading={isLoadingApprove}
                        disabled={approved}
                    >
                        <Icon icon="checkedCircle" />
                        <Text large medium>
                            {`Approve Transaction`}
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
                        h={3.8}
                        onClick={repay}
                        isLoading={isLoadingRepay}
                        disabled={!approved}
                        mt={0.3}
                    >
                        <Text large medium>
                            {`Repay ${amount} cUSD`}
                        </Text>
                    </Button>
                </Box>
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
