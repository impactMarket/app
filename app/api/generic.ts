// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ExchangeRate {
    currency: string;
    rate: number;
}
// Define a service using a base URL and expected endpoints
export const genericApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://impactmarket-api-production.herokuapp.com/api/'
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
