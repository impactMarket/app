import { registerSignature } from '../helpers/registerSignature';
import { toast } from '@impact-market/ui';
import config from '../../config';

export const handleSignature = async (signMessage: any, signTypedData: any) => {
    try {
        const currentDate = new Date();
        const futureDate = new Date(
            currentDate.getTime() + 45 * 24 * 60 * 60 * 1000
        );

        const messageToSign = `${config.signatureMessage} ${currentDate
            .getTime()
            .toString()}`;

        const options = {
            expiry: Math.trunc(futureDate.getTime() / 1000)
        };

        toast.info('Please go to the wallet, sign the message');

        const [signature, eip712_signature] = await Promise.all([
            signMessage(messageToSign),
            signTypedData(messageToSign, options)
        ]);

        registerSignature(signature, eip712_signature, messageToSign);

        return { success: true };
    } catch (error) {
        console.log(error);

        throw Error;
    }
};
