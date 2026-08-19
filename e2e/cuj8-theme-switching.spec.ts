import { test, expect } from './fixtures/auth.fixture';

test.describe('CUJ 8: Dynamic 4-Theme Switching & State Persistence', () => {
  test('should switch themes and persist theme choice in localStorage after reload', async ({ adminPage: page }) => {
    // Open Theme Switcher dropdown using data-testid
    await page.getByTestId('erp-theme-btn').click();

    // Select Heidelberg Dark Carbon theme
    const darkCarbonOption = page.getByRole('button', { name: /Heidelberg Dark Carbon/i }).or(page.getByText(/Dark Carbon/i));
    await darkCarbonOption.first().click();

    // Verify theme attribute on documentElement or body
    const hasDarkTheme = await page.evaluate(() => {
      const theme = document.documentElement.getAttribute('data-erp-theme') || document.body.getAttribute('data-erp-theme');
      return theme === 'dark-carbon' || document.documentElement.classList.contains('dark');
    });
    expect(hasDarkTheme).toBeTruthy();

    // Reload page
    await page.reload();

    // Verify theme persisted
    const themeAfterReload = await page.evaluate(() => {
      return localStorage.getItem('pp_erp_theme');
    });
    expect(themeAfterReload).toBe('dark-carbon');

    // Switch to Corporate Executive Navy
    await page.getByTestId('erp-theme-btn').click();
    const executiveOption = page.getByRole('button', { name: /Corporate Executive Navy/i }).or(page.getByText(/Executive Navy/i));
    await executiveOption.first().click();

    const themeExecutive = await page.evaluate(() => {
      return localStorage.getItem('pp_erp_theme');
    });
    expect(themeExecutive).toBe('executive-navy');
  });
});
