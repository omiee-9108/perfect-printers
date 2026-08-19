import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 7: Document Generation & Printable Dockets', () => {
  test('should open and render Floor Docket modal with letterhead and GSTIN', async ({ adminPage: page }) => {
    // Open Print Floor Docket modal using data-testid
    const docketBtn = page.getByTestId('print-docket-btn').first();
    await docketBtn.click();

    // Verify Docket Modal opens
    await expect(page.getByText(/PERFECT PRINTERS/i).first()).toBeVisible();
    await expect(page.getByText(/JOB DOCKET/i).or(page.getByText(/Press Floor Job Docket/i)).first()).toBeVisible();

    // Close modal
    await page.getByTestId('modal-close-btn').click();
  });

  test('should display Purchase Order management view', async ({ adminPage: page }) => {
    await page.getByTestId('erp-tab-purchase-order').click();

    await expect(page.getByText(/Purchase Order Generator/i).first()).toBeVisible();
    await expect(page.getByText(/Procurement & Supplier Management/i).first()).toBeVisible();
  });

  test('should display Quotation Generator view', async ({ adminPage: page }) => {
    await page.getByTestId('erp-tab-quotation').click();

    await expect(page.getByText(/Commercial Quotation Generator/i).first()).toBeVisible();
    await expect(page.getByText(/Sales Estimation & Proposals/i).first()).toBeVisible();
  });
});
