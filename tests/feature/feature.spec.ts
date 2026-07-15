import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ContactUsPage } from '../../pages/ContactUsPage';

test.describe('Navigation through Automation Exercise', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    contactUsPage = new ContactUsPage(page);
  });

  test('Verify navigation to Products and Contact Us pages', async () => {
    await test.step('Step 1: Navigate to the Home Page and verify', async () => {
      await homePage.navigateToHomePage();
      await homePage.verifyOnHomePage();
    });

    await test.step('Step 2: Click "Products" link and verify navigation', async () => {
      await homePage.clickProductsLink();
      await productsPage.verifyOnProductsPage();
    });

    await test.step('Step 3: Click "Contact us" link and verify navigation', async () => {
      await productsPage.clickContactUsLink();
      await contactUsPage.verifyOnContactUsPage();
    });
  });
});
