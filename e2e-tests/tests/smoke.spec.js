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

  test('SMOKE: User can login successfully', async ({ page }) => {
    // Navigate to app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register a new user
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    // Should redirect to calendar (not dashboard anymore)
    await page.waitForURL('**/calendar', { timeout: 10000 });
    expect(page.url()).toContain('/calendar');

    // Verify we can see the calendar
    await expect(page.locator('h1.app-title:has-text("📅 Kalendarz")')).toBeVisible({ timeout: 10000 });
  });

  test('SMOKE: Calendar displays with navigation and grid', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Register")');
    const timestamp = Date.now();
    const email = `smoketest2${timestamp}@example.com`;
    await page.fill('input[id="register-name"]', 'Smoke Test 2');
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/calendar', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Verify calendar components are visible
    await expect(page.locator('.calendar-grid')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.month-navigation')).toBeVisible({ timeout: 5000 });
    
    // Verify day headers (Pn, Wt, Śr, Cz, Pt, So, Ni)
    const dayHeaders = page.locator('.day-header');
    await expect(dayHeaders).toHaveCount(7);

    // Verify calendar has days
    const calendarDays = page.locator('.calendar-day');
    const count = await calendarDays.count();
    expect(count).toBeGreaterThanOrEqual(28); // At least 4 weeks
    expect(count).toBeLessThanOrEqual(42); // Max 6 weeks

    // Verify navigation buttons
    await expect(page.locator('button:has-text("‹")')).toBeVisible();
    await expect(page.locator('button:has-text("›")')).toBeVisible();
    await expect(page.locator('button:has-text("Dziś")')).toBeVisible();
  });

  test('SMOKE: User can add an entry to calendar', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Register")');
    const timestamp = Date.now();
    const email = `smoketest3${timestamp}@example.com`;
    await page.fill('input[id="register-name"]', 'Smoke Test 3');
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/calendar', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Click on "Add Entry" button or click on a day
    const addButton = page.locator('button.add-entry-btn');
    if (await addButton.isVisible()) {
      await addButton.click();
    } else {
      // Alternative: click on first available day
      const firstDay = page.locator('.calendar-day').first();
      await firstDay.click();
    }

    // Wait for modal to appear
    await page.waitForSelector('.modal-overlay', { timeout: 5000 });
    
    // Fill in entry details
    const entryName = `Smoke Test Entry ${timestamp}`;
    await page.fill('input[placeholder="Nazwa wpisu"]', entryName);
    
    // Click save button
    await page.click('button[type="submit"]:has-text("Zapisz")');
    
    // Wait for modal to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });
    
    // Verify entry appears on calendar
    await expect(page.locator(`.entry-item:has-text("${entryName}")`)).toBeVisible({ timeout: 5000 });
  });
});
