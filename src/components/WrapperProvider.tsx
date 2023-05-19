import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { WagmiConfig, useAccount, useNetwork, useWalletClient } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { celo, celoAlfajores } from '@wagmi/chains';
import { ethereumClient, projectId, wagmiConfig } from 'src/hooks/useWallet';
import React, { useEffect, useState } from 'react';
import config from '../../config';

type WithChildrenProps = {
    children?: any;
};

const KitWrapper = (props: WithChildrenProps) => {
    const { children } = props;
    const { address } = useAccount();
    const { data: signer } = useWalletClient();
    const { chain: network } = useNetwork();

    return (
        <ImpactProvider
            address={address ?? null}
            jsonRpc={
                config.networkRpcUrl || network?.rpcUrls.public.http[0] || ''
            }
            networkId={network?.id || config.chainId || 44787}
            signer={signer ?? null}
        >
            {children}
        </ImpactProvider>
    );
};

const WrapperProvider = (props: WithChildrenProps) => {
    const { children } = props;
    const [network, setNetwork] = useState<any | undefined>();

    const networks = [
        { ...celo, rpcUrl: config.networkRpcUrl },
        { ...celoAlfajores, rpcUrl: config.networkRpcUrl }
    ];

    useEffect(() => {
        setNetwork(networks.find((n) => n.id === config.chainId));
    }, []);

    if (!network) {
        return null;
    }

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <KitWrapper>{children}</KitWrapper>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    );
};

export default WrapperProvider;
