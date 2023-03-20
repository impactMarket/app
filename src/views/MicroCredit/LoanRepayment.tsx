import {
    Box,
    Button,
    Card,
    Display,
    Icon,
    Input,
    Text,
    colors
} from '@impact-market/ui';
import { localeFormat } from '../../utils/currencies';
import { useCUSDBalance } from '@impact-market/utils';
import { useState } from 'react';
import Image from '../../libs/Prismic/components/Image';
import Tooltip from '../../components/Tooltip';
import styled from 'styled-components';

const BorderWrapper = styled(Box)`
    padding: 0.6rem;
    border: 1px solid ${colors.g300};
    border-radius: 8px;
`;

const CleanCard = styled(Card)`
    box-shadow: none;
    overflow: hidden;
    transition: max-height 0.5s;
    max-height: 3rem;
    margin-top: 2rem;

    &.active {
        max-height: 100rem;
        background-color: #f8f9fd;
    }
`;

export function LoanRepayment(props: any) {
    const balanceCUSD = useCUSDBalance();
    const formattedBalance = localeFormat(balanceCUSD, {
        maximumFractionDigits: 6,
        maximumSignificantDigits: 6
    });
    const { title, description, cardImage } = props.data;
    const [amount, setAmount] = useState(0);

    const loanData = [
        {
            label: 'Total loan amount',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: '250cUSD'
        },
        {
            label: 'Total loan to pay',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: '269cUSD'
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
            label: 'Interest rate',
            tooltip:
                'This is total loan amount approved and initially deposited in your wallet.',
            value: '4%'
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
            value: '56cUSD'
        }
    ];

    const [active, setActive] = useState(false);

    const handleClick = () => {
        const overviewElement = document.querySelector('.overview');

        if (active) {
            overviewElement.classList.remove('active');
            setActive(false);
        } else {
            overviewElement.classList.add('active');
            setActive(true);
        }
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

                {/* LOAN OVERVIEW */}

                <CleanCard className="overview">
                    <a>
                        <Box flex fLayout="center">
                            <div
                                className="clicked-element"
                                onClick={handleClick}
                            >
                                <Text small p500 semibold>
                                    {'Loan Overview'}
                                </Text>
                            </div>
                            <Icon
                                icon={active ? 'chevronUp' : 'chevronDown'}
                                p500
                            />
                        </Box>
                    </a>
                    <Box mt={1}>
                        {loanData.map(({ label, value, tooltip }: any) => (
                            <Box flex fLayout="between" mb={0.5}>
                                <Box flex fLayout="center start">
                                    <Text small g500>
                                        {label}
                                    </Text>
                                    <Tooltip content={tooltip}>
                                        <Icon icon="infoCircle" g500 ml={0.3} />
                                    </Tooltip>
                                </Box>

                                <Text small semibold g900>
                                    {value}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                </CleanCard>

                {/* ////---///// */}

                {/* REAPAY INPUT */}

                <Box mt={1.25}>
                    <BorderWrapper>
                        <Box fLayout="between center" flex>
                            <Input
                                label="Repay"
                                name="value"
                                onChange={(e: any) => setAmount(e.target.value)}
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
                    <Button h={3.8} onClick={() => {}}>
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
}

export default LoanRepayment;
