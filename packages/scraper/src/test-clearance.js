import { chromium } from 'playwright';

async function testClearance() {
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
    console.log('📍 Loading clearance section...');
    await page.goto('https://www.homedepot.com/b/Clearance/N-5yc1vZ1z11adf', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForTimeout(5000);

    // Get all text and look for prices
    const html = await page.content();

    // Find all prices
    const priceMatches = html.match(/\$\d+\.\d{2}/g) || [];
    const uniquePrices = [...new Set(priceMatches)];

    console.log('\n💰 All prices found on page:');
    uniquePrices.forEach(price => {
      const cents = price.split('.')[1];
      const isClearance = ['02', '03', '04', '06', '01'].includes(cents);
      console.log(`   ${price}${isClearance ? ' ← CLEARANCE INDICATOR!' : ''}`);
    });

    // Count product pods
    const podCount = await page.locator('[data-testid="product-pod"]').count();
    console.log(`\n📦 Found ${podCount} product pods`);

    if (podCount > 0) {
      // Get text from first pod
      const firstPodText = await page.locator('[data-testid="product-pod"]').first().textContent();
      console.log(`\n📝 First product pod text:\n${firstPodText.substring(0, 300)}...`);
    }

    console.log('\n👀 Browser will stay open for inspection (60 seconds)...');
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testClearance();
