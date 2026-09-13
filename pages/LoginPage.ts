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

  constructor(page: Page) {
    this.page = page;
    this.continueWithGoogleButton = page.locator('button:has-text("Continue with Google")').first();
    this.phoneOrEmailInput = page
      .locator('input[placeholder*="Phone Number or Email" i], input[type="email"], input[type="tel"], input[name*="phone" i], input[name*="email" i]')
      .first();
    this.getOtpButton = page.locator('button:has-text("Get OTP"), button:has-text("Get Otp"), button[type="submit"]').first();
    this.otpInput = page.locator('input[placeholder*="OTP" i], input[placeholder*="Enter OTP" i], input[name*="otp" i], input[maxlength="6"]').first();
    this.otpSubmitButton = page.locator('button:has-text("Verify"), button:has-text("Submit"), button:has-text("Continue"), button[type="submit"]').last();
    this.termsText = page.locator('text=/Terms & Conditions|Privacy Policy|Terms and Conditions/i').first();
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
