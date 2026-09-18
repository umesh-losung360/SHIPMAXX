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
		this.productSpinbuttons = page.getByRole('spinbutton');
		this.packageWeightInput = page.getByRole('textbox', { name: 'Kg' }).first();
		this.packageDimensionInputs = page.getByRole('textbox', { name: 'Cm' });
		this.orderNumberInput = page.getByRole('textbox', { name: 'Order Number' });
		this.createOrderButton = page.getByRole('button', { name: /^Create Order$/i });
	}

	async open() {
		await this.ordersLink.waitFor({ state: 'visible', timeout: 15000 });
		await this.ordersLink.click();
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
		await this.productSpinbuttons.nth(0).fill(details.unitPrice);
		await this.productSpinbuttons.nth(1).fill(details.quantity);
		await this.productSpinbuttons.nth(2).fill(details.discount ?? '0');
		await this.productSpinbuttons.nth(3).fill(details.taxRate ?? '0');

		await this.packageWeightInput.fill(details.deadWeight);
		await this.packageDimensionInputs.nth(0).fill(details.length);
		await this.packageDimensionInputs.nth(1).fill(details.breadth);
		await this.packageDimensionInputs.nth(2).fill(details.height);
		await this.orderNumberInput.fill(details.orderNumber);

		await this.createOrderButton.click();
		await expect(this.createOrderHeading).toBeHidden({ timeout: 30000 });
	}

	async selectPaymentMethod(paymentMethod: 'COD' | 'Prepaid') {
		const paymentOption = this.page.locator('p').filter({ hasText: new RegExp(`^${paymentMethod}$`, 'i') }).last();

		await paymentOption.waitFor({ state: 'visible', timeout: 15000 });
		await paymentOption.click({ force: true });
		await expect(this.page.getByText('Please select a payment method', { exact: true })).toBeHidden({ timeout: 5000 });
	}

	async createShipment() {
		const shipButton = this.page.getByRole('button', { name: /^Ship$/i }).first();

		await shipButton.waitFor({ state: 'visible', timeout: 15000 });
		await shipButton.click();
	}

	async waitForLoad() {
		await expect(this.ordersHeading).toBeVisible({ timeout: 30000 });
	}

	async searchByAwb(awb: string) {
		await this.searchInput.fill(awb);
	}
}
