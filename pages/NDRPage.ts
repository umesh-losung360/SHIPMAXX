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
    this.heading = page.getByRole('heading', { name: /Non-Delivery Recovery \(NDR\)/i }).first();
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
    await this.ndrNavButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.ndrNavButton.click();
    await this.waitForLoad();
  }

  async waitForLoad() {
    await expect(this.heading).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByText('Manage NDR', { exact: true }).first()).toBeVisible({ timeout: 15000 });
  }

  async selectMainTab(tab: NDRMainTab) {
    const tabLocator = this.page.getByText(tab, { exact: true }).first();
    await tabLocator.waitFor({ state: 'visible', timeout: 15000 });
    await tabLocator.click();
  }

  async selectStatusTab(tab: NDRStatusTab) {
    const tabLocator = this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first();
    await tabLocator.waitFor({ state: 'visible', timeout: 15000 });
    await tabLocator.click();
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
      await expect(this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first()).toBeVisible();
    }
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText(/Showing \d+[-–]\d+ of \d+ records/i).first()).toBeVisible({ timeout: 15000 });
  }
}
