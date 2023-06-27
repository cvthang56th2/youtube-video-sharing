import { UserType } from '@/types/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  currentUser: UserType | null;
}

const initialState: AuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserType | null>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.currentUser;

export default authSlice.reducer;