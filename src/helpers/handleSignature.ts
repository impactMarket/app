import { registerSignature } from '../helpers/registerSignature';
import { toast } from '@impact-market/ui';
import config from '../../config';

export const handleSignature = async (signMessage: any) => {
    try {
        const timestamp = new Date()?.getTime()?.toString();
        const messageToSign = `${config.signatureMessage} ${timestamp}`;

        toast.info('Please go to the wallet, sign the message');
        await signMessage(messageToSign).then((signature: string) => {
            registerSignature(signature, messageToSign);
        });

        return { success: true };
    } catch (error) {
        console.log(error);

        throw Error;
    }
};
