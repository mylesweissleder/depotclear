import { chromium } from 'playwright';

async function testExtract() {
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

    console.log('⏳ Waiting for products to load...');
    await page.waitForTimeout(8000);

    // Use Playwright's evaluate to extract product data directly from the DOM
    const products = await page.evaluate(() => {
      const pods = document.querySelectorAll('[data-testid="product-pod"]');
      const results = [];

      pods.forEach((pod, index) => {
        try {
          // Get all text content
          const text = pod.textContent || '';

          // Find price with regex
          const priceMatch = text.match(/\$(\d+)(?:,(\d+))?\.?(\d{2})?/);

          // Find title - usually in a link or heading
          const titleElem = pod.querySelector('h3, h2, [class*="product"]');
          const title = titleElem ? titleElem.textContent.trim() : '';

          // Find link
          const linkElem = pod.querySelector('a[href*="/p/"]');
          const url = linkElem ? linkElem.href : '';

          if (priceMatch) {
            const dollars = priceMatch[1] + (priceMatch[2] || '');
            const cents = priceMatch[3] || '00';
            const price = parseFloat(`${dollars}.${cents}`);

            results.push({
              index,
              title: title.substring(0, 100),
              price,
              priceText: `$${dollars}.${cents}`,
              url,
              textSample: text.substring(0, 200).replace(/\s+/g, ' ')
            });
          }
        } catch (e) {
          // Skip errors
        }
      });

      return results;
    });

    console.log(`\n✅ Extracted ${products.length} products:\n`);
    products.slice(0, 10).forEach(p => {
      console.log(`${p.index + 1}. ${p.title}`);
      console.log(`   💰 ${p.priceText}`);
      console.log(`   🔗 ${p.url}`);
      console.log('');
    });

    console.log('\n👀 Browser will stay open (30 seconds)...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testExtract();
