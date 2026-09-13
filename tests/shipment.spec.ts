import { test } from '@playwright/test';

test('open Shipmaxx QA website', async ({ page }) => {
  await page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForLoadState('networkidle');
});
