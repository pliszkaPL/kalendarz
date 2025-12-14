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
    // Monitor ALL console messages including warnings
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[Browser ${type.toUpperCase()}]:`, text);
    });

    // Monitor page errors (uncaught exceptions)
    page.on('pageerror', error => {
      console.log('[PAGE ERROR]:', error.message);
      console.log('[PAGE ERROR STACK]:', error.stack);
    });

    // Monitor failed requests
    page.on('requestfailed', request => {
      console.log('[REQUEST FAILED]:', request.url(), request.failure()?.errorText);
    });

    // Monitor ALL requests (success and fail)
    page.on('response', async response => {
      const url = response.url();
      const status = response.status();
      const contentType = response.headers()['content-type'];
      
      // Log all JS/CSS files
      if (url.includes('.js') || url.includes('.css') || url.includes('/assets/')) {
        console.log(`[RESOURCE] ${status} ${contentType} - ${url}`);
        
        // If JS/CSS failed, log it
        if (status !== 200) {
          console.log(`[RESOURCE ERROR] Failed to load: ${url}`);
        }
      }
    });

    // Monitor when page navigates
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        console.log('[NAVIGATION]:', frame.url());
      }
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

    // Submit form and wait for API response
    console.log('Submitting registration form...');
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/register') && response.status() === 201,
      { timeout: 10000 }
    );
    await page.click('button[type="submit"]:has-text("Register")');
    await responsePromise;

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

    // DEBUG: Check what's loaded on /calendar page
    console.log('=== DEBUG: On /calendar page ===');
    console.log('URL:', page.url());
    
    // Check localStorage (token should be there) - do this BEFORE waiting for elements
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('DEBUG: localStorage token exists:', !!token);
    if (!token) {
      console.error('ERROR: Token not found in localStorage after registration!');
      console.error('This will cause router guard to redirect back to /');
    }

    // Wait for Vue app to mount - wait for specific calendar elements
    // Using Promise.race to accept any of these elements appearing
    try {
      await Promise.race([
        page.waitForSelector('.top-navbar', { timeout: 15000 }),
        page.waitForSelector('.calendar-grid', { timeout: 15000 }),
        page.waitForSelector('h1.app-title', { timeout: 15000 }),
        page.waitForSelector('.calendar-view', { timeout: 15000 })
      ]);
      console.log('Vue app mounted successfully');
    } catch (e) {
      // Enhanced debug output on failure
      console.error('=== Vue failed to mount ===');
      console.error('Current URL:', page.url());
      console.error('Console errors:', errors);
      
      const appDiv = await page.locator('#app').count();
      console.error('DEBUG: #app div exists:', appDiv > 0);
      
      const appContent = await page.locator('#app').innerHTML().catch(() => '');
      console.error('DEBUG: #app innerHTML length:', appContent.length);
      console.error('DEBUG: #app innerHTML preview:', appContent.substring(0, 500));
      
      throw new Error(`Vue app did not mount. Console errors: ${errors.join(', ')}`);
    }
    
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

    await page.waitForURL('**/calendar', { timeout: 10000 });
    
    // Wait for network and Vue to mount
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Wait for calendar grid (main element)
    await page.waitForSelector('.calendar-grid', { timeout: 15000 });

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

    await page.waitForURL('**/calendar', { timeout: 10000 });
    
    // Wait for network and Vue to mount
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Wait for calendar to be ready
    await page.waitForSelector('.calendar-grid', { timeout: 15000 });
    await page.waitForSelector('.add-entry-btn', { timeout: 15000 });

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
