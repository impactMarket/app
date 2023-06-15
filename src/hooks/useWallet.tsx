import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { celo, celoAlfajores } from '@wagmi/chains';
import {
    configureChains,
    createConfig,
    useAccount,
    useDisconnect,
    useNetwork
} from 'wagmi';
import { deleteCookie, hasCookie, setCookie } from 'cookies-next';
import { getAddress } from '@ethersproject/address';
import { getUserTypes } from '../utils/users';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { setCredentials } from '../state/slices/auth';
import { useCreateUserMutation } from '../api/user';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import config from '../../config';
import useCache from './useCache';

const network = config.useTestNet ? celoAlfajores : celo;

export const projectId = config.walletConnectProjectId;

const { chains, publicClient } = configureChains(
    [config.chainId === 42220 ? celo : celoAlfajores],
    [
        jsonRpcProvider({
            rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] })
        })
    ]
);

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ chains, projectId, version: 2 }),
    publicClient
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

const useWallet = () => {
    const {
        address,
        connect: connectFromHook,
        disconnect: disconnectFromHook,
        isReady,
        network: walletNetwork
    } = React.useContext(AppContext);

    const dispatch = useDispatch();
    const { cacheClear } = useCache();
    const { chain: walletNetwork } = useNetwork();

    const wrongNetwork = walletNetwork && network?.id !== walletNetwork?.id;

    const [createUser, userConnection] = useCreateUserMutation();

    const connect = async (callback?: Function) => {
        if (localStorage.getItem('walletconnect')) {
            localStorage.removeItem('walletconnect');
        };
        
        try {
            const connector = await connectFromHook();

            const payload = await createUser({
                address: getAddress(connector.kit.connection.config.from)
            }).unwrap();

            dispatch(
                setCredentials({
                    token: payload.token,
                    type: getUserTypes(payload),
                    user: { ...payload }
                })
            );

            // Create cookie to save Auth Token
            const expiryDate = new Date();

            expiryDate.setTime(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            setCookies('AUTH_TOKEN', payload.token, {
                expires: expiryDate,
                path: '/'
            });
            removeCookies('LOCALE', { path: '/' });

            if (!!callback) {
                await callback();
            }

            return true;
        } catch (error: any) {
            console.log('Error connecting to wallet!', error);

            if (error?.data?.error?.name === 'DELETION_PROCESS') {
                const connector = await connectFromHook();

                dispatch(
                    setCredentials({
                        token: '',
                        type: [],
                        user: {
                            deleteProcess: true,
                            recoverAddress: getAddress(
                                connector.kit.connection.config.from
                            )
                        }
                    })
                );

                return true;
            }

            return false;
        }
    };

    const disconnect = async (callback?: Function) => {
        try {
            cacheClear();
            await disconnectFromHook();

            if (!!callback) {
                await callback();
            }

            return true;
        } catch (error) {
            console.log('Error disconnecting from wallet!\n', error);

            return false;
        }
    };

    return {
        address,
        connect,
        disconnect,
        isReady,
        userConnection,
        wrongNetwork
    };
};

export default useWallet;
