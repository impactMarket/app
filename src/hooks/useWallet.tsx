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
    const dispatch = useDispatch();
    const { cacheClear } = useCache();
    const { chain: walletNetwork } = useNetwork();

    const wrongNetwork = walletNetwork && network?.id !== walletNetwork?.id;

    const [createUser, userConnection] = useCreateUserMutation();

    const { open: connect } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

    useEffect(() => {
        const connectUser = async (callback?: Function) => {
            if (!hasCookie('AUTH_TOKEN')) {
                try {
                    const payload = await createUser({
                        address: getAddress(address)
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

                    expiryDate.setTime(
                        expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000
                    );
                    setCookie('AUTH_TOKEN', payload.token, {
                        expires: expiryDate,
                        path: '/'
                    });
                    deleteCookie('LOCALE', { path: '/' });

                    if (!!callback) {
                        await callback();
                    }

                    return true;
                } catch (error: any) {
                    console.log('Error connecting to wallet!', error);

                    if (error?.data?.error?.name === 'DELETION_PROCESS') {
                        dispatch(
                            setCredentials({
                                token: '',
                                type: [],
                                user: {
                                    deleteProcess: true,
                                    recoverAddress: getAddress(address)
                                }
                            })
                        );

                        return true;
                    }

                    return false;
                }
            }
        };

        const disconnectUser = async (callback?: Function) => {
            if (hasCookie('AUTH_TOKEN')) {
                try {
                    cacheClear();

                    if (!!callback) {
                        await callback();
                    }

                    return true;
                } catch (error) {
                    console.log('Error disconnecting from wallet!\n', error);

                    return false;
                }
            }
        };

        if (isConnected && address) {
            connectUser();
        }

        if (!isConnected && !address) {
            disconnectUser();
        }
    }, [isConnected, address]);

    return {
        address,
        connect,
        disconnect,
        userConnection,
        wrongNetwork
    };
};

export default useWallet;
