import { createReducer, on } from '@ngrx/store';

import { AppNotification } from '@shared/models/domain.models';

import { NotificationsActions } from './notifications.actions';

export interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
}

export const initialNotificationsState: NotificationsState = {
  items: [],
  loading: false,
  error: null
};

export const notificationsReducer = createReducer(
  initialNotificationsState,
  on(NotificationsActions.load, (state): NotificationsState => ({ ...state, loading: true })),
  on(
    NotificationsActions.loadSuccess,
    (state, { notifications }): NotificationsState => ({
      ...state,
      items: notifications,
      loading: false,
      error: null
    })
  ),
  on(
    NotificationsActions.loadFailure,
    (state, { error }): NotificationsState => ({ ...state, loading: false, error })
  ),
  on(
    NotificationsActions.createSuccess,
    (state, { notification }): NotificationsState => ({
      ...state,
      items: [notification, ...state.items]
    })
  ),
  on(
    NotificationsActions.markReadSuccess,
    (state, { notification }): NotificationsState => ({
      ...state,
      items: state.items.map((item) => (item.id === notification.id ? notification : item))
    })
  )
);
