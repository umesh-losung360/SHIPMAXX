import { expect, Locator, Page } from '@playwright/test';

export interface ProductDetails {
	sku: string;
	productName: string;
	saleChannel: string;
	unitPrice: string;
	discount?: string;
	taxRate?: string;
	description: string;
	deadWeight: string;
	length: string;
	breadth: string;
	height: string;
}

export class ProductPage {
	readonly page: Page;
	readonly productsButton: Locator;
	readonly productsHeading: Locator;
	readonly createProductButton: Locator;
	readonly productDialog: Locator;
	readonly skuInput: Locator;
	readonly productNameInput: Locator;
	readonly saleChannelSelect: Locator;
	readonly unitPriceInput: Locator;
	readonly discountInput: Locator;
	readonly taxRateInput: Locator;
	readonly descriptionInput: Locator;
	readonly deadWeightInput: Locator;
	readonly lengthInput: Locator;
	readonly breadthInput: Locator;
	readonly heightInput: Locator;
	readonly nextButton: Locator;
	readonly inventoryWarehouseSelect: Locator;
	readonly inventoryIncreaseButton: Locator;
	readonly addInventoryButton: Locator;
	readonly saveProductButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.productsButton = page.getByRole('button', { name: /^Products$/i }).first();
		this.productsHeading = page.getByRole('heading', { name: /^Products$/i }).first();
		this.createProductButton = page.getByRole('button', { name: /Create Product/i }).first();
		this.productDialog = page.getByRole('dialog');
		this.skuInput = this.productDialog.getByRole('textbox', { name: /SKU/i });
		this.productNameInput = this.productDialog.getByRole('textbox', { name: /Product Name/i });
		this.saleChannelSelect = this.productDialog.getByRole('combobox').first();
		this.unitPriceInput = this.productDialog.getByRole('textbox', { name: /Unit Price/i });
		this.discountInput = this.productDialog.getByRole('textbox', { name: /^Discount$/i });
		this.taxRateInput = this.productDialog.getByRole('textbox', { name: /Tax Rate/i });
		this.descriptionInput = this.productDialog.getByRole('textbox', { name: /^Description$/i });
		this.deadWeightInput = this.productDialog.getByRole('textbox', { name: /Dead Weight/i });
		this.lengthInput = this.productDialog.getByRole('textbox', { name: /^Length/i });
		this.breadthInput = this.productDialog.getByRole('textbox', { name: /^Breadth/i });
		this.heightInput = this.productDialog.getByRole('textbox', { name: /^Height/i });
		this.nextButton = this.productDialog.getByRole('button', { name: /Next/i });

		const inventoryPanel = this.productDialog.getByRole('tabpanel', { name: /Inventory/i });
		this.inventoryWarehouseSelect = inventoryPanel.getByRole('combobox');
		this.inventoryIncreaseButton = inventoryPanel.getByRole('spinbutton').locator('..').getByRole('button').last();
		this.addInventoryButton = inventoryPanel.getByRole('button', { name: /^\+ Add$/ });
		this.saveProductButton = this.productDialog.getByRole('button', { name: /Save Product/i });
	}

	async open() {
		if (!/\/products(?:$|\?)/i.test(this.page.url())) {
			await this.productsButton.click();
		}
		await expect(this.productsHeading).toBeVisible({ timeout: 30000 });
	}

	async createProduct(details: ProductDetails) {
		await this.createProductButton.click();
		await expect(this.productDialog).toBeVisible({ timeout: 15000 });

		await this.skuInput.fill(details.sku);
		await this.productNameInput.fill(details.productName);
		await this.selectSaleChannel(details.saleChannel);
		await this.unitPriceInput.fill(details.unitPrice);
		await this.discountInput.fill(details.discount ?? '');
		await this.taxRateInput.fill(details.taxRate ?? '');
		await this.descriptionInput.fill(details.description);
		await this.deadWeightInput.fill(details.deadWeight);
		await this.lengthInput.fill(details.length);
		await this.breadthInput.fill(details.breadth);
		await this.heightInput.fill(details.height);

		await this.nextButton.click();
		await this.addInventoryUnits(10);
		await this.addInventoryButton.click();
		await this.saveProductButton.click();
		await expect(this.productDialog).toBeHidden({ timeout: 30000 });
	}

	async ensureProduct(details: ProductDetails) {
		const existingProduct = this.page.getByText(`SKU: ${details.sku}`, { exact: true }).first();

		if (await expect(existingProduct).toBeVisible({ timeout: 5000 }).then(() => true).catch(() => false)) {
			return;
		}

		await this.createProduct(details);
	}

	async addInventoryUnits(units: number) {
		await this.inventoryWarehouseSelect.click();
		await this.page.getByRole('option').first().click();
		await expect(this.inventoryIncreaseButton).toBeVisible({ timeout: 15000 });

		for (let index = 0; index < units; index++) {
			await this.inventoryIncreaseButton.click();
		}

		await expect(this.addInventoryButton).toBeEnabled({ timeout: 15000 });
	}

	async selectSaleChannel(saleChannel: string) {
		if (await this.saleChannelSelect.getByText(saleChannel, { exact: true }).isVisible().catch(() => false)) {
			return;
		}

		await this.saleChannelSelect.click();
		await this.page.getByRole('option', { name: saleChannel, exact: true }).click();
	}

	async expectProductVisible(sku: string, productName: string) {
		await expect(this.page.getByText(`SKU: ${sku}`, { exact: true }).first()).toBeVisible({ timeout: 30000 });
		await expect(this.page.getByText(productName, { exact: true }).first()).toBeVisible({ timeout: 30000 });
	}
}
