# План проекта

## Цель

Сделать учебный production-ready Angular-проект, который показывает архитектуру, state management, авторизацию, тестирование, mock API, CI/CD и понятный пользовательский сценарий управления подписками.

## Основные сценарии

- Пользователь входит в систему.
- Пользователь видит дашборд с расходами, активными подписками и ближайшими платежами.
- Пользователь создает, редактирует, удаляет и деактивирует подписки.
- Пользователь фильтрует и сортирует подписки.
- Пользователь анализирует месячные расходы по категориям.
- Пользователь задает лимиты категорий и видит предупреждения при превышении.
- Пользователь получает уведомления перед оплатой и отмечает их прочитанными.

## Этапы

1. Каркас Angular 21: strict TypeScript, standalone, lazy routes, конфиги качества.
2. Core-слой: API, авторизация, token storage, interceptor, guards.
3. Shared-слой: модели, pipes, directives, pure utils.
4. Store: NgRx actions, reducers, selectors, effects.
5. Features: auth, dashboard, subscriptions, analytics, category limits, notifications.
6. Mock API: json-server seed и endpoints.
7. Тесты: Jest для бизнес-логики/core, Playwright для ключевых сценариев.
8. CI/CD: lint, test, build, e2e, deploy placeholder.

## Риски

- Mock API не заменяет полноценный backend и не должен хранить реальные пароли.
- json-server не обеспечивает настоящую авторизацию, поэтому token flow учебный.
- Версии Angular 21 и Taiga UI 4+ нужно синхронизировать при установке зависимостей.
- Для production-деплоя нужен реальный backend, refresh tokens, HTTPS и серверная валидация.
