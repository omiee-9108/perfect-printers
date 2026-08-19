import { test, expect } from '@playwright/test';

test.describe('CUJ 2: Security Gate & Role-Based Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.goto('/erp');
  });

  test('should display plant security gate when unauthenticated', async ({ page }) => {
    await expect(page.getByText(/Plant Authentication Gateway/i)).toBeVisible();
    await expect(page.getByTestId('erp-login-username')).toBeVisible();
    await expect(page.getByTestId('erp-login-submit')).toBeVisible();
  });

  test('should authenticate successfully with valid Admin credentials', async ({ page }) => {
    await page.getByTestId('erp-login-username').fill('admin_om');
    await page.getByTestId('erp-login-password').fill('perfect123');
    await page.getByTestId('erp-login-submit').click();

    // Verify redirected into ERP dashboard
    await expect(page.getByTestId('erp-tab-job-order')).toBeVisible();
    await expect(page.getByText(/Active Production Board/i)).toBeVisible();
  });

  test('should log in instantly with 1-Click Role Profiles', async ({ page }) => {
    // Click Sales Profile
    const salesProfileBtn = page.getByRole('button', { name: /Mahesh Joshi/i }).or(page.getByText(/Mahesh Joshi/i));
    await salesProfileBtn.first().click();

    // Verify logged in
    await expect(page.getByTestId('erp-tab-job-order')).toBeVisible();
    await expect(page.getByText(/Mahesh Joshi/i).first()).toBeVisible();
  });

  test('should show error with attempts countdown on invalid password', async ({ page }) => {
    await page.getByTestId('erp-login-username').fill('admin_om');
    await page.getByTestId('erp-login-password').fill('wrongpass999');
    await page.getByTestId('erp-login-submit').click();

    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
    await expect(page.getByText(/4 attempts remaining/i)).toBeVisible();
  });

  test('should trigger 30-second lockout after 5 failed attempts', async ({ page }) => {
    const submitBtn = page.getByTestId('erp-login-submit');
    const userField = page.getByTestId('erp-login-username');
    const passField = page.getByTestId('erp-login-password');

    for (let i = 0; i < 5; i++) {
      await userField.fill('admin_om');
      await passField.fill(`badpass_${i}`);
      await submitBtn.click();
      await page.waitForTimeout(500);
    }

    // Verify lockout message appears
    await expect(page.getByText(/Terminal locked for 30 seconds/i).or(page.getByText(/Terminal temporarily locked/i))).toBeVisible();
  });

  test('should log out cleanly and return to security gate', async ({ page }) => {
    // Quick login as Admin
    await page.getByText(/Om Upadhye/i).first().click();
    await expect(page.getByTestId('erp-tab-job-order')).toBeVisible();

    // Click Sign Out using data-testid
    await page.getByTestId('erp-logout-btn').click();

    // Verify returned to login gate
    await expect(page.getByText(/Plant Authentication Gateway/i)).toBeVisible();
  });
});
