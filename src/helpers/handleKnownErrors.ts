import { toast } from '@impact-market/ui';

export const handleKnownErrors = (error: any) => {
    const errorMessage = error.toString().toLowerCase();

    if (errorMessage.includes('insufficient funds')) {
        toast.error(
            `You don't have enough balance to complete the transaction. Please fund your wallet to complete the transaction.`
        );
    } else if (errorMessage.includes("don't have enough funds to borrow")) {
        toast.error(`You don't have enough funds to borrow this amount.`);
    } else {
        toast.error('An error has ocurred. Please try again later.');
    }
};
