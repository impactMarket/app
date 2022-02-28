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
    initialState: { token: null, user: null } as AuthState,
    name: 'auth',
    reducers: {
        setCredentials: (
            state,
            {
                payload: { user, token }
            }: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = user;
            state.token = token;
        }
    }
});

export const { setCredentials } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export default slice.reducer;
