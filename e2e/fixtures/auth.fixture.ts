import { test as base, Page } from '@playwright/test';
import { UserRole } from '../../app/erp/types';
import { createTestSession } from './seed-data';

type AuthFixtures = {
  adminPage: Page;
  salesPage: Page;
  productionPage: Page;
  accountsPage: Page;
  loginAs: (role: UserRole) => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    const session = createTestSession('ADMIN');
    await page.addInitScript((s) => {
      window.localStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.sessionStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.localStorage.setItem('pp_erp_role', s.role);
    }, session);
    await page.goto('/erp');
    await page.locator('[data-testid="erp-tab-job-order"]').waitFor({ state: 'visible', timeout: 15000 });
    await use(page);
  },

  salesPage: async ({ page }, use) => {
    const session = createTestSession('SALES');
    await page.addInitScript((s) => {
      window.localStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.sessionStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.localStorage.setItem('pp_erp_role', s.role);
    }, session);
    await page.goto('/erp');
    await page.locator('[data-testid="erp-tab-job-order"]').waitFor({ state: 'visible', timeout: 15000 });
    await use(page);
  },

  productionPage: async ({ page }, use) => {
    const session = createTestSession('PRODUCTION');
    await page.addInitScript((s) => {
      window.localStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.sessionStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.localStorage.setItem('pp_erp_role', s.role);
    }, session);
    await page.goto('/erp');
    await page.locator('[data-testid="erp-tab-job-order"]').waitFor({ state: 'visible', timeout: 15000 });
    await use(page);
  },

  accountsPage: async ({ page }, use) => {
    const session = createTestSession('ACCOUNTS');
    await page.addInitScript((s) => {
      window.localStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.sessionStorage.setItem('pp_erp_session', JSON.stringify(s));
      window.localStorage.setItem('pp_erp_role', s.role);
    }, session);
    await page.goto('/erp');
    await page.locator('[data-testid="erp-tab-job-order"]').waitFor({ state: 'visible', timeout: 15000 });
    await use(page);
  },

  loginAs: async ({ page }, use) => {
    const fn = async (role: UserRole) => {
      const session = createTestSession(role);
      await page.addInitScript((s) => {
        window.localStorage.setItem('pp_erp_session', JSON.stringify(s));
        window.sessionStorage.setItem('pp_erp_session', JSON.stringify(s));
        window.localStorage.setItem('pp_erp_role', s.role);
      }, session);
      await page.goto('/erp');
    };
    await use(fn);
  },
});

export { expect } from '@playwright/test';
