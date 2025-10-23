import { chromium } from 'playwright';

async function testGoogleMaps() {
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
    console.log('🔍 Loading Google Maps...');
    await page.goto('https://www.google.com/maps/search/dog+daycare+in+San+Francisco,+CA', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('⏳ Waiting 10 seconds for results...');
    await page.waitForTimeout(10000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/gmaps-test.png', fullPage: false });
    console.log('📸 Screenshot saved to /tmp/gmaps-test.png');

    // Try to extract with various selectors
    console.log('\n🔎 Testing selectors...\n');

    const tests = [
      { name: 'role=article', selector: '[role="article"]' },
      { name: 'role=feed', selector: '[role="feed"]' },
      { name: 'div[jsaction]', selector: 'div[jsaction*="mouseover"]' },
      { name: 'a with href=/maps/place/', selector: 'a[href*="/maps/place/"]' },
      { name: 'div.Nv2PK', selector: 'div.Nv2PK' },
    ];

    for (const test of tests) {
      const count = await page.locator(test.selector).count();
      console.log(`${test.name}: ${count} elements found`);
    }

    // Try to extract data with updated approach
    console.log('\n📊 Attempting extraction...\n');

    const businesses = await page.evaluate(() => {
      const results = [];

      // Try multiple possible selectors
      const containers = [
        ...document.querySelectorAll('a[href*="/maps/place/"]')
      ];

      console.log(`Found ${containers.length} place links`);

      containers.forEach((link, index) => {
        if (index > 20) return; // Limit for testing

        try {
          // Get the parent container
          let container = link.closest('div[jsaction]');
          if (!container) container = link.parentElement;

          const name = link.querySelector('[class*="fontHeadline"]')?.textContent?.trim() ||
                      link.querySelector('div[role="heading"]')?.textContent?.trim() ||
                      link.getAttribute('aria-label');

          // Look for rating
          let rating = null;
          const ratingEl = container.querySelector('span[role="img"]');
          if (ratingEl) {
            const ariaLabel = ratingEl.getAttribute('aria-label');
            if (ariaLabel) {
              const match = ariaLabel.match(/(\d+\.?\d*)/);
              if (match) rating = parseFloat(match[1]);
            }
          }

          if (name) {
            results.push({
              name,
              rating,
              href: link.href,
            });
          }
        } catch (e) {
          console.error('Error extracting:', e.message);
        }
      });

      return results;
    });

    console.log(`\n✅ Extracted ${businesses.length} businesses:\n`);
    businesses.slice(0, 10).forEach((b, i) => {
      console.log(`${i + 1}. ${b.name}`);
      console.log(`   Rating: ${b.rating || 'N/A'}`);
      console.log(`   URL: ${b.href}`);
      console.log('');
    });

    console.log('\n👀 Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testGoogleMaps();
