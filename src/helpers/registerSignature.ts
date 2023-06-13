import { setCookie } from 'cookies-next';
import { setSignature } from '../state/slices/auth';
import { store } from '../state/store';
import config from '../../config';

export const registerSignature = (signature: string, message: string) => {
    const expiryDate = new Date(
        Date.now() + 86400 * 1000 * parseInt(config.signatureExpires, 10)
    );

    setCookie('SIGNATURE', signature, { expires: expiryDate, path: '/' });
    setCookie('MESSAGE', message, { expires: expiryDate, path: '/' });

    store.dispatch(setSignature({ message, signature }));
};
