import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiButton } from '@taiga-ui/core';

import { SUBSCRIPTION_CATEGORIES, SubscriptionCategory } from '@shared/models/domain.models';
import { CategoryLabelPipe } from '@shared/pipes/category-label.pipe';
import { CategoryLimitsActions } from '@store/category-limits/category-limits.actions';
import {
  selectCategoryLimits,
  selectExceededCategoryLimits
} from '@store/category-limits/category-limits.selectors';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';

@Component({
  selector: 'spm-category-limits-page',
  standalone: true,
  imports: [AsyncPipe, CategoryLabelPipe, CurrencyPipe, ReactiveFormsModule, TuiButton],
  template: `
    <section class="page">
      <div class="page-header">
        <h1 class="page-title">Лимиты категорий</h1>
      </div>

      <section class="panel">
        <form class="form-grid" [formGroup]="form" (ngSubmit)="submit()">
          <label class="form-field">
            <span>Категория</span>
            <select formControlName="category">
              @for (category of categories; track category) {
                <option [value]="category">{{ category | categoryLabel }}</option>
              }
            </select>
          </label>

          <label class="form-field">
            <span>Месячный лимит</span>
            <input type="number" min="0" formControlName="monthlyLimit" />
          </label>

          <div class="actions form-actions">
            <button tuiButton type="submit" [disabled]="form.invalid">Сохранить лимит</button>
          </div>
        </form>
      </section>

      @if (exceededLimits$ | async; as exceededLimits) {
        @if (exceededLimits.length) {
          <section class="panel warning-box">
            @for (limit of exceededLimits; track limit.id) {
              <p class="warning">
                {{ limit.category | categoryLabel }} выше лимита
                {{ limit.monthlyLimit | currency: 'USD' }}.
              </p>
            }
          </section>
        }
      }

      <section class="panel">
        @if (limits$ | async; as limits) {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Лимит</th>
                </tr>
              </thead>
              <tbody>
                @for (limit of limits; track limit.id) {
                  <tr>
                    <td>{{ limit.category | categoryLabel }}</td>
                    <td>{{ limit.monthlyLimit | currency: 'USD' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="2">Лимитов пока нет.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </section>
  `,
  styles: [
    `
      .form-actions {
        align-self: end;
      }

      .warning-box {
        border-color: #fbbf24;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryLimitsPageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);

  readonly categories = SUBSCRIPTION_CATEGORIES;
  readonly limits$ = this.store.select(selectCategoryLimits);
  readonly exceededLimits$ = this.store.select(selectExceededCategoryLimits);

  readonly form = this.fb.group({
    category: ['entertainment' as SubscriptionCategory, Validators.required],
    monthlyLimit: [30, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.store.dispatch(CategoryLimitsActions.load());
    this.store.dispatch(SubscriptionsActions.load());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.store.dispatch(CategoryLimitsActions.upsert(this.form.getRawValue()));
  }
}
