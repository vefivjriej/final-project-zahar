import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  expensesByCategory,
  totalMonthlyCost,
  upcomingPayments
} from '@shared/utils/subscription-calculations';

import { SubscriptionsState } from './subscriptions.reducer';

export const selectSubscriptionsState = createFeatureSelector<SubscriptionsState>('subscriptions');

export const selectSubscriptions = createSelector(selectSubscriptionsState, (state) => state.items);
export const selectSubscriptionsLoading = createSelector(
  selectSubscriptionsState,
  (state) => state.loading
);
export const selectSubscriptionsError = createSelector(
  selectSubscriptionsState,
  (state) => state.error
);
export const selectSubscriptionFilters = createSelector(
  selectSubscriptionsState,
  (state) => state.filters
);
export const selectSubscriptionSort = createSelector(
  selectSubscriptionsState,
  (state) => state.sort
);

export const selectFilteredSubscriptions = createSelector(
  selectSubscriptions,
  selectSubscriptionFilters,
  selectSubscriptionSort,
  (subscriptions, filters, sort) =>
    subscriptions
      .filter((subscription) =>
        filters.category === 'all' ? true : subscription.category === filters.category
      )
      .filter((subscription) =>
        filters.status === 'all' ? true : subscription.status === filters.status
      )
      .slice()
      .sort((left, right) =>
        sort === 'price'
          ? right.price - left.price
          : left.nextPaymentDate.localeCompare(right.nextPaymentDate)
      )
);

export const selectActiveSubscriptions = createSelector(selectSubscriptions, (subscriptions) =>
  subscriptions.filter((subscription) => subscription.status === 'active')
);

export const selectTotalMonthlyCost = createSelector(selectSubscriptions, totalMonthlyCost);
export const selectExpensesByCategory = createSelector(selectSubscriptions, expensesByCategory);
export const selectUpcomingPayments = createSelector(selectSubscriptions, (subscriptions) =>
  upcomingPayments(subscriptions)
);
