import {
    Box,
    Button,
    CircledIcon,
    ModalWrapper,
    Text,
    toast,
    useModal
} from '@impact-market/ui';
import { handleSignature } from 'src/helpers/handleSignature';
import { useRouter } from 'next/router';
import { useSignatures } from '@impact-market/utils/useSignatures';
import Message from 'src/libs/Prismic/components/Message';
import React, { useState } from 'react';
import String from '../libs/Prismic/components/String';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';
import useWallet from 'src/hooks/useWallet';

const Signature = () => {
    const { t } = useTranslations();
    const { signMessage, signTypedData } = useSignatures();
    const { disconnect } = useWallet();
    const { handleClose } = useModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignMessage = async () => {
        try {
            setIsLoading(true);

            await handleSignature(signMessage, signTypedData);

            setIsLoading(false);
            toast.success(t('loggedIn'));
            handleClose();
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'global_signature');
            toast.error(<Message id="errorOccurred" />);
        }
        setIsLoading(false);
    };

    const handleDisconnectClick = async () => {
        await disconnect();
        handleClose();

        return router.push('/');
    };

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <Box column fLayout="start" flex>
                <CircledIcon warning icon="forbidden" large />
                <Text g900 large medium mt={1.25}>
                    <String id="signatureRequest" />
                </Text>
                <Message g500 small id="validateSignature" />
                <Box mt={1.25} flex style={{ gap: '1rem' }}>
                    <Button
                        isLoading={isLoading}
                        onClick={() => {
                            handleSignMessage();
                        }}
                    >
                        <String id="signMessage" />
                    </Button>
                    <Button
                        secondary
                        isLoading={false}
                        onClick={() => {
                            handleDisconnectClick();
                        }}
                    >
                        {t('logout')}
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default Signature;
