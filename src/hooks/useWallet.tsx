import { Alfajores, Mainnet } from '@celo/react-celo';
import { AppContext } from '../components/WrapperProvider';
import { getAddress } from '@ethersproject/address';
import { getUserTypes } from '../utils/users';
import { removeCookies, setCookies } from 'cookies-next';
import { removeCredentials, setCredentials } from '../state/slices/auth';
import { useCreateUserMutation } from '../api/user';
import { useDispatch } from 'react-redux';
import React from 'react';
import config from '../../config';

const network = config.useTestNet ? Alfajores : Mainnet;

const useWallet = () => {
    const { address, connect: connectFromHook, disconnect: disconnectFromHook, isReady, network: walletNetwork } = React.useContext(AppContext);

    const dispatch = useDispatch();

    const wrongNetwork = network?.chainId !== walletNetwork?.chainId;

    const [createUser, userConnection] = useCreateUserMutation();

    const connect = async (callback?: Function) => {
        try {
            const connector = await connectFromHook();

            const payload = await createUser({
                address: getAddress(connector.kit.connection.config.from)
            }).unwrap();

            dispatch(setCredentials({ 
                token: payload.token, 
                type: getUserTypes(payload),
                user: { ...payload }
            }));

            // Create cookie to save Auth Token
            const expiryDate = new Date();

            expiryDate.setTime(expiryDate.getTime()+(30*24*60*60*1000));
            setCookies('AUTH_TOKEN', payload.token, { expires: expiryDate, path: '/' });

            if (!!callback) {
                await callback();
            }

            return true;
        } catch (error) {
            console.log('Error connecting to wallet!', error);

            return false;
        }
    };

    const disconnect = async (callback?: Function) => {
        try {
            await disconnectFromHook();

            dispatch(removeCredentials());
            removeCookies('AUTH_TOKEN', { path: '/' });

            if (!!callback) {
                await callback();
            }

            return true;
        } catch (error) {
            console.log('Error disconnecting from wallet!\n', error);

            return false;
        }
    };

    return { address, connect, disconnect, isReady, userConnection, wrongNetwork };
};

export default useWallet;
