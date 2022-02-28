// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { RootState } from '../state/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
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
    endpoints: () => ({})
});
