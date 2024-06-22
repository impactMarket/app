// @ts-nocheck
import {
    Box,
    Button,
    Card,
    CircledIcon,
    Icon,
    Input,
    Text,
    TextLink,
    colors,
    toast
} from '@impact-market/ui';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSendVerifyEmailMutation } from 'src/api/user';
import RichText from '../../libs/Prismic/components/RichText';
import config from 'config';
import processTransactionError from '../../utils/processTransactionError';
import router from 'next/router';
import styled from 'styled-components';

const ConsentWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    gap: 0.5rem;
    align-items: center;
`;

const CheckBox = styled(Box)`
    background-color: ${colors.p100};
    border-radius: 5px;
    height: 20px;
    width: 20px;
`;

const IconStyled = styled(Icon)`
    color: ${colors.p500};
    height: 100%;
    width: 30px;
    margin: 0 auto;
`;

const ButtonStyled = styled(Button)`
    margin-top: 1rem;
    border: none;
`;

const ValidateEmail = () => {
    const auth = useSelector(selectCurrentUser);
    const [sendVerifyEmail] = useSendVerifyEmailMutation();
    const [openForm, setOpenForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (auth?.user?.email) {
            setEmail(auth?.user?.email);
        }
    }, [auth]);

    const verifyEmail = async () => {
        if (!validateEmail(email)) {
            setIsEmailValid(false);

            return;
        }

        try {
            await sendVerifyEmail({
                email,
                url: config.verifyEmailUrl
            }).unwrap();

            setIsLoading(false);
            setOpenForm(false);
            setSuccess(true);
        } catch (error) {
            toast.error(`An error has occurred. Please try again later.`);
            processTransactionError(error, 'verify_email');
            console.log(error);
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return re.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsEmailValid(true);
    };

    return (
        <Card
            className="claim-rewards"
            style={{ boxSizing: 'border-box', flex: '1' }}
        >
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {success ? (
                    <CircledIcon
                        icon="check"
                        success
                        style={{ margin: '0 auto' }}
                    />
                ) : (
                    <IconStyled icon="mail" />
                )}
                <RichText
                    style={{
                        color: `${colors.g700}`,
                        marginTop: '0.5rem',
                        textAlign: 'center'
                    }}
                    content={
                        !success
                            ? 'Confirm email to claim rewards'
                            : 'Check your inbox! '
                    }
                    semibold
                    large
                />

                {openForm ? (
                    <>
                        <Box style={{ marginTop: '1rem', width: '100%' }}>
                            <Input
                                id="email"
                                placeholder="Add email"
                                onChange={handleEmailChange}
                                value={email}
                                style={{
                                    color: '#101828',
                                    paddingLeft: '0.5rem'
                                }}
                                icon="mail"
                            />
                            {!isEmailValid && (
                                <Text
                                    extrasmall
                                    style={{
                                        color: colors.e600,
                                        paddingTop: '0.5rem'
                                    }}
                                >
                                    Please enter a valid address
                                </Text>
                            )}
                        </Box>
                        <ConsentWrapper>
                            <Box mr={0.6}>
                                <CheckBox
                                    onClick={() => setConsent(!consent)}
                                    padding={0.3}
                                    flex
                                >
                                    {consent && (
                                        <Icon
                                            icon="tick"
                                            h="100%"
                                            w="100%"
                                            style={{ color: colors.p500 }}
                                        />
                                    )}
                                </CheckBox>
                            </Box>
                            <label style={{ textAlign: 'left' }}>
                                <Text small style={{ color: colors.g700 }}>
                                    I agree to the Privacy Policy and to receive
                                    updates from impactMarket.
                                </Text>
                            </label>
                        </ConsentWrapper>
                        <ButtonStyled
                            isLoading={isLoading}
                            onClick={verifyEmail}
                            disabled={!consent || !email}
                            success
                        >
                            Confirm email
                        </ButtonStyled>
                    </>
                ) : (
                    <>
                        {!success && (
                            <ButtonStyled
                                onClick={() => setOpenForm(true)}
                                isLoading={isLoading}
                                success
                            >
                                Continue
                            </ButtonStyled>
                        )}

                        {success && (
                            <>
                                <Text
                                    style={{
                                        color: colors.g700,
                                        textAlign: 'center'
                                    }}
                                >
                                    We've sent you an email to {email}.
                                </Text>
                                <TextLink
                                    onClick={() => {
                                        setSuccess(false);
                                        setOpenForm(true);
                                    }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '1rem'
                                    }}
                                >
                                    <Text style={{ color: colors.s400 }}>
                                        Change email
                                    </Text>
                                </TextLink>
                            </>
                        )}
                    </>
                )}
                <TextLink
                    onClick={() => {
                        router.reload();
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1rem'
                    }}
                >
                    <Text extrasmall>Refresh page</Text>
                </TextLink>
            </Box>
        </Card>
    );
};

export default ValidateEmail;
