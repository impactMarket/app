import {
    Box,
    Button,
    Display,
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
    const { title, description, cardImage } = data;
    const [amount, setAmount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    const repay = async () => {
        const token = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
        
        setIsLoading(true);

        try {
            toast.success(<Message id="connectWallet" />);
            await approve(token, amount);
            toast.success(<Message id="connectWallet" />);
            const response = await repayLoan(loanId, amount);

            if (response.status) {
                toast.success(<Message id="generatedSuccess" />);
            }
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }

        setIsLoading(false);
    };

    return (
        <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
            <Box style={{ flexBasis: '50%' }} center order={{ sm: 0, xs: 1 }}>
                <Display g800 medium>
                    {title}
                </Display>
                <Text small mt={0.5}>
                    {description}
                </Text>

                <LoanOverview overviewData={overviewData} />

                {/* REAPAY INPUT */}

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

                {/* ////---///// */}

                <Text g500 small mt={0.4}>
                    {`Balance: ${formattedBalance} cUSD`}
                </Text>

                <Box mt={1.5} flex fLayout="center">
                    <Button h={3.8} onClick={repay} isLoading={isLoading}>
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
                <Image {...cardImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default LoanRepayment;
