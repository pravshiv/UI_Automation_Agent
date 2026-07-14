/**
 * SSOLoginHelper — SSO / OAuth / Azure AD / Okta login abstraction.
 *
 * Usage in tests/auth.setup.ts:
 *   const sso = new SSOLoginHelper(page)
 *   await sso.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!)
 *   await page.context().storageState({ path: '.auth/user.json' })
 *
 * Supports:
 *   - Standard username/password forms
 *   - Azure AD (Microsoft login)
 *   - Okta SAML / OIDC
 *   - ADFS
 *   - SSO redirect flows
 */
import { Page, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const AUTH_STATE_PATH = process.env.AUTH_STATE_PATH ?? '.auth/user.json'

export class SSOLoginHelper {
  constructor(private page: Page) {}

  /**
   * Universal login — detects the login form type and authenticates.
   * Falls back to a generic username + password strategy if SSO is not detected.
   */
  async login(username: string, password: string): Promise<void> {
    // Wait for a login form or SSO redirect
    await this.page.waitForLoadState('domcontentloaded')

    const isMicrosoft = await this.page.locator('[data-bind*="otherIdp"], [id="i0116"]').isVisible().catch(() => false)
    const isOkta      = await this.page.locator('[data-se="o-form-input-username"]').isVisible().catch(() => false)
    const isAdfs      = await this.page.locator('#userNameInput').isVisible().catch(() => false)

    if (isMicrosoft) {
      await this.loginMicrosoft(username, password)
    } else if (isOkta) {
      await this.loginOkta(username, password)
    } else if (isAdfs) {
      await this.loginAdfs(username, password)
    } else {
      await this.loginGeneric(username, password)
    }
  }

  private async loginGeneric(username: string, password: string): Promise<void> {
    const userField = this.page.getByRole('textbox', { name: /user(name)?|email|login/i })
      .or(this.page.locator('[name="username"],[name="email"],[name="login"],[type="email"]').first())
    const passField = this.page.locator('[name="password"],[type="password"]').first()

    await userField.fill(username)
    await passField.fill(password)
    await this.page.getByRole('button', { name: /sign.?in|log.?in|submit|login/i }).click()
    await this.page.waitForLoadState('networkidle')
  }

  private async loginMicrosoft(username: string, password: string): Promise<void> {
    await this.page.locator('#i0116').fill(username)
    await this.page.locator('#idSIButton9').click()
    await this.page.locator('#i0118').waitFor({ state: 'visible' })
    await this.page.locator('#i0118').fill(password)
    await this.page.locator('#idSIButton9').click()
    // Handle "Stay signed in?" prompt
    const stay = this.page.locator('#idSIButton9')
    if (await stay.isVisible({ timeout: 5000 }).catch(() => false)) await stay.click()
    await this.page.waitForLoadState('networkidle')
  }

  private async loginOkta(username: string, password: string): Promise<void> {
    await this.page.locator('[data-se="o-form-input-username"]').fill(username)
    await this.page.getByRole('button', { name: 'Next' }).click()
    await this.page.locator('[data-se="o-form-input-credentials.passcode"]').fill(password)
    await this.page.getByRole('button', { name: 'Sign In' }).click()
    await this.page.waitForLoadState('networkidle')
  }

  private async loginAdfs(username: string, password: string): Promise<void> {
    await this.page.locator('#userNameInput').fill(username)
    await this.page.locator('#passwordInput').fill(password)
    await this.page.locator('#submitButton').click()
    await this.page.waitForLoadState('networkidle')
  }

  /** Save auth state to disk for test session reuse */
  async saveState(): Promise<void> {
    const dir = path.dirname(AUTH_STATE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    await this.page.context().storageState({ path: AUTH_STATE_PATH })
  }
}
