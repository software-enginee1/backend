// auth.setup.ts
import { test as setup } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

const testUserEmail = 'test@tester.com'
const testUserPassword = 'test123'

const basePath = 'https://patreon-17bd2.web.app/'
const loginPath = 'https://patreon-17bd2.web.app/login'

setup('authenticate', async ({ page }) => {
  // Navigate to page.
  await page.goto(loginPath)
  // Login
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill(testUserEmail)
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill(testUserPassword)
  // Press Login
  await page.getByRole('button', { name: 'Login' }).click()
  // Wait for re-direct
  await page.waitForURL(basePath)
  await page.context().storageState({ path: authFile })
})
