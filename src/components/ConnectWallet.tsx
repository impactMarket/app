import {
    Box,
    Button,
    Card,
    CircledIcon,
    Display,
    ViewContainer
} from '@impact-market/ui';
import Message from 'src/libs/Prismic/components/Message';
import React, { useState } from 'react';
import String from '../libs/Prismic/components/String';
import styled from 'styled-components';
import useWallet from 'src/hooks/useWallet';

const CardStyled = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
`;

const ConnectWallet = ({ title }: { title?: string }) => {
    const { connect } = useWallet();

    const ConnectButton = (props: any) => {
        const [isConnecting, setIsConnecting] = useState(false);

        const handleConnectClick = async () => {
            setIsConnecting(true);

            await connect();

            setIsConnecting(false);
        };

        return (
            <Button
                {...props}
                icon="coins"
                isLoading={isConnecting}
                onClick={handleConnectClick}
                secondary
            >
                <String id="connectWallet" />
            </Button>
        );
    };

    return (
        <ViewContainer {...({} as any)}>
            {title && (
                <Display g900 medium mb={2}>
                    {title}
                </Display>
            )}
            <CardStyled>
                <CircledIcon icon="alertCircle" warning medium />
                <Box>
                    <Message id="connectWalletAccess" g900 large medium />
                </Box>
                <Box margin="0 auto">
                    <ConnectButton />
                </Box>
            </CardStyled>
        </ViewContainer>
    );
};

export default ConnectWallet;
