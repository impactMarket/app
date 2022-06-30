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

// #region UtilsWrapper
const UtilsWrapper = (props: WithChildrenProps & BaseState) => {
    const { address, web3, children } = props;

    if (!web3) {
        return children;
    }

    return (
        <ImpactProvider address={address} jsonRpc={config.networkRpcUrl} web3={web3}>
            {children}
        </ImpactProvider>
    )
}
// #endregion UtilsWrapper

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
        <UtilsWrapper address={address} web3={kit.connection.web3}>
            <AppProvider {...forwardData}>
                {children}
            </AppProvider>
        </UtilsWrapper>
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
            dapp={{
                description: 'Decentralized Poverty Alleviation Protocol',
                icon: 'https://dzrx8kf1cwjv9.cloudfront.net/impactmarket/PACT_Token_Ticker_Blue@2x.png',
                name: 'impactMarket',
                url: 'https://impactmarket.com'
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
