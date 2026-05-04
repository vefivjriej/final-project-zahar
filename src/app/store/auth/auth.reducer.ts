import { createReducer, on } from '@ngrx/store';

import { AuthSession } from '@shared/models/domain.models';

import { AuthActions } from './auth.actions';

export interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

function readInitialSession(): AuthSession | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const rawSession = localStorage.getItem('spm.session');

    return rawSession ? (JSON.parse(rawSession) as AuthSession) : null;
  } catch {
    localStorage.removeItem('spm.session');

    return null;
  }
}

export const initialAuthState: AuthState = {
  session: readInitialSession(),
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state): AuthState => ({ ...state, loading: true, error: null })),
  on(
    AuthActions.loginSuccess,
    (state, { session }): AuthState => ({ ...state, session, loading: false, error: null })
  ),
  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({ ...state, loading: false, error })
  ),
  on(AuthActions.logout, (): AuthState => ({ session: null, loading: false, error: null }))
);
