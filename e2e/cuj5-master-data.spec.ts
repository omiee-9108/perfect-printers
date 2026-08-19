import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 5: Master Data Management & Sanitized CSV Export', () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.getByTestId('erp-tab-master-data').click();
    await expect(page.getByText(/Master Data Portal/i)).toBeVisible();
  });

  test('should display and switch between all 6 master data tabs', async ({ adminPage: page }) => {
    // Check all tabs exist
    await expect(page.getByRole('button', { name: /Customers/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Jobs/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Machines/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Processes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Employees/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Admins/i })).toBeVisible();

    // Click Machines tab
    await page.getByRole('button', { name: /Machines/i }).click();
    await expect(page.getByText(/Heidelberg Speedmaster CD 102/i)).toBeVisible();

    // Click Jobs tab
    await page.getByRole('button', { name: /Jobs/i }).click();
    await expect(page.getByText(/Paracetamol 500mg/i).first()).toBeVisible();
  });

  test('should trigger sanitized CSV download when clicking Export to CSV', async ({ adminPage: page }) => {
    // Switch to Customers tab
    await page.getByRole('button', { name: /Customers/i }).click();

    // Wait for download event when clicking Export
    const downloadPromise = page.waitForEvent('download');
    const exportBtn = page.getByRole('button', { name: /Export CSV/i }).or(page.locator('button:has-text("Export")'));
    await exportBtn.first().click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('Perfect_Printers_Customers');
  });

  test('should filter customers by search query', async ({ adminPage: page }) => {
    const searchInput = page.getByTestId('master-data-search');
    await searchInput.fill('Cipla');

    await expect(page.getByText(/Cipla Healthcare/i)).toBeVisible();
  });
});
