import { Alfajores, CeloMainnet } from '@celo-tools/use-contractkit';
import { AppContext } from '../components/WrapperProvider';
import { getUserTypes } from '../utils/userTypes';
import { removeCredentials, setCredentials } from '../state/slices/auth';
import { useCreateUserMutation } from '../api/user';
import { useDispatch } from 'react-redux';
import React from 'react';
import config from '../../config';

const network = config.useTestNet ? Alfajores: CeloMainnet;

const useWallet = () => {
    const { address, connect: connectFromHook, disconnect: disconnectFromHook, isReady, network: walletNetwork } = React.useContext(AppContext);

    const dispatch = useDispatch();

    const wrongNetwork = network?.chainId !== walletNetwork?.chainId;

    const [createUser, userConnection] = useCreateUserMutation();

    const connect = async (callback?: Function) => {
        try {
            const connector = await connectFromHook();

            const payload = await createUser({
                address: connector.account
            }).unwrap();

            dispatch(setCredentials({ token: payload.token, user: { type: getUserTypes(payload), ...payload }}));

            // Create cookie to save Auth Token
            const expiryDate = new Date();

            expiryDate.setTime(expiryDate.getTime()+(30*24*60*60*1000));
            document.cookie = `AUTH_TOKEN=${payload.token}; path=/; expires=${expiryDate.toUTCString()};`;

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
            document.cookie = 'AUTH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

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
