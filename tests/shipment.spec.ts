import { test } from '@playwright/test';

test('open Shipmaxx QA website', async ({ page }) => {
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForLoadState('networkidle');
});
