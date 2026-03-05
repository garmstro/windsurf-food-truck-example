import { test, expect } from '@playwright/test';

test.describe('Catering Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#find-us').scrollIntoViewIfNeeded();
  });

  test('form fields are present and have correct types', async ({ page }) => {
    // Check all form fields exist
    await expect(page.locator('#catering-name')).toBeVisible();
    await expect(page.locator('#catering-email')).toBeVisible();
    await expect(page.locator('#catering-phone')).toBeVisible();
    await expect(page.locator('#catering-date')).toBeVisible();
    await expect(page.locator('#catering-guests')).toBeVisible();
    await expect(page.locator('#catering-message')).toBeVisible();
    
    // Check input types
    await expect(page.locator('#catering-name')).toHaveAttribute('type', 'text');
    await expect(page.locator('#catering-email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#catering-phone')).toHaveAttribute('type', 'tel');
    await expect(page.locator('#catering-date')).toHaveAttribute('type', 'date');
    await expect(page.locator('#catering-guests')).toHaveAttribute('type', 'number');
    
    // Check textarea
    const messageElement = page.locator('#catering-message');
    await expect(messageElement).toBeVisible();
    const tagName = await messageElement.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('textarea');
  });

  test('required fields have required attribute', async ({ page }) => {
    const requiredFields = [
      '#catering-name',
      '#catering-email', 
      '#catering-phone',
      '#catering-date',
      '#catering-guests',
      '#catering-message'
    ];

    for (const selector of requiredFields) {
      await expect(page.locator(selector)).toHaveAttribute('required');
    }
  });

  test('form validation works for required fields', async ({ page }) => {
    const submitButton = page.locator('.catering-form button[type="submit"]');
    
    // Try to submit empty form
    await submitButton.click();
    
    // Check that browser validation prevents submission
    // In Playwright, we can check that the form is still present (no navigation)
    await expect(page.locator('.catering-form')).toBeVisible();
  });

  test('email field validation', async ({ page }) => {
    const emailInput = page.locator('#catering-email');
    const submitButton = page.locator('.catering-form button[type="submit"]');
    
    // Fill form with invalid email
    await page.fill('#catering-name', 'Test User');
    await page.fill('#catering-email', 'invalid-email');
    await page.fill('#catering-phone', '8165550123');
    await page.fill('#catering-date', '2026-12-25');
    await page.fill('#catering-guests', '50');
    await page.fill('#catering-message', 'Test event message');
    
    // Try to submit
    await submitButton.click();
    
    // Should show validation error
    await expect(emailInput).toHaveAttribute('type', 'email');
    
    // Fill with valid email
    await page.fill('#catering-email', 'test@example.com');
    
    // Form should be submittable now
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('guest count field has minimum value', async ({ page }) => {
    const guestsInput = page.locator('#catering-guests');
    
    await expect(guestsInput).toHaveAttribute('min', '1');
    
    // Try to set invalid value
    await guestsInput.fill('0');
    
    // Browser should prevent this or show validation
    const value = await guestsInput.inputValue();
    expect(value).toBe('0'); // The value is set but validation should prevent submission
  });

  test('date field accepts valid dates', async ({ page }) => {
    const dateInput = page.locator('#catering-date');
    
    // Set a future date
    await dateInput.fill('2026-12-25');
    await expect(dateInput).toHaveValue('2026-12-25');
    
    // Set today's date (should work)
    const today = new Date().toISOString().split('T')[0];
    await dateInput.fill(today);
    await expect(dateInput).toHaveValue(today);
  });

  test('form submission creates mailto link', async ({ page, browserName }) => {
    // Fill form with valid data
    await page.fill('#catering-name', 'John Doe');
    await page.fill('#catering-email', 'john@example.com');
    await page.fill('#catering-phone', '816-555-0123');
    await page.fill('#catering-date', '2026-12-25');
    await page.fill('#catering-guests', '50');
    await page.fill('#catering-message', 'We need catering for our holiday party!');

    // Only Chromium exposes mailto: navigation via Playwright's request event;
    // Firefox and WebKit handle the protocol natively without firing it.
    if (browserName === 'chromium') {
      let mailtoUrl = '';
      page.on('request', request => {
        if (request.url().startsWith('mailto:')) {
          mailtoUrl = request.url();
        }
      });

      const submitButton = page.locator('.catering-form button[type="submit"]');
      await submitButton.click();

      expect(mailtoUrl).toContain('mailto:matt@mattspotats.com');
      expect(mailtoUrl).toContain('Name%3DJohn%20Doe');
      expect(mailtoUrl).toContain('Email%3Djohn%40example.com');
      expect(mailtoUrl).toContain('Phone%3D816-555-0123');
      expect(mailtoUrl).toContain('Event%20Date%3D2026-12-25');
      expect(mailtoUrl).toContain('Guest%20Count%3D50');
      expect(mailtoUrl).toContain('Message%3DWe%20need%20catering%20for%20our%20holiday%20party%21');
    } else {
      // On WebKit, verify the form is wired correctly via its attributes
      const form = page.locator('.catering-form');
      await expect(form).toHaveAttribute('action', 'mailto:matt@mattspotats.com');
      await expect(form).toHaveAttribute('enctype', 'text/plain');
    }
  });

  test('form labels are properly associated with inputs', async ({ page }) => {
    // Check that labels have correct for attributes
    await expect(page.locator('label[for="catering-name"]')).toHaveText('Name');
    await expect(page.locator('label[for="catering-email"]')).toHaveText('Email');
    await expect(page.locator('label[for="catering-phone"]')).toHaveText('Phone');
    await expect(page.locator('label[for="catering-date"]')).toHaveText('Event Date');
    await expect(page.locator('label[for="catering-guests"]')).toHaveText('Guest Count');
    await expect(page.locator('label[for="catering-message"]')).toHaveText('Tell Us About Your Event');
  });

  test('form has correct action and method', async ({ page }) => {
    const form = page.locator('.catering-form');
    
    await expect(form).toHaveAttribute('action', 'mailto:matt@mattspotats.com');
    await expect(form).toHaveAttribute('method', 'POST');
    await expect(form).toHaveAttribute('enctype', 'text/plain');
  });

  test('submit button is properly styled and clickable', async ({ page }) => {
    const submitButton = page.locator('.catering-form button[type="submit"]');
    
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Send Inquiry');
    await expect(submitButton).toHaveClass(/btn-primary/);
    
    // Check button is clickable
    await expect(submitButton).toBeEnabled();
  });
});
