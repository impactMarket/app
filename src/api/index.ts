// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { FetchArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { RootState } from '../state/store';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import config from '../../config';

const baseQuery = retry(
    async (args: string | FetchArgs, api, extraOptions) => {
        const result = await fetchBaseQuery({
            baseUrl: config.baseApiUrl,
            prepareHeaders: (headers, { getState }) => {
                const {
                    token,
                    signature,
                    message
                } = (getState() as RootState).auth;

                // If we have a token set in state, let's assume that we should be passing it.
                if (token) {
                    headers.set('authorization', `Bearer ${token}`);
                }

                if (signature) {
                    headers.set('signature', signature);
                    headers.set('message', message);
                }

                return headers;
            }
        })(args, api, extraOptions);

        // If the error returned is different than 408 (timeout), we don't wan't to try again
        if (result.error && result.error?.status !== 408) {
            retry.fail(result.error);
        }

        return result;
    },
    {
        maxRetries: 5
    }
);

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
    baseQuery,
    endpoints: () => ({})
});
