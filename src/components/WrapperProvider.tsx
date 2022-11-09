import '@celo/react-celo/lib/styles.css';
import { Alfajores, CeloProvider, Mainnet, Network, SupportedProviders, useCelo } from '@celo/react-celo';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import config from '../../config';

// #region types
type WithChildrenProps = {
  children?: any;
};

type BaseState = {
    address?: string | null;
    connect?: Function;
    disconnect?: Function;
    isReady?: boolean;
    network?: Network;
    web3?: Web3 | null;
}

type BaseContext = BaseState & {
    setState: Function;
}
// #endregion types

// #region AppProvider
export const AppContext = React.createContext<BaseContext>({ setState: () => {} });

const AppProvider = (props: WithChildrenProps & BaseState) => {
    const { children, ...forwardState } = props;

    const [state, setState] = useState<BaseState>(forwardState);

    useEffect(() => {
        setState(state => ({ ...state, ...forwardState }))
    }, [forwardState?.address, forwardState?.network])

    return (
        <AppContext.Provider value={{ ...state, setState }}>
            {children}
        </AppContext.Provider>
    )
}
// #endregion InnerProvider

// #region KitWrapper
const KitWrapper = (props: WithChildrenProps) => {
    const { children } = props;
    const { address, connect, destroy: disconnect, initialised: isReady, network, kit } = useCelo();
    const forwardData = { address, connect, disconnect, isReady, network };

    return (
        <ImpactProvider address={address} connection={kit.connection} jsonRpc={config.networkRpcUrl}>
            <AppProvider {...forwardData}>
                {children}
            </AppProvider>
        </ImpactProvider>
    )
}
// #endregion WrapperProvider

const WrapperProvider = (props: WithChildrenProps) => {
    const { children } = props;
    const [network, setNetwork] = useState<Network | undefined>();

    const networks = [
        { ...Mainnet, rpcUrl: config.networkRpcUrl },
        { ...Alfajores, rpcUrl: config.networkRpcUrl }
    ];

    useEffect(() => {
        setNetwork(networks.find((n) => n.chainId === config.chainId));
    }, []);

    if (!network) {
        return null;
    }

    return (
        <CeloProvider
            connectModal={{
                providersOptions: {
                    additionalWCWallets: [
                        // see https://github.com/WalletConnect/walletconnect-registry/#schema for a schema example
                        {
                            app: {
                                android: 'https://play.google.com/store/apps/details?id=com.impactmarket.mobile',
                                browser: '',
                                ios: 'https://apps.apple.com/app/impactmarket/id1530870911',
                                linux: '',
                                mac: '',
                                windows: '',
                            },
                            chains: ['eip:42220'],
                            description: 'Your future unlocked.',
                            desktop: {
                                native: 'libera://',
                                universal: 'libera://',
                            },
                            homepage: 'https://impactmarket.com/',
                            id: 'libera-wallet',
                            logos: {
                                lg: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                                md: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                                sm: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5IjoiTGliZXJhTG9nby5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSJ9fSwib3V0cHV0Rm9ybWF0IjoianBnIn0=',
                            },
                            metadata: {
                                colors: {
                                    primary: '#fff',
                                    secondary: '#2E6AFF',
                                },
                                shortName: 'Libera',
                            },
                            mobile: {
                                native: 'libera://',
                                universal: 'libera://'
                            },
                            name: 'Libera',
                            responsive: {
                                browserFriendly: false,
                                browserOnly: false,
                                mobileFriendly: true,
                                mobileOnly: true,
                            },
                            // IMPORTANT
                            // This is the version of WC. We only support version 1 at the moment.
                            versions: ['1'],
                        },
                        {
                            app: {
                                android: 'https://play.google.com/store/apps/details?id=com.bitkeep.wallet',
                                browser: 'https://chrome.google.com/webstore/detail/bitkeep-bitcoin-crypto-wa/jiidiaalihmmhddjgbnbgdfflelocpak',
                                ios: 'https://apps.apple.com/app/bitkeep/id1395301115',
                                linux: 'https://bitkeep.com/download?type=2',
                                mac: 'https://bitkeep.com/download?type=2',
                                windows: 'https://bitkeep.com/download?type=2',
                            },
                            chains: ['eip:42220'],
                            description: 'BitKeep is a decentralized multi-chain digital wallet.',
                            desktop: {
                                native: 'bitkeep://',
                                universal: 'bitkeep://',
                            },
                            homepage: 'https://bitkeep.com/',
                            id: 'bitkeep-wallet',
                            logos: {
                                lg: 'https://github.com/bitkeepwallet/download/blob/main/logo-png/BitKeep_logo_circle.png?raw=true',
                                md: 'https://github.com/bitkeepwallet/download/blob/main/logo-png/BitKeep_logo_circle.png?raw=true',
                                sm: 'https://github.com/bitkeepwallet/download/blob/main/logo-png/BitKeep_logo_circle.png?raw=true',
                            },
                            metadata: {
                                colors: {
                                    primary: '#fff',
                                    secondary: '#7524F9',
                                },
                                shortName: 'BitKeep',
                            },
                            mobile: {
                                native: 'bitkeep://',
                                universal: 'bitkeep://'
                            },
                            name: 'BitKeep Wallet',
                            responsive: {
                                browserFriendly: true,
                                browserOnly: false,
                                mobileFriendly: true,
                                mobileOnly: false,
                            },
                            // IMPORTANT
                            // This is the version of WC. We only support version 1 at the moment.
                            versions: ['1'],
                        }
                    ],
                    // This option hides specific wallets from the default list
                    hideFromDefaults: [
                        SupportedProviders.PrivateKey,
                        SupportedProviders.CeloTerminal,
                        SupportedProviders.CeloWallet,
                        SupportedProviders.CeloDance,
                        SupportedProviders.Injected,
                        SupportedProviders.Ledger,
                        SupportedProviders.Steakwallet,
                    ],
                },
            }}
            dapp={{
                description: 'Human Empowerment Protocol',
                icon: 'https://app.impactmarket.com/img/app-icon.png',
                name: 'impactMarket',
                url: 'https://app.impactmarket.com',
            }}
            network={network}
            networks={networks}
        >
            <KitWrapper>
                {children}
            </KitWrapper>
        </CeloProvider>
    )
};

export default WrapperProvider;
