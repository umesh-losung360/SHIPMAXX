import { test } from '@playwright/test';
import { ORDER_DATA, PRODUCT_DATA } from '../fixtures/testdata';
import { OrdersPage, OrderDetails } from '../pages/OrdersPage';
import { ProductDetails, ProductPage } from '../pages/ProductPage';

test('login, add product, create COD order, and create shipment', async ({ page }) => {
  await page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
    waitUntil: 'domcontentloaded',
  });

  const productPage = new ProductPage(page);
  const ordersPage = new OrdersPage(page);
  const product: ProductDetails = { ...PRODUCT_DATA };
  const order: OrderDetails = {
    ...ORDER_DATA,
    sku: product.sku,
    productName: product.productName,
    unitPrice: product.unitPrice,
    paymentMethod: 'COD',
    orderNumber: `PW-ORDER-${Date.now()}`,
  };

  await productPage.open();
  await productPage.ensureProduct(product);
  await productPage.expectProductVisible(product.sku, product.productName);

  await ordersPage.open();
  await ordersPage.createOrder(order);
  await ordersPage.createShipment();
});