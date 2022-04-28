import { emptySplitApi } from './index';

interface Community {
    name: string;
    currency: string;
    coverImage: string;
};

export interface SelectCommunity {
    id: number;
    name: string;
}

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getCommunities: builder.mutation<{count: number, rows: SelectCommunity[]}, void>({
            query: () => ({
                method: 'GET',
                url: `/communities`
            }),
            transformResponse: (response: { data?: {count: number, rows: SelectCommunity[]} }) => response.data
        }),     
        getCommunity: builder.mutation<Community, void>({
            query: (id) => ({
                method: 'GET',
                url: `communities/${id}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        
        getCommunityById: builder.query<Community, string>({
            query: id => `communities/${id}`
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery, useGetCommunityMutation, useGetCommunitiesMutation } = communityApi;
