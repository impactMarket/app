import { emptySplitApi } from './index';

export interface User {
    address: string;
    token: string;
    id: number;
    type?: any;
}

export interface PutPostUser {
    address?: string;
    phone?: string;
    language?: string;
    currency?: string;
    pushNotificationToken?: string;
    username?: string;
    gender?: string;
    year?: number;
    children?: number;
    overwrite?: boolean;
    recover?: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    country?: string;
    avatarMediaPath?: string;
    beneficiary?: any;
    manager?: any;
    councilMember?: any;
    ambassador?: any;
}

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

export interface Notification {
    count: number;
    rows: [{
        id: number;
        userId: number;
        type: number;
        params: {
            userAddress: string;
            contentId: number;
        };
        read: boolean;
        createdAt: string;
    }]
}

export interface UnreadNotifications {
    success : boolean;
    data: number;
}

export interface ReportsType {
    count: number;
    rows: [{
        id: number;
        communityId: number;
        message: string;
        category: string;
        review: string;
        createdAt: Date,
        community: {
            id: number;
            contractAddress: string;
            name: string;
            coverMediaPath: string;
        }
    }]
}

// Define a service using a base URL and expected endpoints
export const userApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        // Accept beneficiary community rules
        acceptRules: builder.mutation<void, void>({
            query: () => ({
                body: {
                    'action': 'beneficiary-rules'
                },
                method: 'PATCH',
                url: 'users'
            })
        }),
        // First connect. Either register or login.
        createUser: builder.mutation<User, PutPostUser>({
            query: body => ({
                body,
                method: 'POST',
                url: 'users'
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        // Delete user
        deleteUser: builder.mutation<void, void>({
            query: () => ({
                method: 'DELETE',
                url: 'users'
            })
        }),
        // Get suspicious activities reported 
        getAmbassadorReports: builder.mutation<ReportsType, {limit: number, offset: number}>({
            query: ({limit, offset}) => ({
                method: 'GET',
                url: `users/report?${!!limit ? `&limit=${limit}` : ''}${!!offset ? `&offset=${offset}` : ''}`
            }),
            transformResponse: (response: { data: ReportsType }) => response.data
        }),
        // Get notifications
        getNotifications: builder.mutation<Notification[], {limit: number, offset: number}>({
            query: ({limit, offset}) => ({
                method: 'GET',
                url: `users/notifications?${!!offset ? `&offset=${offset}` : ''}${!!limit ? `&limit=${limit}` : ''}`
            }),
            transformResponse: (response: { data: Notification[] }) => response.data
        }),
        // Get preSigned URL for image upload
        getPreSigned: builder.mutation<PreSigned, void>({
            query: type => ({
                method: 'GET',
                url: `users/presigned?mime=${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
        }),
        // Get number of unread notifications
        getUnreadNotifications: builder.mutation<UnreadNotifications, void>({
            query: () => ({
                method: 'GET',
                url: 'users/notifications/unread'
            })
        }),
        // Get profile
        getUser: builder.mutation<User, void>({
            query: () => ({
                method: 'GET',
                url: 'users'
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        getUserById: builder.mutation<User, string>({
            query: (id) => ({
                method: 'GET',
                url: `users/${id}`
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        // Mark notifications as read
        updateNotifications: builder.mutation<Notification[], {body: any}>({
            query: ({body}) => ({
                body,
                method: 'PUT',
                url: 'users/notifications/read'
            })
        }),
        // Edit profile
        updateUser: builder.mutation<User, PutPostUser>({
            query: body => ({
                body,
                method: 'PUT',
                url: 'users'
            }),
            transformResponse: (response: { data: User }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useAcceptRulesMutation,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetNotificationsMutation,
    useGetUnreadNotificationsMutation,
    useGetAmbassadorReportsMutation,
    useGetUserMutation,
    useGetUserByIdMutation,
    useUpdateNotificationsMutation,
    useUpdateUserMutation,
    useGetPreSignedMutation
} = userApi;
