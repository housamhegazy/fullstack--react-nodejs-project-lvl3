import { createSlice } from '@reduxjs/toolkit';
import { userApi } from './userApi'; // استيراد الـ API

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoadingAuth: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoadingAuth = false;
    },
    clearAuthUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoadingAuth = false;
    },
    setLoadingAuth: (state, action) => {
      state.isLoadingAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserProfile.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoadingAuth = false;
      }
    );
    builder.addMatcher(
      userApi.endpoints.getUserProfile.matchRejected,
      (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoadingAuth = false;
      }
    );
  },
});

export const { setAuthUser, clearAuthUser, setLoadingAuth } = authSlice.actions;
export default authSlice.reducer;