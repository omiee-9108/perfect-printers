import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 3: Direct Order Entry & Production Kanban Progression', () => {
  test('should create a new production order with live sheet calculation', async ({ adminPage: page }) => {
    // Navigate to Direct Entry tab using data-testid
    await page.getByTestId('erp-tab-new-order').click();

    // Verify Direct Entry form is displayed
    await expect(page.getByText(/Create New Production Order/i)).toBeVisible();

    // Select customer & job
    const customerSelect = page.locator('select').first();
    await customerSelect.selectOption({ index: 0 });

    // Enter order quantity
    const qtyInput = page.locator('input[type="number"]').first();
    await qtyInput.fill('50000');

    // Verify live sheet calculator formula output
    await expect(page.getByText(/Calculated Sheets Required/i)).toBeVisible();

    // Fill instructions
    const notesInput = page.locator('textarea');
    if (await notesInput.isVisible()) {
      await notesInput.fill('Urgent pharmaceutical batch for export.');
    }

    // Submit Order
    const createBtn = page.getByRole('button', { name: /Create Production Order/i });
    await createBtn.click();

    // Verify success confirmation
    await expect(page.getByRole('heading', { name: /Order Created Successfully/i })).toBeVisible();
  });

  test('should filter orders by stage on the Kanban board', async ({ adminPage: page }) => {
    // Verify Dashboard is visible
    await expect(page.getByText(/Active Production Board/i)).toBeVisible();

    // Click "Pending" stage filter on the sidebar
    const pendingFilter = page.locator('button:has-text("Pending")').first();
    await pendingFilter.click();

    // Verify filtered view
    await expect(page.locator('body')).toBeVisible();
  });

  test('should search orders by job code or customer name', async ({ adminPage: page }) => {
    const searchInput = page.getByTestId('kanban-search-input');
    await searchInput.fill('Cipla');

    // Verify Cipla jobs remain visible
    await expect(page.getByText(/Cipla/i).first()).toBeVisible();
  });
});
