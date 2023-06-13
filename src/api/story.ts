import { emptySplitApi } from './index';

export interface Story {
    uploadURL: any;
    readonly id: number;
    storyMediaPath?: string;
    storyMedia?: any;
    message?: string;
    isDetetable: boolean;
    createdAt?: Date;
    community: {
        id: number;
        name: string;
        coverMediaPath?: string;
        city: string;
        country: string;
    };
    engagement: {
        loves?: number;
        userLoved?: boolean;
        userReported?: boolean;
    };
}

interface PostStory {
    readonly communityId: number;
    storyMediaPath?: string;
    storyMedia?: any;
    message?: string;
}

interface PreSigned {
    filePath?: string;
    filename?: string;
    media?: {
        height?: number;
        id?: number;
        url?: string;
        width?: number;
    };
    uploadURL?: string;
}

interface CountryWithStory {
    country?: string;
    count?: number;
}

interface PostComment {
    body: any;
    id: any;
    token: any;
}

// Define a service using a base URL and expected endpoints
export const storyApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        createStory: builder.mutation<Story, PostStory>({
            query: (body: any) => ({
                body,
                method: 'POST',
                url: 'stories'
            }),
            transformResponse: (response: { data: Story }) => response.data
        }),
        deleteStory: builder.mutation<Story, number>({
            query: (id: number) => ({
                method: 'DELETE',
                url: `stories/${id}`
            }),
            transformResponse: (response: { data: Story }) => response.data
        }),
        // Get preSigned URL for image upload
        getCountriesWithStories: builder.mutation<CountryWithStory[], void>({
            query: () => ({
                method: 'GET',
                url: `stories/count?groupBy=country`
            }),
            transformResponse: (response: { data: CountryWithStory[] }) =>
                response.data
        }),
        // Get Countries with stories
        getPreSigned: builder.mutation<PreSigned, void>({
            query: (type: any) => ({
                method: 'GET',
                url: `stories/presigned?mime=${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
        }),
        getStories: builder.mutation<
            { count: number; data: Story[]; success: boolean },
            { filters: string; limit: number; offset: number }
        >({
            query: ({ filters, limit, offset }) => ({
                method: 'GET',
                url: `stories?${!!filters ? `${filters}` : ''}${
                    !!limit ? `&limit=${limit}` : ''
                }${!!offset ? `&offset=${offset}` : ''}`
            })
        }),
        getStoryById: builder.mutation<Story, string>({
            query: (id) => `stories/${id}`
        }),
        loveStory: builder.mutation<Story, number>({
            query: (id: number) => ({
                method: 'PUT',
                url: `stories/love/${id}`
            }),
            transformResponse: (response: { data: Story }) => response.data
        }),
        postComment: builder.mutation<
            PostComment,
            { body: any; id: any; token: any }
        >({
            query: ({ body, id, token }) => ({
                body,
                headers: { Authorization: `Bearer ${token}` },
                method: 'POST',
                url: `/stories/${id}/comments`
            }),
            transformResponse: (response: { data: PostComment }) =>
                response.data
        }),
        reportStory: builder.mutation<Story, { body: any; id: number }>({
            query: ({ body, id }) => ({
                body,
                method: 'PUT',
                url: `stories/inapropriate/${id}`
            }),
            transformResponse: (response: { data: Story }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetStoryByIdMutation,
    useGetCountriesWithStoriesMutation,
    useGetPreSignedMutation,
    useGetStoriesMutation,
    useCreateStoryMutation,
    useLoveStoryMutation,
    useReportStoryMutation,
    useDeleteStoryMutation,
    usePostCommentMutation
} = storyApi;
