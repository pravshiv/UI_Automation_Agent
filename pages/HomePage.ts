import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class HomePage extends BasePage {
  readonly productsLink: Locator;
  readonly fullFledgedWebsiteHeading: Locator;

  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
    this.productsLink = page.getByRole("link", { name: " Products" });
    // TODO: Locator 'page.locator("750,342")' is a coordinate fallback (L7). Consider finding a more robust selector if UI changes.
    this.fullFledgedWebsiteHeading = page.locator("750,342");
  }

  async gotoHomePage() {
    await this.goto('/');
    await this.verifyOnPage('automationexercise.com');
  }

  async clickProductsLink() {
    await expect(this.productsLink).toBeVisible();
    await this.productsLink.click();
    await this.page.waitForLoadState('networkidle'); // Wait for navigation to complete
    await this.verifyOnPage('/products'); // Assertion from trace: toHaveURL after click
  }

  async clickFullFledgedWebsiteHeading() {
    await expect(this.fullFledgedWebsiteHeading).toBeVisible();
    await this.fullFledgedWebsiteHeading.click();
    await this.page.waitForLoadState('networkidle'); // Ensure any potential load completes
  }
}
