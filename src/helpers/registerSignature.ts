import { setCookie } from 'cookies-next';
import { setSignature } from '../state/slices/auth';
import { store } from '../state/store';
import config from '../../config';

interface Signature {
    message: object;
    signature: string;
}

export const registerSignature = (
    signature: string,
    eip712_signature: Signature,
    messageToSign: string
) => {
    const expiryDate = new Date(
        Date.now() + 86400 * 1000 * parseInt(config.signatureExpires, 10)
    );

    setCookie('SIGNATURE', signature, { expires: expiryDate, path: '/' });
    setCookie('MESSAGE', messageToSign, { expires: expiryDate, path: '/' });

    setCookie('EIP712_SIGNATURE', eip712_signature?.signature, {
        expires: expiryDate,
        path: '/'
    });
    setCookie('EIP712_MESSAGE', JSON.stringify(eip712_signature?.message), {
        expires: expiryDate,
        path: '/'
    });

    store.dispatch(
        setSignature({
            eip712_message: JSON.stringify(eip712_signature?.message),
            eip712_signature: eip712_signature?.signature,
            message: messageToSign,
            signature
        })
    );
};
