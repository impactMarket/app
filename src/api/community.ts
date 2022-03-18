import { emptySplitApi } from './index';

interface Community {
    data: {
        name: string;
    };
}
// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getCommunityById: builder.query<Community, number>({
            query: id => `community/${id}`
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCommunityByIdQuery } = communityApi;
