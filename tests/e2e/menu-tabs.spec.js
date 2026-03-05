import { test, expect } from '@playwright/test';

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

  test('signatures tab shows 6 signature builds', async ({ page }) => {
    const signaturesTab = page.locator('[data-tab="signatures"]');
    await signaturesTab.click();
    
    const signatureCards = page.locator('.menu-card--signature');
    await expect(signatureCards).toHaveCount(6);
    
    // Check specific signature items
    await expect(page.locator('text=The Classic Matt')).toBeVisible();
    await expect(page.locator('text=The Pulled Pork Paradise')).toBeVisible();
    await expect(page.locator('text=The Buffalo Bomb')).toBeVisible();
    await expect(page.locator('text=The Sweet & Smoky')).toBeVisible();
    await expect(page.locator('text=The Baked Boss')).toBeVisible();
    await expect(page.locator('text=The Veggie Victory')).toBeVisible();
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

  test('bases tab shows all base options', async ({ page }) => {
    const basesTab = page.locator('[data-tab="bases"]');
    await basesTab.click();
    
    const baseCards = page.locator('#tab-bases .menu-card');
    await expect(baseCards).toHaveCount(8);
    
    // Check specific base items
    await expect(page.locator('#tab-bases:has-text("Curly Fries")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Steak Fries")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Shoestring Fries")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Waffle Fries")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Tater Tots")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Crispy Crowns")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Sweet Potato Fries")')).toBeVisible();
    await expect(page.locator('#tab-bases:has-text("Baked Potato")')).toBeVisible();
  });

  test('proteins tab shows protein options with pricing', async ({ page }) => {
    const proteinsTab = page.locator('[data-tab="proteins"]');
    await proteinsTab.click();
    
    const proteinCards = page.locator('#tab-proteins .menu-card');
    await expect(proteinCards).toHaveCount(7);
    
    // Check specific protein items with prices
    await expect(page.locator('#tab-proteins:has-text("Grilled Chicken")')).toBeVisible();
    await expect(page.locator('#tab-proteins:has-text("+$3.50")')).toBeVisible();
    await expect(page.locator('#tab-proteins:has-text("Shaved Steak")')).toBeVisible();
    await expect(page.locator('#tab-proteins:has-text("+$4.00")')).toBeVisible();
    await expect(page.locator('#tab-proteins:has-text("Pulled Pork")')).toBeVisible();
    await expect(page.locator('#tab-proteins:has-text("Black Beans")')).toBeVisible();
    await expect(page.locator('#tab-proteins .veg-badge')).toHaveCount(2); // Vegetarian badges
  });

  test('sauces tab shows heat level badges', async ({ page }) => {
    const saucesTab = page.locator('[data-tab="sauces"]');
    await saucesTab.click();
    
    // Check heat badges are present
    await expect(page.locator('#tab-sauces .heat-badge')).toHaveCount(4);
    await expect(page.locator('#tab-sauces:has-text("🌶 Mild")')).toBeVisible();
    await expect(page.locator('#tab-sauces:has-text("🌶🌶 Medium")')).toBeVisible();
    
    // Check specific sauces
    await expect(page.locator('#tab-sauces:has-text("BBQ")')).toBeVisible();
    await expect(page.locator('#tab-sauces:has-text("Buffalo")')).toBeVisible();
    await expect(page.locator('#tab-sauces:has-text("Ranch")')).toBeVisible();
  });

  test('extras tab shows extra ingredients as tags', async ({ page }) => {
    const extrasTab = page.locator('[data-tab="extras"]');
    await extrasTab.click();
    
    const extraTags = page.locator('.extra-tag');
    await expect(extraTags).toHaveCount(11);
    
    // Check specific extras
    await expect(page.locator('#tab-extras .extra-tag:has-text("Sour Cream")')).toBeVisible();
    await expect(page.locator('#tab-extras .extra-tag:has-text("Fresh Chives")')).toBeVisible();
    await expect(page.locator('#tab-extras .extra-tag:has-text("Pickled Jalapeños")')).toBeVisible();
    await expect(page.locator('#tab-extras .extra-tag:has-text("Caramelized Onions")')).toBeVisible();
  });

  test('drinks tab shows beverage options', async ({ page }) => {
    const drinksTab = page.locator('[data-tab="drinks"]');
    await drinksTab.click();
    
    const drinkCards = page.locator('#tab-drinks .menu-card');
    await expect(drinkCards).toHaveCount(5);
    
    // Check specific drinks
    await expect(page.locator('#tab-drinks:has-text("Fountain Drink")')).toBeVisible();
    await expect(page.locator('#tab-drinks:has-text("$1.50 / $2 / $2.50")')).toBeVisible();
    await expect(page.locator('#tab-drinks:has-text("Fresh Lemonade")')).toBeVisible();
    await expect(page.locator('#tab-drinks .menu-card__price:has-text("$3.00")')).toBeVisible();
  });

  test('pricing summary callout is visible', async ({ page }) => {
    // Should be visible regardless of active tab
    await expect(page.locator('.pricing-callout')).toBeVisible();
    await expect(page.locator('.pricing-callout:has-text("How It Works")')).toBeVisible();
    await expect(page.locator('.pricing-callout .pricing-row__label:has-text("Signature Build")')).toBeVisible();
    await expect(page.locator('.pricing-callout:has-text("$11.50 – $13.50")')).toBeVisible();
  });
});
