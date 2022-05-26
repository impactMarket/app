import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface NotificationsList {
    notifications: Notification[];
}

interface Notification {
    key: string;
    value: number;
};

const slice = createSlice({
    initialState: {
       notifications: []
    } as NotificationsList,
    name: 'notifications',
    reducers: {
        addNotification: (
            state,
            action: PayloadAction<{ notification: Notification }>
        ) => {
            state.notifications.push(action.payload.notification);
        },
        markAsRead: (
            state,
            action: PayloadAction<{ key: string, reduce: number }>
        ) => {
            const found = state.notifications.findIndex((n: Notification) => n.key === action.payload.key);

            if(found > -1) {
                const diff = state.notifications[found].value - action.payload.reduce;

                state.notifications[found].value = diff > 0 ? diff : 0;
            }
        },
    }
});

export const { addNotification, markAsRead } = slice.actions;

export const getNotifications = (state: RootState) => state.notifications;

export default slice.reducer;
