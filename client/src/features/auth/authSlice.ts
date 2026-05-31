import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@shared/types';
import type { RootState } from '@/app/store';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  /** Cached Firebase ID token (or demo token) for the API client interceptor. */
  token: string | null;
}

const initialState: AuthState = { user: null, status: 'idle', token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.status = 'loading';
    },
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'authenticated';
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    signedOut(state) {
      state.user = null;
      state.token = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { authLoading, setCredentials, setToken, signedOut } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (s: RootState) => s.auth.user;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectIsAdmin = (s: RootState) => s.auth.user?.role === 'admin';
export const selectIsAuthenticated = (s: RootState) => s.auth.status === 'authenticated';
