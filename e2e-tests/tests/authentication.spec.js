import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  let testEmail;
  let testPassword;
  let testName;

  test.beforeAll(async () => {
    // Set up test user credentials
    const timestamp = Date.now();
    testEmail = `authuser${timestamp}@example.com`;
    testName = 'Auth Test User';
    testPassword = 'password123';
  });

  test('should register a user and then login successfully', async ({ page }) => {
    // First, register a new user
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', testName);
    await page.fill('input[id="register-email"]', testEmail);
    await page.fill('input[id="register-password"]', testPassword);
    await page.fill('input[id="register-password-confirm"]', testPassword);
    await page.click('button[type="submit"]:has-text("Register")');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/', { timeout: 5000 });

    // Now login with the same credentials
    await page.waitForLoadState('networkidle');
    
    // Should be on login tab by default
    await page.fill('input[id="login-email"]', testEmail);
    await page.fill('input[id="login-password"]', testPassword);
    await page.click('button[type="submit"]:has-text("Login")');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify we're on the dashboard
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator(`text=Welcome, ${testName}`)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to login with invalid credentials
    await page.fill('input[id="login-email"]', 'nonexistent@example.com');
    await page.fill('input[id="login-password"]', 'wrongpassword');
    await page.click('button[type="submit"]:has-text("Login")');

    // Wait for error message
    await page.waitForSelector('.bg-red-100', { timeout: 5000 });

    const errorMessage = await page.locator('.bg-red-100');
    await expect(errorMessage).toBeVisible();
  });

  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
    await page.goto('/dashboard');

    // Should be redirected to login page
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).not.toContain('/dashboard');
  });

  test('should redirect authenticated user from login to dashboard', async ({ page }) => {
    // First login
    const timestamp = Date.now();
    const email = `redirect${timestamp}@example.com`;
    const name = 'Redirect User';
    const password = 'password123';

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Register
    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', name);
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', password);
    await page.fill('input[id="register-password-confirm"]', password);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Try to navigate to login page while authenticated
    await page.goto('/');

    // Should be redirected back to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('should successfully logout and clear session', async ({ page }) => {
    // Register and login
    const timestamp = Date.now();
    const email = `logout${timestamp}@example.com`;
    const name = 'Logout User';
    const password = 'password123';

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Register")');
    await page.fill('input[id="register-name"]', name);
    await page.fill('input[id="register-email"]', email);
    await page.fill('input[id="register-password"]', password);
    await page.fill('input[id="register-password-confirm"]', password);
    await page.click('button[type="submit"]:has-text("Register")');

    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/', { timeout: 5000 });

    // Verify we're back on login page
    expect(page.url()).not.toContain('/dashboard');

    // Try to access dashboard again
    await page.goto('/dashboard');
    await page.waitForURL('/', { timeout: 5000 });

    // Should be redirected to login
    expect(page.url()).not.toContain('/dashboard');
  });
});
