import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AuthSession, Credentials } from '@shared/models/domain.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ credentials: Credentials }>(),
    'Login Success': props<{ session: AuthSession }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: emptyProps()
  }
});
