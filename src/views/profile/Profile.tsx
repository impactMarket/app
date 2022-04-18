/* eslint-disable max-depth */
import { Box, Button, Card, Col, Display, DropdownMenu, Row, Text, ViewContainer, toast } from '@impact-market/ui';
import { SubmitHandler } from "react-hook-form";
import { formatAddress } from '../../utils/formatAddress';
import { getUserName } from '../../utils/users';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { useDeleteUserMutation, useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
import { useDispatch, useSelector } from 'react-redux';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import AditionalForm from './components/AditionalForm';
import ContactForm from './components/ContactForm';
import DeleteForm from './components/DeleteForm';
import ImageForm from './components/ImageForm';
import PersonalForm from './components/PersonalForm';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useWallet from '../../hooks/useWallet';

const Profile: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData({ list: true });
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

    const handleDisconnectClick = async () => {
        await disconnect();
    }

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const payload = await updateUser({
                ...data,
                gender: data?.gender || 'u'
            }).unwrap();

            dispatch(setUser({ user: { ...payload }}));

            // TODO: colocar textos no prismic
            toast.success("Successfully changed data!");
        }
        catch(e) {
            console.log(e);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    };

    const onImageSubmit: SubmitHandler<any> = async (data) => {
        try {
            if(data?.img?.length > 0) {
                const type = data.img[0].type?.split('/')[1] || '';

                if(type) {
                    const preSigned = await getPreSigned(type).unwrap();

                    if(preSigned?.uploadURL) {
                        const result = await fetch(preSigned.uploadURL, {
                            body: data.img[0],
                            method: 'PUT'
                        });

                        if(result?.status === 200) {
                            const payload = await updateUser({
                                avatarMediaPath: preSigned.filePath
                            }).unwrap();

                            dispatch(setUser({ user: { ...payload }}));

                            // TODO: colocar textos no prismic
                            toast.success("Successfully changed data!");
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
 
    return (
        <ViewContainer isLoading={isLoading}>
            <Row>
                <Col colSize={{ sm: 6, xs: 12 }}>
                    <Display g900 medium>
                        { /* TODO: verificar se é para colocar um nome por default */ }
                        {getUserName(auth?.user) || 'John Doe'}
                    </Display>
                    { /* TODO: colocar textos no prismic */ }
                    { /* TODO: verificar como é para ficar o link */ }
                    <DropdownMenu
                        items={[
                            {
                                icon: 'open',
                                onClick: () => window.open(`https://alfajores-blockscout.celo-testnet.org/address/${auth?.user?.address}/transactions`),
                                title: 'Open in Explorer'
                            },
                            {
                                icon: 'copy',
                                onClick: () => copyToClipboard(),
                                title: 'Copy Address'
                            }
                        ]}
                        mt={0.25}
                        title={formatAddress(auth?.user?.address, [6, 4])}
                    />
                </Col>
                <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0 }} tAlign={{ sm: 'right', xs: 'left' }}>
                    <Button default icon="logout" onClick={handleDisconnectClick}>
                        <String id="disconnectWallet" />
                    </Button>
                </Col>
            </Row>
            <Box mt={4}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>{photoTitle}</Text>
                        <RichText content={photoDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card pl={0} pr={0}>
                            <ImageForm onSubmit={onImageSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>{personalTitle}</Text>
                        <RichText content={personalDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card pl={0} pr={0}>
                            <PersonalForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>{contactTitle}</Text>
                        <RichText content={contactDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card pl={0} pr={0}>
                            <ContactForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>{additionalInfoTitle}</Text>
                        <RichText content={additionalInfoDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card pl={0} pr={0}>
                            <AditionalForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>{deleteAccountTitle}</Text>
                        <RichText content={deleteAccountDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card pl={0} pr={0}>
                            <DeleteForm onSubmit={onDelete} />
                        </Card>
                    </Col>
                </Row>
            </Box>
        </ViewContainer>
    );
};

export default Profile;