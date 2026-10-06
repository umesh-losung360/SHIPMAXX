import { test } from '@playwright/test';
import { EscalationPage } from '../pages/EscalationPage';

test.describe('Shipmaxx escalations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
  });

  test('displays Pickup Delay and Delivery Delay navigation', async ({ page }) => {
    const escalationPage = new EscalationPage(page);

    await escalationPage.expectNavigationVisible();
  });

  test('opens Pickup Delay', async ({ page }) => {
    const escalationPage = new EscalationPage(page);

    await escalationPage.open('Pickup Delay');
    await escalationPage.expectPageLoaded('Pickup Delay');
  });

  test('opens Delivery Delay', async ({ page }) => {
    const escalationPage = new EscalationPage(page);

    await escalationPage.open('Delivery Delay');
    await escalationPage.expectPageLoaded('Delivery Delay');
  });
});
