import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

import { currencyFormat } from '../utils/currencies';
import { selectRates } from '../state/slices/rates';

export default function useBeneficiaries(entity: string , incomingFilters: any) {
    const auth = useSelector(selectCurrentUser);
    const rates = useSelector(selectRates);

    const localeCurrency = new Intl.NumberFormat(auth?.user.currency.language || 'en-US', { 
        currency: auth?.user.currency || 'USD', 
        style: 'currency' 
    });
    
    const queryString = Object.keys(incomingFilters)
        .map((key) => `${ key }=${ incomingFilters[key] }`)
        .join('&');

    const fetcher = (url: string) => fetch(config.baseApiUrl + url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => res.json());

    const { data, mutate, error } = useSWR(`/communities/${entity}?${queryString}`, fetcher);

    data?.data?.rows.map((row: any) => {
        row.claimedFormatted = currencyFormat(row?.claimed, localeCurrency, rates);
    });

    const loading = !data && !error;
    
    return { 
        ...data,
        error,
        loading,
        mutate,
    };
}
