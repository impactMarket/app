/* eslint-disable sort-keys */
/* eslint-disable react-hooks/rules-of-hooks */
import { Rate, selectRates } from '../state/slices/rates';
import { useSelector } from 'react-redux';
import currenciesJSON from '../assets/currencies.json';

export const currencyFormat = (number: number, currency: string) => {
    const rates = useSelector(selectRates);
    const currencySymbol = getCurrencySymbol(currency);

    if(currency !== 'USD') {
        const rate = rates.find((elem: Rate) => elem.currency === currency)?.rate || 1;

        return `${currencySymbol}${number * rate}`;
    }

    return `${currencySymbol}${number}`;
};

export function getCurrencySymbol(currency: string) {
    return (
        currenciesJSON as {
            [key: string]: {
                symbol: string;
                name: string;
                symbol_native: string;
            };
        }
    )[currency.toUpperCase()].symbol;
}