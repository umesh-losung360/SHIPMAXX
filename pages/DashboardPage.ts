import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly sidebar: Locator;
  readonly logoutButton: Locator;
  readonly overviewCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = page.locator('h1, h2').filter({ hasText: /dashboard|overview|home/i }).first();
    this.sidebar = page.locator('aside, nav, [role="navigation"]').first();
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Log out"), a:has-text("Logout")').first();
    this.overviewCard = page.getByText(/overview|dashboard|analytics/i).first();
  }

  async waitForLoad() {
    await this.dashboardHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(/dashboard|home|overview/i);
    await expect(this.dashboardHeading).toBeVisible();
  }

  async logout() {
    await this.logoutButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.logoutButton.click();
  }
}
