import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../interfaces/state-interfaces/auth-inter-st.model";


// 1. Feature selector - получаем весь auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// 2. Простые селекторы (для отдельных полей)
export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectEmail = createSelector(
  selectAuthState,
  (state: AuthState) => state.email
);

export const selectRole = createSelector(
  selectAuthState,
  (state: AuthState) => state.role
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

// 3. Комбинированные селекторы (вычисляемые значения)
export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (token) => !!token
);

// использо