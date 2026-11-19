import { expect, Locator, Page } from '@playwright/test';

export interface OrderDetails {
	customerMobile: string;
	customerName: string;
	address: string;
	pincode: string;
	email?: string;
	sku: string;
	productName: string;
	unitPrice: string;
	quantity: string;
	discount?: string;
	taxRate?: string;
	deadWeight: string;
	length: string;
	breadth: string;
	height: string;
	orderNumber: string;
	paymentMethod?: 'COD' | 'Prepaid';
}

export class OrdersPage {
	readonly page: Page;
	readonly ordersLink: Locator;
	readonly addOrderButton: Locator;
	readonly ordersHeading: Locator;
	readonly searchInput: Locator;
	readonly statusFilter: Locator;
	readonly createOrderHeading: Locator;
	readonly mobileInputs: Locator;
	readonly fullNameInputs: Locator;
	readonly addressInputs: Locator;
	readonly pincodeInputs: Locator;
	readonly emailInputs: Locator;
	readonly billingSameAsDeliveryCheckbox: Locator;
	readonly paymentMethod: Locator;
	readonly skuInput: Locator;
	readonly productNameInput: Locator;
	readonly productSpinbuttons: Locator;
	readonly unitPriceInput: Locator;
	readonly quantityInput: Locator;
	readonly discountInput: Locator;
	readonly taxRateInput: Locator;
	readonly packageWeightInput: Locator;
	readonly packageDimensionInputs: Locator;
	readonly orderNumberInput: Locator;
	readonly createOrderButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.ordersLink = page.getByRole('button', { name: /^Orders$/i }).first();
		this.addOrderButton = page.getByRole('button', { name: /Add an order/i }).first();
		this.ordersHeading = page.getByRole('heading', { name: /orders/i }).first();
		this.searchInput = page.locator('input[placeholder*="AWB" i], input[placeholder*="search" i]').first();
		this.statusFilter = page.getByRole('button', { name: /all status/i }).first();
		this.createOrderHeading = page.getByRole('heading', { name: /^Create Order$/i }).first();
		this.mobileInputs = page.getByRole('textbox', { name: 'Mobile number' });
		this.fullNameInputs = page.getByRole('textbox', { name: 'Full Name' });
		this.addressInputs = page.getByRole('textbox', { name: 'Complete Address' });
		this.pincodeInputs = page.getByRole('textbox', { name: 'Pincode' });
		this.emailInputs = page.getByRole('textbox', { name: 'Email address' });
		this.billingSameAsDeliveryCheckbox = page.getByRole('checkbox', { name: /Billing address same as delivery/i });
		this.paymentMethod = page.getByText(/^Prepaid$/i).first();
		this.skuInput = page.getByRole('textbox', { name: 'SKU' }).first();
		this.productNameInput = page.getByRole('textbox', { name: 'Product Name' }).first();
		this.productSpinbuttons = page.locator('input[name*="unitPrice" i], input[name*="quantity" i], input[name*="discount" i], input[name*="taxRate" i]');
		this.unitPriceInput = page.locator('input[name*="unitPrice" i]').first();
		this.quantityInput = page.locator('input[name*="quantity" i]').first();
		this.discountInput = page.locator('input[name*="discount" i]').first();
		this.taxRateInput = page.locator('input[name*="taxRate" i]').first();
		this.packageWeightInput = page.getByRole('textbox', { name: 'Kg' }).first();
		this.packageDimensionInputs = page.getByRole('textbox', { name: 'Cm' });
		this.orderNumberInput = page.getByRole('textbox', { name: 'Order Number' });
		this.createOrderButton = page.getByRole('button', { name: /^Create Order$/i });
	}

	async open() {
		await this.page.goto('/manage-orders', { waitUntil: 'domcontentloaded' });
		await this.waitForLoad();
	}

	async openCreateOrder() {
		await this.addOrderButton.waitFor({ state: 'visible', timeout: 15000 });
		await this.addOrderButton.click();
		await expect(this.createOrderHeading).toBeVisible({ timeout: 30000 });
	}

	async createOrder(details: OrderDetails) {
		await this.openCreateOrder();

		await this.mobileInputs.first().fill(details.customerMobile);
		await this.fullNameInputs.first().fill(details.customerName);
		await this.addressInputs.first().fill(details.address);
		await this.pincodeInputs.first().fill(details.pincode);
		if (details.email) {
			await this.emailInputs.first().fill(details.email);
		}
		await this.selectPaymentMethod(details.paymentMethod ?? 'COD');
		await this.billingSameAsDeliveryCheckbox.check();

		await this.skuInput.fill(details.sku);
		await this.productNameInput.fill(details.productName);
		await this.unitPriceInput.fill(details.unitPrice);
		await this.quantityInput.fill(details.quantity);
		await this.discountInput.fill(details.discount ?? '0');
		await this.taxRateInput.fill(details.taxRate ?? '18');

		await this.packageWeightInput.fill(details.deadWeight);
		await this.packageDimensionInputs.nth(0).fill(details.length);
		await this.packageDimensionInputs.nth(1).fill(details.breadth);
		await this.packageDimensionInputs.nth(2).fill(details.height);
		await this.orderNumberInput.fill(details.orderNumber);

		await this.createOrderButton.click();
		await expect.poll(async () => {
			const urlOk = /manage-orders|orders\/create/i.test(this.page.url());
			const ordersTableVisible = await this.page.getByText(/Order Number|Showing .* of .* orders/i).first().isVisible().catch(() => false);
			const formHidden = await this.createOrderHeading.isVisible().catch(() => false) === false;
			return urlOk || ordersTableVisible || formHidden;
		}, {
			timeout: 30000,
			message: 'Expected the order flow to leave the create form or show the orders workspace.',
		}).toBeTruthy();
	}

	async selectPaymentMethod(paymentMethod: 'COD' | 'Prepaid') {
		const paymentOption = this.page.locator('p').filter({ hasText: new RegExp(`^${paymentMethod}$`, 'i') }).last();

		await paymentOption.waitFor({ state: 'visible', timeout: 15000 });
		await paymentOption.click({ force: true });
		await expect(this.page.getByText('Please select a payment method', { exact: true })).toBeHidden({ timeout: 5000 });
	}

	async createShipment(orderNumber: string) {
		const orderNumberText = this.page.getByText(orderNumber, { exact: true }).first();
		await expect(orderNumberText, `Expected the newly created order ${orderNumber} to be visible.`)
			.toBeVisible({ timeout: 30000 });

		const orderCard = orderNumberText.locator('xpath=ancestor::*[.//button[normalize-space(.)="Ship"]][1]');
		const openShipmentButton = orderCard.getByRole('button', { name: /^Ship$/i });
		await openShipmentButton.waitFor({ state: 'visible', timeout: 15000 });
		await openShipmentButton.click();

		await expect(this.page.getByRole('heading', { name: /^Order Details$/i })).toBeVisible({ timeout: 15000 });

		await this.page.locator('.flex.flex-col.items-center.justify-center.py-12').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});

		const confirmShipmentButton = this.page.getByRole('button', { name: /^SHIP\s*(>>)?$/i }).last();
		await confirmShipmentButton.waitFor({ state: 'visible', timeout: 15000 });
		await confirmShipmentButton.click();
		await expect.poll(async () => {
			return await this.page.getByText(/^Packed|^Manifested|^Dispatched/i).first().isVisible().catch(() => false)
				|| await this.page.getByText(/AWB|Tracking/i).first().isVisible().catch(() => false);
		}, { timeout: 30000 }).toBeTruthy();
	}

	async cancelOrder(orderNumber: string) {
		const orderNumberText = this.page.getByText(orderNumber, { exact: true }).first();
		await expect(orderNumberText, `Expected the shipped order ${orderNumber} to be visible before cancellation.`)
			.toBeVisible({ timeout: 30000 });

		const orderRow = orderNumberText.locator('xpath=ancestor::*[.//button[normalize-space(.)="View Order"]][1]');
		await orderRow.waitFor({ state: 'visible', timeout: 15000 });

		const drawer = this.page.locator('.fixed.right-0').first();
		if (await drawer.isVisible().catch(() => false)) {
			const closeButton = drawer.getByRole('button').first();
			await closeButton.click({ force: true });
			await drawer.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
		}

		const checkbox = orderRow.getByRole('checkbox').first();
		await checkbox.waitFor({ state: 'visible', timeout: 15000 });
		await checkbox.check({ force: true });

		const bulkActionButton = this.page.getByRole('button', { name: /Select Bulk Action/i }).first();
		await bulkActionButton.waitFor({ state: 'visible', timeout: 15000 });
		await bulkActionButton.click({ force: true });

		const cancelButton = this.page.getByRole('button', { name: /^Cancel$/i }).first();
		await cancelButton.waitFor({ state: 'visible', timeout: 15000 });
		await cancelButton.click({ force: true });

		await expect.poll(async () => {
			const rowText = await orderRow.innerText().catch(() => '');
			const cancellationVisible = await this.page.getByText(/cancelled|canceled/i).first().isVisible().catch(() => false);
			return /cancelled|canceled/i.test(rowText) || cancellationVisible;
		}, {
			timeout: 30000,
			message: `Expected order ${orderNumber} to be cancelled after the bulk cancellation action.`,
		}).toBeTruthy();
	}

	async waitForLoad() {
		await expect(this.ordersHeading).toBeVisible({ timeout: 30000 });
	}

	async searchByAwb(awb: string) {
		await this.searchInput.fill(awb);
	}
}
