import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should successfully register a new user', async ({ page }) => {
    // Generate a unique email for each test run
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    const testName = 'Test User';
    const testPassword = 'password123';

    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Click on the Register tab
    await page.click('button:has-text("Register")');

    // Fill in the registration form
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);

    // Submit the form
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait for redirect to calendar
    await page.waitForURL('**/calendar', { timeout: 10000 });

    // Verify we're on the calendar
    expect(page.url()).toContain('/calendar');

    // Verify the calendar page is displayed
    await expect(page.locator('text=Twój kalendarz')).toBeVisible();
  });

  test('should show error for duplicate email registration', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `duplicate${timestamp}@example.com`;
    const testName = 'Duplicate User';
    const testPassword = 'password123';

    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register the first user
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait for redirect to calendar
    await page.waitForURL('**/calendar', { timeout: 10000 });

    // Logout - accept confirm dialog
    page.once('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Wyloguj")');
    await page.waitForURL('/', { timeout: 5000 });

    // Try to register with the same email
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait for error message
    await page.waitForSelector('.bg-red-100', { timeout: 5000 });

    // Verify error is shown
    const errorMessage = await page.locator('.bg-red-100');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', 'Test User');
    await page.fill('input[id="register-email"]', 'test@example.com');
    await page.fill('input[id="register-password"]', 'password123');
    await page.fill('input[id="register-password-confirm"]', 'password456');
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait for error message
    await page.waitForSelector('.bg-red-100', { timeout: 5000 });

    const errorMessage = await page.locator('.bg-red-100');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Passwords do not match');
  });
});
