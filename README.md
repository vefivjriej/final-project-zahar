# Менеджер подписок и регулярных платежей

Production-ready учебный проект на Angular 21 для контроля подписок, регулярных платежей, уведомлений, лимитов и аналитики расходов.

## Стек

- Angular 21, TypeScript strict mode, standalone components, lazy routes
- Taiga UI 4+
- NgRx Store, Effects, Selectors
- RxJS, HttpClient interceptor, auth guard
- Mock API: json-server
- Jest для unit-тестов
- Playwright для e2e
- ESLint, Prettier, Stylelint
- GitHub Actions CI/CD

## Запуск

```bash
npm install
npm run dev
```

Приложение: `http://localhost:4200`
Mock API: `http://localhost:3000`

Тестовый пользователь:

```text
demo@example.com / demo123
```

## Команды

```bash
npm run start       # Angular dev server
npm run api         # json-server
npm run dev         # app + mock API
npm run test        # Jest
npm run e2e         # Playwright
npm run lint        # ESLint + Stylelint
npm run build       # production build
```

## Структура

```text
src/app
  core
    auth
    guards
    interceptors
    services
  shared
    directives
    models
    pipes
    ui
    utils
  features
    auth
    dashboard
    subscriptions
    analytics
    category-limits
    notifications
  store
    auth
    subscriptions
    category-limits
    notifications
```

## Деплой

CI собирает production artifact. Рекомендуемый учебный деплой:

- Mock API: Render Web Service, `npm run api:prod`.
- Frontend: Vercel static Angular app.

Подробные шаги описаны в `docs/deploy.md`.

## Архитектурные решения

- Авторизация хранит токен и пользователя в `localStorage`.
- Interceptor добавляет `Authorization: Bearer <token>`.
- Guard защищает приватный shell.
- Данные разделяются по `userId` на уровне API-запросов.
- Бизнес-логика расчетов вынесена в `shared/utils` и покрыта unit-тестами.
- UI-компоненты держат только форму, отображение и dispatch action.
- Состояние подписок, пользователя, лимитов и уведомлений хранится в NgRx.
