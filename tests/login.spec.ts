import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Shipmaxx login flow', () => {
  test('user can request OTP with the provided phone number', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectTermsVisible();
    await loginPage.loginWithPhoneOrEmail();

    await expect(page.getByText(/We've sent a 6-digit OTP to/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('button', { name: /Didn't receive OTP\? Resend/i })).toBeVisible({ timeout: 20000 });

    await loginPage.enterOTP();
    await expect(page.getByRole('heading', { name: 'Welcome back, Amarjit!' })).toBeVisible({ timeout: 20000 });
  });
});
