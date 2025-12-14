import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console messages
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('[ERROR]', error.message));
  
  console.log('Navigating to http://kalendarz.loc');
  try {
    await page.goto('http://kalendarz.loc', { waitUntil: 'load', timeout: 30000 });
    console.log('Page loaded');
    
    // Wait for Vue to mount - wait for any content in #app
    console.log('Waiting for Vue to mount...');
    await page.waitForSelector('#app > *', { timeout: 10000 });
    console.log('Vue mounted!');
    
    const appDiv = await page.locator('#app').innerHTML();
    console.log('App div has content:', appDiv.length > 0);
    
    // Try to find register button
    const registerBtn = await page.locator('button:has-text("Register")').count();
    console.log('Register button found:', registerBtn > 0);
    
  } catch (e) {
    console.log('Error:', e.message);
    
    // Debug: capture page content
    const content = await page.content();
    console.log('Full page content:', content);
  }
  
  await browser.close();
})();
