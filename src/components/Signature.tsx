import { Box, Button, Card, CircledIcon, Text, toast } from '@impact-market/ui';
import { handleSignature } from 'src/helpers/handleSignature';
import { useSignatures } from '@impact-market/utils/useSignatures';
import Message from 'src/libs/Prismic/components/Message';
import React from 'react';
import String from '../libs/Prismic/components/String';

const Signature = () => {
    const { signMessage } = useSignatures();

    const handleSignMessage = async () => {
        try {
            await handleSignature(signMessage);
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }
    };

    return (
        <Card maxW="fit-content" padding={1.5} margin="5rem auto">
            <Box column fLayout="start" flex>
                <CircledIcon warning icon="forbidden" large />
                <Text g900 large medium mt={1.25}>
                    <String id="signatureRequest" />
                </Text>
                <Message g500 small id="validateSignature" />
                <Box mt={1.25}>
                    <Button
                        isLoading={false}
                        onClick={() => {
                            handleSignMessage();
                        }}
                        w="100%"
                    >
                        <String id="signMessage" />
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default Signature;
