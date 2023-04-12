// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to page
  await page.goto('https://patreon-17bd2.web.app/login');
  // Login
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('111@test.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('111111');
  // Press Login
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/');
  await page.context().storageState({ path: authFile });
});