import { expect, Locator, Page } from '@playwright/test';

export class ShipmentPage {
	readonly page: Page;
	readonly trackOrderLink: Locator;
	readonly shipmentHeading: Locator;
	readonly awbInput: Locator;

	constructor(page: Page) {
		this.page = page;
		this.trackOrderLink = page.getByRole('link', { name: /track order/i }).first();
		this.shipmentHeading = page.getByRole('heading', { name: /track|shipment/i }).first();
		this.awbInput = page.locator('input[placeholder*="AWB" i], input[placeholder*="tracking" i]').first();
	}

	async open() {
		await this.trackOrderLink.waitFor({ state: 'visible', timeout: 15000 });
		await this.trackOrderLink.click();
		await this.waitForLoad();
	}

	async waitForLoad() {
		await expect(this.shipmentHeading).toBeVisible({ timeout: 30000 });
	}

	async track(awb: string) {
		await this.awbInput.fill(awb);
		await this.awbInput.press('Enter');
	}
}
