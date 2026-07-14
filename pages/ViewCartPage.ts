import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class ViewCartPage extends BasePage {
  readonly signupLoginLink: Locator;

  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
  }

  async gotoViewCartPage() {
    await this.goto('/view_cart');
    await this.verifyOnPage('/view_cart');
  }

  async clickSignupLoginLink() {
    await expect(this.signupLoginLink).toBeVisible();
    await this.signupLoginLink.click();
    await this.page.waitForLoadState('networkidle'); // Wait for navigation to complete
    await this.verifyOnPage('/login'); // Assertion from trace: toHaveURL after click
  }
}
