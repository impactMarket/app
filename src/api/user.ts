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
        // Get preSigned URL for image upload
        getPreSigned: builder.mutation<PreSigned, void>({
            query: type => ({
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
    useGetUserMutation,
    useUpdateUserMutation,
    useGetPreSignedMutation
} = userApi;
