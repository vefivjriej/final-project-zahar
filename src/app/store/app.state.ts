import { ActionReducerMap } from '@ngrx/store';

import { AuthEffects } from './auth/auth.effects';
import { AuthState, authReducer } from './auth/auth.reducer';
import { CategoryLimitsEffects } from './category-limits/category-limits.effects';
import {
  CategoryLimitsState,
  categoryLimitsReducer
} from './category-limits/category-limits.reducer';
import { NotificationsEffects } from './notifications/notifications.effects';
import { NotificationsState, notificationsReducer } from './notifications/notifications.reducer';
import { SubscriptionsEffects } from './subscriptions/subscriptions.effects';
import { SubscriptionsState, subscriptionsReducer } from './subscriptions/subscriptions.reducer';

export interface AppState {
  auth: AuthState;
  subscriptions: SubscriptionsState;
  notifications: NotificationsState;
  categoryLimits: CategoryLimitsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  subscriptions: subscriptionsReducer,
  notifications: notificationsReducer,
  categoryLimits: categoryLimitsReducer
};

export const appEffects = [
  AuthEffects,
  SubscriptionsEffects,
  NotificationsEffects,
  CategoryLimitsEffects
];
