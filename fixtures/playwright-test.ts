import { expect, test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const appDownloadPopup = page
      .locator('[role="dialog"][data-state="open"]')
      .filter({ has: page.locator('a[href*="play.google.com/store/apps"]') });

    await page.addLocatorHandler(appDownloadPopup, async popup => {
      await popup.getByRole('button', { name: /close/i }).click();
    });

    await use(page);
  },
});

export { expect };
