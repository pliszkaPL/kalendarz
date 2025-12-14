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
    // Log slow network requests
    page.on('response', response => {
      const request = response.request();
      const timing = response.timing();
      if (timing.responseEnd > 1000) { // Slower than 1s
        console.log(`SLOW REQUEST: ${request.url()} took ${timing.responseEnd}ms`);
      }
    });
  });

  test('SMOKE: User can login successfully', async ({ page }) => {
    // Catch console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Navigate to app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Debug: Check what's on the page
    const title = await page.title();
    console.log('Page title:', title);
    
    // Wait for Vue to mount first
    await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 5000 });

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
    await page.click('button[type="submit"]:has-text("Register")');

    // Should redirect to calendar
    await page.waitForURL('**/calendar', { timeout: 5000 });
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
    await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 5000 });

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
    await page.waitForSelector('h1:has-text("Kalendarz")', { timeout: 5000 });

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
    await page.fill('input[placeholder="Nazwa wpisu"]', entryName);
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Zapisz")');
    
    // Wait for modal to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 3000 });
    
    // Verify entry appears
    const entryItem = page.locator('.entry-item, .calendar-entry').filter({ hasText: entryName });
    await expect(entryItem).toBeVisible({ timeout: 3000 });
  });
});
