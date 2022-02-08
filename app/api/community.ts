// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Community {
    data: {
        name: string;
    };
}
// Define a service using a base URL and expected endpoints
export const communityApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://impactmarket-api-staging.herokuapp.com/api/'
    }),
    endpoints: builder => ({
        getCommunityById: builder.query<Community, number>({
            query: id => `community/${id}`
        })
    }),
    reducerPath: 'communityApi'
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery } = communityApi;
