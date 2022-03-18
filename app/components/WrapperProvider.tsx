import '@celo-tools/use-contractkit/lib/styles.css';
import {
    Alfajores,
    CeloMainnet,
    ContractKitProvider,
    Network,
    useContractKit,
    useProviderOrSigner,
} from '@celo-tools/use-contractkit';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { provider } from '../helpers';
import React, { useState } from 'react';
import config from '../../config';
import type { Signer } from '@ethersproject/abstract-signer';

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
    signer?: Signer | null;
}

type BaseContext = BaseState & {
    setState: Function;
}
// #endregion types

// #region UtilsWrapper
const UtilsWrapper = (props: WithChildrenProps & BaseState) => {
    const { address, signer, children } = props;

    if (!address || !signer) {
        return children;
    }

    return (
        <ImpactProvider address={address} jsonRpc={config.networkRpcUrl} signer={signer}>
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
    const signer = useProviderOrSigner() as Signer | undefined;
    const { address, connect, destroy: disconnect, initialised: isReady, network } = useContractKit();

    const forwardData = { address, connect, disconnect, isReady, network, signer };

    return (
        <UtilsWrapper address={address} signer={signer}>
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
