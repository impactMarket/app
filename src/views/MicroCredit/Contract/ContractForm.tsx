import {
    Box,
    Button,
    Card,
    Icon,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import {
    SubmitHandler,
    useForm,
    useFormState,
    useWatch
} from 'react-hook-form';
import { currencyFormat } from '../../../utils/currencies';
import { getCookie } from 'cookies-next';
import { handleSignature } from 'src/helpers/handleSignature';
import { selectCurrentUser } from '../../../state/slices/auth';
import { selectRates } from '../../../state/slices/rates';
import { useEffect, useRef, useState } from 'react';
import { useGetMicrocreditPreSignedMutation } from 'src/api/microcredit';
import { usePDF } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { useSignatures } from '@impact-market/utils/useSignatures';
import Input from '../../../components/Input';
import Message from '../../../libs/Prismic/components/Message';
import PDF from './PDF';
import RichText from '../../../libs/Prismic/components/RichText';
import config from '../../../../config';
import processTransactionError from '../../../utils/processTransactionError';
import styled from 'styled-components';
import useFilters from 'src/hooks/useFilters';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const CheckBox = styled(Box)`
    background-color: ${colors.p100};
    border-radius: 50%;
    height: 20px;
    width: 20px;
`;

const ContractForm = (props: any) => {
    const {
        data,
        claimLoan,
        loan,
        isLoading,
        setIsLoading,
        updatedContract,
        setUserSignature,
        setUserId
    } = props;
    const {
        claimLoanButton,
        consent1: consentText1,
        consent2: consentText2,
        contractBorrowerSignature,
        contractLenderSignature,
        contractSignature,
        contractId,
        contractFullName
    } = data;
    const loanAmount = loan.amountBorrowed ?? 0;
    const { t } = useTranslations();
    const rates = useSelector(selectRates);
    const auth = useSelector(selectCurrentUser);
    const [consent1, setConsent1] = useState(false);
    const [consent2, setConsent2] = useState(false);

    const { signature, eip712_signature } = useSelector(selectCurrentUser);
    const { signMessage, signTypedData } = useSignatures();

    const [getMicrocreditPreSigned] = useGetMicrocreditPreSignedMutation();

    const localeCurrency = new Intl.NumberFormat(
        auth?.user?.currency?.language || 'en-US',
        {
            currency: auth?.user?.currency || 'USD',
            style: 'currency'
        }
    );

    const date = new Date();
    const currentDate = `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: { id: '', name: '' } });
    const { isDirty, isSubmitting } = useFormState({
        control
    });

    const userSignature = useWatch({
        control,
        name: 'name'
    });

    const userId = useWatch({
        control,
        name: 'id'
    });

    // Break signatures div to when the user writes more than X% of the parent div
    const ref = useRef() as any;

    const [width, setWidth] = useState(0);
    const [parentElement, setParentElement] = useState(0);

    useEffect(() => {
        if (!ref?.current?.clientWidth) {
            return;
        }
        setWidth(ref?.current?.clientWidth);
    }, [userSignature]);

    useEffect(() => {
        if (!ref?.current?.parentElement.clientWidth) {
            return;
        }
        setParentElement(ref?.current?.parentElement.clientWidth);
    }, [ref?.current?.parentElement.clientWidth]);

    const [breakLine, setBreakLine] = useState(0) as any;

    useEffect(() => {
        const percentage = ((width / parentElement) * 100)?.toFixed(0);

        setBreakLine(percentage);
    }, [userSignature, width]);

    // PDF Data
    const [pdf, setPDF] = usePDF({
        document: (
            <PDF
                data={updatedContract}
                signature={{
                    contractBorrowerSignature,
                    contractLenderSignature,
                    contractSignature,
                    userSignature
                }}
            />
        )
    });

    // Update the PDF whenever userSignature changes
    useEffect(() => {
        const updatePDF = async () => {
            setUserSignature(userSignature);
            setUserId(userId);

            const updatedDocument = (
                <PDF
                    data={updatedContract}
                    signature={{
                        contractBorrowerSignature,
                        contractLenderSignature,
                        contractSignature,
                        userSignature
                    }}
                />
            );

            await setPDF(updatedDocument);
        };

        updatePDF();
    }, [userSignature, userId, setPDF]);

    const { clear } = useFilters();

    const claim = async () => {
        try {
            toast.info(<Message id="connectWallet" />);
            const response = await claimLoan();

            if (response.status) {
                toast.success(<Message id="generatedSuccess" />);
            }
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'claim_loan');
            toast.error(<Message id="errorOccurred" />);
            clear('contractAddress');
        }

        setIsLoading(false);
    };

    const onSubmit: SubmitHandler<any> = async () => {
        setIsLoading(true);

        try {
            if (!signature || !eip712_signature) {
                await handleSignature(signMessage, signTypedData);
            }

            const type = pdf?.blob?.type?.split('/')[1] || '';
            const preSigned = await getMicrocreditPreSigned(type).unwrap();

            if (!preSigned?.uploadURL) {
                return null;
            }

            const result = await fetch(preSigned?.uploadURL, {
                body: pdf?.blob,
                method: 'PUT'
            });

            if (result?.status === 200) {
                const res = await fetch(
                    `${config.baseApiUrl}/microcredit/docs`,
                    {
                        body: JSON.stringify([
                            {
                                category: 1,
                                filepath: preSigned?.filePath
                            }
                        ]),
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${auth.token}`,
                            'Content-Type': 'application/json',
                            eip712_message:
                                getCookie('EIP712_MESSAGE').toString(),
                            eip712_signature:
                                getCookie('EIP712_SIGNATURE').toString(),
                            message: getCookie('MESSAGE').toString(),
                            signature: getCookie('SIGNATURE').toString()
                        },
                        method: 'POST'
                    }
                );

                const response = await res.json();

                if (response?.success) {
                    claim();
                }
            } else {
                toast.error(<Message id="errorOccurred" />);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box margin="2.5rem 0 1rem 0" padding={0} tAlign="left">
                <Input
                    control={control}
                    label={contractFullName}
                    name="name"
                    withError={!!errors?.name}
                    hint={errors?.name ? t('requiredField') : ''}
                    rules={{ required: true }}
                    placeholder="Enter name ..."
                    limit={20}
                />
            </Box>

            <Box margin="0 0 2.5rem 0" padding={0} tAlign="left">
                <Input
                    control={control}
                    label={contractId}
                    name="id"
                    withError={!!errors?.id}
                    hint={errors?.id ? t('requiredField') : ''}
                    rules={{ required: true }}
                    placeholder="Enter ID ..."
                    limit={40}
                />
            </Box>

            <Card
                flex
                fWrap="wrap"
                tAlign="left"
                style={{ boxShadow: 'none', rowGap: '0.5rem' }}
                padding={0}
            >
                <Box
                    bgColor={colors.g100}
                    borderRadius={
                        parseInt(breakLine, 10) > 50
                            ? '0.5rem'
                            : '0.5rem 0 0 0.5rem'
                    }
                    w={parseInt(breakLine, 10) > 50 && '100%'}
                    minW={'50%'}
                    padding="1rem 1.5rem 1rem 1rem"
                    pr={1.5}
                    ref={ref}
                >
                    <Text g600 mb={1}>
                        {contractBorrowerSignature}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Italianno',
                            fontSize: '4rem',
                            lineHeight: 'unset'
                        }}
                        g600
                        mb={0.5}
                    >
                        {userSignature || '-'}
                    </Text>
                    <Box
                        style={{
                            display: parseInt(breakLine, 10) > 50 && 'flex',
                            gap: '0.5rem'
                        }}
                        fWrap="wrap"
                    >
                        <Text g600 mb={parseInt(breakLine, 10) <= 50 && 0.5}>
                            {userSignature || '-'}
                        </Text>
                        {parseInt(breakLine, 10) > 50 && <Text>,</Text>}
                        <Text g600>
                            {(userSignature && currentDate) || '-'}
                        </Text>
                    </Box>
                </Box>
                <Box
                    bgColor={colors.g100}
                    borderRadius={
                        parseInt(breakLine, 10) > 50
                            ? '0.5rem'
                            : '0 0.5rem 0.5rem 0'
                    }
                    w={parseInt(breakLine, 10) > 50 && '100%'}
                    minW={'50%'}
                    padding={1}
                >
                    <Text g600 mb={1}>
                        {contractLenderSignature}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Italianno',
                            fontSize: '4rem',
                            lineHeight: 'unset'
                        }}
                        g600
                        mb={0.5}
                    >
                        {contractSignature}
                    </Text>
                    <Box
                        style={{
                            display: parseInt(breakLine, 10) > 50 && 'flex',
                            gap: '0.5rem'
                        }}
                        fWrap="wrap"
                    >
                        <Text g600 mb={parseInt(breakLine, 10) <= 50 && 0.5}>
                            {contractSignature}
                        </Text>
                        {parseInt(breakLine, 10) > 50 && <Text>,</Text>}
                        <Text g600>{currentDate}</Text>
                    </Box>
                </Box>
            </Card>
            <Box
                flex
                fDirection="column"
                style={{ gap: '1.2rem' }}
                margin="1.2rem 0"
            >
                <Box fLayout="start" flex>
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
                        <Text g600>{consentText1}</Text>
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
                        <Text g600>{consentText2}</Text>
                    </label>
                </Box>
            </Box>
            <Box>
                <Box mt={1.5} flex fLayout="center">
                    <Button
                        disabled={
                            isSubmitting ||
                            !consent1 ||
                            !consent2 ||
                            !isDirty ||
                            !userSignature ||
                            !userId
                        }
                        isLoading={isSubmitting || isLoading}
                        type="submit"
                        h={3.8}
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
        </form>
    );
};

export default ContractForm;
