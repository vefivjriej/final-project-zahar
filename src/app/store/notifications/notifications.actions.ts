import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AppNotification } from '@shared/models/domain.models';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ notifications: AppNotification[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Generate Due': emptyProps(),
    'Create Success': props<{ notification: AppNotification }>(),
    'Mark Read': props<{ notification: AppNotification }>(),
    'Mark Read Success': props<{ notification: AppNotification }>()
  }
});
