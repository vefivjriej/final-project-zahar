import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notifications');

export const selectNotifications = createSelector(selectNotificationsState, (state) => state.items);
export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state) => state.loading
);
export const selectUnreadNotificationsCount = createSelector(
  selectNotifications,
  (notifications) => notifications.filter((notification) => !notification.isRead).length
);
