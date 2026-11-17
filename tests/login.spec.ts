import { expect, test } from '../fixtures/playwright-test';
import { TEST_CREDENTIALS } from '../fixtures/testdata';
import { LoginPage } from '../pages/LoginPage';

test.describe('Shipmaxx login flow', () => {
  test('user can sign in with OTP using the provided phone number', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectTermsVisible();
    await loginPage.loginWithPhoneOrEmail();

    await expect(page.getByText(/We've sent a 6-digit OTP to/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('button', { name: /didn't receive otp\? resend/i })).toBeVisible({
      timeout: 20000,
    });

    await loginPage.enterOTP();
    await expect(page.getByRole('heading', { name: 'Welcome back, Amarjit!' })).toBeVisible({ timeout: 20000 });
  });

  test('Get OTP is disabled until a phone number or email is entered', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expect(loginPage.phoneOrEmailInput).toBeVisible();
    await expect(loginPage.getOtpButton).toBeDisabled();
  });

  test('unknown email cannot request an OTP', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.phoneOrEmailInput.fill(TEST_CREDENTIALS.invalidEmail);
    await expect(page.getByText("User doesn't exist", { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(loginPage.getOtpButton).toBeDisabled();
  });
});
