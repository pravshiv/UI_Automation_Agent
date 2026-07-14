import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class ProductsPage extends BasePage {
  readonly cartLink: Locator;

  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
    this.cartLink = page.getByRole("link", { name: "Cart" });
  }

  async gotoProductsPage() {
    await this.goto('/products');
    await this.verifyOnPage('/products');
  }

  async clickCartLink() {
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle'); // Wait for navigation to complete
    await this.verifyOnPage('/view_cart'); // Assertion from trace: toHaveURL after click
  }
}
