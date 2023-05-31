import { Rate, selectRates } from '../state/slices/rates';
import { useSelector } from 'react-redux';
import currenciesJSON from '../assets/currencies.json';

import { selectCurrentUser } from '../state/slices/auth';

export const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;

export const currenciesOptions = Object.entries(
    currencies
).map(([key, value]: any) => ({ label: value.name, value: key }));

export const localeFormat = (value: number, options: any = {}) => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';

    return new Intl.NumberFormat(language, options).format(value);
};

const defaultCurrency = () => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';

    return new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });
};

export const currencyFormat = (
    number: number,
    customCurrency: Intl.NumberFormat = null,
    rate: any = null
) => {
    const rates = rate || useSelector(selectRates);
    const localeCurrency = customCurrency || defaultCurrency();
    const { currency } = localeCurrency.resolvedOptions();

    if (currency !== 'USD') {
        const rate =
            rates.find((elem: Rate) => elem.currency === currency)?.rate || 1;

        return localeCurrency.format(number * rate);
    }

    return localeCurrency.format(number);
};

export function getCurrencySymbol(currency: string) {
    return (currenciesJSON as {
        [key: string]: {
            symbol: string;
            name: string;
            symbol_native: string;
        };
    })[currency?.toUpperCase()]?.symbol;
}

export const convertCurrency = (
    number: number,
    rates: Rate[],
    from: string,
    to: string
) => {
    if (from === to) {
        return number;
    }

    const fromRate =
        rates.find((elem: Rate) => elem.currency === from)?.rate || 1;
    const toRate = rates.find((elem: Rate) => elem.currency === to)?.rate || 1;

    return (toRate / fromRate) * number;
};
