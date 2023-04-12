// tests/example.spec.ts
import { test } from '@playwright/test';

const testUserName = "tester"
const basePath = 'https://patreon-17bd2.web.app/'
const loginPath = 'https://patreon-17bd2.web.app/login'

// test('Login & Setup should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.goto(basePath);
//   await page.waitForURL(basePath);
// });

// test('Logout should success', async ({ page }) => {
//   // Logout
//   await page.goto(basePath);
//   await page.getByText('Logout').click();
//   // Wait for re-direct
//   await page.waitForURL(loginPath);
// });

// test('Register should success', async ({ page }) => {
//   const randomUser = Math.random().toString(36).substring(2, 12);
//   // Logout
//   await page.goto(basePath);
//   await page.getByText('Logout').click();
//   // Wait for re-direct to login page
//   await page.waitForURL(loginPath);
//   // Fill in the Register Form
//   await page.getByText('Register').click();
//   await page.getByLabel('Name').click();
//   await page.getByLabel('Name').fill(randomUser);
//   await page.getByLabel('Email').click();
//   await page.getByLabel('Email').fill(`${randomUser}@test.com`);
//   await page.getByLabel('Password').fill('test123');
//   // Register
//   await page.getByRole('button', { name: 'Register' }).click();
//   // Wait for re-direct to home page
// });

// test('Search and Navigate should success', async ({ page }) => {
//   // Wait for re-direct
//   await page.goto(basePath);
//   await page.getByRole('link', { name: 'Search' }).click();
//   await page.getByPlaceholder('       Search for user').click();
//   await page.getByPlaceholder('       Search for user').fill(testUserName);
//   await page.getByRole('link', { name: testUserName, exact: true }).click();
//   await page.waitForURL(`${basePath}/profile/${testUserName}`);
// });

test('Post should success', async ({ page }) => { //TODO: FIX ME, LOCATOR WITH POSTED CONTENT
   const randomNum = Math.floor(Math.random() * 100001); 
   const commentText = `test comment - ${randomNum}`
  // Wait for re-direct
  await page.goto(basePath);
  await page.waitForURL(basePath);
  await page.getByPlaceholder('What is on your mind?').click();
  await page.getByPlaceholder('What is on your mind?').fill(commentText);
  await page.getByRole('button').first().click();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1
  // Reload Page
  await page.reload()
  await page.getByText(commentText).click();

});

test('Like dashboard post should success', async ({ page }) => {
  // Wait for re-direct
  await page.goto(basePath);

});

test('Like profile post should success', async ({ page }) => {});

test('Unlike should success', async ({ page }) => {
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/');
});

test('Follow should success', async ({ page }) => {
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/');
});

test('Unfollow should success', async ({ page }) => {
  // Wait for re-direct
  await page.waitForURL('https://patreon-17bd2.web.app/');
});

