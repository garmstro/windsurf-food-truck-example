import { test, expect } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const edgeMenu = require('../fixtures/menu-edge-cases.json');

// Helper: intercept the menu.json fetch and serve the edge-case fixture instead
async function loadWithEdgeMenu(page) {
  await page.route('**/menu.json', route =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(edgeMenu) })
  );
  await page.goto('/');
  await page.locator('#menu').scrollIntoViewIfNeeded();
}

test.describe('Menu rendering — edge case fixture', () => {
  test.beforeEach(async ({ page }) => {
    await loadWithEdgeMenu(page);
  });

  // ── Signatures ──────────────────────────────────────────────

  test('renders a single signature item with high price', async ({ page }) => {
    await page.locator('[data-tab="signatures"]').click();

    const cards = page.locator('.menu-card--signature');
    await expect(cards).toHaveCount(1);

    const card = cards.first();
    await expect(card.locator('.menu-card__name')).toHaveText('Single Item Menu');
    await expect(card.locator('.menu-card__price')).toHaveText('$99.99');
    await expect(card.locator('.menu-card__base')).toContainText('Tater Tots');
    await expect(card.locator('.menu-card__toppings')).toHaveText('Everything');
  });

  // ── Bases ────────────────────────────────────────────────────

  test('renders a single base option', async ({ page }) => {
    await page.locator('[data-tab="bases"]').click();

    const cards = page.locator('#tab-bases .menu-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.menu-card__name')).toHaveText('Only Base');
    await expect(cards.first().locator('.menu-card__price')).toHaveText('$6.00');
  });

  // ── Proteins — all vegetarian ─────────────────────────────────

  test('shows veg badge on every protein when all items are vegetarian', async ({ page }) => {
    await page.locator('[data-tab="proteins"]').click();

    const cards = page.locator('#tab-proteins .menu-card');
    await expect(cards).toHaveCount(2);

    const vegBadges = page.locator('#tab-proteins .veg-badge');
    await expect(vegBadges).toHaveCount(2);
  });

  // ── Cheeses ──────────────────────────────────────────────────

  test('renders a single cheese option', async ({ page }) => {
    await page.locator('[data-tab="cheeses"]').click();

    const cards = page.locator('#tab-cheeses .menu-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.menu-card__name')).toHaveText('Only Cheese');
  });

  // ── Sauces — mixed heat ───────────────────────────────────────

  test('only sauces with heat get a heat badge', async ({ page }) => {
    await page.locator('[data-tab="sauces"]').click();

    // fixture has 1 sauce with heat, 1 without
    const heatBadges = page.locator('#tab-sauces .heat-badge');
    await expect(heatBadges).toHaveCount(1);

    await expect(page.locator('#tab-sauces:has-text("No Heat Sauce")')).toBeVisible();
    await expect(page.locator('#tab-sauces:has-text("Max Heat Sauce")')).toBeVisible();
  });

  // ── Extras — single tag ───────────────────────────────────────

  test('renders a single extra tag', async ({ page }) => {
    await page.locator('[data-tab="extras"]').click();

    const tags = page.locator('.extra-tag');
    await expect(tags).toHaveCount(1);
    await expect(tags.first()).toHaveText('Only Extra');
  });

  // ── Drinks — $0.00 price, no desc ────────────────────────────

  test('renders a drink with $0.00 price and no description paragraph', async ({ page }) => {
    await page.locator('[data-tab="drinks"]').click();

    const cards = page.locator('#tab-drinks .menu-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.menu-card__name')).toHaveText('Free Water');
    await expect(cards.first().locator('.menu-card__price')).toHaveText('$0.00');
    await expect(cards.first().locator('.menu-card__desc')).toHaveCount(0);
  });

  // ── Pricing summary ───────────────────────────────────────────

  test('pricing callout uses fixture heading and note', async ({ page }) => {
    await expect(page.locator('.pricing-callout__heading')).toHaveText(edgeMenu.pricingSummary.heading);
    await expect(page.locator('.pricing-callout__note')).toHaveText(edgeMenu.pricingSummary.note);
  });

  test('pricing callout renders only fixture rows', async ({ page }) => {
    const rows = page.locator('.pricing-callout .pricing-row');
    await expect(rows).toHaveCount(edgeMenu.pricingSummary.rows.length);

    for (const row of edgeMenu.pricingSummary.rows) {
      const rowEl = page.locator(`.pricing-row:has-text("${row.label}")`);
      await expect(rowEl.locator('.pricing-row__price')).toHaveText(row.price);
    }
  });

  test('highlighted pricing row has correct class', async ({ page }) => {
    const highlightedRow = edgeMenu.pricingSummary.rows.find(r => r.highlight);
    const rowEl = page.locator(`.pricing-row--highlight`);
    await expect(rowEl).toHaveCount(1);
    await expect(rowEl.locator('.pricing-row__label')).toHaveText(highlightedRow.label);
  });

  // ── Tab switching still works with minimal data ───────────────

  test('tab switching works correctly with minimal menu data', async ({ page }) => {
    const tabs = ['bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];

    for (const tab of tabs) {
      await page.locator(`[data-tab="${tab}"]`).click();
      await expect(page.locator(`#tab-${tab}`)).toHaveClass(/active/);
    }
  });
});
