import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      type: request.resourceType()
    });
  });
  
  page.on('response', async response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      contentType: response.headers()['content-type']
    });
  });
  
  page.on('console', msg => console.log('[CONSOLE]', msg.text()));
  page.on('pageerror', error => console.log('[PAGE ERROR]', error.message));
  
  await page.goto('http://kalendarz.loc', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('\n=== Failed Requests ===');
  const failedRequests = requests.filter((req, idx) => {
    const resp = responses[idx];
    return !resp || resp.status >= 400;
  });
  
  failedRequests.forEach((req, idx) => {
    console.log(`${idx + 1}. ${req.url} - Type: ${req.type}`);
  });
  
  await browser.close();
})();
