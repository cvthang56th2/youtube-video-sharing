import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import notificationReducer from './notificationSlice'
import videoReducer from './videoSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    video: videoReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
})