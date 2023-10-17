import { registerSignature } from './registerSignature';
import { toast } from '@impact-market/ui';
import Message from 'src/libs/Prismic/components/Message';
import config from '../../config';
import processTransactionError from 'src/utils/processTransactionError';

export const handleSignature = async (
    signMessage: any,
    _signTypedData: any
) => {
    try {
        const currentDate = new Date();
        // const futureDate = new Date(
        //     currentDate.getTime() + 45 * 24 * 60 * 60 * 1000
        // );

        const messageToSign = `${config.signatureMessage} ${currentDate
            .getTime()
            .toString()}`;

        // const options = {
        //     expiry: Math.trunc(futureDate.getTime() / 1000)
        // };

        toast.info(<Message id="signMessage" />);

        const [signature, eip712_signature] = await Promise.all([
            signMessage(messageToSign),
            // signTypedData(messageToSign, options)
            { message: { x: 1 }, signature: 'xpto' }
        ]);

        registerSignature(signature, eip712_signature, messageToSign);

        return { success: true };
    } catch (error: any) {
        console.log(error);

        if (
            error.code === 4001 ||
            JSON.stringify(error).includes('rejected') ||
            JSON.stringify(error).includes('denied')
        ) {
            toast.error(<Message id="signatureRejected" />);
        } else {
            toast.error(<Message id="errorOccurred" />);
            processTransactionError(error, 'global_signature');
        }

        throw Error;
    }
};
