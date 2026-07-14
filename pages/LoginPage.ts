import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
  }

  async gotoLoginPage() {
    await this.goto('/login');
    await this.verifyOnPage('/login');
  }

  async verifyOnLoginPage() {
    await this.verifyOnPage('/login');
    // Add more specific assertions if there were elements on the login page to verify
    // e.g., await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }
}
