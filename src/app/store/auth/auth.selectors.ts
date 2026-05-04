import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectSession = createSelector(selectAuthState, (state) => state.session);
export const selectCurrentUser = createSelector(selectSession, (session) => session?.user ?? null);
export const selectCurrentUserId = createSelector(selectCurrentUser, (user) => user?.id ?? null);
export const selectIsAuthenticated = createSelector(selectSession, (session) => Boolean(session));
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
