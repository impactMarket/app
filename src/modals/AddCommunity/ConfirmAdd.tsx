/* eslint-disable no-nested-ternary */
import {
    Box,
    Button,
    CircledIcon,
    ModalWrapper,
    Text,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { addUserSchema } from '../../utils/communities';
import { currencyFormat } from '../../utils/currencies';
import { handleSignature } from '../../helpers/handleSignature';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useSignatures } from '@impact-market/utils/useSignatures';
import { useYupValidationResolver } from '../../helpers/yup';
import Message from '../../libs/Prismic/components/Message';
import PersonalForm from '../../views/AddCommunity/PersonalForm';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const ConfirmAdd = () => {
    const { data, handleClose, isSubmitting, language, onSubmit } = useModal();

    const { signature, eip712_signature } = useSelector(selectCurrentUser);
    const { signMessage, signTypedData } = useSignatures();
    const auth = useSelector(selectCurrentUser);
    const [updatedData, setUpdatedData] = useState(data) as any;
    const [profilePicture, setProfilePicture] = useState(null);

    const localeCurrency = new Intl.NumberFormat(language, {
        currency: 'USD',
        style: 'currency'
    });

    const { t } = useTranslations();
    const { extractFromModals, extractFromView } = usePrismicData();
    const { beneficiaryAble, content, title } = extractFromModals(
        'createAddCommunity'
    ) as any;
    const { basicProfileData } = extractFromView('formSections') as any;

    const amount = currencyFormat(data.claimAmount, localeCurrency);
    const interval =
        data.baseInterval === 'day'
            ? t('perDay')
            : data.baseInterval === 'week'
              ? t('perWeek')
              : '';
    const maxAmount = currencyFormat(data.maxClaim, localeCurrency);
    const minutes = data.incrementInterval;

    const {
        handleSubmit,
        control,
        formState: { errors, submitCount, isValid }
    } = useForm({
        defaultValues: {
            address: auth?.user?.address || '',
            email: auth?.user?.email || '',
            firstName: auth?.user?.firstName || '',
            lastName: auth?.user?.lastName || '',
            profileImg: auth?.user?.avatarMediaPath || ''
        },
        mode: 'onChange',
        resolver: useYupValidationResolver(addUserSchema)
    });

    const personalForm: SubmitHandler<any> = async (userData) => {
        if (isValid) {
            try {
                if (!signature || !eip712_signature) {
                    await handleSignature(signMessage, signTypedData);
                }

                if (profilePicture || auth?.user?.avatarMediaPath) {
                    setUpdatedData({ ...data, ...userData });
                }
            } catch (error: any) {
                if (
                    error?.data?.error?.name === 'EXPIRED_SIGNATURE' ||
                    error?.data?.error?.name === 'INVALID_SINATURE'
                ) {
                    const { success } = await handleSignature(
                        signMessage,
                        signTypedData
                    );

                    if (success) personalForm(data);
                } else {
                    console.log(error);
                    processTransactionError(error, 'add_community');
                    toast.error(<Message id="errorOccurred" />);
                }
            }
        }
    };

    const authData =
        !auth?.user?.email ||
        !auth?.user?.firstName ||
        !auth?.user?.lastName ||
        !auth?.user?.avatarMediaPath;
    const personalData =
        !updatedData?.email ||
        !updatedData?.firstName ||
        !updatedData?.lastName;

    return (
        <ModalWrapper maxW={30} padding={1.5} w="100%">
            {authData && personalData ? (
                <>
                    <CircledIcon icon="user" medium success />
                    <Text g900 large mt={1.25} semibold>
                        {basicProfileData[0]?.text}
                    </Text>
                    <Box flex>
                        <form
                            onSubmit={handleSubmit(personalForm)}
                            style={{ width: '100%' }}
                        >
                            <Box mt={1.25}>
                                <PersonalForm
                                    control={control}
                                    errors={errors}
                                    isLoading={isSubmitting}
                                    profilePicture={profilePicture}
                                    setProfilePicture={setProfilePicture}
                                    submitCount={submitCount}
                                    user={auth?.user}
                                />
                            </Box>
                            <Box flex mt={2}>
                                <Box pr={0.375} w="50%">
                                    <Button
                                        disabled={isSubmitting}
                                        gray
                                        onClick={handleClose}
                                        w="100%"
                                    >
                                        <String id="goBack" />
                                    </Button>
                                </Box>
                                <Box pl={0.375} w="50%">
                                    <Button
                                        disabled={isSubmitting}
                                        isLoading={isSubmitting}
                                        type="submit"
                                        w="100%"
                                    >
                                        <String id="submit" />
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </>
            ) : (
                <>
                    <CircledIcon icon="checkCircle" medium success />
                    <Text g900 large mt={1.25} semibold>
                        {title}
                    </Text>
                    <RichText content={content} g500 mt={0.5} small />
                    <RichText
                        content={beneficiaryAble}
                        g500
                        mt={1.25}
                        variables={{ amount, interval, maxAmount, minutes }}
                    />
                    <Box flex mt={2}>
                        <Box pr={0.375} w="50%">
                            <Button
                                disabled={isSubmitting}
                                gray
                                onClick={handleClose}
                                w="100%"
                            >
                                <String id="cancel" />
                            </Button>
                        </Box>
                        <Box pl={0.375} w="50%">
                            <Button
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                onClick={() => {
                                    console.log(updatedData);
                                    onSubmit(
                                        updatedData,
                                        auth,
                                        profilePicture && profilePicture
                                    );
                                    handleClose();
                                }}
                                w="100%"
                            >
                                <String id="iConfirm" />
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </ModalWrapper>
    );
};

export default ConfirmAdd;
