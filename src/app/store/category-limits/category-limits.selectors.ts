import { createFeatureSelector, createSelector } from '@ngrx/store';

import { exceededLimits } from '@shared/utils/subscription-calculations';
import { selectSubscriptions } from '@store/subscriptions/subscriptions.selectors';

import { CategoryLimitsState } from './category-limits.reducer';

export const selectCategoryLimitsState =
  createFeatureSelector<CategoryLimitsState>('categoryLimits');

export const selectCategoryLimits = createSelector(selectCategoryLimitsState, (state) => state.items);
export const selectCategoryLimitsLoading = createSelector(
  selectCategoryLimitsState,
  (state) => state.loading
);
export const selectExceededCategoryLimits = createSelector(
  selectSubscriptions,
  selectCategoryLimits,
  exceededLimits
);
