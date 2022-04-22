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
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        getCommunities: builder.mutation<Community, {myCountry: any, review: string}>({
            query: ({myCountry, review}: any) => ({
                method: 'GET',
                // url: `communities?limit=99${myCountry as any && '&country=PT'}`
                url: `communities?limit=99&review=${review}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        updateReview: builder.mutation<Community, {body:any, id:number}>({
            query: ({body, id}: any) => ({
                body,
                method: 'PUT',
                url: `communities/${id}/review`
            }),
            transformResponse: (response: { data: Community }) => response.data
        }),
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityMutation, useGetCommunitiesMutation, useUpdateReviewMutation } = communityApi;
