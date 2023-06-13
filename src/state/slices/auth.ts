import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type User = any;

type AuthState = {
    user: User | null;
    signature: string | null;
    message: string | null;
    token: string | null;
    type: string[] | null;
};

const slice = createSlice({
    initialState: {
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
            action: PayloadAction<{ signature: string; message: string }>
        ) => {
            state.signature = action.payload.signature;
            state.message = action.payload.message;
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
