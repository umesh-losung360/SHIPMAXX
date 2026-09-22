import { expect, Locator, Page } from '@playwright/test';
import { TEST_CREDENTIALS } from '../fixtures/testdata';

export class LoginPage {
  readonly page: Page;
  readonly continueWithGoogleButton: Locator;
  readonly phoneOrEmailInput: Locator;
  readonly getOtpButton: Locator;
  readonly otpInput: Locator;
  readonly otpSubmitButton: Locator;
  readonly termsText: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly passwordToggleButton: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueWithGoogleButton = page.locator('button:has-text("Continue with Google")').first();
    this.phoneOrEmailInput = page
      .locator('input[placeholder*="Phone Number or Email" i], input[type="email"], input[type="tel"], input[name*="phone" i], input[name*="email" i]')
      .first();
    this.getOtpButton = page.locator('button:has-text("Get OTP"), button:has-text("Get Otp"), button[type="submit"]').first();
    this.otpInput = page.locator('input[placeholder*="OTP" i], input[placeholder*="Enter OTP" i], input[name*="otp" i], input[maxlength="6"]').first();
    this.otpSubmitButton = page.locator('button:has-text("Verify"), button:has-text("Submit"), button:has-text("Continue"), button[type="submit"]').last();
    this.emailInput = page.locator('input[type="email" i], input[name*="email" i], input[placeholder*="Email" i], input[placeholder*="Username" i], input[autocomplete="username" i]').first();
    this.passwordInput = page.locator('input[type="password" i], input[name*="password" i], input[placeholder*="Password" i], input[autocomplete="current-password" i]').first();
    this.loginButton = page.locator('button:has-text("Login"), button:has-text("Log in"), button:has-text("Sign in"), button[type="submit"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), a:has-text("Forgot password"), a:has-text("Reset password"), button:has-text("Forgot Password")').first();
    this.passwordToggleButton = page.locator('button:has-text("Show"), button:has-text("Hide"), [aria-label*="password" i], [title*="password" i]').first();
    this.termsText = page.locator('text=/Terms & Conditions|Privacy Policy|Terms and Conditions/i').first();
    this.formError = page.locator('[role="alert"], .error, .error-message, [data-error], text=/invalid|required|email|password/i').first();
  }

  async goto() {
    await this.page.goto('https://qa-2.sm-qa.shipmaxx.in/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  async loginWithPhoneOrEmail() {
    await this.phoneOrEmailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.phoneOrEmailInput.fill(TEST_CREDENTIALS.phoneNumber);
    await this.getOtpButton.click();
  }

  async hasPasswordLoginForm() {
    const emailVisible = await this.emailInput.isVisible({ timeout: 3000 }).catch(() => false);
    const passwordVisible = await this.passwordInput.isVisible({ timeout: 3000 }).catch(() => false);
    return emailVisible && passwordVisible;
  }

  async loginWithCredentials(email: string, password: string) {
    await this.page.waitForLoadState('domcontentloaded');
    if (!(await this.hasPasswordLoginForm())) {
      throw new Error('Password-based login form is not available on this page.');
    }

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    await this.loginWithCredentials(email, password);
  }

  async loginWithInvalidEmail() {
    await this.loginWithCredentials(TEST_CREDENTIALS.invalidEmail, TEST_CREDENTIALS.password);
  }

  async loginWithInvalidPassword() {
    await this.loginWithCredentials(TEST_CREDENTIALS.email, TEST_CREDENTIALS.invalidPassword);
  }

  async submitEmptyEmailField() {
    if (!(await this.hasPasswordLoginForm())) {
      throw new Error('Password-based login form is not available on this page.');
    }
    await this.emailInput.fill('');
    await this.passwordInput.fill(TEST_CREDENTIALS.password);
    await this.loginButton.click();
  }

  async submitEmptyPasswordField() {
    if (!(await this.hasPasswordLoginForm())) {
      throw new Error('Password-based login form is not available on this page.');
    }
    await this.emailInput.fill(TEST_CREDENTIALS.email);
    await this.passwordInput.fill('');
    await this.loginButton.click();
  }

  async expectSuccessfulLoginRedirect() {
    await expect(this.page).toHaveURL(/dashboard|home|overview|main/i, { timeout: 20000 });
  }

  async expectInvalidCredentialsError() {
    await expect(this.formError).toContainText(/invalid credentials|invalid username|invalid email|invalid login|wrong password|incorrect password/i);
  }

  async expectRequiredFieldError(fieldName: string) {
    const requiredText = new RegExp(`${fieldName}.*required|required.*${fieldName}`, 'i');
    await expect(this.page.locator(`text=${requiredText}`).first()).toBeVisible();
  }

  async togglePasswordVisibility() {
    if (await this.passwordToggleButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.passwordToggleButton.click();
    }
  }

  async expectPasswordVisible() {
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
  }

  async expectPasswordHidden() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async expectPasswordVisibilityToggle() {
    await this.expectPasswordVisible();
  }

  async expectForgotPasswordLink() {
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async loginWithGoogle() {
    await this.continueWithGoogleButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.continueWithGoogleButton.click();
  }

  async enterOTP() {
    await this.otpInput.waitFor({ state: 'visible', timeout: 15000 });
    const otp = TEST_CREDENTIALS.otp;
    const otpFields = this.page.locator('input[name^="otp-"][maxlength="1"]:visible');

    if (await otpFields.count() >= otp.length) {
      for (let index = 0; index < otp.length; index++) {
        await otpFields.nth(index).fill(otp[index]);
      }
      for (let index = 0; index < otp.length; index++) {
        await expect(otpFields.nth(index)).toHaveValue(otp[index]);
      }
    } else {
      await this.otpInput.fill(otp);
      await expect(this.otpInput).toHaveValue(otp);
    }

    if (!(await this.otpSubmitButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.otpInput.press('Enter');
      return;
    }

    if (await this.otpSubmitButton.isDisabled().catch(() => true)) {
      await this.otpInput.press('Enter');
      return;
    }

    await this.otpSubmitButton.click();
  }

  async expectTermsVisible() {
    await expect(this.termsText).toBeVisible();
  }
}
