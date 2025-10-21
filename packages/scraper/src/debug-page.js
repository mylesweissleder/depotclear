import { chromium } from 'playwright';

async function debugHomeDepotPage() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.chrome = { runtime: {} };
  });

  try {
    console.log('📍 Navigating to Home Depot clearance search...');
    await page.goto('https://www.homedepot.com/s/tools%20clearance?NCNI-5', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ path: '/Users/myles/depotclear/debug-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to debug-screenshot.png');

    // Save HTML
    const html = await page.content();
    const fs = await import('fs');
    fs.writeFileSync('/Users/myles/depotclear/debug-page.html', html);
    console.log('📄 HTML saved to debug-page.html');

    // Check for common selectors
    console.log('\n🔍 Checking for product selectors:');
    const selectors = [
      '[data-testid="product-pod"]',
      '.product-pod',
      '.product',
      '.pod',
      '[data-component="ProductPod"]',
      '.product-card',
      '.hd-product',
    ];

    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      console.log(`   ${selector}: ${count} found`);
    }

    // Check page title
    const title = await page.title();
    console.log(`\n📌 Page title: ${title}`);

    // Wait for user to inspect
    console.log('\n👀 Browser will stay open for 60 seconds - inspect the page manually');
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugHomeDepotPage();
