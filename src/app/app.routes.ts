import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { publicOnlyGuard } from '@core/guards/public-only.guard';
import { AppShellComponent } from '@shared/ui/app-shell.component';

export const appRoutes: Routes = [
  {
    path: 'auth/login',
    canActivate: [publicOnlyGuard],
    loadComponent: () =>
      import('@features/auth/login-page.component').then((module) => module.LoginPageComponent)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent
          )
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('@features/subscriptions/subscriptions-page.component').then(
            (module) => module.SubscriptionsPageComponent
          )
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('@features/analytics/analytics-page.component').then(
            (module) => module.AnalyticsPageComponent
          )
      },
      {
        path: 'category-limits',
        loadComponent: () =>
          import('@features/category-limits/category-limits-page.component').then(
            (module) => module.CategoryLimitsPageComponent
          )
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('@features/notifications/notifications-page.component').then(
            (module) => module.NotificationsPageComponent
          )
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
