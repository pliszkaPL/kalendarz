import { test, expect } from '@playwright/test';

test('simple entry creation test', async ({ page }) => {
  // Capture console messages
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  // Register and login
  const timestamp = Date.now();
  const testEmail = `simpletest${timestamp}@example.com`;
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await page.click('button:has-text("Register")');
  await page.fill('input[id="register-name"]', 'Simple Test');
  await page.fill('input[id="register-email"]', testEmail);
  await page.fill('input[id="register-password"]', 'password123');
  await page.fill('input[id="register-password-confirm"]', 'password123');
  await page.click('button[type="submit"]:has-text("Register")');
  
  await page.waitForURL('**/calendar', { timeout: 10000 });
  
  // Go to calendar
  await page.goto('/calendar');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.removeItem('kalendarz_entries');
    localStorage.removeItem('kalendarz_groups');
  });
  
  // Take screenshot before
  await page.screenshot({ path: 'test-results/before-click.png' });
  
  // Click add button
  await page.click('.add-entry-btn');
  await page.waitForSelector('.entry-modal', { state: 'visible', timeout: 5000 });
  
  // Take screenshot of modal
  await page.screenshot({ path: 'test-results/modal-open.png' });
  
  // Fill form
  await page.fill('input#entry-name', 'Test Entry');
  await page.fill('input#entry-date', '2025-12-31');
  
  // Take screenshot before submit
  await page.screenshot({ path: 'test-results/before-submit.png' });
  
  // Check if submit button exists and is visible
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toBeVisible();
  
  const buttonText = await submitButton.textContent();
  console.log('Button text:', buttonText);
  
  // Click submit
  await submitButton.click();
  
  // Wait a bit
  await page.waitForTimeout(1000);
  
  // Take screenshot after submit
  await page.screenshot({ path: 'test-results/after-submit.png' });
  
  // Check localStorage
  const entries = await page.evaluate(() => {
    const data = localStorage.getItem('kalendarz_entries');
    console.log('LocalStorage entries:', data);
    return data ? JSON.parse(data) : [];
  });
  
  console.log('Entries count:', entries.length);
  console.log('Entries:', JSON.stringify(entries, null, 2));
  
  expect(entries.length).toBeGreaterThan(0);
});
