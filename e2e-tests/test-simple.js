import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to http://kalendarz.loc');
  await page.goto('http://kalendarz.loc', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('Waiting for app to load...');
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  console.log('Page HTML length:', content.length);
  console.log('Page title:', await page.title());
  
  // Check if Vue mounted
  const appDiv = await page.locator('#app').innerHTML();
  console.log('App div content length:', appDiv.length);
  console.log('App div content preview:', appDiv.substring(0, 500));
  
  // Try to find register button
  try {
    const registerBtn = await page.locator('button:has-text("Register")').count();
    console.log('Register button count:', registerBtn);
  } catch (e) {
    console.log('Error finding register button:', e.message);
  }
  
  await browser.close();
})();
