import { Rate } from '../state/slices/rates';
import { emptySplitApi } from './index';

// Define a service using a base URL and expected endpoints
export const genericApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        // getExchangeRates: builder.query<{ data: Rate[] }, void>({
        //     query: () => `exchange-rates`
        // }),
        getExchangeRates: builder.mutation<Rate[], void>({
            query: () => ({
                method: 'GET',
                url: 'exchange-rates'
            }),
            transformResponse: (response: { data: Rate[] }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExchangeRatesMutation } = genericApi;
