import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  CreateSubscriptionDto,
  Subscription,
  SubscriptionFilters,
  SubscriptionSort,
  SubscriptionStatus
} from '@shared/models/domain.models';

export const SubscriptionsActions = createActionGroup({
  source: 'Subscriptions',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ subscriptions: Subscription[] }>(),
    'Load Failure': props<{ error: string }>(),
    Create: props<{ dto: CreateSubscriptionDto }>(),
    'Create Success': props<{ subscription: Subscription }>(),
    'Create Failure': props<{ error: string }>(),
    Update: props<{ subscription: Subscription }>(),
    'Update Success': props<{ subscription: Subscription }>(),
    'Update Failure': props<{ error: string }>(),
    'Change Status': props<{ subscription: Subscription; status: SubscriptionStatus }>(),
    Delete: props<{ id: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),
    'Set Filters': props<{ filters: Partial<SubscriptionFilters> }>(),
    'Set Sort': props<{ sort: SubscriptionSort }>()
  }
});
