import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiButton } from '@taiga-ui/core';

import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { AuthActions } from '@store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '@store/auth/auth.selectors';

@Component({
  selector: 'spm-login-page',
  standalone: true,
  imports: [AsyncPipe, AutofocusDirective, ReactiveFormsModule, TuiButton],
  template: `
    <main class="login">
      <section class="login-card" aria-labelledby="login-title">
        <div>
          <p class="eyebrow">Subscription Payments Manager</p>
          <h1 id="login-title">Вход</h1>
          <p class="muted">Тестовый аккаунт: demo&#64;example.com / demo123</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label class="form-field">
            <span>Email</span>
            <input spmAutofocus type="email" autocomplete="email" formControlName="email" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <small>Введите корректный email</small>
            }
          </label>

          <label class="form-field">
            <span>Пароль</span>
            <input type="password" autocomplete="current-password" formControlName="password" />
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <small>Минимум 4 символа</small>
            }
          </label>

          @if (error$ | async; as error) {
            <p class="error">{{ error }}</p>
          }

          <button
            tuiButton
            type="submit"
            [disabled]="form.invalid || ((loading$ | async) ?? false)"
          >
            {{ (loading$ | async) ? 'Входим...' : 'Войти' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
      .login {
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 1rem;
        background:
          linear-gradient(rgba(16, 32, 29, 0.76), rgba(16, 32, 29, 0.76)),
          url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80')
            center/cover;
      }

      .login-card {
        display: grid;
        width: min(100%, 28rem);
        gap: 1.25rem;
        padding: 1.5rem;
        border-radius: 8px;
        background: #fff;
      }

      .eyebrow {
        margin: 0 0 0.3rem;
        color: var(--spm-accent);
        font-weight: 700;
      }

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      form {
        display: grid;
        gap: 1rem;
      }

      .form-field span {
        color: var(--spm-muted);
        font-size: 0.875rem;
      }

      .error {
        margin: 0;
        color: var(--spm-danger);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);

  readonly form = this.fb.group({
    email: ['demo@example.com', [Validators.required, Validators.email]],
    password: ['demo123', [Validators.required, Validators.minLength(4)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.store.dispatch(AuthActions.login({ credentials: this.form.getRawValue() }));
  }
}
