import { expect, test } from '@playwright/test';

test.describe('subscription manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('demo@example.com');
    await page.getByLabel('Пароль').fill('demo123');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('login shows dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Дашборд' })).toBeVisible();
  });

  test('creates subscription', async ({ page }) => {
    await page.getByRole('link', { name: 'Подписки' }).click();
    await page.getByTestId('subscription-name').fill('YouTube Premium');
    await page.getByTestId('subscription-price').fill('13.99');
    await page.getByTestId('subscription-category').selectOption('entertainment');
    await page.getByTestId('subscription-date').fill('2026-05-20');
    await page.getByTestId('save-subscription').click();

    await expect(
      page.getByTestId('subscription-row').filter({ hasText: 'YouTube Premium' })
    ).toBeVisible();
  });

  test('filters subscriptions by category', async ({ page }) => {
    await page.getByRole('link', { name: 'Подписки' }).click();
    await page.getByTestId('category-filter').selectOption('education');

    await expect(
      page.getByTestId('subscription-row').filter({ hasText: 'Coursera' })
    ).toBeVisible();
  });
});
