// Need to use the React-specific entry point to import createApi
import { RootState } from '../state/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

interface ExchangeRate {
    currency: string;
    rate: number;
}
// Define a service using a base URL and expected endpoints
export const genericApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: config.baseApiUrl,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).auth;

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),
    endpoints: builder => ({
        getExchangeRates: builder.query<[ExchangeRate], void>({
            query: () => `/exchange-rates`
        })
    }),
    reducerPath: 'genericApi'
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExchangeRatesQuery } = genericApi;
