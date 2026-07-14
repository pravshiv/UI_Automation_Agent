/**
 * auth.setup.ts — Playwright global auth setup.
 * Runs once before tests that depend on the 'setup' project.
 * Saves browser storage state to .auth/user.json for session reuse.
 *
 * Run independently: npx playwright test tests/auth.setup.ts --project=setup
 */
import { test as setup, expect } from '@playwright/test'
import { SSOLoginHelper } from '../utils/ssoLoginHelper'
import { config } from '../utils/envConfig'
import path from 'path'

const AUTH_STATE_PATH = config.authStatePath

setup('authenticate', async ({ page }) => {
  if (config.skipAuth) {
    console.log('[Auth Setup] SKIP_AUTH=true — skipping login.')
    return
  }
  // Evidence-based: no credentials configured ⇒ this app flow doesn't log in
  // (or the recorded spec performs its own login). Never invent an auth step
  // the user didn't record.
  if (!config.username || !config.password) {
    console.log('[Auth Setup] No TEST_USERNAME/TEST_PASSWORD set — skipping login.')
    return
  }

  await page.goto(config.baseUrl)

  const sso = new SSOLoginHelper(page)
  await sso.login(config.username, config.password)

  // Verify login succeeded — adjust the selector to match your app's post-login indicator
  await expect(
    page.locator('[data-testid="user-menu"], [aria-label="User menu"], .user-avatar').first(),
  ).toBeVisible({ timeout: 30_000 })

  await sso.saveState()
  console.log(`[Auth Setup] Auth state saved to ${AUTH_STATE_PATH}`)
})
