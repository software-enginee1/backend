// tests/example.spec.ts
import { test } from '@playwright/test';

const basePath = 'https://patreon-17bd2.web.app/'

test('Login & Setup should success', async ({ page }) => {
  // Wait for re-direct
  await page.goto('https://patreon-17bd2.web.app/');
  await page.waitForURL('https://patreon-17bd2.web.app/');
});

test('Logout should success', async ({ page }) => {
  // Logout
  await page.goto('https://patreon-17bd2.web.app/');
  await page.getByText('Logout').click();
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/login');
});

test('Register should success', async ({ page }) => {
  const randomUser = Math.random().toString(36).substring(2, 12);
  // Logout
  await page.goto('https://patreon-17bd2.web.app/');
  await page.getByText('Logout').click();
  // Wait for re-direct to login page
  await page.waitForURL('https://patreon-17bd2.web.app/login');
  // Fill in the Register Form
  await page.getByText('Register').click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill(randomUser);
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill(`${randomUser}@test.com`);
  await page.getByLabel('Password').fill('testest');
  // Register
  await page.getByRole('button', { name: 'Register' }).click();
  // Wait for re-direct to home page
});

test('Search and Navigate should success', async ({ page }) => {
  // Wait for re-direct
  await page.goto('https://patreon-17bd2.web.app/');
  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByPlaceholder('       Search for user').click();
  await page.getByPlaceholder('       Search for user').fill('test');
  await page.getByRole('link', { name: 'test', exact: true }).click();
  await page.waitForURL('https://patreon-17bd2.web.app/profile/test');
});

test('Post should success', async ({ page }) => { //TODO: FIX ME, LOCATOR WITH POSTED CONTENT
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/');
  await page.getByPlaceholder('What is on your mind?').click();
  await page.getByPlaceholder('What is on your mind?').fill('test comment');
  await page.getByRole('button').click();
  // ADD ME
});

// test('Like should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.waitForURL('https://patreon-17bd2.web.app/');
// });

// test('Unlike should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.waitForURL('https://patreon-17bd2.web.app/');
// });

// test('Follow should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.waitForURL('https://patreon-17bd2.web.app/');
// });

// test('Unfollow should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.waitForURL('https://patreon-17bd2.web.app/');
// });

