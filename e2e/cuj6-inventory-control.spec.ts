import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 6: Inventory Control & GRN Stock-In Ledger', () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.getByTestId('erp-tab-inventory').click();
    await expect(page.getByText(/Inventory Management/i).first()).toBeVisible();
  });

  test('should display inventory tabs and stock summary metrics', async ({ adminPage: page }) => {
    await expect(page.getByRole('button', { name: /Own Factory Stock/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Client Free-Issue Stock/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Material Out/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Transaction Log/i })).toBeVisible();

    // Check KPI
    await expect(page.getByText(/Own Stock Valuation/i)).toBeVisible();
  });

  test('should filter inventory by category or stock type', async ({ adminPage: page }) => {
    // Click Client Free-Issue Stock tab
    await page.getByRole('button', { name: /Client Free-Issue Stock/i }).click();

    // Verify client stock items
    await expect(page.getByText(/Client:/i).first()).toBeVisible();
  });

  test('should open and submit Stock-In (GRN) transaction modal', async ({ adminPage: page }) => {
    const stockInBtn = page.getByTestId('stock-in-btn').first();
    await stockInBtn.click();

    // Modal opens
    await expect(page.getByText(/Store Material Receipt \(GRN\)/i)).toBeVisible();

    // Fill form
    const qtyInput = page.locator('input[type="number"]').first();
    await qtyInput.fill('500');

    // Submit GRN
    const submitBtn = page.getByRole('button', { name: /Confirm Stock In/i });
    await submitBtn.click();

    // Modal closes
    await expect(page.getByText(/Store Material Receipt \(GRN\)/i)).not.toBeVisible();
  });
});
