import { NotificationType } from '@/types/Notification';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface NotificationState {
  notifications: NotificationType[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      console.log(action.payload)
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;

export const selectNotifications = (state: { notification: NotificationState }) => state.notification.notifications;

export default notificationSlice.reducer;