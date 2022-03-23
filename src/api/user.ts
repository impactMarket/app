import { emptySplitApi } from './index';

export interface User {
    address: string;
    token: string;
    id: number;
    type?: any
}
interface PutPostUser {
    address: string;
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
}
// Define a service using a base URL and expected endpoints
export const userApi = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        // First connect. Either register or login.
        createUser: builder.mutation<User, PutPostUser>({
            query: body => ({
                body,
                method: 'POST',
                url: 'users'
            }),
            transformResponse: (response: { data: User }) => response.data
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
    useCreateUserMutation,
    useGetUserMutation,
    useUpdateUserMutation
} = userApi;
