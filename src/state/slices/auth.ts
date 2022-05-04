import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
// import type { User } from '../../api/user';

// type User = {
//     id: number;
// };

type User = any;

type AuthState = {
    user: User | null;
    token: string | null;
    type: string[] | null;
};

const slice = createSlice({
    initialState: {
        token: null,
        type: null,
        user: null
    } as AuthState,
    name: 'auth',
    reducers: {
        removeCredentials: (
            state
        ) => {
            console.log('removeCredentials');
            state.user = null;
            state.token = null;
            state.type = null;
        },
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string, type: string[] }>
        ) => {
            // console.log('setCredentials', action);
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.type = action.payload.type;
        },
        setToken: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            // console.log('setToken', action);
            state.token = action.payload.token;
        },
        setType: (
            state,
            action: PayloadAction<{ type: string[] }>
        ) => {
            // console.log('setType', action);
            state.type = action.payload.type;
        },
        setUser: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            // console.log('setUser', action);
            state.user = action.payload.user;
        }
    }
});

export const { setCredentials, removeCredentials, setToken, setType, setUser } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;

export default slice.reducer;
