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
};

const slice = createSlice({
    initialState: {
        token: null,
        user: null
    } as AuthState,
    name: 'auth',
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            //console.log('setCredentials', action);
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        removeCredentials: (
            state
        ) => {
            //console.log('removeCredentials', action);
            state.user = null;
            state.token = null;
        },
        setToken: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            //console.log('setToken', action);
            state.token = action.payload.token;
        },
        setUser: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            //console.log('setUser', action);
            state.user = action.payload.user;
        }
    }
});

export const { setCredentials, removeCredentials, setToken, setUser } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;

export default slice.reducer;
