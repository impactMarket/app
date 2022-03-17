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
        }),
        getExchangeRatesTest: builder.mutation<[ExchangeRate], void>({
            query: () => ({
                method: 'GET',
                url: 'exchange-rates'
            }),
            transformResponse: (response: { data: [ExchangeRate] }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExchangeRatesQuery, useGetExchangeRatesTestMutation } = genericApi;
