import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiButton } from '@taiga-ui/core';

import { AppNotification } from '@shared/models/domain.models';
import { NotificationsActions } from '@store/notifications/notifications.actions';
import {
  selectNotifications,
  selectNotificationsLoading
} from '@store/notifications/notifications.selectors';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';

@Component({
  selector: 'spm-notifications-page',
  standalone: true,
  imports: [AsyncPipe, TuiButton],
  template: `
    <section class="page">
      <div class="page-header">
        <h1 class="page-title">Уведомления</h1>
        <button tuiButton type="button" appearance="secondary" (click)="generate()">
          Проверить списания
        </button>
      </div>

      <section class="panel">
        @if (loading$ | async) {
          <p class="muted">Загрузка...</p>
        }

        @if (notifications$ | async; as notifications) {
          <div class="notifications">
            @for (notification of notifications; track notification.id) {
              <article class="notification" [class.unread]="!notification.isRead">
                <p>{{ notification.message }}</p>
                @if (!notification.isRead) {
                  <button
                    tuiButton
                    size="xs"
                    appearance="flat"
                    type="button"
                    (click)="markRead(notification)"
                  >
                    Прочитано
                  </button>
                }
              </article>
            } @empty {
              <p class="muted">Уведомлений пока нет.</p>
            }
          </div>
        }
      </section>
    </section>
  `,
  styles: [
    `
      .notifications {
        display: grid;
        gap: 0.75rem;
      }

      .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.875rem;
        border: 1px solid var(--spm-border);
        border-radius: 8px;
      }

      .notification.unread {
        border-color: #2dd4bf;
        background: #f0fdfa;
      }

      .notification p {
        margin: 0;
      }

      @media (max-width: 560px) {
        .notification {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly notifications$ = this.store.select(selectNotifications);
  readonly loading$ = this.store.select(selectNotificationsLoading);

  ngOnInit(): void {
    this.store.dispatch(NotificationsActions.load());
    this.store.dispatch(SubscriptionsActions.load());
  }

  generate(): void {
    this.store.dispatch(NotificationsActions.generateDue());
  }

  markRead(notification: AppNotification): void {
    this.store.dispatch(NotificationsActions.markRead({ notification }));
  }
}
