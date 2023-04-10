import {
    Alert,
    Box,
    Button,
    Display,
    Icon,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import styled from 'styled-components';

const CenteredAlert = styled(Alert)`
    > div {
        display: flex;
        justify-content: center;

        > div {
            width: auto;
        }

        p {
            font-weight: 600;
        }
    }
`;

const CheckBox = styled(Box)`
    background-color: ${colors.p100};
    border-radius: 50%;
    height: 20px;
    width: 20px;
`;

const ClaimLoan = (props: any) => {
    const { data, overviewData, claimLoan, loan } = props;
    const {
        claimLoanButton,
        claimLoanTitle,
        claimLoanDescription,
        claimLoanImage,
        consent1: consentText1,
        consent2: consentText2
    } = data;
    const [isLoading, setIsLoading] = useState(false);
    const loanAmount = loan.amountBorrowed ?? 0;
    const rates = useSelector(selectRates);
    const auth = useSelector(selectCurrentUser);
    const [consent1, setConsent1] = useState(false);
    const [consent2, setConsent2] = useState(false);

    const localeCurrency = new Intl.NumberFormat(
        auth?.user?.currency?.language || 'en-US',
        {
            currency: auth?.user?.currency || 'USD',
            style: 'currency'
        }
    );

    const claim = async () => {
        setIsLoading(true);

        try {
            toast.success(<Message id="connectWallet" />);
            const response = await claimLoan();

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
                    {claimLoanTitle}
                </Display>
                <RichText
                    content={claimLoanDescription}
                    variables={{ loanAmount: loan.amountBorrowed }}
                    small
                    mt={0.5}
                    g500
                />

                <CenteredAlert
                    warning
                    icon="alertTriangle"
                    mb={1.5}
                    message={'This offer expires in 1 week.'}
                    mt={1.5}
                />
                <LoanOverview overviewData={overviewData} />

                <Box fLayout="start" flex mb={1.2} mt={1.2}>
                    <Box mr={0.6}>
                        <CheckBox
                            onClick={() => setConsent1(!consent1)}
                            padding={0.3}
                            flex
                        >
                            {consent1 && (
                                <Icon icon="tick" p500 h="100%" w="100%" />
                            )}
                        </CheckBox>
                    </Box>
                    <label style={{ textAlign: 'left' }}>
                        <Text small g600>
                            {consentText1}
                        </Text>
                    </label>
                </Box>

                <Box fLayout="start" flex>
                    <Box mr={0.6}>
                        <CheckBox
                            onClick={() => setConsent2(!consent2)}
                            padding={0.3}
                            flex
                        >
                            {consent2 && (
                                <Icon icon="tick" p500 h="100%" w="100%" />
                            )}
                        </CheckBox>
                    </Box>
                    <label style={{ textAlign: 'left' }}>
                        <Text small g600>
                            {consentText2}
                        </Text>
                    </label>
                </Box>

                <Box mt={1.5} flex fLayout="center">
                    <Button
                        h={3.8}
                        onClick={claim}
                        isLoading={isLoading}
                        disabled={!consent1 || !consent2}
                    >
                        <RichText
                            large
                            medium
                            content={claimLoanButton}
                            variables={{ loanAmount }}
                        >
                            {`Accept ${loanAmount} cUSD Loan`}
                        </RichText>
                    </Button>
                </Box>
                <Text g500 small mt={1}>
                    {`${loan.amountBorrowed} cUSD = ~${currencyFormat(
                        loanAmount,
                        localeCurrency,
                        rates
                    )}`}
                </Text>
            </Box>
            <Box
                style={{ flexBasis: '50%' }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <Image {...claimLoanImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default ClaimLoan;
