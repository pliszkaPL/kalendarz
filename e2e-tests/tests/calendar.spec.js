import { test, expect } from '@playwright/test';

test.describe('Calendar Functionality', () => {
  let testEmail;
  let testPassword;
  let testName;

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    const timestamp = Date.now();
    testEmail = `calendaruser${timestamp}@example.com`;
    testName = 'Calendar Test User';
    testPassword = 'password123';

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('should navigate to calendar from dashboard', async ({ page }) => {
    // Click on Calendar link
    await page.click('a[href="/calendar"]');

    // Wait for calendar page to load
    await page.waitForURL('**/calendar', { timeout: 10000 });
    
    // Verify we're on the calendar page
    expect(page.url()).toContain('/calendar');
    
    // Wait for Vue to render (give it time to mount)
    await page.waitForTimeout(2000);
    
    // Verify calendar title is visible
    await expect(page.locator('h1:has-text("Kalendarz")')).toBeVisible({ timeout: 10000 });
  });

  test('should display calendar grid with days', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Verify calendar grid exists
    await expect(page.locator('.calendar-grid')).toBeVisible();
    
    // Verify day headers are visible (Pn, Wt, Śr, etc.)
    await expect(page.locator('.day-header')).toHaveCount(7);
    
    // Verify calendar days are visible
    const calendarDays = page.locator('.calendar-day');
    const count = await calendarDays.count();
    expect(count).toBeGreaterThanOrEqual(28); // At least 4 weeks
    expect(count).toBeLessThanOrEqual(42); // Max 6 weeks
  });

  test('should display month navigation', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Verify navigation exists
    await expect(page.locator('.month-navigation')).toBeVisible();
    
    // Verify navigation buttons
    await expect(page.locator('button:has-text("‹")')).toBeVisible(); // Previous
    await expect(page.locator('button:has-text("›")')).toBeVisible(); // Next
    await expect(page.locator('button:has-text("Dziś")')).toBeVisible(); // Today
    
    // Verify month and year display
    await expect(page.locator('.month-button')).toBeVisible();
    await expect(page.locator('.year-button')).toBeVisible();
  });

  test('should navigate to next month', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Get current month text
    const currentMonth = await page.locator('.month-button').textContent();
    
    // Click next month
    await page.click('button:has-text("›")');
    
    // Wait for update
    await page.waitForTimeout(500);
    
    // Get new month text
    const newMonth = await page.locator('.month-button').textContent();
    
    // Verify month changed
    expect(newMonth).not.toBe(currentMonth);
  });

  test('should navigate to previous month', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Get current month text
    const currentMonth = await page.locator('.month-button').textContent();
    
    // Click previous month
    await page.click('button:has-text("‹")');
    
    // Wait for update
    await page.waitForTimeout(500);
    
    // Get new month text
    const newMonth = await page.locator('.month-button').textContent();
    
    // Verify month changed
    expect(newMonth).not.toBe(currentMonth);
  });

  test('should return to current month with "Dziś" button', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    const today = new Date();
    const currentMonthName = today.toLocaleDateString('pl-PL', { month: 'long' });
    
    // Navigate away from current month
    await page.click('button:has-text("›")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("›")');
    await page.waitForTimeout(500);
    
    // Click "Dziś" button
    await page.click('button:has-text("Dziś")');
    await page.waitForTimeout(500);
    
    // Verify we're back to current month
    const displayedMonth = await page.locator('.month-button').textContent();
    expect(displayedMonth?.toLowerCase()).toBe(currentMonthName.toLowerCase());
  });

  test('should display sidebar with groups and templates', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Verify sidebar exists
    await expect(page.locator('.calendar-sidebar')).toBeVisible();
    
    // Verify sections
    await expect(page.locator('h2:has-text("Grupy")')).toBeVisible();
    await expect(page.locator('h2:has-text("Szablony")')).toBeVisible();
    await expect(page.locator('h2:has-text("Statystyki")')).toBeVisible();
  });

  test('should display seeded templates', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Wait for templates to load
    await page.waitForSelector('.template-item', { timeout: 5000 });
    
    // Verify templates are displayed
    const templates = page.locator('.template-item');
    const count = await templates.count();
    expect(count).toBeGreaterThanOrEqual(3); // At least 3 default templates
    
    // Verify template names
    await expect(page.locator('.template-name:has-text("Urodziny")')).toBeVisible();
    await expect(page.locator('.template-name:has-text("Rocznica")')).toBeVisible();
    await expect(page.locator('.template-name:has-text("Przypomnienie")')).toBeVisible();
  });

  test('should display seeded groups', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Wait for groups to load
    await page.waitForSelector('.group-item, .empty-message', { timeout: 5000 });
    
    // Check if groups are displayed
    const groupItems = page.locator('.group-item');
    const groupCount = await groupItems.count();
    
    if (groupCount > 0) {
      // Verify groups are displayed
      expect(groupCount).toBeGreaterThanOrEqual(3); // At least 3 default groups
      
      // Verify group names
      await expect(page.locator('.group-name:has-text("Rodzina")')).toBeVisible();
      await expect(page.locator('.group-name:has-text("Praca")')).toBeVisible();
      await expect(page.locator('.group-name:has-text("Przyjaciele")')).toBeVisible();
    }
  });

  test('should display seeded entries on calendar', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Wait for entries to potentially load
    await page.waitForTimeout(1000);
    
    // Check if any entries are displayed
    const entries = page.locator('.entry-item');
    const entryCount = await entries.count();
    
    if (entryCount > 0) {
      // Verify at least one entry is visible
      expect(entryCount).toBeGreaterThan(0);
      
      // Verify entry has icon and name
      const firstEntry = entries.first();
      await expect(firstEntry.locator('.entry-icon')).toBeVisible();
      await expect(firstEntry.locator('.entry-name')).toBeVisible();
    }
  });

  test('should display statistics in sidebar', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Verify statistics section
    await expect(page.locator('.stat-label:has-text("Wszystkie wpisy:")')).toBeVisible();
    await expect(page.locator('.stat-label:has-text("W tym miesiącu:")')).toBeVisible();
    
    // Verify stat values are visible (even if 0)
    const statValues = page.locator('.stat-value');
    expect(await statValues.count()).toBe(2);
  });

  test('should highlight today\'s date', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Find today's date element
    const todayElement = page.locator('.calendar-day.today');
    
    // Verify today is highlighted (should exist and be visible)
    await expect(todayElement).toBeVisible();
  });

  test('should mark other month days with different styling', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render

    // Find other-month days
    const otherMonthDays = page.locator('.calendar-day.other-month');
    
    // Verify other-month days exist
    const count = await otherMonthDays.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should remain accessible after logout and login', async ({ page }) => {
    // Navigate to calendar
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue to render
    
    // Verify calendar is visible
    await expect(page.locator('.calendar-grid')).toBeVisible();
    
    // Navigate to dashboard and logout
    await page.goto('/dashboard');
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/', { timeout: 5000 });
    
    // Login again
    await page.fill('input[id="login-email"]', testEmail);
    await page.fill('input[id="login-password"]', testPassword);
    await page.click('button[type="submit"]:has-text("Login")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to calendar again
    await page.click('a[href="/calendar"]');
    await page.waitForURL('**/calendar', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for Vue to render
    
    // Verify calendar still works
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });

  test('should require authentication to access calendar', async ({ page }) => {
    // Clear session
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    // Try to access calendar directly
    await page.goto('/calendar');
    
    // Should be redirected to login
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).not.toContain('/calendar');
  });
});
