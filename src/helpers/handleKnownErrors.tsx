import { toast } from '@impact-market/ui';
import Message from 'src/libs/Prismic/components/Message';

export const handleKnownErrors = (error: any) => {
    const errorMessage = error.toString().toLowerCase();

    if (errorMessage.includes('insufficient funds')) {
        toast.error(<Message id="insufficientFunds" />);
    } else if (errorMessage.includes("don't have enough funds to borrow")) {
        toast.error(<Message id="notEnoughFunds" />);
    } else if (errorMessage.includes('user already has an active loan')) {
        toast.error(<Message id="alreadyHasLoan" />);
    } else {
        toast.error(<Message id="errorOccurred" />);
    }
};
