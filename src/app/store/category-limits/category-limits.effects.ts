import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take, withLatestFrom } from 'rxjs';

import { CategoryLimitsApiService } from '@core/services/category-limits-api.service';
import { selectCurrentUserId } from '@store/auth/auth.selectors';

import { CategoryLimitsActions } from './category-limits.actions';
import { selectCategoryLimits } from './category-limits.selectors';

@Injectable()
export class CategoryLimitsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(CategoryLimitsApiService);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryLimitsActions.load),
      switchMap(() =>
        this.store.select(selectCurrentUserId).pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              return of(CategoryLimitsActions.loadFailure({ error: 'Нет пользователя' }));
            }

            return this.api.list(userId).pipe(
              map((limits) => CategoryLimitsActions.loadSuccess({ limits })),
              catchError((error: unknown) =>
                of(CategoryLimitsActions.loadFailure({ error: toErrorMessage(error) }))
              )
            );
          })
        )
      )
    )
  );

  upsert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryLimitsActions.upsert),
      withLatestFrom(this.store.select(selectCurrentUserId), this.store.select(selectCategoryLimits)),
      switchMap(([{ category, monthlyLimit }, userId, limits]) => {
        if (!userId) {
          return of(CategoryLimitsActions.upsertFailure({ error: 'Нет пользователя' }));
        }

        const existingLimit = limits.find((limit) => limit.category === category);

        return this.api.upsert(userId, existingLimit, category, monthlyLimit).pipe(
          map((limit) => CategoryLimitsActions.upsertSuccess({ limit })),
          catchError((error: unknown) =>
            of(CategoryLimitsActions.upsertFailure({ error: toErrorMessage(error) }))
          )
        );
      })
    )
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ошибка лимитов';
}
