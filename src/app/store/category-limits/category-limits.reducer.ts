import { createReducer, on } from '@ngrx/store';

import { CategoryLimit } from '@shared/models/domain.models';

import { CategoryLimitsActions } from './category-limits.actions';

export interface CategoryLimitsState {
  items: CategoryLimit[];
  loading: boolean;
  error: string | null;
}

export const initialCategoryLimitsState: CategoryLimitsState = {
  items: [],
  loading: false,
  error: null
};

export const categoryLimitsReducer = createReducer(
  initialCategoryLimitsState,
  on(CategoryLimitsActions.load, (state): CategoryLimitsState => ({ ...state, loading: true })),
  on(
    CategoryLimitsActions.loadSuccess,
    (state, { limits }): CategoryLimitsState => ({
      ...state,
      items: limits,
      loading: false,
      error: null
    })
  ),
  on(
    CategoryLimitsActions.loadFailure,
    CategoryLimitsActions.upsertFailure,
    (state, { error }): CategoryLimitsState => ({ ...state, loading: false, error })
  ),
  on(
    CategoryLimitsActions.upsertSuccess,
    (state, { limit }): CategoryLimitsState => ({
      ...state,
      items: state.items.some((item) => item.id === limit.id)
        ? state.items.map((item) => (item.id === limit.id ? limit : item))
        : [...state.items, limit],
      loading: false,
      error: null
    })
  )
);
