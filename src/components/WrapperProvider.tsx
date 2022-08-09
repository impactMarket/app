import '@celo/react-celo/lib/styles.css';
import { Alfajores, CeloProvider, Mainnet, Network, useCelo } from '@celo/react-celo';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { provider } from '../helpers';
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
    const [network, setNetwork] = useState() as any;

    const networks = [Mainnet, Alfajores];

    useEffect(() => {
        const lastUsedNetworkName = window.localStorage.getItem('react-celo/last-used-network');
        const defaultNetwork = networks.find(({ rpcUrl }: any) => rpcUrl === provider.connection.url);
        const network = networks.find(({ name }: any) => name === lastUsedNetworkName) || defaultNetwork;

        setNetwork(network);
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
                        },
                        {
                            app: {
                                android: '',
                                browser: '',
                                ios: '',
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
                                lg: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5Ijoid2FsbGV0LWxvZ28ucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifX0sIm91dHB1dEZvcm1hdCI6ImpwZyJ9',
                                md: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5Ijoid2FsbGV0LWxvZ28ucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifX0sIm91dHB1dEZvcm1hdCI6ImpwZyJ9',
                                sm: 'https://dxdwf61ltxjyn.cloudfront.net/eyJidWNrZXQiOiJpbXBhY3RtYXJrZXQtYXBwIiwia2V5Ijoid2FsbGV0LWxvZ28ucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifX0sIm91dHB1dEZvcm1hdCI6ImpwZyJ9',
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
                    ],
                },
            }}
            dapp={{
                description: 'Decentralized Poverty Alleviation Protocol',
                icon: 'https://app.impactmarket.com/icon.png',
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
