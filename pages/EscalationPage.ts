import { expect, Locator, Page } from '@playwright/test';

export type EscalationType = 'Pickup' | 'Delivery' | 'Pickup Delay' | 'Delivery Delay';

export class EscalationPage {
  readonly page: Page;
  readonly escalationsButton: Locator;
  readonly pickupDelayButton: Locator;
  readonly deliveryDelayButton: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.escalationsButton = page.getByRole('button', { name: /^(Escalations|Overview|Pickup|Delivery)$/i }).first();
    this.pickupDelayButton = page.getByRole('button', { name: /^Pickup$/i }).first();
    this.deliveryDelayButton = page.getByRole('button', { name: /^Delivery$/i }).first();
    this.mainContent = page.locator('main').first();
  }

  async expand() {
    const pickupVisible = await this.pickupDelayButton.isVisible().catch(() => false);
    const deliveryVisible = await this.deliveryDelayButton.isVisible().catch(() => false);

    if (!pickupVisible || !deliveryVisible) {
      const overview = this.page.getByRole('button', { name: /^Overview$/i }).first();
      if (await overview.isVisible().catch(() => false)) {
        await overview.click();
      }
    }

    await expect(this.pickupDelayButton).toBeVisible({ timeout: 15000 });
    await expect(this.deliveryDelayButton).toBeVisible({ timeout: 15000 });
  }

  async open(type: EscalationType) {
    await this.expand();
    const normalizedType = type.toLowerCase().includes('pickup') ? 'Pickup' : 'Delivery';
    const pageButton = normalizedType === 'Pickup' ? this.pickupDelayButton : this.deliveryDelayButton;
    await pageButton.click();
    await expect(pageButton).toBeVisible({ timeout: 15000 });
  }

  async expectNavigationVisible() {
    await this.expand();
    await expect(this.pickupDelayButton).toBeVisible();
    await expect(this.deliveryDelayButton).toBeVisible();
  }

  async expectPageLoaded(type: EscalationType) {
    const normalizedType = type.toLowerCase().includes('pickup') ? 'Pickup' : 'Delivery';
    const target = normalizedType === 'Pickup' ? this.pickupDelayButton : this.deliveryDelayButton;
    await expect(target).toBeVisible({ timeout: 15000 });
  }
}
