import { communityApi } from '../api/community';
import { configureStore } from '@reduxjs/toolkit';
import { genericApi } from '../api/generic';
import counterReducer from './slices/counter';

export const store = configureStore({
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(genericApi.middleware)
            .concat(communityApi.middleware),
    reducer: {
        counter: counterReducer,
        // Add the generated reducer as a specific top-level slice
        [genericApi.reducerPath]: genericApi.reducer,
        [communityApi.reducerPath]: communityApi.reducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
