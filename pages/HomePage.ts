import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productsLink: Locator;
  readonly featuresItemsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.productsLink = page.getByRole('link', { name: ' Products' });
    this.featuresItemsHeading = page.getByRole('heading', { name: 'FEATURES ITEMS' });
  }

  async navigateToHomePage(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyOnHomePage(): Promise<void> {
    await expect(this.page).toHaveURL('/');
    await expect(this.featuresItemsHeading).toBeVisible();
  }

  async clickProductsLink(): Promise<void> {
    await expect(this.productsLink).toBeVisible();
    await this.productsLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
