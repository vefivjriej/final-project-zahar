import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  EMPTY,
  filter,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs';

import { NotificationsApiService } from '@core/services/notifications-api.service';
import { buildDueNotifications } from '@shared/utils/subscription-calculations';
import { selectCurrentUserId } from '@store/auth/auth.selectors';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';
import { selectSubscriptions } from '@store/subscriptions/subscriptions.selectors';

import { NotificationsActions } from './notifications.actions';
import { selectNotifications } from './notifications.selectors';

@Injectable()
export class NotificationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(NotificationsApiService);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.load),
      switchMap(() =>
        this.store.select(selectCurrentUserId).pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              return of(NotificationsActions.loadFailure({ error: 'Нет пользователя' }));
            }

            return this.api.list(userId).pipe(
              map((notifications) => NotificationsActions.loadSuccess({ notifications })),
              catchError((error: unknown) =>
                of(
                  NotificationsActions.loadFailure({
                    error: error instanceof Error ? error.message : 'Ошибка уведомлений'
                  })
                )
              )
            );
          })
        )
      )
    )
  );

  generateDue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.generateDue),
      withLatestFrom(
        this.store.select(selectCurrentUserId),
        this.store.select(selectSubscriptions),
        this.store.select(selectNotifications)
      ),
      switchMap(([, userId, subscriptions, notifications]) => {
        if (!userId) {
          return EMPTY;
        }

        const existingKeys = new Set(
          notifications.map((notification) => `${notification.subscriptionId}:${notification.message}`)
        );
        const newNotifications = buildDueNotifications(subscriptions, userId).filter(
          (notification) => !existingKeys.has(`${notification.subscriptionId}:${notification.message}`)
        );

        return from(newNotifications).pipe(
          mergeMap((notification) => this.api.create(notification)),
          map((notification) => NotificationsActions.createSuccess({ notification }))
        );
      })
    )
  );

  generateAfterSubscriptionsLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionsActions.loadSuccess),
      map(() => NotificationsActions.generateDue())
    )
  );

  markRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markRead),
      filter(({ notification }) => !notification.isRead),
      mergeMap(({ notification }) =>
        this.api
          .markRead(notification)
          .pipe(map((updatedNotification) =>
            NotificationsActions.markReadSuccess({ notification: updatedNotification })
          ))
      )
    )
  );
}
