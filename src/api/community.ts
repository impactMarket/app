import { emptySplitApi } from "./index"

interface Community {
    coverImage: string;
    currency: string;
    name: string;
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
        getCommunitiesByCountry: builder.mutation<Community[], void>({
            query: (myCountry) => ({
                method: 'GET',
                url: `communities?limit=999?limit=999${myCountry as any && '&country=PT'}`
            }),
            transformResponse: (response: { data?: Community[] }) => response.data
        }),
        setCommunityReviewState:  builder.mutation<Community, Community>({
            query: (body) => ({
                body,
                method: 'PUT',
                url: 'communities/2/review'
            }),
            transformResponse: (response: { data?: Community }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery, useGetCommunityMutation, useGetCommunitiesByCountryMutation, useSetCommunityReviewStateMutation } = communityApi;
