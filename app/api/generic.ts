import { emptySplitApi } from './index';

interface ExchangeRate {
    currency: string;
    rate: number;
}
// Define a service using a base URL and expected endpoints
export const genericApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getExchangeRates: builder.query<[ExchangeRate], void>({
            query: () => `/exchange-rates`
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExchangeRatesQuery } = genericApi;
