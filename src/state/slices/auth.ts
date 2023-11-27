import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';
import type { RootState } from '../store';

type User = any;

type AuthState = {
    eip712_signature: string | null;
    eip712_message: string | null;
    user: User | null;
    signature: string | null;
    message: string | null;
    token: string | null;
    type: string[] | null;
};

const slice = createSlice({
    initialState: {
        eip712_signature: null,
        signature: null,
        token: null,
        type: null,
        user: null
    } as AuthState,
    name: 'auth',
    reducers: {
        removeCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.type = null;
        },
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string; type: string[] }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.type = action.payload.type;
        },
        setSignature: (
            state,
            action: PayloadAction<{
                signature: string;
                message: string;
                eip712_signature: string;
                eip712_message: string;
            }>
        ) => {
            state.signature = action.payload.signature;
            state.message = action.payload.message;
            state.eip712_signature = action.payload.eip712_signature;
            state.eip712_message = action.payload.eip712_message;
        },
        setToken: (state, action: PayloadAction<{ token: string }>) => {
            // console.log('setToken', action);
            state.token = action.payload.token;
        },
        setType: (state, action: PayloadAction<{ type: string[] }>) => {
            // console.log('setType', action);
            state.type = action.payload.type;
        },
        setUser: (state, action: PayloadAction<{ user: User }>) => {
            // console.log('setUser', action);
            state.user = action.payload.user;

            const expiryDate = new Date();

            expiryDate.setTime(expiryDate.getTime() + 60 * 24 * 60 * 60 * 1000);

            setCookie('AUTH_TOKEN', action.payload.user.token, {
                expires: expiryDate,
                path: '/'
            });
        }
    }
});

export const {
    setCredentials,
    removeCredentials,
    setSignature,
    setToken,
    setType,
    setUser
} = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;

export default slice.reducer;
