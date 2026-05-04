import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiButton } from '@taiga-ui/core';

import {
  BILLING_PERIODS,
  BillingPeriod,
  CreateSubscriptionDto,
  SUBSCRIPTION_CATEGORIES,
  Subscription,
  SubscriptionCategory,
  SubscriptionStatus
} from '@shared/models/domain.models';
import { BillingPeriodLabelPipe } from '@shared/pipes/billing-period-label.pipe';
import { CategoryLabelPipe } from '@shared/pipes/category-label.pipe';
import { SubscriptionsActions } from '@store/subscriptions/subscriptions.actions';
import {
  selectFilteredSubscriptions,
  selectSubscriptionFilters,
  selectSubscriptionSort,
  selectSubscriptionsError,
  selectSubscriptionsLoading
} from '@store/subscriptions/subscriptions.selectors';

@Component({
  selector: 'spm-subscriptions-page',
  standalone: true,
  imports: [
    AsyncPipe,
    BillingPeriodLabelPipe,
    CategoryLabelPipe,
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    TuiButton
  ],
  template: `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Подписки</h1>
          <p class="muted">CRUD, фильтры, сортировка и быстрая деактивация.</p>
        </div>
        <button tuiButton type="button" appearance="secondary" (click)="resetForm()">
          Новая подписка
        </button>
      </div>

      <section class="panel">
        <h2>{{ editingSubscription() ? 'Редактирование' : 'Новая подписка' }}</h2>
        <form class="form-grid" [formGroup]="form" (ngSubmit)="submit()">
          <label class="form-field">
            <span>Название</span>
            <input data-testid="subscription-name" formControlName="name" />
            @if (form.controls.name.touched && form.controls.name.invalid) {
              <small>Название обязательно</small>
            }
          </label>

          <label class="form-field">
            <span>Цена</span>
            <input data-testid="subscription-price" type="number" min="0.01" formControlName="price" />
            @if (form.controls.price.touched && form.controls.price.invalid) {
              <small>Цена должна быть больше 0</small>
            }
          </label>

          <label class="form-field">
            <span>Категория</span>
            <select data-testid="subscription-category" formControlName="category">
              @for (category of categories; track category) {
                <option [value]="category">{{ category | categoryLabel }}</option>
              }
            </select>
          </label>

          <label class="form-field">
            <span>Периодичность</span>
            <select formControlName="billingPeriod">
              @for (period of billingPeriods; track period) {
                <option [value]="period">{{ period | billingPeriodLabel }}</option>
              }
            </select>
          </label>

          <label class="form-field">
            <span>Следующий платеж</span>
            <input data-testid="subscription-date" type="date" formControlName="nextPaymentDate" />
          </label>

          <label class="form-field">
            <span>Уведомить за дней</span>
            <input type="number" min="0" formControlName="notifyBeforeDays" />
          </label>

          <label class="form-field">
            <span>Статус</span>
            <select formControlName="status">
              <option value="active">Активна</option>
              <option value="inactive">Неактивна</option>
            </select>
          </label>

          <div class="actions form-actions">
            <button tuiButton data-testid="save-subscription" type="submit" [disabled]="form.invalid">
              {{ editingSubscription() ? 'Сохранить' : 'Добавить' }}
            </button>
            @if (editingSubscription()) {
              <button tuiButton appearance="flat" type="button" (click)="resetForm()">Отмена</button>
            }
          </div>
        </form>
      </section>

      <section class="panel">
        <div class="filters">
          <label class="form-field">
            <span>Категория</span>
            <select
              data-testid="category-filter"
              [value]="(filters$ | async)?.category ?? 'all'"
              (change)="setCategoryFilter($event)"
            >
              <option value="all">Все</option>
              @for (category of categories; track category) {
                <option [value]="category">{{ category | categoryLabel }}</option>
              }
            </select>
          </label>

          <label class="form-field">
            <span>Статус</span>
            <select
              data-testid="status-filter"
              [value]="(filters$ | async)?.status ?? 'all'"
              (change)="setStatusFilter($event)"
            >
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </label>

          <label class="form-field">
            <span>Сортировка</span>
            <select
              data-testid="sort-select"
              [value]="(sort$ | async) ?? 'nextPaymentDate'"
              (change)="setSort($event)"
            >
              <option value="nextPaymentDate">Дата платежа</option>
              <option value="price">Цена</option>
            </select>
          </label>
        </div>

        @if (loading$ | async) {
          <p class="muted">Загрузка...</p>
        }
        @if (error$ | async; as error) {
          <p class="danger">{{ error }}</p>
        }

        @if (subscriptions$ | async; as subscriptions) {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Период</th>
                  <th>Дата</th>
                  <th>Цена</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                @for (subscription of subscriptions; track subscription.id) {
                  <tr data-testid="subscription-row">
                    <td>{{ subscription.name }}</td>
                    <td>{{ subscription.category | categoryLabel }}</td>
                    <td>{{ subscription.billingPeriod | billingPeriodLabel }}</td>
                    <td>{{ subscription.nextPaymentDate | date: 'dd.MM.yyyy' }}</td>
                    <td>{{ subscription.price | currency: 'USD' }}</td>
                    <td>
                      <span class="chip">
                        {{ subscription.status === 'active' ? 'Активна' : 'Неактивна' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button tuiButton size="xs" appearance="flat" type="button" (click)="edit(subscription)">
                          Изменить
                        </button>
                        <button
                          tuiButton
                          size="xs"
                          appearance="flat"
                          type="button"
                          (click)="toggleStatus(subscription)"
                        >
                          {{ subscription.status === 'active' ? 'Отключить' : 'Включить' }}
                        </button>
                        <button
                          tuiButton
                          size="xs"
                          appearance="flat"
                          type="button"
                          (click)="remove(subscription.id)"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7">Подписок по фильтрам нет.</td>
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
      h2 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-actions {
        align-self: end;
      }

      @media (max-width: 760px) {
        .filters {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsPageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);

  readonly categories = SUBSCRIPTION_CATEGORIES;
  readonly billingPeriods = BILLING_PERIODS;
  readonly subscriptions$ = this.store.select(selectFilteredSubscriptions);
  readonly loading$ = this.store.select(selectSubscriptionsLoading);
  readonly error$ = this.store.select(selectSubscriptionsError);
  readonly filters$ = this.store.select(selectSubscriptionFilters);
  readonly sort$ = this.store.select(selectSubscriptionSort);
  readonly editingSubscription = signal<Subscription | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    price: [1, [Validators.required, Validators.min(0.01)]],
    category: ['services' as SubscriptionCategory, Validators.required],
    billingPeriod: ['monthly' as BillingPeriod, Validators.required],
    nextPaymentDate: [todayIso(), Validators.required],
    status: ['active' as SubscriptionStatus, Validators.required],
    notifyBeforeDays: [3, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.store.dispatch(SubscriptionsActions.load());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const dto: CreateSubscriptionDto = this.form.getRawValue();
    const editing = this.editingSubscription();

    if (editing) {
      this.store.dispatch(
        SubscriptionsActions.update({
          subscription: {
            ...editing,
            ...dto
          }
        })
      );
    } else {
      this.store.dispatch(SubscriptionsActions.create({ dto }));
    }

    this.resetForm();
  }

  edit(subscription: Subscription): void {
    this.editingSubscription.set(subscription);
    this.form.setValue({
      name: subscription.name,
      price: subscription.price,
      category: subscription.category,
      billingPeriod: subscription.billingPeriod,
      nextPaymentDate: subscription.nextPaymentDate,
      status: subscription.status,
      notifyBeforeDays: subscription.notifyBeforeDays
    });
  }

  resetForm(): void {
    this.editingSubscription.set(null);
    this.form.reset({
      name: '',
      price: 1,
      category: 'services',
      billingPeriod: 'monthly',
      nextPaymentDate: todayIso(),
      status: 'active',
      notifyBeforeDays: 3
    });
  }

  toggleStatus(subscription: Subscription): void {
    this.store.dispatch(
      SubscriptionsActions.changeStatus({
        subscription,
        status: subscription.status === 'active' ? 'inactive' : 'active'
      })
    );
  }

  remove(id: string): void {
    this.store.dispatch(SubscriptionsActions.delete({ id }));
  }

  setCategoryFilter(event: Event): void {
    const value = selectValue(event);
    const category = isCategoryOrAll(value) ? value : 'all';

    this.store.dispatch(SubscriptionsActions.setFilters({ filters: { category } }));
  }

  setStatusFilter(event: Event): void {
    const value = selectValue(event);
    const status = value === 'active' || value === 'inactive' || value === 'all' ? value : 'all';

    this.store.dispatch(SubscriptionsActions.setFilters({ filters: { status } }));
  }

  setSort(event: Event): void {
    const value = selectValue(event);

    this.store.dispatch(
      SubscriptionsActions.setSort({ sort: value === 'price' ? 'price' : 'nextPaymentDate' })
    );
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function selectValue(event: Event): string {
  return event.target instanceof HTMLSelectElement ? event.target.value : '';
}

function isCategoryOrAll(value: string): value is SubscriptionCategory | 'all' {
  return value === 'all' || SUBSCRIPTION_CATEGORIES.includes(value as SubscriptionCategory);
}
