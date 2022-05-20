import { emptySplitApi } from './index';
import qs from 'query-string';

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

export interface Reviews {
    count: number;
    review: string;
}

export interface ReviewsByCountry {
    country: string;
}

export interface Contract {
    communityId: number;
}
export interface PendingCommunities {
    count: number;
    rows: [{
        name: string;
        description: string;
        country: string;
        city: string;
        coverMediaPath: string;
        ambassadorAddress: string;
        proposals?: boolean;
        contract: {
            maxClaim: number;
            baseInterval: number;
            claimAmount: number;
            incrementInterval: number;
        };
        success: boolean;
        userHasVoted?: boolean;
    }];
};

export interface CommunityContract {
    data: {
        communityId: number;
        claimAmount: string;
        maxClaim: string;
        baseInterval: number;
        incrementInterval: number;  
    };
    success: boolean;
};

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
        getCommunityById: builder.query<CommunityContract, string>({
            query: id => `communities/${id}`
        }),
        //  Get single community contract
        getCommunityContract: builder.mutation<CommunityContract, { id: any }>({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}/contract`
            })
        }),
        getCountryByCommunities: builder.mutation<Countries[], void>({
            query: () => ({
                method: 'GET',
                url: `communities/count?groupBy=country`
            }),
            transformResponse: (response: { data?: Countries[] }) => response.data
        }),
        getPendingCommunities: builder.mutation<PendingCommunities, {limit: number, offset: number}>({
            query: ({limit, offset}) => ({
                method: 'GET',
                url: `communities?status=pending&review=accepted${!!limit ? `&limit=${limit}` : ''}${!!offset ? `&offset=${offset}` : ''}&fields=id;requestByAddress;name;description;country;city;coverMediaPath;ambassadorAddress;contract.maxClaim;contract.baseInterval;contract.claimAmount;contract.incrementInterval`
            }),
            transformResponse: (response: { data?: PendingCommunities }) => response.data
        }),
        //  Get reviews by country
        getReviewsByCountry: builder.mutation<ReviewsByCountry, string>({
            query: (status: string) => ({
                method: 'GET',
                url: `communities/count?groupBy=reviewByCountry${status && `&status=${status}`}`
            }),
            transformResponse: (response: { data?: ReviewsByCountry }) => response.data
        }),
        //  Get reviews count
        getReviewsCount: builder.mutation<Reviews[], void>({
            query: () => ({
                method: 'GET',
                url: `communities/count?groupBy=review`
            }),
            transformResponse: (response: { data?: Reviews[] }) => response.data
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
    useGetReviewsCountMutation,
    useGetReviewsByCountryMutation,
    useGetCommunityContractMutation,
    useGetPendingCommunitiesMutation,
} = communityApi;
