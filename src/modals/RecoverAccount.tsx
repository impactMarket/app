import * as Sentry from '@sentry/browser';
import {
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { getUserTypes } from '../utils/users';
import { selectCurrentUser, setCredentials } from '../state/slices/auth';
import { setCookie } from 'cookies-next';
import { useDispatch, useSelector } from 'react-redux';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRecoverAccountMutation } from '../api/user';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';
import useWallet from '../hooks/useWallet';

const RecoverAccount = () => {
    const { user } = useSelector(selectCurrentUser);
    const { disconnect } = useWallet();
    const dispatch = useDispatch();

    const { handleClose } = useModal();
    const { modals } = usePrismicData();
    const { control, handleSubmit } = useForm();
    const { isSubmitting } = useFormState({
        control
    });

    const [recoverAccount] = useRecoverAccountMutation();

    const onSubmit: SubmitHandler<any> = async () => {
        try {
            const content: any = {
                address: user?.recoverAddress,
                recover: true
            };

            const payload: any = await recoverAccount(content);

            if (payload?.error) {
                toast.error(<RichText content="Error" />);
            } else {
                dispatch(
                    setCredentials({
                        token: payload?.data.token,
                        type: getUserTypes(payload?.data),
                        user: { ...payload?.data }
                    })
                );

                // Create cookie to save Auth Token
                const expiryDate = new Date();

                expiryDate.setTime(
                    expiryDate.getTime() + 60 * 24 * 60 * 60 * 1000
                );
                setCookie('AUTH_TOKEN', payload?.data.token, {
                    expires: expiryDate,
                    path: '/'
                });

                toast.success(
                    <RichText content={modals?.data?.recoverAccountRecovered} />
                );

                handleClose();
            }
        } catch (error) {
            toast.error(<RichText content="Error" />);
            Sentry.captureException(error);
            console.log(error);
        }
    };

    const handleCancel = async () => {
        try {
            await disconnect();

            handleClose();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon error icon="minusCircle" large />
            <RichText
                content={modals?.data?.recoverAccountTitle}
                large
                mt={1.25}
                semibold
            />
            <RichText
                content={modals?.data?.recoverAccountDescription[0]?.text}
                g500
                mt={0.5}
                small
            />
            <Row mt={1}>
                <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                    <Button gray onClick={handleCancel} w="100%">
                        <RichText
                            content={modals?.data?.createStoryCancelButtonLabel}
                        />
                    </Button>
                </Col>
                <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Button isLoading={isSubmitting} type="submit" w="100%">
                            <RichText
                                content={modals?.data?.recoverAccountRecover}
                            />
                        </Button>
                    </form>
                </Col>
            </Row>
        </ModalWrapper>
    );
};

export default RecoverAccount;
