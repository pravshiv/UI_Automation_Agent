import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactUsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyOnContactUsPage(): Promise<void> {
    await expect(this.page).toHaveURL('/contact_us');
  }
}
