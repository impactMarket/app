/* eslint-disable max-depth */
import { Box, Button, Card, Col, Display, Divider, DropdownMenu, Row, Text, ViewContainer, toast } from '@impact-market/ui';
import { SubmitHandler } from "react-hook-form";
import { formatAddress } from '../../utils/formatAddress';
import { getUserName } from '../../utils/users';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { useDeleteUserMutation, useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
import { useDispatch, useSelector } from 'react-redux';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import AditionalForm from './AditionalForm';
import ContactForm from './ContactForm';
import DeleteForm from './DeleteForm';
import ImageForm from './ImageForm';
import PersonalForm from './PersonalForm';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const Profile: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData();
    const { 
        additionalInfoDescription, 
        additionalInfoTitle, 
        contactDescription, 
        contactTitle,
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

    const handleDisconnectClick = async () => {
        await disconnect();

        return router.push('/');
    }

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const result = await updateUser(data).unwrap();

            if(result) {
                dispatch(setUser({ user: { ...result }}));

                // TODO: colocar textos no prismic
                toast.success("Successfully changed data!");
            }
        }
        catch(e) {
            console.log(e);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    };

    const onImageSubmit: SubmitHandler<any> = async (data) => {
        try {
            if(data?.length > 0) {
                const type = data[0].type?.split('/')[1] || '';

                if(type) {
                    const preSigned = await getPreSigned(type).unwrap();

                    if(preSigned?.uploadURL) {
                        const result = await fetch(preSigned.uploadURL, {
                            body: data[0],
                            method: 'PUT'
                        });

                        if(result?.status === 200) {
                            const payload = await updateUser({
                                avatarMediaPath: preSigned.filePath
                            }).unwrap();

                            if(payload) {
                                dispatch(setUser({ user: { ...payload }}));

                                // TODO: colocar textos no prismic
                                toast.success("Successfully changed data!");
                            }
                        }
                    }
                }
            }
        }
        catch(e) {
            console.log(e);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    }

    // TODO: verificar se fica como está o delete
    const onDelete = async () => {
        try {
            await deleteUser();
            await disconnect();

            // TODO: colocar textos no prismic
            toast.success("Your account was deleted successfully!");

            return router.push('/');
        }
        catch(e) {
            console.log(e);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(auth?.user?.address);

        // TODO: colocar textos no prismic
        toast.success("Copied! You can paste the address whenever you want.");
    }

    const renderCard = (title: string, description: string, children: any, firstCard: boolean = false) => {
        return (
            <Row>
                <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                    { !firstCard && <Divider margin="1.25 0" show={{ sm: 'none', xs: 'block' }} /> }
                    <Text g700 medium small>{title}</Text>
                    <RichText content={description} g500 regular small />
                </Col>
                <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                    <Card pb={1.5} pl={0} pr={0} pt={1.5}>
                        {children}
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <ViewContainer isLoading={isLoading}>
            <Row>
                <Col colSize={{ sm: 6, xs: 12 }}>
                    <Display g900 medium>
                        {getUserName(auth?.user)}
                    </Display>
                    { /* TODO: verificar como é para ficar o link */ }
                    <DropdownMenu
                        icon="chevronDown"
                        items={[
                            {
                                icon: 'open',
                                onClick: () => window.open(`https://alfajores-blockscout.celo-testnet.org/address/${auth?.user?.address}/transactions`),
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
                <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0 }} tAlign={{ sm: 'right', xs: 'left' }}>
                    <Button default icon="logout" onClick={handleDisconnectClick}>
                        <String id="disconnectWallet" />
                    </Button>
                </Col>
            </Row>
            <Box mt={{ sm: 4, xs: 2 }}>
                {renderCard(photoTitle, photoDescription, <ImageForm onSubmit={onImageSubmit} />, true)}
            </Box>
            <Box>
                {renderCard(personalTitle, personalDescription, <PersonalForm onSubmit={onSubmit} />)}
            </Box>
            <Box>
                {renderCard(contactTitle, contactDescription, <ContactForm onSubmit={onSubmit} />)}
            </Box>
            <Box>
                {renderCard(additionalInfoTitle, additionalInfoDescription, <AditionalForm onSubmit={onSubmit} />)}
            </Box>
            <Box>
                {renderCard(deleteAccountTitle, deleteAccountDescription, <DeleteForm onSubmit={onDelete} />)}
            </Box>
        </ViewContainer>
    );
};

export default Profile;
