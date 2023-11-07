import * as Sentry from '@sentry/browser';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { celo, celoAlfajores } from 'viem/chains';
import {
    configureChains,
    createConfig,
    useAccount,
    useDisconnect,
    useNetwork
} from 'wagmi';
import { deleteToken, getMessaging, isSupported } from 'firebase/messaging';
import { getAddress } from '@ethersproject/address';
import { getUserTypes } from '../utils/users';
import { hasCookie, setCookie } from 'cookies-next';
import { publicProvider } from 'wagmi/providers/public';
import { setCredentials } from '../state/slices/auth';
import { useCreateUserMutation } from '../api/user';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { walletConnectProvider } from '@web3modal/wagmi';
import config from '../../config';
import firebaseApp from 'src/utils/firebase/firebase';
import processTransactionError from 'src/utils/processTransactionError';
import useCache from './useCache';

const network = config.useTestNet ? celoAlfajores : celo;

export const projectId = config.walletConnectProjectId;

const metadata = {
    description: 'impactMarket',
    icons: ['https://avatars.githubusercontent.com/u/42247406'],
    name: 'impactMarket',
    url: 'https://impactmarket.com'
};

export const { chains, publicClient } = configureChains(
    [config.chainId === 42220 ? celo : celoAlfajores],
    [walletConnectProvider({ projectId }), publicProvider()]
);

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({
            chains,
            options: { metadata, projectId, showQrModal: false }
        }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } })
    ],
    publicClient
});

const useWallet = () => {
    const dispatch = useDispatch();
    const { cacheClear } = useCache();
    const { chain: walletNetwork } = useNetwork();

    const wrongNetwork = walletNetwork && network?.id !== walletNetwork?.id;

    const [createUser, userConnection] = useCreateUserMutation();

    const { open: connect } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

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

                processTransactionError(error, 'wallet_connect');

                return false;
            }
        }
    };

    const disconnectUser = async (callback?: Function) => {
        if (hasCookie('AUTH_TOKEN')) {
            try {
                cacheClear();

                const hasFirebaseSupport = await isSupported();

                // Delete token - Firebase
                if (hasFirebaseSupport) {
                    const permission = await Notification.requestPermission();
                    const messaging = getMessaging(firebaseApp);

                    if (permission) {
                        // eslint-disable-next-line max-depth
                        try {
                            await deleteToken(messaging);
                            console.log('Token deleted.');
                        } catch (error) {
                            console.error('Error deleting token:', error);
                            Sentry.captureException(error);
                        }
                    }
                }

                if (!!callback) {
                    await callback();
                }

                return true;
            } catch (error) {
                console.log('Error disconnecting from wallet!\n', error);
                processTransactionError(error, 'wallet_disconnect');

                return false;
            }
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            connectUser();
        }
        if (!isConnected && !address) {
            disconnectUser();
        }
    }, []);

    return {
        address,
        connect,
        disconnect,
        userConnection,
        wrongNetwork
    };
};

export default useWallet;
