# Deploy

Проект состоит из двух частей:

- Frontend: Angular static app.
- Mock API: `json-server` с `mock-server/db.json`.

## 1. Mock API на Render

1. Запушьте проект в GitHub.
2. Откройте Render Dashboard.
3. Создайте Blueprint или Web Service из этого репозитория.
4. Если создаете Web Service вручную:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm run api:prod`
5. После деплоя Render даст URL вида:

```text
https://subscription-payments-manager-api.onrender.com
```

Проверьте endpoint:

```text
https://subscription-payments-manager-api.onrender.com/users
```

## 2. Frontend на Vercel

1. В `src/environments/environment.prod.ts` замените `apiUrl` на URL Render API.
2. Запушьте изменения в GitHub.
3. Импортируйте репозиторий в Vercel.
4. Vercel прочитает `vercel.json`:
   - Build Command: `npm run build`
   - Output Directory: `dist/subscription-payments-manager/browser`
5. После деплоя откройте Vercel URL.

## 3. Проверка

Тестовый пользователь:

```text
demo@example.com / demo123
```

Если login не работает, проверьте:

- frontend использует правильный `apiUrl`;
- Render API просыпается после cold start;
- endpoint `/users` открывается в браузере.
