import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { SUBSCRIPTION_CATEGORIES, SubscriptionCategory } from '@shared/models/domain.models';
import { CategoryLabelPipe } from '@shared/pipes/category-label.pipe';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';
import {
  selectExpensesByCategory,
  selectTotalMonthlyCost
} from '@store/subscriptions/subscriptions.selectors';

@Component({
  selector: 'spm-analytics-page',
  standalone: true,
  imports: [AsyncPipe, CategoryLabelPipe, CurrencyPipe],
  template: `
    <section class="page">
      <div class="page-header">
        <h1 class="page-title">Аналитика</h1>
      </div>

      <article class="panel summary">
        <span class="muted">Total monthly</span>
        <strong>{{ totalMonthly$ | async | currency: 'USD' }}</strong>
      </article>

      @if (expenses$ | async; as expenses) {
        <section class="panel chart" aria-label="Расходы по категориям">
          @for (category of categories; track category) {
            <div class="chart-row">
              <div class="chart-label">
                <span>{{ category | categoryLabel }}</span>
                <strong>{{ expenses[category] | currency: 'USD' }}</strong>
              </div>
              <div class="bar">
                <span [style.width.%]="barWidth(expenses[category], expenses)"></span>
              </div>
            </div>
          }
        </section>
      }
    </section>
  `,
  styles: [
    `
      .summary {
        display: grid;
        gap: 0.4rem;
      }

      .summary strong {
        font-size: 2rem;
      }

      .chart {
        display: grid;
        gap: 1rem;
      }

      .chart-row {
        display: grid;
        gap: 0.45rem;
      }

      .chart-label {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly categories = SUBSCRIPTION_CATEGORIES;
  readonly expenses$ = this.store.select(selectExpensesByCategory);
  readonly totalMonthly$ = this.store.select(selectTotalMonthlyCost);

  ngOnInit(): void {
    this.store.dispatch(SubscriptionsActions.load());
  }

  barWidth(value: number, expenses: Record<SubscriptionCategory, number>): number {
    const max = Math.max(...Object.values(expenses), 1);

    return Math.round((value / max) * 100);
  }
}
