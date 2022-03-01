import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
// import type { User } from '../../api/user';

type User = {
    id: number;
};

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
            console.log('setCredentials', action);
            state.user = action.payload.user;
            state.token = action.payload.token;
        }
    }
});

export const { setCredentials } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;

export default slice.reducer;
