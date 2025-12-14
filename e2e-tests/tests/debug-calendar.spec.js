import { test, expect } from '@playwright/test';

test('debug calendar page', async ({ page }) => {
  // Capture console messages and errors
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  // Register and login
  const timestamp = Date.now();
  const testEmail = `debug${timestamp}@example.com`;
  const testName = 'Debug User';
  const testPassword = 'password123';

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.click('button:has-text("Register")');
  await page.fill('input[id="register-name"]', testName);
  await page.fill('input[id="register-email"]', testEmail);
  await page.fill('input[id="register-password"]', testPassword);
  await page.fill('input[id="register-password-confirm"]', testPassword);
  await page.click('button[type="submit"]:has-text("Register")');

  await page.waitForURL('**/calendar', { timeout: 10000 });
  
  // Navigate to calendar
  await page.click('a[href="/calendar"]');
  await page.waitForURL('**/calendar', { timeout: 10000 });
  
  // Wait a bit for Vue to render
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: '/home/nali/Documents/prompts/kalendarz/e2e-tests/calendar-debug.png', fullPage: true });
  
  // Get HTML content
  const html = await page.content();
  console.log('Page HTML length:', html.length);
  console.log('App div content:', await page.locator('#app').innerHTML());
});
