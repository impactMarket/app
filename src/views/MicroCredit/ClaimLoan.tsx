import { Alert, Box, Button, Display, Text } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Contract from './Contract';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';
import RichText from '../../libs/Prismic/components/RichText';
import styled from 'styled-components';
import useFilters from 'src/hooks/useFilters';

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
    const { data, overviewData, claimLoan, loan } = props;
    const {
        claimLoanTitle,
        claimLoanDescription,
        claimLoanImage,
        claimLoanExpiry
    } = data;
    const [isLoading, setIsLoading] = useState(false);
    const loanAmount = loan.amountBorrowed ?? 0;
    const rates = useSelector(selectRates);
    const auth = useSelector(selectCurrentUser);
    const { user } = useSelector(selectCurrentUser);
    const [signContract, setSignContract] = useState(false);
    const { update, getByKey } = useFilters();

    useEffect(() => {
        if (getByKey('contractAddress')) {
            setSignContract(true);
        } else {
            setSignContract(false);
        }
    }, [getByKey('contractAddress')]);

    const localeCurrency = new Intl.NumberFormat(
        auth?.user?.currency?.language || 'en-US',
        {
            currency: auth?.user?.currency || 'USD',
            style: 'currency'
        }
    );

    return (
        <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
            {!signContract && (
                <>
                    <Box
                        style={{ flexBasis: '50%' }}
                        center
                        order={{ sm: 0, xs: 1 }}
                        padding={{ sm: '4rem 0 4rem 4rem', xs: '1rem' }}
                    >
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
                            message={claimLoanExpiry}
                            mt={1.5}
                        />
                        <LoanOverview overviewData={overviewData} open />
                        <Box mt={1.5} flex fLayout="center">
                            <Button
                                h={3.8}
                                onClick={() =>
                                    update('contractAddress', user?.address)
                                }
                                isLoading={isLoading}
                            >
                                <RichText
                                    large
                                    medium
                                    content={`Sign contract to accept ${loanAmount} cUSD Loan`}
                                    variables={{ loanAmount }}
                                />
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
                        padding={{ sm: '4rem 4rem 4rem 0', xs: '1rem' }}
                        fLayout="center"
                        flex
                        order={{ sm: 1, xs: 0 }}
                    >
                        <Image
                            {...claimLoanImage}
                            radius={0.5}
                            w="100%"
                            mb={1}
                        />
                    </Box>
                </>
            )}
            {signContract && (
                <Contract
                    data={data}
                    loan={loan}
                    claimLoan={claimLoan}
                    overviewData={overviewData}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            )}
        </Box>
    );
};

export default ClaimLoan;
