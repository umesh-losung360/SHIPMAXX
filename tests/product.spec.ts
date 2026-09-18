import { test } from '@playwright/test';
import { PRODUCT_DATA } from '../fixtures/testdata';
import { ProductDetails, ProductPage } from '../pages/ProductPage';

test.describe('Shipmaxx products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('logs in and adds a product with complete details', async ({ page }) => {
    const productPage = new ProductPage(page);
    const product: ProductDetails = {
      ...PRODUCT_DATA,
    };

    await productPage.open();
    await productPage.ensureProduct(product);
    await productPage.expectProductVisible(product.sku, product.productName);
  });
});