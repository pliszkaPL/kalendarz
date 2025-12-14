import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Critical Path Testing
 * 
 * These tests verify the most critical functionality:
 * 1. User can login
 * 2. Calendar displays correctly
 * 3. User can add an entry to the calendar
 * 
 * Run these first in CI to quickly detect breaking changes
 */

test.describe('Smoke Tests - Critical Path', () => {
  let testEmail;
  let testPassword;
  let testName;

  test.beforeAll(async () => {
    // Set up test user credentials
    const timestamp = Date.now();
    testEmail = `smoketest${timestamp}@example.com`;
    testName = 'Smoke Test User';
    testPassword = 'password123';
  });

  test.beforeEach(async ({ page }) => {
    // Monitor network requests for performance issues
    page.on('response', async response => {
      // Note: response.timing() was removed in newer Playwright versions
      // If you need detailed timing, use page.on('requestfinished') instead
    });
  });

  test('SMOKE: User can login successfully', async ({ page }) => {
    // Catch console errors
    const errors = [];
    const networkResponses = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Capture API responses for debugging
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        try {
          const body = await response.text();
          networkResponses.push({
            url: response.url(),
            status: response.status(),
            body: body.substring(0, 500)
          });
          console.log(`API Response: ${response.status()} ${response.url()}`);
          if (response.status() >= 400) {
            console.log(`API Error Body: ${body.substring(0, 500)}`);
          }
        } catch (e) {
          // Ignore body read errors
        }
      }
    });

    // Navigate to app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Debug: Check what's on the page
    const title = await page.title();
    console.log('Page title:', title);

    // Wait for Vue to mount first - with debug output on failure
    try {
      await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 10000 });
    } catch (e) {
      const content = await page.content();
      console.log('=== DEBUG: Page HTML when h1 not found ===');
      console.log(content.substring(0, 3000));
      console.log('=== END DEBUG ===');
      console.log('Console errors:', errors);
      throw e;
    }

    // Click Register tab to show registration form
    await page.click('button:has-text("Register")');

    // Wait for registration form to appear
    await page.waitForSelector('input[id="register-name"]', { timeout: 3000 });

    // Fill registration form
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);

    // Submit form
    console.log('Submitting registration form...');
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait a moment for API response
    await page.waitForTimeout(2000);

    // Debug: Log current state
    console.log('=== DEBUG after register click ===');
    console.log('Current URL:', page.url());
    console.log('Console errors:', errors);
    console.log('Network responses:', JSON.stringify(networkResponses, null, 2));

    // Check for error message on page
    const errorMsg = await page.locator('.text-red-500, .error-message, [class*="error"]').first().textContent().catch(() => null);
    if (errorMsg) {
      console.log('Error message on page:', errorMsg);
    }

    // Should redirect to calendar
    try {
      await page.waitForURL('**/calendar', { timeout: 10000 });
    } catch (e) {
      console.log('=== FAILED TO REDIRECT ===');
      console.log('Final URL:', page.url());
      console.log('Page content:', (await page.content()).substring(0, 2000));
      throw e;
    }
    expect(page.url()).toContain('/calendar');

    // Wait for Vue app to mount (any of these means success)
    await Promise.race([
      page.waitForSelector('.top-navbar', { timeout: 5000 }),
      page.waitForSelector('.calendar-grid', { timeout: 5000 }),
      page.waitForSelector('h1.app-title', { timeout: 5000 })
    ]).catch(() => {
      console.error('Vue failed to mount. Console errors:', errors);
      throw new Error(`Vue app did not mount. Console errors: ${errors.join(', ')}`);
    });
    
    // Verify navbar is visible
    await expect(page.locator('.top-navbar')).toBeVisible({ timeout: 2000 });
  });

  test('SMOKE: Calendar displays with navigation and grid', async ({ page }) => {
    // Navigate and wait for app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for Vue to mount first - with debug output on failure
    try {
      await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 10000 });
    } catch (e) {
      const content = await page.content();
      console.log('=== DEBUG: Page HTML when h1 not found ===');
      console.log(content.substring(0, 3000));
      console.log('=== END DEBUG ===');
      throw e;
    }

    // Click Register tab
    await page.click('button:has-text("Register")');
    await page.waitForSelector('input[id="register-name"]', { timeout: 3000 });

    // Register new user
    const timestamp = Date.now();
    const email = `smoketest2${timestamp}@example.com`;
    await page.fill('input[id="register-name"]', 'Smoke Test 2');
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/calendar', { timeout: 5000 });
    
    // Wait for calendar grid (main element)
    await page.waitForSelector('.calendar-grid', { timeout: 5000 });

    // Verify calendar components are visible
    await expect(page.locator('.calendar-grid')).toBeVisible();
    await expect(page.locator('.month-navigation')).toBeVisible();
    
    // Verify day headers (Pn, Wt, Śr, Cz, Pt, So, Ni)
    const dayHeaders = page.locator('.day-header');
    await expect(dayHeaders).toHaveCount(7);

    // Verify calendar has days
    const calendarDays = page.locator('.calendar-day');
    await expect(calendarDays.first()).toBeVisible();
    const count = await calendarDays.count();
    expect(count).toBeGreaterThanOrEqual(28); // At least 4 weeks
    expect(count).toBeLessThanOrEqual(42); // Max 6 weeks

    // Verify navigation buttons
    await expect(page.locator('button:has-text("‹")')).toBeVisible();
    await expect(page.locator('button:has-text("›")')).toBeVisible();
    await expect(page.locator('button:has-text("Dziś")')).toBeVisible();
  });

  test('SMOKE: User can add an entry to calendar', async ({ page }) => {
    // Navigate and wait for app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for Vue to mount first - with debug output on failure
    try {
      await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 10000 });
    } catch (e) {
      const content = await page.content();
      console.log('=== DEBUG: Page HTML when h1 not found ===');
      console.log(content.substring(0, 3000));
      console.log('=== END DEBUG ===');
      throw e;
    }

    // Click Register tab
    await page.click('button:has-text("Register")');
    await page.waitForSelector('input[id="register-name"]', { timeout: 3000 });

    // Register new user
    const timestamp = Date.now();
    const email = `smoketest3${timestamp}@example.com`;
    await page.fill('input[id="register-name"]', 'Smoke Test 3');
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/calendar', { timeout: 5000 });
    
    // Wait for calendar to be ready
    await page.waitForSelector('.calendar-grid', { timeout: 5000 });
    await page.waitForSelector('.add-entry-btn', { timeout: 5000 });

    // Click add entry button
    await page.click('.add-entry-btn');

    // Wait for modal and fill form
    await page.waitForSelector('.modal-overlay', { timeout: 3000 });
    
    const entryName = `Smoke Test Entry ${timestamp}`;
    await page.fill('input[id="entry-name"]', entryName);
    
    // Fill required date field
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[id="entry-date"]', dateStr);
    
    // Submit form (button says "Dodaj" for new entries)
    await page.click('button[type="submit"]:has-text("Dodaj")');
    
    // Wait for modal to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 3000 });
    
    // Verify entry appears
    const entryItem = page.locator('.entry-item, .calendar-entry').filter({ hasText: entryName });
    await expect(entryItem).toBeVisible({ timeout: 3000 });
  });
});
