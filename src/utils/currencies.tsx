/* eslint-disable sort-keys */
/* eslint-disable react-hooks/rules-of-hooks */
import { Rate, selectRates } from '../state/slices/rates';
import { useSelector } from 'react-redux';
import currenciesJSON from '../assets/currencies.json';

export const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;

export const currenciesOptions = Object.entries(currencies).map(([key, value]: any) => ({ label: value.name, value: key }));

export const currencyFormat = (number: number, localeCurrency: Intl.NumberFormat) => {
    const rates = useSelector(selectRates);
    const { currency } = localeCurrency.resolvedOptions();
    
    if (currency !== 'USD') {
        const rate = rates.find((elem: Rate) => elem.currency === currency)?.rate || 1;

        return localeCurrency.format(number * rate);
    }

    return localeCurrency.format(number);
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

export const convertCurrency = (number: number, rates: Rate[], from: string, to: string) => {
    if (from === to) {
        return number;
    }

    const fromRate = rates.find((elem: Rate) => elem.currency === from)?.rate || 1;
    const toRate = rates.find((elem: Rate) => elem.currency === to)?.rate || 1;

    return (toRate / fromRate) * number;
};
