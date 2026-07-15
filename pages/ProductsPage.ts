import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly contactUsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
  }

  async verifyOnProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL('/products');
  }

  async clickContactUsLink(): Promise<void> {
    await expect(this.contactUsLink).toBeVisible();
    await this.contactUsLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
