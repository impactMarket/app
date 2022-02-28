// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

export interface User {
    address: string;
}
interface PutPostUser {
    address: string;
    // phone: string;
    // language: string;
    // currency: string;
    // pushNotificationToken: string;
    // username: string;
    // gender: string;
    // year: number;
    // children: number;
    // avatarMediaId: number;
    // overwrite: boolean;
    // recover: boolean;
}
// Define a service using a base URL and expected endpoints
export const userApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: config.baseApiUrl
    }),
    endpoints: builder => ({
        // First connect. Either register or login.
        createUser: builder.mutation<User, PutPostUser>({
            query: body => ({
                body,
                method: 'POST',
                url: 'user/auth'
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        // Edit profile
        getUser: builder.query<User, void>({
            query: () => ({
                method: 'GET',
                url: 'user'
            }),
            transformResponse: (response: { data: User }) => response.data
        }),
        // Edit profile
        updateUser: builder.mutation<User, PutPostUser>({
            query: body => ({
                body,
                method: 'PUT',
                url: 'user'
            }),
            transformResponse: (response: { data: User }) => response.data
        })
    }),
    reducerPath: 'userApi'
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateUserMutation, useUpdateUserMutation } = userApi;
