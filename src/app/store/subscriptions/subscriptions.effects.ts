import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take, withLatestFrom } from 'rxjs';

import { SubscriptionsApiService } from '@core/services/subscriptions-api.service';
import { selectCurrentUserId } from '@store/auth/auth.selectors';

import { SubscriptionsActions } from './subscriptions.actions';

@Injectable()
export class SubscriptionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(SubscriptionsApiService);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.load),
      switchMap(() =>
        this.store.select(selectCurrentUserId).pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              return of(SubscriptionsActions.loadFailure({ error: 'Нет пользователя' }));
            }

            return this.api.list(userId).pipe(
              map((subscriptions) => SubscriptionsActions.loadSuccess({ subscriptions })),
              catchError((error: unknown) =>
                of(SubscriptionsActions.loadFailure({ error: toErrorMessage(error) }))
              )
            );
          })
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.create),
      withLatestFrom(this.store.select(selectCurrentUserId)),
      switchMap(([{ dto }, userId]) => {
        if (!userId) {
          return of(SubscriptionsActions.createFailure({ error: 'Нет пользователя' }));
        }

        return this.api.create(userId, dto).pipe(
          map((subscription) => SubscriptionsActions.createSuccess({ subscription })),
          catchError((error: unknown) =>
            of(SubscriptionsActions.createFailure({ error: toErrorMessage(error) }))
          )
        );
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.update),
      switchMap(({ subscription }) =>
        this.api.update(subscription).pipe(
          map((updatedSubscription) =>
            SubscriptionsActions.updateSuccess({ subscription: updatedSubscription })
          ),
          catchError((error: unknown) =>
            of(SubscriptionsActions.updateFailure({ error: toErrorMessage(error) }))
          )
        )
      )
    )
  );

  changeStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.changeStatus),
      switchMap(({ subscription, status }) =>
        this.api.updateStatus(subscription, status).pipe(
          map((updatedSubscription) =>
            SubscriptionsActions.updateSuccess({ subscription: updatedSubscription })
          ),
          catchError((error: unknown) =>
            of(SubscriptionsActions.updateFailure({ error: toErrorMessage(error) }))
          )
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.delete),
      switchMap(({ id }) =>
        this.api.delete(id).pipe(
          map(() => SubscriptionsActions.deleteSuccess({ id })),
          catchError((error: unknown) =>
            of(SubscriptionsActions.deleteFailure({ error: toErrorMessage(error) }))
          )
        )
      )
    )
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ошибка загрузки подписок';
}
