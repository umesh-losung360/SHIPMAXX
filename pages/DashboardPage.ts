import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly sidebar: Locator;
  readonly logoutButton: Locator;
  readonly overviewCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: /dashboard|overview|home/i }).or(page.getByText(/dashboard|overview|home/i)).first();
    this.sidebar = page.locator('aside, nav, [role="navigation"]').filter({ has: page.getByRole('link') }).first();
    this.logoutButton = page.getByRole('button', { name: /logout|log out/i }).or(page.getByRole('link', { name: /logout|log out/i })).first();
    this.overviewCard = page.getByRole('heading', { name: /overview|dashboard|analytics/i }).or(page.getByText(/overview|dashboard|analytics/i)).first();
  }

  async waitForLoad() {
    await expect(this.page).toHaveURL(/dashboard|home|overview/i, { timeout: 30000 });
    await expect(this.dashboardHeading).toBeVisible({ timeout: 30000 });
  }

  async isLoaded() {
    await this.waitForLoad();
  }

  async logout() {
    await this.logoutButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.logoutButton.click();
  }
}
