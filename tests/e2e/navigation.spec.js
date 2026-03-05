import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sticky navigation remains visible when scrolling', async ({ page }) => {
    const nav = page.locator('#main-nav');
    
    // Check nav is visible at top
    await expect(nav).toBeVisible();
    
    // Scroll down to menu section
    await page.locator('#menu').scrollIntoViewIfNeeded();
    
    // Check nav is still visible (sticky)
    await expect(nav).toBeVisible();
    
    // Check nav has sticky positioning
    const navBox = await nav.boundingBox();
    expect(navBox?.y).toBe(0); // Should be at top of viewport
  });

  test('mobile hamburger menu opens and closes', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburger = page.locator('#hamburger');
    const navLinks = page.locator('#nav-links');
    
    // Initially closed
    await expect(navLinks).not.toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    
    // Open menu
    await hamburger.click();
    await expect(navLinks).toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    
    // Close menu
    await hamburger.click();
    await expect(navLinks).not.toHaveClass(/open/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu closes when clicking nav link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburger = page.locator('#hamburger');
    const navLinks = page.locator('#nav-links');
    // Be more specific - target the nav link, not the hero CTA
    const menuLink = page.locator('#nav-links a[href="#menu"]');
    
    // Open menu
    await hamburger.click();
    await expect(navLinks).toHaveClass(/open/);
    
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    
    // Click menu link
    await menuLink.click();
    
    // Menu should close
    await expect(navLinks).not.toHaveClass(/open/);
    
    // Wait for potential scroll
    await page.waitForTimeout(1000);
    
    // Check that we scrolled down (menu section should be lower on page)
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
    
    // Verify the menu section exists and is visible
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeVisible();
  });

  test('smooth scrolling to sections', async ({ page }) => {
    const isMobile = (page.viewportSize()?.width ?? 1280) <= 768;

    // On mobile the nav links live inside a hidden slide-out panel.
    // Open the hamburger first so the link is actionable, then click it.
    async function clickNavLink(href) {
      if (isMobile) {
        await page.locator('#hamburger').click();
        await expect(page.locator('#nav-links')).toHaveClass(/open/);
      }
      await page.locator(`#nav-links a[href="${href}"]`).click();
    }

    // Test menu link
    await clickNavLink('#menu');
    await page.waitForTimeout(1000); // Increased wait time
    const menuSection = page.locator('#menu');
    const menuBox = await menuSection.boundingBox();
    expect(menuBox?.y).toBeLessThan(150); // Increased tolerance

    // Test story link
    await clickNavLink('#story');
    await page.waitForTimeout(1000);
    const storySection = page.locator('#story');
    const storyBox = await storySection.boundingBox();
    expect(storyBox?.y).toBeLessThan(150);

    // Test find us link
    await clickNavLink('#find-us');
    await page.waitForTimeout(1000);
    const findUsSection = page.locator('#find-us');
    const findUsBox = await findUsSection.boundingBox();
    expect(findUsBox?.y).toBeLessThan(150);
  });

  test('active nav link highlighting on scroll', async ({ page }) => {
    // Target individual nav links, not the collection
    const menuNavLink = page.locator('#nav-links a[href="#menu"]');
    const storyNavLink = page.locator('#nav-links a[href="#story"]');
    const findUsNavLink = page.locator('#nav-links a[href="#find-us"]');
    
    // Start at hero - no active links initially
    await expect(menuNavLink).not.toHaveClass(/active/);
    await expect(storyNavLink).not.toHaveClass(/active/);
    await expect(findUsNavLink).not.toHaveClass(/active/);
    
    // Scroll to menu section
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await expect(menuNavLink).toHaveClass(/active/);
    
    // Scroll to story section
    await page.locator('#story').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await expect(storyNavLink).toHaveClass(/active/);
    await expect(menuNavLink).not.toHaveClass(/active/);
    
    // Scroll to find us section
    await page.locator('#find-us').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await expect(findUsNavLink).toHaveClass(/active/);
    await expect(storyNavLink).not.toHaveClass(/active/);
  });

  test('logo links back to hero section', async ({ page }) => {
    const logoLink = page.locator('.nav-logo-link');
    
    // Scroll down first
    await page.locator('#menu').scrollIntoViewIfNeeded();
    
    // Click logo
    await logoLink.click();
    await page.waitForTimeout(500);
    
    // Should be back at top
    const heroSection = page.locator('#hero');
    const heroBox = await heroSection.boundingBox();
    expect(heroBox?.y).toBeLessThan(50);
  });

  test('hero CTA buttons navigate to correct sections', async ({ page }) => {
    // Target hero CTA buttons specifically
    const buildButton = page.locator('.hero-ctas a[href="#menu"]');
    const findUsButton = page.locator('.hero-ctas a[href="#find-us"]');
    
    // Test Build Your Potato button
    await buildButton.click();
    await page.waitForTimeout(1000);
    const menuSection = page.locator('#menu');
    const menuBox = await menuSection.boundingBox();
    expect(menuBox?.y).toBeLessThan(150);
    
    // Scroll back up first
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Test Find Us button
    await findUsButton.click();
    await page.waitForTimeout(1000);
    const findUsSection = page.locator('#find-us');
    const findUsBox = await findUsSection.boundingBox();
    expect(findUsBox?.y).toBeLessThan(150);
  });
});
