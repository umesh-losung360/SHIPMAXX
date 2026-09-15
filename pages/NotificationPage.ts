import { expect, Locator, Page } from '@playwright/test';

export class NotificationPage {
	readonly page: Page;
	readonly notificationButton: Locator;
	readonly notificationPanel: Locator;

	constructor(page: Page) {
		this.page = page;
		this.notificationButton = page.locator('button[aria-label*="notification" i], [data-testid*="notification" i]').first();
		this.notificationPanel = page.locator('[role="dialog"], [role="menu"], [data-testid*="notification" i]').last();
	}

	async open() {
		await this.notificationButton.waitFor({ state: 'visible', timeout: 15000 });
		await this.notificationButton.click();
		await this.waitForLoad();
	}

	async waitForLoad() {
		await expect(this.notificationPanel).toBeVisible({ timeout: 15000 });
	}
}
