import { emptySplitApi as api } from '../api';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import notificationsReducer from './slices/notifications';
import ratesReducer from './slices/rates';

import learnAndEarnReduce from './slices/learnAndEarn';

export const store = configureStore({
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(api.middleware),
    reducer: {
        auth: authReducer,
        notifications: notificationsReducer,
        rates: ratesReducer,
        learnAndEarn: learnAndEarnReduce,
        [api.reducerPath]: api.reducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
