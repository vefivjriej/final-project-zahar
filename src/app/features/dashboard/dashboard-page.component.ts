import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { CategoryLabelPipe } from '@shared/pipes/category-label.pipe';
import { CategoryLimitsActions } from '@store/category-limits/category-limits.actions';
import { selectExceededCategoryLimits } from '@store/category-limits/category-limits.selectors';
import { NotificationsActions } from '@store/notifications/notifications.actions';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';
import {
  selectActiveSubscriptions,
  selectTotalMonthlyCost,
  selectUpcomingPayments
} from '@store/subscriptions/subscriptions.selectors';

@Component({
  selector: 'spm-dashboard-page',
  standalone: true,
  imports: [AsyncPipe, CategoryLabelPipe, CurrencyPipe, DatePipe],
  template: `
    <section class="page">
      <div class="page-header">
        <h1 class="page-title">Дашборд</h1>
      </div>

      <div class="grid grid-3">
        <article class="panel stat">
          <span class="muted">Расходы в месяц</span>
          <strong>{{ totalMonthly$ | async | currency: 'USD' : 'symbol' : '1.2-2' }}</strong>
        </article>
        <article class="panel stat">
          <span class="muted">Активные подписки</span>
          <strong>{{ (activeSubscriptions$ | async)?.length ?? 0 }}</strong>
        </article>
        <article class="panel stat">
          <span class="muted">Превышения лимитов</span>
          <strong>{{ (exceededLimits$ | async)?.length ?? 0 }}</strong>
        </article>
      </div>

      <section class="panel">
        <h2>Ближайшие платежи</h2>
        @if (upcomingPayments$ | async; as payments) {
          @if (payments.length) {
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  @for (payment of payments; track payment.id) {
                    <tr>
                      <td>{{ payment.name }}</td>
                      <td>{{ payment.category | categoryLabel }}</td>
                      <td>{{ payment.nextPaymentDate | date: 'dd.MM.yyyy' }}</td>
                      <td>{{ payment.price | currency: 'USD' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="muted">В ближайшие 14 дней платежей нет.</p>
          }
        }
      </section>

      @if (exceededLimits$ | async; as limits) {
        @if (limits.length) {
          <section class="panel warning-panel">
            <h2>Лимиты превышены</h2>
            @for (limit of limits; track limit.id) {
              <p class="warning">
                {{ limit.category | categoryLabel }}: лимит
                {{ limit.monthlyLimit | currency: 'USD' }} превышен
              </p>
            }
          </section>
        }
      }
    </section>
  `,
  styles: [
    `
      h2 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
      }

      .stat {
        display: grid;
        gap: 0.4rem;
      }

      .stat strong {
        font-size: 2rem;
        line-height: 1;
      }

      .warning-panel {
        border-color: #fbbf24;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly totalMonthly$ = this.store.select(selectTotalMonthlyCost);
  readonly activeSubscriptions$ = this.store.select(selectActiveSubscriptions);
  readonly upcomingPayments$ = this.store.select(selectUpcomingPayments);
  readonly exceededLimits$ = this.store.select(selectExceededCategoryLimits);

  ngOnInit(): void {
    this.store.dispatch(NotificationsActions.load());
    this.store.dispatch(SubscriptionsActions.load());
    this.store.dispatch(CategoryLimitsActions.load());
  }
}
