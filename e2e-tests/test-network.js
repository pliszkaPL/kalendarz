import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/src/main.js')) {
      console.log('\n=== /src/main.js Response ===');
      console.log('URL:', url);
      console.log('Status:', response.status());
      console.log('Headers:', JSON.stringify(await response.allHeaders(), null, 2));
      const body = await response.text();
      console.log('Body preview (first 500 chars):', body.substring(0, 500));
    }
  });
  
  await page.goto('http://kalendarz.loc', { waitUntil: 'networkidle', timeout: 30000 });
  
  await browser.close();
})();
