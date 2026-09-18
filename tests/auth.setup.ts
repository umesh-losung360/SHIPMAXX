import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate once', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithPhoneOrEmail();
  await loginPage.enterOTP();

  await page.getByRole('heading', { name: 'Welcome back, Amarjit!' }).waitFor({
    state: 'visible',
    timeout: 20000,
  });
  await page.context().storageState({ path: authFile });
});
