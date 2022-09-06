import { setCookies } from 'cookies-next';
import { setSignature } from '../state/slices/auth';
import { store } from '../state/store';
import config from '../../config';

export const registerSignature = (signature: string, message: string) => {
    const expiryDate = new Date(
        Date.now() + 86400 * 1000 * parseInt(config.signatureExpires, 10)
    );

    setCookies('SIGNATURE', signature, { expires: expiryDate, path: '/' });
    setCookies('MESSAGE', message, { expires: expiryDate, path: '/' });

    store.dispatch(setSignature({ message, signature }));
};
