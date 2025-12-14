import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  console.log('Navigating to http://kalendarz.loc');
  await page.goto('http://kalendarz.loc', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('Waiting for app to load...');
  await page.waitForTimeout(5000);
  
  const appDiv = await page.locator('#app').innerHTML();
  console.log('App div content:', appDiv || '(empty)');
  
  await browser.close();
})();
