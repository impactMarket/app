import { emptySplitApi } from './index';

interface Community {
    name: string;
    currency: string;
};

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getCommunity: builder.mutation<Community, void>({
            query: (id) => ({
                method: 'GET',
                url: `community/${id}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        getCommunityById: builder.query<Community, string>({
            query: id => `community/${id}`
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery, useGetCommunityMutation } = communityApi;
