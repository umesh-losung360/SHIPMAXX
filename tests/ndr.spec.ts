import { test } from '@playwright/test';
import { NDRPage } from '../pages/NDRPage';

test.describe('Shipmaxx NDR', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('opens NDR and displays the recovery workspace', async ({ page }) => {
    const ndrPage = new NDRPage(page);

    await ndrPage.open();
    await ndrPage.expectStatusTabsVisible();
    await ndrPage.expectPaginationVisible();
  });

  test('filters NDR records by AWB without changing record state', async ({ page }) => {
    const ndrPage = new NDRPage(page);

    await ndrPage.open();
    await ndrPage.searchByAwb('15299418000185');
    await ndrPage.clearSearch();
    await ndrPage.clearFilters();
  });

  test('switches between NDR report and management tabs', async ({ page }) => {
    const ndrPage = new NDRPage(page);

    await ndrPage.open();
    await ndrPage.selectMainTab('NDR Reports');
    await ndrPage.selectMainTab('Manage NDR');
    await ndrPage.selectStatusTab('Action Taken');
    await ndrPage.selectStatusTab('Action Required');
  });
});
