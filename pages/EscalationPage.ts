import { expect, Locator, Page } from '@playwright/test';

export type EscalationType = 'Pickup Delay' | 'Delivery Delay';

export class EscalationPage {
  readonly page: Page;
  readonly escalationsButton: Locator;
  readonly pickupDelayButton: Locator;
  readonly deliveryDelayButton: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.escalationsButton = page.getByRole('button', { name: /^Escalations$/i }).first();
    this.pickupDelayButton = page.getByRole('button', { name: /^Pickup Delay$/i }).first();
    this.deliveryDelayButton = page.getByRole('button', { name: /^Delivery Delay$/i }).first();
    this.mainContent = page.locator('main').first();
  }

  async expand() {
    await this.escalationsButton.waitFor({ state: 'visible', timeout: 15000 });

    if (!(await this.pickupDelayButton.isVisible().catch(() => false))) {
      await this.escalationsButton.click();
    }

    await expect(this.pickupDelayButton).toBeVisible({ timeout: 15000 });
    await expect(this.deliveryDelayButton).toBeVisible({ timeout: 15000 });
  }

  async open(type: EscalationType) {
    await this.expand();
    const pageButton = type === 'Pickup Delay' ? this.pickupDelayButton : this.deliveryDelayButton;
    await pageButton.click();
    await expect(this.mainContent).toBeVisible({ timeout: 30000 });
  }

  async expectNavigationVisible() {
    await this.expand();
    await expect(this.pickupDelayButton).toBeVisible();
    await expect(this.deliveryDelayButton).toBeVisible();
  }

  async expectPageLoaded(type: EscalationType) {
    await expect(this.page).toHaveURL(/pickup|delivery|escalat/i, { timeout: 30000 });
    await expect(this.mainContent).toContainText(new RegExp(type.replace(' ', '\\s+'), 'i'));
  }
}
