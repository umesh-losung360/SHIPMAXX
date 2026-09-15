import { test } from '@playwright/test';
import { ORDER_DATA } from '../fixtures/testdata';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage, OrderDetails } from '../pages/OrdersPage';

test.describe('Shipmaxx orders', () => {
	test('opens the orders page', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const ordersPage = new OrdersPage(page);

		await loginPage.goto();
		await loginPage.loginWithPhoneOrEmail();
		await loginPage.enterOTP();
		await ordersPage.open();
	});

	test('creates an order with customer, product, and package details', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const ordersPage = new OrdersPage(page);
		const order: OrderDetails = {
			...ORDER_DATA,
			orderNumber: `PW-ORDER-${Date.now()}`,
		};

		await loginPage.goto();
		await loginPage.loginWithPhoneOrEmail();
		await loginPage.enterOTP();
		await ordersPage.createOrder(order);
	});
});
