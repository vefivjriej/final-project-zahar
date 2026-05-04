import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CategoryLimit, SubscriptionCategory } from '@shared/models/domain.models';

export const CategoryLimitsActions = createActionGroup({
  source: 'Category Limits',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ limits: CategoryLimit[] }>(),
    'Load Failure': props<{ error: string }>(),
    Upsert: props<{ category: SubscriptionCategory; monthlyLimit: number }>(),
    'Upsert Success': props<{ limit: CategoryLimit }>(),
    'Upsert Failure': props<{ error: string }>()
  }
});
