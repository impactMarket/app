import { PutPostUser } from './user';
import { emptySplitApi } from './index';
import qs from 'query-string';

export interface Community {
    coverImage: string;
    currency: string;
    name: string;
    id: any;
    state: any;
    language: string;
    status?: string;
    baseInterval?: number;
    claimAmount?: string;
    description?: string;
    incrementInterval?: number;
    maxClaim?: string;
    country?: string;
    city?: string;
    gps?: {
        latitude: number;
        longitude: number;
    }
    placeId?: string;
    coverMediaPath?: string;
    requestByAddress?: string;
    contractAddress?: string;
    ambassadorAddress?: string;
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

export interface Reviews {
    count: number;
    review: string;
}

export interface ReviewsByCountry {
    country: string;
    excludeCountry: string;
}

export interface Contract {
    communityId: number;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}

export interface CommunityManagers {
    address: string;
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

interface PostCommunity {
    requestByAddress?: string;
    name: string;
    contractAddress?: string;
    description: string;
    language: string;
    currency: string;
    city: string;
    country: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    email: string;
    coverMediaPath: string;
    txReceipt?: Object;
    contractParams: {
        claimAmount: string;
        maxClaim: string;
        baseInterval: number;
        incrementInterval: number;
    };
    placeId: string;
};

interface PostValidCommunity {
    name: string;
    description: string;
    coverMediaPath: string;
};

interface PreSigned {
    filePath?: string;
    filename?: string;
    media?: {
        height?: number;
        id?: number;
        url?: string;
        width?: number;
    }
    uploadURL?: string;
}

interface claimLocations {
    latitude: number;
    longitude: number;
}

interface Promoter {
    category?: string;
    description?: string;
    id: number;
    logoMediaPath?: string;
    name: string;
    socialMedia?: [{
        promoterId: number;
        mediaType: string;
        url: string;
    }]
}

export interface CommunityCampaign {
    id: number;
    communityId: number;
    campaignUrl: string;  
};

// Define a service using a base URL and expected endpoints
export const communityApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        createCommunity: builder.mutation<Community, PostCommunity>({
            query: (body: any) => ({
                body,
                method: 'POST',
                url: 'communities'
            }),
            transformResponse: (response: { data: Community }) => response.data
        }),
        editPendingCommunity: builder.mutation<Community, { id: string, body: PostCommunity }>({
            query: ({id , body}) => ({
                body,
                method: 'PATCH',
                url: `communities/${id}`
            }),
            transformResponse: (response: { data: Community }) => response.data
        }),
        editValidCommunity: builder.mutation<Community, PostValidCommunity>({
            query: body => ({
                body,
                method: 'PUT',
                url: 'communities'
            }),
            transformResponse: (response: { data: Community }) => response.data
        }),
        getBeneficiaries: builder.mutation<any, void>({
            query: () => ({
                method: 'GET',
                url: `communities/beneficiaries`
            }),
            transformResponse: (response: { data?: any }) => response.data
        }),
        //  Get claims locations
        getClaimsLocations: builder.mutation<claimLocations[], {id: any} >({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}/claims-location`
            }),
            transformResponse: (response: { data?: claimLocations[] }) => response.data
        }),
        //  Get all communities by country or/and review status
        getCommunities: builder.mutation<Communities, Record<string, any>>({
            query: (filters: Record<string, any>) => ({
                method: 'GET',
                url: qs.stringifyUrl({query:{ ...filters }, url:'communities'})
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
        //  Get Community Ambassador
        getCommunityAmbassador: builder.mutation<PutPostUser, { id: any }>({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}/ambassador`
            }),
            transformResponse: (response: { data?: PutPostUser }) => response.data
        }),
        getCommunityBeneficiaries: builder.mutation<any, {filters: string, limit: number, offset: number}>({
            query: ({filters, limit, offset}) => ({
                method: 'GET',
                url: `communities/beneficiaries?${!!filters ? `${filters}` : ''}${!!limit ? `&limit=${limit}` : ''}${!!offset ? `&offset=${offset}` : ''}`
            }),
            transformResponse: (response: { data?: any }) => response.data
        }),
        getCommunityById: builder.query<CommunityContract, string>({
            query: id => `communities/${id}`
        }),
        //  Get community campaign URL
        getCommunityCampaign: builder.mutation<CommunityCampaign, string>({
            query: (id: string) =>  `communities/${id}/campaign`
        }),
        //  Get single community contract
        getCommunityContract: builder.mutation<CommunityContract, { id: any }>({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}/contract`
            })
        }),
        //  Get community managers
        getCommunityManagers: builder.mutation<CommunityManagers, {community: string, filters?: string, limit?: number, offset?: number}>({
            query: ({community, filters, limit, offset}) => ({
                method: 'GET',
                url: `communities/${community}/managers?${!!filters ? `${filters}` : ''}${!!limit ? `&limit=${limit}` : ''}${!!offset ? `&offset=${offset}` : ''}`
            }),
            transformResponse: (response: { data?: CommunityManagers }) => response.data
        }),
        // Get preSigned URL for image upload
        getCommunityPreSigned: builder.mutation<PreSigned, void>({
            query: type => ({
                method: 'GET',
                url: `communities/media/${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
        }),
        getPendingCommunities: builder.mutation<PendingCommunities, {limit: number, offset: number, orderBy?: string}>({
            query: ({limit, offset, orderBy}) => ({
                method: 'GET',
                url: `communities?status=pending&review=accepted${!!limit ? `&limit=${limit}` : ''}${!!offset ? `&offset=${offset}` : ''}${!!orderBy ? `&orderBy=${orderBy}` : ''}&fields=id;requestByAddress;name;description;country;city;coverMediaPath;ambassadorAddress;contract.maxClaim;contract.baseInterval;contract.claimAmount;contract.incrementInterval`
            }),
            transformResponse: (response: { data?: PendingCommunities }) => response.data
        }),
        //  Get claims locations
        getPromoter: builder.mutation<Promoter, {id: any} >({
            query: (id: any) => ({
                method: 'GET',
                url: `communities/${id}/promoter`
            }),
            transformResponse: (response: { data?: Promoter }) => response.data
        }),
        //  Get reviews by country
        getReviewsByCountry: builder.mutation<ReviewsByCountry, Record<string, any>>({
            query: (filters: Record<string, any>) => ({
                method: 'GET',
                url: qs.stringifyUrl({query:{limit:999, ...filters}, url:'communities/count?groupBy=reviewByCountry'})
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
    useCreateCommunityMutation,
    useGetBeneficiariesMutation,
    useGetCommunityMutation,
    // Replace this in request by the swr getter
    useGetCommunitiesMutation,
    useUpdateReviewMutation,
    useGetReviewsCountMutation,
    useGetReviewsByCountryMutation,
    useGetCommunityContractMutation,
    useGetPendingCommunitiesMutation,
    useGetCommunityAmbassadorMutation,
    useGetCommunityManagersMutation,
    useGetCommunityBeneficiariesMutation,
    useGetCommunityPreSignedMutation,
    useGetClaimsLocationsMutation,
    useGetPromoterMutation,
    useEditPendingCommunityMutation,
    useEditValidCommunityMutation,
    useGetCommunityCampaignMutation
} = communityApi;
