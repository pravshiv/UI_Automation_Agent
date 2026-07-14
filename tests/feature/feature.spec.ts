import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ViewCartPage } from '../../pages/ViewCartPage';
import { LoginPage } from '../../pages/LoginPage';
import { SSOLoginHelper } from '../../utils/ssoLoginHelper'; // Assuming utils folder

test.describe('Feature: User Navigation and Login Flow', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let viewCartPage: ViewCartPage;
  let loginPage: LoginPage;
  let ssoLoginHelper: SSOLoginHelper;

  test.beforeEach(async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'https://automationexercise.com';
    homePage = new HomePage(page, baseURL);
    productsPage = new ProductsPage(page, baseURL);
    viewCartPage = new ViewCartPage(page, baseURL);
    loginPage = new LoginPage(page, baseURL);
    ssoLoginHelper = new SSOLoginHelper();
  });

  test('Verify navigation to products, cart, and login pages', async ({ page }) => {
    await allure.step('Navigate to Home Page', async () => {
      await homePage.gotoHomePage();
    });

    await allure.step('Click "Products" link from Home Page', async () => {
      await homePage.clickProductsLink();
    });

    await allure.step('Click "Full-Fledged practice website for Automation Engineers" (L7 coordinate locator)', async () => {
      await homePage.clickFullFledgedWebsiteHeading();
    });

    await allure.step('Click "Products" link again from Home Page', async () => {
      await homePage.clickProductsLink();
    });

    await allure.step('Navigate to Products Page', async () => {
      await productsPage.gotoProductsPage();
    });

    await allure.step('Click "Cart" link from Products Page', async () => {
      await productsPage.clickCartLink();
    });

    await allure.step('Navigate to View Cart Page', async () => {
      await viewCartPage.gotoViewCartPage();
    });

    await allure.step('Click "Signup / Login" link from View Cart Page', async () => {
      await viewCartPage.clickSignupLoginLink();
    });

    await allure.step('Handle SSO / Auth redirect to Login Page', async () => {
      // The click above initiated an SSO redirect to the login page.
      // We now verify the final state by checking the URL.
      await loginPage.verifyOnLoginPage();
      // If actual SSO login was required with credentials, it would look like this:
      // await ssoLoginHelper.login(page, process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!); 
      // Ensure TEST_USERNAME and TEST_PASSWORD are set in your .env file.
    });
  });
});
