/* eslint-disable max-depth */
import { Box, Button, Card, Col, Display, DropdownMenu, Row, Text, ViewContainer, toast } from '@impact-market/ui';
import { SubmitHandler } from "react-hook-form";
import { formatAddress } from '../../utils/formatAddress';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
// import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import AditionalForm from './components/AditionalForm';
import ContactForm from './components/ContactForm';
import DeleteForm from './components/DeleteForm';
import ImageForm from './components/ImageForm';
import PersonalForm from './components/PersonalForm';
import React from 'react';
import useWallet from '../../hooks/useWallet';

const Profile: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    // TODO: carregar info do prismic
    // const { view } = usePrismicData({ list: true });

    const auth = useSelector(selectCurrentUser);
    const [updateUser] = useUpdateUserMutation();
    const { disconnect } = useWallet();
    const dispatch = useDispatch();
    const [getPreSigned] = useGetPreSignedMutation();

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

    // TODO: terminar delete da conta
    const onDelete = () => {
        console.log("delete account");
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
                    <Display g900>
                        { /* TODO: verificar se é para colocar um nome por default */ }
                        {auth?.user?.username || 'John Doe'}
                    </Display>
                    { /* TODO: colocar textos no prismic */ }
                    { /* TODO: colocar ícone certo no 1º item */ }
                    <DropdownMenu
                        items={[
                            {
                                icon: 'logout',
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
                        Disconnect Wallet
                    </Button>
                </Col>
            </Row>
            <Box mt={4}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>Your photo</Text>
                        <Text g500 regular small>This will be displayed on your profile.</Text>
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card>
                            <ImageForm onSubmit={onImageSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>Personal Information</Text>
                        <Text g500 regular small>Update your photo and personal details.</Text>
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card>
                            <PersonalForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>Contact information</Text>
                        <Text g500 regular small>Update your email.</Text>
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card>
                            <ContactForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>Aditional information</Text>
                        <Text g500 regular small>Help us know your reality better.</Text>
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card>
                            <AditionalForm onSubmit={onSubmit} />
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }}>
                        <Text g700 medium small>Delete Account</Text>
                        <Text g500 regular small>Proceed to erase all your information.</Text>
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pt={{ sm: 1, xs: 0.25 }}>
                        <Card>
                            <DeleteForm onSubmit={onDelete} />
                        </Card>
                    </Col>
                </Row>
            </Box>
        </ViewContainer>
    );
};

export default Profile;