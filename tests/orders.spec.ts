import { test } from '@playwright/test';
import { ORDER_DATA } from '../fixtures/testdata';
import { OrdersPage, OrderDetails } from '../pages/OrdersPage';

test.describe('Shipmaxx orders', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
			waitUntil: 'domcontentloaded',
		});
	});

	test('opens the orders page', async ({ page }) => {
		const ordersPage = new OrdersPage(page);

		await ordersPage.open();
	});

	test('creates an order with customer, product, and package details', async ({ page }) => {
		const ordersPage = new OrdersPage(page);
		const order: OrderDetails = {
			...ORDER_DATA,
			orderNumber: `PW-ORDER-${Date.now()}`,
		};

		await ordersPage.createOrder(order);
	});
});
