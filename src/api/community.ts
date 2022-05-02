import { emptySplitApi } from './index';

interface Community {
    coverImage: string;
    currency: string;
    name: string;
    id: any;
}

interface Communities {
    myCountry: string;
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

export interface PendingCommunities {
    name: string;
    description: string;
    country: string;
    city: string;
    coverMediaPath: string;
    ambassadorAddress: string;
    contract: {
        maxClaim: number;
        baseInterval: number;
        claimAmount: number;
        incrementInterval: number;
    };
};

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        //  Get all communities by country or/and review status
        getCommunities: builder.mutation<Communities, { myCountry: any; review: string }>({
            query: ({ myCountry, review }: any) => ({
                method: 'GET',
                url: `communities?limit=999${myCountry ? '&country=PT' : ''}${
                    review && `&review=${review}`
                }`
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
        getCommunityById: builder.query<Community, string>({
            query: id => `communities/${id}`
        }),
        getCountryByCommunities: builder.mutation<Countries[], void>({
            query: () => ({
                method: 'GET',
                url: `communities/count?groupBy=country`
            }),
            transformResponse: (response: { data?: Countries[] }) => response.data
        }),
        getPendingCommunities: builder.mutation<PendingCommunities[], void>({
            query: () => ({
                method: 'GET',
                url: `communities?status=pending&review=accepted&fields=id;requestByAddress;name;description;country;city;coverMediaPath;ambassadorAddress;contract.maxClaim;contract.baseInterval;contract.claimAmount;contract.incrementInterval`
            }),
            transformResponse: (response: { data?: PendingCommunities[] }) => response.data
        }),
        //  Update community review status (accepted, claimed, declined, pending)
        updateReview: builder.mutation<Update, { body: any; id: number }>({
            query: ({ body, id }: any) => ({
                body,
                method: 'PUT',
                url: `communities/${id}/review`
            }),
            transformResponse: (response: { data: Update }) => response.data
        }), 
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCommunityMutation,
    useGetCommunitiesMutation,
    useUpdateReviewMutation,
    useGetCountryByCommunitiesMutation,
    useGetPendingCommunitiesMutation
} = communityApi;
