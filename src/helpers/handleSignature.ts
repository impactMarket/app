import { registerSignature } from '../helpers/registerSignature';
import config from '../../config';

export const handleSignature = async (signMessage: any) => {
    try {
        const timestamp = new Date()?.getTime()?.toString();
        const messageToSign = `${config.signatureMessage} ${timestamp}`;

        await signMessage(messageToSign).then((signature: string) => {
            registerSignature(signature, messageToSign);
        });

        return { success: true };
    } catch (error) {
        console.log(error);

        throw Error;
    }
};
