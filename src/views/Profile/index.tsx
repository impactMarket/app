/* eslint-disable max-depth */
import * as Sentry from '@sentry/browser';
import {
    Box,
    Button,
    Card,
    Col,
    Display,
    Divider,
    DropdownMenu,
    Row,
    Text,
    ViewContainer,
    toast
} from '@impact-market/ui';
import { SubmitHandler } from 'react-hook-form';
import { formatAddress } from '../../utils/formatAddress';
import { getUserName } from '../../utils/users';
import { handleSignature } from '../../helpers/handleSignature';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import {
    useDeleteUserMutation,
    useGetPreSignedMutation,
    useUpdateUserMutation
} from '../../api/user';
import { useDispatch, useSelector } from 'react-redux';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSignatures } from '@impact-market/utils/useSignatures';
import AditionalForm from './AditionalForm';
import ContactForm from './ContactForm';
import DeleteForm from './DeleteForm';
import ImageForm from './ImageForm';
import Message from '../../libs/Prismic/components/Message';
import PersonalForm from './PersonalForm';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import _ from 'lodash';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const Profile: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [imageLoading, toggleImageLoading] = useState(false);

    const { extractFromView } = usePrismicData();
    const {
        additionalInfoDescription,
        additionalInfoTitle,
        contactDescription,
        contactTitle,
        deleteAccountAlert,
        deleteAccountDescription,
        deleteAccountTitle,
        personalDescription,
        personalTitle,
        photoDescription,
        photoTitle
    } = extractFromView('formSections') as any;

    const auth = useSelector(selectCurrentUser);
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [getPreSigned] = useGetPreSignedMutation();
    const { disconnect } = useWallet();
    const dispatch = useDispatch();
    const router = useRouter();
    const { t } = useTranslations();
    const { signature, eip712_signature } = useSelector(selectCurrentUser);
    const { signMessage, signTypedData } = useSignatures();

    const handleDisconnectClick = async () => {
        await disconnect();

        return router.push('/');
    };

    const update = async (data: any) => {
        try {
            // Replace empty strings with undefined to prevent errors in API
            const payload = _.mapValues(data, (v) => (v === '' ? null : v));

            const result = await updateUser(payload).unwrap();

            if (result) {
                dispatch(setUser({ user: { ...result } }));

                toast.success(<Message id="successfullyChangedData" />);
            } else {
                toast.error(<Message id="errorOccurred" />);
            }
        } catch (e: any) {
            if (e?.data?.error?.name === 'EXPIRED_SIGNATURE') {
                const { success } = await handleSignature(
                    signMessage,
                    signTypedData
                );

                if (success) update(data);
            } else {
                console.log(e);
                Sentry.captureException(e);
                toast.error(<Message id="errorOccurred" />);
            }
        }
    };

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            if (!signature || !eip712_signature) {
                await handleSignature(signMessage, signTypedData);
            }

            update(data);
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }
    };

    const onImageSubmit: SubmitHandler<any> = async (data) => {
        try {
            if (data?.length > 0) {
                toggleImageLoading(true);

                let success = false;
                const type = data[0].type?.split('/')[1] || '';

                if (!signature || !eip712_signature) {
                    await handleSignature(signMessage, signTypedData);
                }

                if (type) {
                    const preSigned = await getPreSigned(type).unwrap();

                    if (preSigned?.uploadURL) {
                        const result = await fetch(preSigned.uploadURL, {
                            body: data[0],
                            method: 'PUT'
                        });

                        if (result?.status === 200) {
                            const payload = await updateUser({
                                avatarMediaPath: preSigned.filePath
                            }).unwrap();

                            if (payload) {
                                dispatch(setUser({ user: { ...payload } }));

                                toast.success(
                                    <Message id="successfullyChangedData" />
                                );
                                success = true;
                            }
                        }
                    }
                }

                if (!success) {
                    toast.error(<Message id="errorOccurred" />);
                }

                toggleImageLoading(false);
            }
        } catch (e) {
            console.log(e);
            Sentry.captureException(e);

            toast.error(<Message id="errorOccurred" />);

            toggleImageLoading(false);
        }
    };

    // TODO: check if Delete stays as it is
    const onDelete = async () => {
        try {
            await deleteUser();
            await disconnect();

            toast.success(deleteAccountAlert);

            return router.push('/');
        } catch (e) {
            console.log(e);
            Sentry.captureException(e);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    const copyToClipboard = () => {
        navigator?.clipboard.writeText(auth?.user?.address);

        toast.success(<Message id="copiedAddress" />);
    };

    const renderCard = (
        title: string,
        description: string,
        children: any,
        firstCard: boolean = false
    ) => {
        return (
            <Row>
                <Col
                    colSize={{ sm: 4, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                >
                    {!firstCard && (
                        <Divider
                            margin="1.25 0"
                            show={{ sm: 'none', xs: 'block' }}
                        />
                    )}
                    <Text g700 medium small>
                        {title}
                    </Text>
                    <RichText content={description} g500 regular small />
                </Col>
                <Col
                    colSize={{ sm: 8, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                >
                    <Card pb={1.5} pl={0} pr={0} pt={1.5}>
                        {children}
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <Box pb={5}>
                <Row>
                    <Col colSize={{ sm: 6, xs: 12 }}>
                        {(auth?.user?.firstName || auth?.user?.lastName) && (
                            <Display g900 medium>
                                {getUserName(auth?.user)}
                            </Display>
                        )}
                        <DropdownMenu
                            {...({} as any)}
                            icon="chevronDown"
                            items={[
                                {
                                    icon: 'open',
                                    onClick: () =>
                                        window.open(
                                            config.explorerUrl?.replace(
                                                '#USER#',
                                                auth?.user?.address
                                            )
                                        ),
                                    title: t('openInExplorer')
                                },
                                {
                                    icon: 'copy',
                                    onClick: () => copyToClipboard(),
                                    title: t('copyAddress')
                                }
                            ]}
                            title={formatAddress(auth?.user?.address, [6, 4])}
                            wrapperProps={{
                                mt: 0.25
                            }}
                        />
                    </Col>
                    <Col
                        colSize={{ sm: 6, xs: 12 }}
                        pt={{ sm: 1, xs: 0 }}
                        tAlign={{ sm: 'right', xs: 'left' }}
                    >
                        <Button
                            default
                            icon="logout"
                            onClick={handleDisconnectClick}
                        >
                            <String id="disconnectWallet" />
                        </Button>
                    </Col>
                </Row>
                <Box mt={{ sm: 4, xs: 2 }}>
                    {renderCard(
                        photoTitle,
                        photoDescription,
                        <ImageForm
                            isLoading={imageLoading}
                            onSubmit={onImageSubmit}
                        />,
                        true
                    )}
                </Box>
                <Box>
                    {renderCard(
                        personalTitle,
                        personalDescription,
                        <PersonalForm onSubmit={onSubmit} />
                    )}
                </Box>
                <Box>
                    {renderCard(
                        contactTitle,
                        contactDescription,
                        <ContactForm onSubmit={onSubmit} />
                    )}
                </Box>
                <Box>
                    {renderCard(
                        additionalInfoTitle,
                        additionalInfoDescription,
                        <AditionalForm onSubmit={onSubmit} />
                    )}
                </Box>
                <Box>
                    {renderCard(
                        deleteAccountTitle,
                        deleteAccountDescription,
                        <DeleteForm onSubmit={onDelete} />
                    )}
                </Box>
            </Box>
        </ViewContainer>
    );
};

export default Profile;
