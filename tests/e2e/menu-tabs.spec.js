import { test, expect } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const menu = require('../../menu.json');

test.describe('Menu Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#menu').scrollIntoViewIfNeeded();
  });

  test('all menu tabs are present and clickable', async ({ page }) => {
    const tabs = [
      { tab: 'signatures', label: '⭐ Signatures' },
      { tab: 'bases', label: '🥔 Bases' },
      { tab: 'proteins', label: '🍗 Proteins' },
      { tab: 'cheeses', label: '🧀 Cheeses' },
      { tab: 'sauces', label: '🥫 Sauces' },
      { tab: 'extras', label: '✨ Extras' },
      { tab: 'drinks', label: '🥤 Drinks' }
    ];

    for (const { tab, label } of tabs) {
      const tabButton = page.locator(`[data-tab="${tab}"]`);
      await expect(tabButton).toBeVisible();
      await expect(tabButton).toHaveText(label);
    }
  });

  test('signatures tab shows all signature builds from menu.json', async ({ page }) => {
    await page.locator('[data-tab="signatures"]').click();

    const signatureCards = page.locator('.menu-card--signature');
    await expect(signatureCards).toHaveCount(menu.signatures.items.length);

    for (const item of menu.signatures.items) {
      await expect(page.locator(`text=${item.name}`)).toBeVisible();
    }
  });

  test('tab switching shows correct content', async ({ page }) => {
    const tabs = ['bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
    
    for (const tab of tabs) {
      const tabButton = page.locator(`[data-tab="${tab}"]`);
      await tabButton.click();
      
      // Check correct panel is active
      const panel = page.locator(`#tab-${tab}`);
      await expect(panel).toHaveClass(/active/);
      
      // Check other panels are not active
      const otherPanels = page.locator('.tab-panel:not(#tab-' + tab + ')');
      for (let i = 0; i < await otherPanels.count(); i++) {
        await expect(otherPanels.nth(i)).not.toHaveClass(/active/);
      }
    }
  });

  test('active tab styling updates correctly', async ({ page }) => {
    const tabs = ['signatures', 'bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
    
    for (const tab of tabs) {
      const tabButton = page.locator(`[data-tab="${tab}"]`);
      await tabButton.click();
      
      // Check clicked tab is active
      await expect(tabButton).toHaveClass(/active/);
      
      // Check other tabs are not active
      const otherTabs = page.locator('.tab-btn:not([data-tab="' + tab + '"])');
      for (let i = 0; i < await otherTabs.count(); i++) {
        await expect(otherTabs.nth(i)).not.toHaveClass(/active/);
      }
    }
  });

  test('bases tab shows all base options from menu.json', async ({ page }) => {
    await page.locator('[data-tab="bases"]').click();

    const baseCards = page.locator('#tab-bases .menu-card');
    await expect(baseCards).toHaveCount(menu.bases.items.length);

    for (const item of menu.bases.items) {
      await expect(page.locator(`#tab-bases:has-text("${item.name}")`)).toBeVisible();
    }
  });

  test('proteins tab shows all protein options from menu.json', async ({ page }) => {
    await page.locator('[data-tab="proteins"]').click();

    const proteinCards = page.locator('#tab-proteins .menu-card');
    await expect(proteinCards).toHaveCount(menu.proteins.items.length);

    for (const item of menu.proteins.items) {
      await expect(page.locator(`#tab-proteins:has-text("${item.name}")`)).toBeVisible();
    }

    const vegCount = menu.proteins.items.filter(i => i.vegetarian).length;
    await expect(page.locator('#tab-proteins .veg-badge')).toHaveCount(vegCount);
  });

  test('sauces tab shows heat level badges from menu.json', async ({ page }) => {
    await page.locator('[data-tab="sauces"]').click();

    const heatCount = menu.sauces.items.filter(i => i.heat !== null).length;
    await expect(page.locator('#tab-sauces .heat-badge')).toHaveCount(heatCount);

    for (const item of menu.sauces.items) {
      await expect(page.locator(`#tab-sauces:has-text("${item.name}")`)).toBeVisible();
    }
  });

  test('extras tab shows all extra ingredients from menu.json', async ({ page }) => {
    await page.locator('[data-tab="extras"]').click();

    const extraTags = page.locator('.extra-tag');
    await expect(extraTags).toHaveCount(menu.extras.items.length);

    for (const name of menu.extras.items) {
      await expect(page.locator(`#tab-extras .extra-tag:has-text("${name}")`)).toBeVisible();
    }
  });

  test('drinks tab shows all beverage options from menu.json', async ({ page }) => {
    await page.locator('[data-tab="drinks"]').click();

    const drinkCards = page.locator('#tab-drinks .menu-card');
    await expect(drinkCards).toHaveCount(menu.drinks.items.length);

    for (const item of menu.drinks.items) {
      await expect(page.locator(`#tab-drinks:has-text("${item.name}")`)).toBeVisible();
    }
  });

  test('pricing summary callout reflects menu.json data', async ({ page }) => {
    await expect(page.locator('.pricing-callout')).toBeVisible();
    await expect(page.locator('.pricing-callout:has-text("How It Works")')).toBeVisible();

    const sigRow = menu.pricingSummary.rows.find(r => r.label === 'Signature Build');
    await expect(page.locator('.pricing-callout .pricing-row__label:has-text("Signature Build")')).toBeVisible();
    await expect(page.locator(`.pricing-callout:has-text("${sigRow.price}")`)).toBeVisible();
  });
});
