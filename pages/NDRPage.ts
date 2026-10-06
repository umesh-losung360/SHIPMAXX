import { expect, Locator, Page } from '@playwright/test';

export type NDRMainTab = 'NDR Reports' | 'Manage NDR';
export type NDRStatusTab = 'Action Required' | 'Action Taken' | 'Delivered' | 'RTO';

export class NDRPage {
  readonly page: Page;
  readonly ndrNavButton: Locator;
  readonly heading: Locator;
  readonly bulkUploadButton: Locator;
  readonly dateRangeButton: Locator;
  readonly searchInput: Locator;
  readonly courierPartnerFilter: Locator;
  readonly ndrReasonFilter: Locator;
  readonly ndrAttemptFilter: Locator;
  readonly actionTakenByFilter: Locator;
  readonly clearFiltersButton: Locator;
  readonly recordsTable: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ndrNavButton = page.getByRole('button', { name: /^NDR$/i }).first();
    this.heading = page.getByText(/Non-Delivery Recovery|NDR/i).first();
    this.bulkUploadButton = page.getByRole('button', { name: /Bulk Upload/i }).first();
    this.dateRangeButton = page.locator('button').filter({ hasText: /\d{1,2} \w{3}.*\d{1,2} \w{3}/i }).first();
    this.searchInput = page.getByPlaceholder(/AWB No\. Search/i).first();
    this.courierPartnerFilter = page.getByRole('button', { name: /Courier Partner/i }).first();
    this.ndrReasonFilter = page.getByRole('button', { name: /NDR Reason/i }).first();
    this.ndrAttemptFilter = page.getByRole('button', { name: /NDR Attempt/i }).first();
    this.actionTakenByFilter = page.getByRole('button', { name: /Action Taken By/i }).first();
    this.clearFiltersButton = page.getByText('Clear all', { exact: true }).first();
    this.recordsTable = page.locator('main').first();
    this.nextPageButton = page.getByRole('button', { name: /Next/i }).last();
    this.previousPageButton = page.getByRole('button', { name: /Prev/i }).last();
  }

  async open() {
    await this.page.goto('/ndr?page=1&limit=20', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await this.waitForLoad();
  }

  async waitForLoad() {
    await expect(this.page).toHaveURL(/\/ndr/i, { timeout: 30000 });
    await expect.poll(async () => {
      const headingVisible = await this.heading.isVisible().catch(() => false);
      const tableVisible = await this.page.locator('table').first().isVisible().catch(() => false);
      const manageVisible = await this.page.getByText('Manage NDR', { exact: true }).first().isVisible().catch(() => false);
      const recordsVisible = await this.page.getByText(/Showing .* of .* records/i).first().isVisible().catch(() => false);
      return headingVisible || tableVisible || manageVisible || recordsVisible;
    }, {
      timeout: 30000,
      message: 'Expected the NDR workspace to finish loading.',
    }).toBeTruthy();
  }

  async selectMainTab(tab: NDRMainTab) {
    const tabLocator = this.page.getByText(tab, { exact: true }).first();
    if (await tabLocator.isVisible().catch(() => false)) {
      await tabLocator.click();
      return;
    }
  }

  async selectStatusTab(tab: NDRStatusTab) {
    const tabLocator = this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first();
    if (await tabLocator.isVisible().catch(() => false)) {
      await tabLocator.click();
      return;
    }
  }

  async searchByAwb(value: string) {
    await this.searchInput.fill(value);
  }

  async clearSearch() {
    await this.searchInput.fill('');
  }

  async clearFilters() {
    await this.clearFiltersButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.clearFiltersButton.click();
  }

  async expectStatusTabsVisible() {
    for (const tab of ['Action Required', 'Action Taken', 'Delivered', 'RTO'] as NDRStatusTab[]) {
      const buttonVisible = await this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first().isVisible().catch(() => false);
      const textVisible = await this.page.getByText(new RegExp(tab, 'i')).first().isVisible().catch(() => false);
      if (buttonVisible || textVisible) {
        continue;
      }
    }
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText(/Showing \d+[-–]\d+ of \d+ records/i).first()).toBeVisible({ timeout: 15000 });
  }
}
