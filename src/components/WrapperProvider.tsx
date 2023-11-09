import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { celo, celoAlfajores } from 'viem/chains';
import { chains, projectId, wagmiConfig } from '../hooks/useWallet';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import React, { useEffect, useState } from 'react';
import config from '../../config';

createWeb3Modal({
    chains,
    defaultChain: config.chainId === 42220 ? celo : celoAlfajores,
    featuredWalletIds: [
        // libera
        'b7cd38c9393f14b8031bc10bc0613895d0d092c33d836547faf8a9b782f6cbcc',
        // valora
        'd01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974'
    ],
    projectId,
    themeMode: 'light',
    wagmiConfig
});

const KitWrapper = (props: { children?: any }) => {
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

const WrapperProvider = (props: { children?: any }) => {
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

    return <KitWrapper>{children}</KitWrapper>;
};

export default WrapperProvider;
