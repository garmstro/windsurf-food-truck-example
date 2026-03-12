import { test, expect } from '@playwright/test';

test.describe('Accessibility — tab system ARIA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#menu').scrollIntoViewIfNeeded();
  });

  test('tablist container has role="tablist"', async ({ page }) => {
    await expect(page.locator('.menu-tabbar__inner')).toHaveAttribute('role', 'tablist');
  });

  test('each tab button has role="tab"', async ({ page }) => {
    const tabs = page.locator('.tab-btn');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toHaveAttribute('role', 'tab');
    }
  });

  test('each tab panel has role="tabpanel"', async ({ page }) => {
    const panels = page.locator('.tab-panel');
    const count = await panels.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(panels.nth(i)).toHaveAttribute('role', 'tabpanel');
    }
  });

  test('initially active tab has aria-selected="true"', async ({ page }) => {
    await expect(page.locator('[data-tab="signatures"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('initially inactive tabs have aria-selected="false"', async ({ page }) => {
    const inactiveTabs = ['bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
    for (const tab of inactiveTabs) {
      await expect(page.locator(`[data-tab="${tab}"]`)).toHaveAttribute('aria-selected', 'false');
    }
  });

  test('clicking a tab sets its aria-selected to "true"', async ({ page }) => {
    await page.locator('[data-tab="bases"]').click();
    await expect(page.locator('[data-tab="bases"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a tab sets other tabs aria-selected to "false"', async ({ page }) => {
    await page.locator('[data-tab="bases"]').click();
    await expect(page.locator('[data-tab="signatures"]')).toHaveAttribute('aria-selected', 'false');
  });

  test('each tab button has a matching aria-controls attribute', async ({ page }) => {
    const tabs = ['signatures', 'bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
    for (const tab of tabs) {
      await expect(page.locator(`[data-tab="${tab}"]`)).toHaveAttribute('aria-controls', `tab-${tab}`);
    }
  });

  test('each tab panel has aria-labelledby pointing to its button', async ({ page }) => {
    const tabs = ['signatures', 'bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
    for (const tab of tabs) {
      await expect(page.locator(`#tab-${tab}`)).toHaveAttribute('aria-labelledby', `tab-btn-${tab}`);
    }
  });
});
