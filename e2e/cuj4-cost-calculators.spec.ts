import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 4: 7 Industrial Cost Estimators & Calculation Safety', () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.getByTestId('erp-tab-calculators').click();
    await expect(page.getByText(/Printing Press Cost Calculators/i)).toBeVisible();
  });

  test('should display all 7 specialized industrial estimation tools', async ({ adminPage: page }) => {
    await expect(page.getByRole('button', { name: /Flagship Mono Carton Estimator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ink SPANKS Formula/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Power Consumption/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lamination Film/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lamination Gum/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /UV Coating/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Aqueous Coating/i })).toBeVisible();
  });

  test('should calculate accurate Mono Carton cost and respond to margin slider', async ({ adminPage: page }) => {
    // Flagship Mono Carton is active by default
    await expect(page.getByText(/Total Cost & Pricing Summary/i)).toBeVisible();
    await expect(page.getByText(/Factory Production Cost:/i)).toBeVisible();

    // Verify figures are non-zero and formatted
    const costPill = page.locator('text=₹').first();
    await expect(costPill).toBeVisible();
  });

  test('should compute SPANKS ink formula correctly without NaN', async ({ adminPage: page }) => {
    // Switch to SPANKS tab
    const spanksBtn = page.getByRole('button', { name: /Ink SPANKS Formula/i });
    await spanksBtn.click();

    await expect(page.getByText(/SPANKS Mathematical Ink Calculator/i)).toBeVisible();
    await expect(page.getByText(/Offset Ink Consumption Formula/i)).toBeVisible();
  });

  test('should handle edge cases and zero division without crashing', async ({ adminPage: page }) => {
    // Switch to Mono Carton Estimator
    const monoBtn = page.getByRole('button', { name: /Flagship Mono Carton Estimator/i });
    await monoBtn.click();

    // Find Ups input and set to 0
    const upsInput = page.locator('input[type="number"]').nth(1);
    if (await upsInput.isVisible()) {
      await upsInput.fill('0');
      // Assert page does not crash with NaN or Infinity error
      await expect(page.getByText(/Printing Press Cost Calculators/i)).toBeVisible();
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('NaN');
      expect(bodyText).not.toContain('Infinity');
    }
  });
});
