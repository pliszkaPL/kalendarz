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
    await page.waitForURL('**/calendar', { timeout: 15000 });
    expect(page.url()).toContain('/calendar');

    // Wait for Vue app to fully mount and render
    await page.waitForLoadState('networkidle');
    
    // Wait for the navbar to appear (indicates Vue has mounted)
    await page.waitForSelector('.top-navbar', { timeout: 20000 });
    
    // Verify we can see the calendar navbar title
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

    await page.waitForURL('**/calendar', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Wait for navbar first (indicates Vue mounted)
    await page.waitForSelector('.top-navbar', { timeout: 20000 });

    // Wait for calendar grid to appear (critical element)
    await page.waitForSelector('.calendar-grid', { timeout: 20000 });
    
    // Wait for month navigation (another critical element)
    await page.waitForSelector('.month-navigation', { timeout: 20000 });

    // Verify calendar components are visible
    await expect(page.locator('.calendar-grid')).toBeVisible();
    await expect(page.locator('.month-navigation')).toBeVisible();
    
    // Verify day headers (Pn, Wt, Śr, Cz, Pt, So, Ni)
    const dayHeaders = page.locator('.day-header');
    await expect(dayHeaders).toHaveCount(7, { timeout: 10000 });

    // Verify calendar has days
    const calendarDays = page.locator('.calendar-day');
    await expect(calendarDays.first()).toBeVisible({ timeout: 10000 });
    const count = await calendarDays.count();
    expect(count).toBeGreaterThanOrEqual(28); // At least 4 weeks
    expect(count).toBeLessThanOrEqual(42); // Max 6 weeks

    // Verify navigation buttons
    await expect(page.locator('button:has-text("‹")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("›")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Dziś")')).toBeVisible({ timeout: 10000 });
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

    await page.waitForURL('**/calendar', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Wait for navbar first (indicates Vue has mounted)
    await page.waitForSelector('.top-navbar', { timeout: 20000 });
    
    // Wait for calendar grid to load
    await page.waitForSelector('.calendar-grid', { timeout: 20000 });
    
    // Wait for at least one calendar day to be clickable
    await page.waitForSelector('.calendar-day', { timeout: 20000 });

    // Click on "Add Entry" button or click on a day
    const addButton = page.locator('button.add-entry-btn');
    const addButtonVisible = await addButton.isVisible().catch(() => false);
    
    if (addButtonVisible) {
      await addButton.click();
    } else {
      // Alternative: click on first current-month day (not previous/next month)
      const currentMonthDay = page.locator('.calendar-day:not(.other-month)').first();
      await currentMonthDay.waitFor({ state: 'visible', timeout: 10000 });
      await currentMonthDay.click();
    }

    // Wait for modal to appear (longer timeout for CI)
    await page.waitForSelector('.modal-overlay', { timeout: 10000 });
    
    // Wait for input field to be ready
    await page.waitForSelector('input[placeholder="Nazwa wpisu"]', { timeout: 10000 });
    
    // Fill in entry details
    const entryName = `Smoke Test Entry ${timestamp}`;
    await page.fill('input[placeholder="Nazwa wpisu"]', entryName);
    
    // Wait a bit for form validation
    await page.waitForTimeout(500);
    
    // Click save button
    const saveButton = page.locator('button[type="submit"]:has-text("Zapisz")');
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();
    
    // Wait for modal to close (longer timeout for CI)
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 10000 });
    
    // Wait for calendar to re-render
    await page.waitForTimeout(1000);
    
    // Verify entry appears on calendar (more flexible selector)
    const entryItem = page.locator('.entry-item, .calendar-entry').filter({ hasText: entryName });
    await expect(entryItem).toBeVisible({ timeout: 10000 });
  });
});
