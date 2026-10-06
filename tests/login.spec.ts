import { expect, test } from '@playwright/test';
import { TEST_CREDENTIALS } from '../fixtures/testdata';
import { LoginPage } from '../pages/LoginPage';

test.describe('Shipmaxx login flow', () => {
  test('user can request OTP with the provided phone number', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectTermsVisible();
    await loginPage.loginWithPhoneOrEmail();

    await expect(page.getByText(/We've sent a 6-digit OTP to/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Resend code in \d+:\d+/i)).toBeVisible({ timeout: 20000 });

    await loginPage.enterOTP();
    await expect(page.getByRole('heading', { name: 'Welcome back, Amarjit!' })).toBeVisible({ timeout: 20000 });
  });

  test('TC_003 - login with valid credentials redirects to dashboard/home', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    test.skip(!(await loginPage.hasPasswordLoginForm()), 'Password-based login form is not available in this environment');

    await loginPage.loginWithEmailAndPassword(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    await loginPage.expectSuccessfulLoginRedirect();
  });

  test('TC_004 - login with invalid email or username shows invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    test.skip(!(await loginPage.hasPasswordLoginForm()), 'Password-based login form is not available in this environment');

    await loginPage.loginWithInvalidEmail();
    await loginPage.expectInvalidCredentialsError();
  });

  test('TC_005 - login with invalid password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    test.skip(!(await loginPage.hasPasswordLoginForm()), 'Password-based login form is not available in this environment');

    await loginPage.loginWithInvalidPassword();
    await loginPage.expectInvalidCredentialsError();
  });

  test('TC_007 - login without email/username shows required validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    test.skip(!(await loginPage.hasPasswordLoginForm()), 'Password-based login form is not available in this environment');

    await loginPage.submitEmptyEmailField();
    await loginPage.expectRequiredFieldError('email');
  });

  test('TC_008 - login without password shows required validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    test.skip(!(await loginPage.hasPasswordLoginForm()), 'Password-based login form is not available in this environment');

    await loginPage.submitEmptyPasswordField();
    await loginPage.expectRequiredFieldError('password');
  });
});
