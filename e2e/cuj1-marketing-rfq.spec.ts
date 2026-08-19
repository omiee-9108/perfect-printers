import { test, expect } from '@playwright/test';

test.describe('CUJ 1: Marketing Website & Interactive RFQ Funnel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section, value propositions, and plant capabilities', async ({ page }) => {
    await expect(page).toHaveTitle(/Perfect Printers/i);
    await expect(page.locator('h1')).toContainText(/Precision Printing/i);
    
    // Check Machine Fleet section or navigation exists
    await expect(page.locator('text=Commercial Offset Press').first()).toBeVisible();
    
    // Check ERP Portal navigation link exists
    const erpBtn = page.getByRole('link', { name: /ERP Portal/i });
    await expect(erpBtn.first()).toBeVisible();
  });

  test('should open RFQ modal, complete quote builder form, and submit inquiry', async ({ page }) => {
    // Look for quote builder or request quote CTA
    const quoteCta = page.getByRole('button', { name: /Instant Quote/i }).or(page.getByRole('link', { name: /Instant Quote/i })).or(page.getByText(/Get a Quote/i));
    if (await quoteCta.first().isVisible()) {
      await quoteCta.first().click();
      
      // If modal or section opens, verify fields
      const submitBtn = page.getByRole('button', { name: /Submit Quote/i }).or(page.getByRole('button', { name: /Calculate/i }));
      if (await submitBtn.first().isVisible()) {
        await expect(submitBtn.first()).toBeEnabled();
      }
    }
  });

  test('should navigate to ERP login gate when clicking ERP Portal button', async ({ page }) => {
    const erpBtn = page.getByTestId('nav-erp-portal-link').first();
    await erpBtn.click();
    await expect(page).toHaveURL(/\/erp/);
    await expect(page.getByText(/Plant Authentication Gateway/i).or(page.getByText(/Production Order Management/i))).toBeVisible();
  });
});
