import '@celo-tools/use-contractkit/lib/styles.css';
import {
    Alfajores,
    CeloMainnet,
    ContractKitProvider,
    useContractKit,
    useProviderOrSigner
} from '@celo-tools/use-contractkit';
import { Signer } from '@ethersproject/abstract-signer';
import { SignerContext } from '../../utils/useSigner';
import { User, useCreateUserMutation } from '../../api/user';
import { provider } from '../../../app/helpers';
import { setCredentials } from '../../state/slices/auth';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from '../../utils/useStorage';
import React, { useContext, useEffect, useState } from 'react';

function Wallet() {
    const signer = useProviderOrSigner();
    const dispatch = useDispatch();
    const { setSigner, setAddress } = useContext(SignerContext);
    const {
        connect: connectToWallet,
        network: walletNetwork,
        destroy,
        address,
        initialised
    } = useContractKit();
    const [providerNetworkChainId, setProviderNetworkChainId] = useState<
        number | undefined
    >();
    const [, setLocalUser, removeLocalUser] = useLocalStorage<User | undefined>(
        'user',
        undefined
    );
    const [createUser, createUserResult] = useCreateUserMutation();

    useEffect(() => {
        const setChainId = async () => {
            // do not request the network, if information exists
            let chainId = provider.network?.chainId;

            if (!chainId) {
                const providerNetwork = await provider?.getNetwork();

                chainId = providerNetwork?.chainId;
            }

            if (providerNetworkChainId !== chainId) {
                setProviderNetworkChainId(chainId);
            }
        };

        if (!providerNetworkChainId) {
            setChainId();
        }
    }, [providerNetworkChainId]);

    useEffect(() => {
        if (signer instanceof Signer) {
            setSigner(signer);
        }
        setAddress(address);
    }, [signer, address]);

    const connect = async () => {
        try {
            const connector = await connectToWallet();

            const payload = await createUser({
                address: connector.account,
                phone: '0'
            }).unwrap();

            setLocalUser((payload as any).user);
            dispatch(setCredentials({ token: payload.token, user: { id: 5 } }));

            console.log('fulfilled', payload);
        } catch (error) {
            console.error('rejected', error);
        }
    };

    const disconnect = async () => {
        await destroy();
        removeLocalUser();
    };

    if (!initialised || !providerNetworkChainId) {
        return <div>Loading...</div>;
    }

    const isSameNetwork = walletNetwork?.chainId === providerNetworkChainId;

    if (walletNetwork?.chainId && !isSameNetwork) {
        return <div>The app and your wallet are in different networks!</div>;
    }

    return (
        <>
            {address ? (
                <>
                    <div>Connected to {address}</div>
                    <button onClick={disconnect}>Disconnect</button>
                </>
            ) : (
                <>
                    {createUserResult.isLoading ? 'Loading...' : null}
                    <button onClick={connect}>Connect wallet</button>
                </>
            )}
        </>
    );
}

function WrappedWallet() {
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
            <Wallet />
        </ContractKitProvider>
    );
}

export default WrappedWallet;
