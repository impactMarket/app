import { emptySplitApi } from './index';

export interface User {
    address: string;
    token: string;
    id: number;
    type?: any;
}

export interface PutPostUser {
    address?: string;
    age?: number;
    ambassador?: any;
    appPNT?: string;
    avatarMediaPath?: string;
    beneficiary?: any;
    bio?: string;
    borrower?: any;
    children?: number;
    councilMember?: any;
    country?: string;
    currency?: string;
    email?: string;
    firstName?: string;
    gender?: string;
    language?: string;
    lastName?: string;
    loanManager?: any;
    manager?: any;
    overwrite?: boolean;
    phone?: string;
    pushNotificationToken?: string;
    recover?: boolean;
    username?: string;
    year?: number;
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

export interface Notification {
    count: number;
    rows: [
        {
            id: number;
            userId: number;
            type: number;
            params: {
                userAddress: string;
                contentId: number;
            };
            read: boolean;
            createdAt: string;
        }
    ];
}

export interface UnreadNotifications {
    success: boolean;
    data: number;
}

export interface AnonymousReport {
    communityId: number;
    category: string;
    message: string;
}

export interface RecoverUser {
    recover: boolean;
}

// Define a service using a base URL and expected endpoints
export const userApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        // Accept beneficiary community rules
        acceptRules: builder.mutation<void, void>({
            query: () => ({
                body: {
                    action: 'beneficiary-rules'
                },
                method: 'PATCH',
                url: 'users'
            })
        }),
        // Send anonymous report
        anonymousReport: builder.mutation<AnonymousReport, void>({
            query: (body: any) => ({
                body,
                method: 'POST',
                url: 'users/report'
            }),
            transformResponse: (response: { data: AnonymousReport }) =>
                response.data
        }),
        // First connect. Either register or login.
        createUser: builder.mutation<User, PutPostUser>({
            query: (body) => ({
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
        // Get preSigned URL for image upload
        getPreSigned: builder.mutation<PreSigned, void>({
            query: (type) => ({
                method: 'GET',
                url: `users/presigned?mime=${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
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
        // Recover account
        recoverAccount: builder.mutation<RecoverUser, void>({
            query: (body) => ({
                body,
                method: 'POST',
                url: 'users'
            }),
            transformResponse: (response: { data: RecoverUser }) =>
                response.data
        }),
        // Mark notifications as read
        updateNotifications: builder.mutation<Notification[], { body: any }>({
            query: ({ body }) => ({
                body,
                method: 'PUT',
                url: 'users/notifications'
            })
        }),
        // Edit profile
        updateUser: builder.mutation<User, PutPostUser>({
            query: (body) => ({
                body,
                method: 'PUT',
                url: 'users'
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        // Send Email
        sendVerifyEmail: builder.mutation<any, any>({
            query: (body) => ({
                body,
                method: 'POST',
                url: '/users/request-verify'
            }),
            transformResponse: (response: { data: any }) => response.data
        }),
        // Verify Email
        verifyEmail: builder.mutation<any, any>({
            query: (body) => ({
                body,
                method: 'POST',
                url: 'users/verify'
            }),
            transformResponse: (response: { data: any }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useAcceptRulesMutation,
    useAnonymousReportMutation,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetUserMutation,
    useGetUserByIdMutation,
    useRecoverAccountMutation,
    useUpdateNotificationsMutation,
    useUpdateUserMutation,
    useGetPreSignedMutation,
    useSendVerifyEmailMutation,
    useVerifyEmailMutation
} = userApi;
