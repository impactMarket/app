import {
    Alert,
    Box,
    Button,
    CircledIcon,
    Col,
    Icon,
    Input,
    ModalWrapper,
    Row,
    Text,
    colors,
    toast,
    useModal
} from '@impact-market/ui';
import { localeFormat } from '../utils/currencies';
import { useCUSDBalance, useDonationMiner } from '@impact-market/utils';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import BigNumber from 'bignumber.js';
import Message from '../libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import processTransactionError from '../utils/processTransactionError';
import styled from 'styled-components';
import useFilters from '../hooks/useFilters';

const BorderWrapper = styled(Box)`
    padding: 1rem;
    border: 1px solid ${colors.g300};
    border-radius: 8px;
`;

const CloseButton = styled(Button)`
    .button-content {
        padding: 0.5rem;
    }
`;

const ButtonWrapper = styled(Button)`
    transition: none;
    background-color: ${colors.s400};
    border-color: ${colors.s400};

    &:disabled {
        background-color: ${colors.p600};
        border-color: ${colors.p600};
    }
    &:hover:not([disabled]),
    .button-spinner {
        background-color: ${colors.s400};
        border-color: ${colors.s400};
    }
`;

const AlertWrapper = styled(Box)`
    a {
        font-size:0.875rem;
    }
`;

const Contribute = () => {
    const { handleClose, contractAddress, value } = useModal();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [approved, setApproved] = useState(0);
    const [contribution, setContribution] = useState(value);
    const { extractFromModals } = usePrismicData();
    const { placeholder, balance, content, tip, tipTitle, title, approve: approveCUSD } = extractFromModals(
        'contribute'
    ) as any;
    const { approve, donateToCommunity, donateToTreasury } = useDonationMiner();
    const { clear } = useFilters();
    const balanceCUSD = useCUSDBalance();
    const formattedBalance = localeFormat(balanceCUSD, {
        maximumFractionDigits: 6,
        maximumSignificantDigits: 6
    });
    const insuficientFunds = contribution <= 0 || contribution > balanceCUSD;
    const isApprovalDisabled = step === 1 || insuficientFunds;
    const isContributeDisabled = step === 0 || insuficientFunds || contribution !== approved;

    const handleChange = (e: any) => {
        if (approved > 0) {
            e.target.value !== approved ? setStep(0) : setStep(1);
        }

        setContribution(e.target.value.replace(/,/g, '.'));
    };

    const handleApprove = async () => {
        if (loading || contribution > balance) {
            return;
        }

        setLoading(true);

        try {
            BigNumber.config({ EXPONENTIAL_AT: 29 });
            const amount = new BigNumber(contribution).toString();

            const response = await approve(amount, contractAddress);

            if (!response?.status) {
                processTransactionError(response, 'approve');
                
                return toast.error(<Message id="errorOccurred" />);
            }

            toast.success('Approved successfully.');
            setApproved(contribution);
            setStep(1);
        } catch (error) {
            processTransactionError(error, 'approve');
            toast.error(<Message id="errorOccurred" />);
        } finally {
            setLoading(false);
        }
    };

    const handleContribute = async () => {
        if (loading || contribution > balance) {
            return;
        }

        setLoading(true);

        try {
            BigNumber.config({ EXPONENTIAL_AT: 29 });
            const amount = new BigNumber(contribution).toString();

            const response = !!contractAddress
                ? await donateToCommunity(contractAddress, amount)
                : await donateToTreasury(amount);

            if (!response?.status) {
                processTransactionError(response, 'donate');

                return toast.error(<Message id="errorOccurred" />);
            }

            toast.success('Thanks for your donation.');
            closeModal();
        } catch (error) {
            processTransactionError(error, 'donate');
            toast.error(<Message id="errorOccurred" />);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        clear('contribute');
        handleClose();
    };

    const handleKeyPress = (event: any) => {
        if (!/^\d*(?:[\,\.]\d*)?$/.test(event.target.value + event.key)) {
            event.preventDefault();
        }
    };

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <Box fLayout="between" flex w="100%">
                <Col>
                    <CircledIcon icon="creditCard" large />
                </Col>
                <Col fDirection="column" fLayout="center" flex>
                    <CloseButton
                        bgColor={colors.n01}
                        gray
                        onClick={closeModal}
                        padding={0}
                    >
                        <Icon g900 icon="close" />
                    </CloseButton>
                </Col>
            </Box>
            <RichText content={title} large mt={1.25} semibold />

            <RichText content={content} g500 mt={0.5} small />
            <Box mt={1.25}>
                <BorderWrapper>
                    <Box fLayout="between" flex mb={0.5}>
                        <Box>
                            {/* TODO:  Add currency icon */}
                            {/* <Currency currency="cUSD" /> */}
                            <Text bold ml={0.5} small>
                                cUSD
                            </Text>
                        </Box>
                        <Box fLayout="end" flex>
                            <RichText
                                content={balance}
                                regular
                                small
                                variables={{ balance: formattedBalance }}
                            />
                            <Text regular small>
                                {' cUSD'}
                            </Text>
                        </Box>
                    </Box>
                    <Input
                        label="Contribute"
                        mt={0.5}
                        name="value"
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        rules={{ required: true }}
                        style={{ fontSize: '1.5rem' }}
                        type="number"
                        value={contribution}
                        wrapperProps={{
                            padding: { xs: 0 },
                            style: { boxShadow: 'none', fontSize: '5.5rem' }
                        }}
                    />
                </BorderWrapper>
            </Box>
            <Row mt={0.5}>
                <Col colSize={{ sm: 6, xs: 6 }} fLayout="center" flex>
                    <Box
                        bgColor={isApprovalDisabled ? colors.p200 : colors.p500}
                        borderRadius="50%"
                        padding="4px 10px"
                    >
                        <Text n01 regular small>
                            1
                        </Text>
                    </Box>
                </Col>
                <Col colSize={{ sm: 6, xs: 6 }} fLayout="center" flex>
                    <Box
                        bgColor={
                            isContributeDisabled ? colors.p200 : colors.s400
                        }
                        borderRadius="50%"
                        padding="4px 10px"
                    >
                        <Text n01 regular small>
                            2
                        </Text>
                    </Box>
                </Col>
            </Row>

            <Row>
                <Col colSize={{ sm: 6, xs: 6 }} flex pr={0.25}>
                    <Button
                        disabled={isApprovalDisabled}
                        isLoading={step === 0 && loading}
                        onClick={handleApprove}
                        w="100%"
                    >
                        <RichText content={approveCUSD} />
                    </Button>
                </Col>
                <Col colSize={{ sm: 6, xs: 6 }} flex pl={0.25}>
                    <ButtonWrapper
                        disabled={isContributeDisabled}
                        isLoading={step === 1 && loading}
                        onClick={handleContribute}
                        w="100%"
                    >
                        <RichText content={title} />
                    </ButtonWrapper>
                </Col>
            </Row>

            {loading && 
                <AlertWrapper>
                    <Alert
                        icon="alertCircle"
                        message={<RichText content={tip} g500 mt={0.5} small />}
                        mt={1}
                        title={tipTitle}
                    />
                </AlertWrapper>   
            }
        </ModalWrapper>
    );
};

export default Contribute;
