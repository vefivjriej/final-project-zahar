import { createReducer, on } from '@ngrx/store';

import { Subscription, SubscriptionFilters, SubscriptionSort } from '@shared/models/domain.models';

import { SubscriptionsActions } from './subscriptions.actions';

export interface SubscriptionsState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
  filters: SubscriptionFilters;
  sort: SubscriptionSort;
}

export const initialSubscriptionsState: SubscriptionsState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'all'
  },
  sort: 'nextPaymentDate'
};

export const subscriptionsReducer = createReducer(
  initialSubscriptionsState,
  on(SubscriptionsActions.load, (state): SubscriptionsState => ({ ...state, loading: true })),
  on(
    SubscriptionsActions.loadSuccess,
    (state, { subscriptions }): SubscriptionsState => ({
      ...state,
      items: subscriptions,
      loading: false,
      error: null
    })
  ),
  on(
    SubscriptionsActions.loadFailure,
    (state, { error }): SubscriptionsState => ({ ...state, loading: false, error })
  ),
  on(SubscriptionsActions.create, (state): SubscriptionsState => ({ ...state, loading: true })),
  on(
    SubscriptionsActions.createSuccess,
    (state, { subscription }): SubscriptionsState => ({
      ...state,
      items: [...state.items, subscription],
      loading: false,
      error: null
    })
  ),
  on(
    SubscriptionsActions.createFailure,
    SubscriptionsActions.updateFailure,
    SubscriptionsActions.deleteFailure,
    (state, { error }): SubscriptionsState => ({ ...state, loading: false, error })
  ),
  on(
    SubscriptionsActions.updateSuccess,
    (state, { subscription }): SubscriptionsState => ({
      ...state,
      items: state.items.map((item) => (item.id === subscription.id ? subscription : item)),
      loading: false,
      error: null
    })
  ),
  on(
    SubscriptionsActions.deleteSuccess,
    (state, { id }): SubscriptionsState => ({
      ...state,
      items: state.items.filter((item) => item.id !== id),
      loading: false,
      error: null
    })
  ),
  on(
    SubscriptionsActions.setFilters,
    (state, { filters }): SubscriptionsState => ({
      ...state,
      filters: {
        ...state.filters,
        ...filters
      }
    })
  ),
  on(
    SubscriptionsActions.setSort,
    (state, { sort }): SubscriptionsState => ({
      ...state,
      sort
    })
  )
);
