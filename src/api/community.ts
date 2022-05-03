import { emptySplitApi } from './index';
import qs from 'query-string';

interface Community {
    coverImage: string;
    currency: string;
    name: string;
    id: any;
}

interface Communities {
    country: string;
    review: string;
}

interface Update {
    body: any;
    id: number;
}
export interface SelectCommunity {
    id: number;
    name: string;
}

export interface Countries {
    count: number;
    country: string;
}

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        //  Get all communities by country or/and review status
        getCommunities: builder.mutation<Communities, Record<string, any>>({
            query: (filters: Record<string, any>) => ({
                method: 'GET',
                url: qs.stringifyUrl({query:{limit:999, ...filters}, url:'communities'})
            }),
            transformResponse: (response: { data?: Communities }) => response.data
        }),
        //  Get single community by id
        getCommunity: builder.mutation<Community, { id: any }>({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}`
            }),
            transformResponse: (response: { data?: Community }) => response.data
        }),
        //  Update community review status (accepted, claimed, declined, pending)
        updateReview: builder.mutation<Update, { body: any; id: number }>({
            query: ({ body, id }: any) => ({
                body,
                method: 'PUT',
                url: `communities/${id}/review`
            }),
            transformResponse: (response: { data: Update }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCommunityMutation,
    useGetCommunitiesMutation,
    useUpdateReviewMutation
} = communityApi;
