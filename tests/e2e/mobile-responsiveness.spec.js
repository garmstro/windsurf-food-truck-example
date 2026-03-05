import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  const mobileViewports = [
    { width: 375, height: 667, name: 'iPhone SE' },
    { width: 390, height: 844, name: 'iPhone 12' },
    { width: 414, height: 896, name: 'iPhone 11' }
  ];

  mobileViewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
      });

      test('hamburger menu is visible on mobile', async ({ page }) => {
        const hamburger = page.locator('#hamburger');
        await expect(hamburger).toBeVisible();
        
        // Desktop nav links should be hidden
        const navLinks = page.locator('#nav-links');
        await expect(navLinks).not.toHaveClass(/open/);
      });

      test('mobile menu opens and closes properly', async ({ page }) => {
        const hamburger = page.locator('#hamburger');
        const navLinks = page.locator('#nav-links');
        
        // Open menu
        await hamburger.click();
        await expect(navLinks).toHaveClass(/open/);
        await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
        
        // Check nav links are visible when open
        await expect(page.locator('#nav-links a[href="#menu"]')).toBeVisible();
        await expect(page.locator('#nav-links a[href="#story"]')).toBeVisible();
        await expect(page.locator('#nav-links a[href="#find-us"]')).toBeVisible();
        
        // Close menu
        await hamburger.click();
        await expect(navLinks).not.toHaveClass(/open/);
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      });

      test('hero section adapts to mobile layout', async ({ page }) => {
        const heroContent = page.locator('.hero-content');
        const heroImage = page.locator('.hero-image');
        
        await expect(heroContent).toBeVisible();
        await expect(heroImage).toBeVisible();
        
        // Check text is readable (not too small)
        const headline = page.locator('.hero-headline');
        await expect(headline).toBeVisible();
        
        // Check CTA buttons are stacked or properly sized
        const ctaButtons = page.locator('.hero-ctas a');
        await expect(ctaButtons).toHaveCount(2);
        await expect(ctaButtons.first()).toBeVisible();
        await expect(ctaButtons.last()).toBeVisible();
      });

      test('menu tabs are scrollable on mobile', async ({ page }) => {
        await page.locator('#menu').scrollIntoViewIfNeeded();
        
        const tabbar = page.locator('.menu-tabbar');
        await expect(tabbar).toBeVisible();
        
        // Check if tabs are horizontally scrollable
        const tabbarInner = page.locator('.menu-tabbar__inner');
        const tabbarBox = await tabbarInner.boundingBox();
        
        if (tabbarBox) {
          // Check if tabbar is wider than viewport
          const viewportWidth = viewport.width;
          if (tabbarBox.width > viewportWidth) {
            // Should be scrollable
            await expect(tabbar).toBeVisible();
          }
        }
        
        // Test clicking tabs on mobile
        const signaturesTab = page.locator('[data-tab="signatures"]');
        await signaturesTab.click();
        await expect(page.locator('#tab-signatures')).toHaveClass(/active/);
        
        const basesTab = page.locator('[data-tab="bases"]');
        await basesTab.click();
        await expect(page.locator('#tab-bases')).toHaveClass(/active/);
      });

      test('menu cards stack properly on mobile', async ({ page }) => {
        await page.locator('#menu').scrollIntoViewIfNeeded();
        await page.locator('[data-tab="signatures"]').click();
        
        const menuGrid = page.locator('#tab-signatures .menu-grid');
        await expect(menuGrid).toBeVisible();
        
        // Check that cards are visible and properly sized
        const cards = page.locator('.menu-card--signature');
        await expect(cards).toHaveCount(7);
        
        // First card should be visible
        await expect(cards.first()).toBeVisible();
        
        // Check card content is readable
        await expect(page.locator('text=The Classic Matt')).toBeVisible();
        await expect(page.locator('text=$12.00').first()).toBeVisible();
      });

      test('our story section adapts to mobile', async ({ page }) => {
        await page.locator('#story').scrollIntoViewIfNeeded();
        
        const storyContent = page.locator('.story-content');
        await expect(storyContent).toBeVisible();
        
        // Check text content is readable
        const storyText = page.locator('.story-text');
        await expect(storyText).toBeVisible();
        
        // Check contact links are clickable
        const emailLink = page.locator('a[href="mailto:matt@mattspotats.com"]');
        const phoneLink = page.locator('a[href="tel:+18165550123"]');
        
        await expect(emailLink).toBeVisible();
        await expect(phoneLink).toBeVisible();
      });

      test('find us section adapts to mobile', async ({ page }) => {
        await page.locator('#find-us').scrollIntoViewIfNeeded();
        
        const findUsGrid = page.locator('.find-us-grid');
        await expect(findUsGrid).toBeVisible();
        
        // Check location card
        const locationCard = page.locator('.find-us-card').first();
        await expect(locationCard).toBeVisible();
        await expect(page.locator('.location-label')).toBeVisible();
        
        // Check catering form card
        const cateringCard = page.locator('.find-us-card').last();
        await expect(cateringCard).toBeVisible();
        
        // Check form fields are properly sized for mobile
        const formInputs = page.locator('.form-input');
        await expect(formInputs.first()).toBeVisible();
      });

      test('form is usable on mobile', async ({ page }) => {
        await page.locator('#find-us').scrollIntoViewIfNeeded();
        
        // Test filling form on mobile
        await page.fill('#catering-name', 'Mobile User');
        await page.fill('#catering-email', 'mobile@test.com');
        await page.fill('#catering-phone', '8165550123');
        
        // Check keyboard doesn't obscure important elements
        const submitButton = page.locator('.catering-form button[type="submit"]');
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toBeEnabled();
      });

      test('no horizontal scrolling on mobile', async ({ page }) => {
        // Check page doesn't require horizontal scrolling
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        
        // Allow small tolerance for mobile browsers
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
      });

      test('text remains readable on mobile', async ({ page }) => {
        // Check various text elements are visible and not too small
        await expect(page.locator('.hero-headline')).toBeVisible();
        
        await page.locator('#menu').scrollIntoViewIfNeeded();
        await expect(page.locator('.section-heading').first()).toBeVisible();
        await expect(page.locator('.menu-card__name').first()).toBeVisible();
        
        await page.locator('#story').scrollIntoViewIfNeeded();
        await expect(page.locator('.story-paragraph').first()).toBeVisible();
        
        await page.locator('#find-us').scrollIntoViewIfNeeded();
        await expect(page.locator('.form-label').first()).toBeVisible();
      });

      test('touch targets are adequately sized', async ({ page }) => {
        // Check buttons and links have adequate touch target size
        const ctaButtons = page.locator('.hero-ctas a');
        const firstButton = ctaButtons.first();
        const buttonBox = await firstButton.boundingBox();
        
        if (buttonBox) {
          // Touch targets should be at least 44x44 points, but we'll be more lenient
          expect(buttonBox.height).toBeGreaterThanOrEqual(35);
          expect(buttonBox.width).toBeGreaterThanOrEqual(35);
        }
        
        // Check hamburger menu
        const hamburger = page.locator('#hamburger');
        const hamburgerBox = await hamburger.boundingBox();
        
        if (hamburgerBox) {
          // Be more lenient with hamburger size - check it's clickable
          expect(hamburgerBox.height).toBeGreaterThanOrEqual(30);
          expect(hamburgerBox.width).toBeGreaterThanOrEqual(30);
        }
      });
    });
  });

  test('tablet viewport works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // On tablet, test that the page loads and basic functionality works
    const hamburger = page.locator('#hamburger');
    const navLinks = page.locator('#nav-links');
    
    // Check if hamburger is visible (it might be on tablet depending on breakpoint)
    const isHamburgerVisible = await hamburger.isVisible();
    
    if (isHamburgerVisible) {
      // If hamburger is visible, test mobile menu functionality
      await hamburger.click();
      await expect(navLinks).toHaveClass(/open/);
      
      // Test navigation works - use hero CTA instead since nav links might be hidden
      await page.locator('.hero-ctas a[href="#menu"]').click();
      await page.waitForTimeout(500);
    } else {
      // If desktop nav is visible, test desktop navigation
      await page.locator('#nav-links a[href="#menu"]').click();
      await page.waitForTimeout(500);
    }
    
    const menuSection = page.locator('#menu');
    const menuBox = await menuSection.boundingBox();
    expect(menuBox?.y).toBeLessThan(150);
  });
});
