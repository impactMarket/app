import '@celo-tools/use-contractkit/lib/styles.css';
import {
    Alfajores,
    CeloMainnet,
    ContractKitProvider,
    Network,
    useContractKit,
} from '@celo-tools/use-contractkit';
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
    }, [forwardState?.address])

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
    const { address, connect, destroy: disconnect, initialised: isReady, network, kit } = useContractKit();

    const forwardData = { address, connect, disconnect, isReady, network };

    return (
        <UtilsWrapper address={address} web3={kit.web3}>
            <AppProvider {...forwardData}>
                {children}
            </AppProvider>
        </UtilsWrapper>
    )
}
// #endregion WrapperProvider

const WrapperProvider = (props: WithChildrenProps) => {
    const { children } = props;

    const currentNetwork =
        provider.connection.url.indexOf('alfajores') !== -1
            ? Alfajores
            : CeloMainnet;

    return (
        <ContractKitProvider
            dapp={{
                description: 'Decentralized Poverty Alleviation Protocol',
                icon:
                    'https://dzrx8kf1cwjv9.cloudfront.net/impactmarket/PACT_Token_Ticker_Blue@2x.png',
                name: 'impactMarket',
                url: 'https://impactmarket.com'
            }}
            network={currentNetwork}
            networks={[CeloMainnet, Alfajores]}
        >
            <KitWrapper>
                {children}
            </KitWrapper>
        </ContractKitProvider>
    )
};

export default WrapperProvider;
