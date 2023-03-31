import { Alert, Box, Button, Display, Text, toast } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useMicroCredit } from '@impact-market/utils';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';
import Message from '../../libs/Prismic/components/Message';
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

const ClaimLoan = (props: any) => {
    const { data, overviewData, claimLoan } = props;
    const { loan } = useMicroCredit();

    /* title, description from prismic */
    const { cardImage } = data;
    const [isLoading, setIsLoading] = useState(false);
    const loanAmount = loan.amountBorrowed ?? 0;
    const rates = useSelector(selectRates);
    const auth = useSelector(selectCurrentUser);

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
                    {/* {title} */}
                    {'Your loan has been approved!'}
                </Display>
                <Text small mt={0.5}>
                    {/* {description} */}
                    {`Congratulations! We're thrilled to inform you that your loan application for 200 cUSD has been approved!
                    
We're confident that this loan will help you achieve your financial goals, and we're excited to be a part of your journey.`}
                </Text>

                <CenteredAlert
                    warning
                    icon="alertTriangle"
                    mb={1.5}
                    message={'This offer expires in 1 week.'}
                    mt={1.5}
                />

                {/* LOAN OVERVIEW */}

                <LoanOverview overviewData={overviewData} />

                {/* ////---///// */}

                <Box mt={1.5} flex fLayout="center">
                    <Button h={3.8} onClick={claim} isLoading={isLoading}>
                        <Text large medium>
                            {`Accept ${loanAmount} cUSD Loan`}
                        </Text>
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
                <Image {...cardImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default ClaimLoan;
