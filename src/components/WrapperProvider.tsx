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
            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                explorerRecommendedWalletIds={[
                    // libera
                    'b7cd38c9393f14b8031bc10bc0613895d0d092c33d836547faf8a9b782f6cbcc',
                    // valora
                    'd01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974',
                    // metamask
                    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
                ]}
            />
        </>
    );
};

export default WrapperProvider;
