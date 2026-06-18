
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/haowang/projects/yanzhi-app/screenshot.png', fullPage: false });
  await browser.close();
  console.log('OK');
})().catch(e => { console.error('ERR:', e.message); process.exit(1); });
