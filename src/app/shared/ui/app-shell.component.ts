import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiButton } from '@taiga-ui/core';

import { AuthActions } from '@store/auth/auth.actions';
import { selectCurrentUser } from '@store/auth/auth.selectors';
import { selectUnreadNotificationsCount } from '@store/notifications/notifications.selectors';

@Component({
  selector: 'spm-app-shell',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, TuiButton],
  template: `
    <div class="shell">
      <aside class="sidebar" aria-label="Основная навигация">
        <a class="brand" routerLink="/dashboard">
          <span class="brand-mark">S</span>
          <span>SubPay</span>
        </a>

        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">Дашборд</a>
          <a routerLink="/subscriptions" routerLinkActive="active">Подписки</a>
          <a routerLink="/analytics" routerLinkActive="active">Аналитика</a>
          <a routerLink="/category-limits" routerLinkActive="active">Лимиты</a>
          <a routerLink="/notifications" routerLinkActive="active">
            Уведомления
            @if ((unreadCount$ | async) ?? 0; as unreadCount) {
              <span class="badge">{{ unreadCount }}</span>
            }
          </a>
        </nav>
      </aside>

      <div class="content">
        <header class="topbar">
          <span class="muted">{{ (user$ | async)?.email }}</span>
          <button tuiButton size="s" appearance="flat" type="button" (click)="logout()">
            Выйти
          </button>
        </header>

        <main>
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .shell {
        display: grid;
        grid-template-columns: 16rem minmax(0, 1fr);
        min-height: 100vh;
      }

      .sidebar {
        display: grid;
        align-content: start;
        gap: 1.5rem;
        padding: 1.25rem;
        background: #10201d;
        color: #fff;
      }

      .brand {
        display: inline-flex;
        gap: 0.75rem;
        align-items: center;
        color: #fff;
        font-weight: 700;
        text-decoration: none;
      }

      .brand-mark {
        display: inline-grid;
        width: 2.25rem;
        height: 2.25rem;
        place-items: center;
        border-radius: 8px;
        background: #2dd4bf;
        color: #0f172a;
      }

      nav {
        display: grid;
        gap: 0.35rem;
      }

      nav a {
        display: flex;
        min-height: 2.5rem;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.75rem;
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.82);
        text-decoration: none;
      }

      nav a.active,
      nav a:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
      }

      .badge {
        min-width: 1.5rem;
        padding: 0.15rem 0.45rem;
        border-radius: 999px;
        background: #f97316;
        color: #fff;
        text-align: center;
        font-size: 0.75rem;
      }

      .content {
        min-width: 0;
      }

      .topbar {
        display: flex;
        min-height: 4rem;
        align-items: center;
        justify-content: flex-end;
        gap: 1rem;
        padding: 0 1.5rem;
        border-bottom: 1px solid var(--spm-border);
        background: #fff;
      }

      main {
        padding: 1.5rem;
      }

      @media (max-width: 860px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: sticky;
          top: 0;
          z-index: 5;
          gap: 1rem;
        }

        nav {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        nav a {
          justify-content: center;
          font-size: 0.85rem;
        }
      }

      @media (max-width: 560px) {
        nav {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .topbar {
          justify-content: space-between;
          padding: 0 1rem;
        }

        main {
          padding: 1rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly store = inject(Store);

  readonly user$ = this.store.select(selectCurrentUser);
  readonly unreadCount$ = this.store.select(selectUnreadNotificationsCount);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
