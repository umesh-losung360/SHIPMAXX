import { test } from '@playwright/test';
import { PRODUCT_DATA } from '../fixtures/testdata';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetails, ProductPage } from '../pages/ProductPage';

test.describe('Shipmaxx products', () => {
  test('logs in and adds a product with complete details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const product: ProductDetails = {
      ...PRODUCT_DATA,
      sku: `PW-${Date.now()}`,
    };

    await loginPage.goto();
    await loginPage.loginWithPhoneOrEmail();
    await loginPage.enterOTP();

    await productPage.open();
    await productPage.createProduct(product);
    await productPage.expectProductVisible(product.sku, product.productName);
  });
});