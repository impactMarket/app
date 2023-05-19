import { toast } from '@impact-market/ui';

export const handleKnownErrors = (error: any) => {
    const errorMessage = error.toString().toLowerCase();

    if (errorMessage.includes('insufficient funds')) {
        toast.error(
            `You don't have enough balance to complete the transaction. Please fund your wallet with some cUSD to complete the transaction.`
        );
    }
};
