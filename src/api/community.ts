import { emptySplitApi } from './index';

interface Community {
    name: string;
    currency: string;
    coverImage: string;
};

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getCommunity: builder.mutation<Community, void>({
            query: (id) => ({
                method: 'GET',
                url: `communities/${id}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        getCommunityById: builder.query<Community, string>({
            query: id => `communities/${id}`
        }),
        getCommunities: builder.mutation<Community[], void>({
            query: () => ({
                method: 'GET',
                url: `communities`
            }),
            transformResponse: (response: { data?: Community[] }) => response.data
        }),
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery, useGetCommunityMutation, useGetCommunitiesMutation } = communityApi;
