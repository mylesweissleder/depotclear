import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import 'dotenv/config';

/**
 * Main scraper for Home Depot clearance items
 */
class HomeDepotScraper {
  constructor() {
    this.baseUrl = 'https://www.homedepot.com';
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing browser...');

    // Launch with anti-detection settings
    this.browser = await chromium.launch({
      headless: false, // Use headed mode - looks more human
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });

    this.page = await this.browser.newPage();

    // Set realistic viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Remove automation markers
    await this.page.addInitScript(() => {
      // Override the navigator.webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Mock plugins and mimeTypes
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Chrome runtime
      window.chrome = {
        runtime: {},
      };

      // Permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters);
    });

    // Set realistic headers
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
    });
  }

  /**
   * Search for clearance items in a specific category
   * @param {string} category - Category to search (e.g., 'Tools', 'Lighting')
   * @param {number} maxPages - Maximum pages to scrape
   */
  async scrapeCategory(category, maxPages = 3) {
    // Use the actual clearance section with category filter
    const categoryMap = {
      'Tools': 'c1xy',
      'Lighting': 'ajff',
      'Hardware': 'c1zl',
      'Paint': 'aqor',
      'Outdoor': 'bx82',
      'All': ''
    };

    const categoryCode = categoryMap[category] || '';
    const searchUrl = categoryCode
      ? `${this.baseUrl}/b/${category}/Clearance/N-5yc1vZ${categoryCode}Z1z11adf`
      : `${this.baseUrl}/b/Clearance/N-5yc1vZ1z11adf`;

    console.log(`\n🔍 Searching: ${category} clearance`);
    console.log(`   URL: ${searchUrl}`);

    try {
      // Navigate with more realistic settings
      await this.page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // Random delay to appear more human
      await this.randomDelay(2000, 4000);

      // Try to wait for products, but continue if timeout
      try {
        await this.page.waitForSelector('[data-testid="product-pod"], .product-pod, .product', {
          timeout: 15000,
        });
      } catch (e) {
        console.log('      Product selector not found, checking page content...');
      }

      // Scroll to simulate human behavior
      await this.humanScroll();

      const items = [];

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        console.log(`   📄 Scraping page ${pageNum}...`);

        await this.randomDelay(1000, 2000);

        // Use dynamic parsing (works better for React-heavy sites)
        const pageItems = await this.parseProductPageDynamic(category);
        items.push(...pageItems);

        console.log(`      Found ${pageItems.length} clearance items on page ${pageNum}`);

        // Try to navigate to next page
        if (pageNum < maxPages) {
          const hasNext = await this.goToNextPage();
          if (!hasNext) {
            console.log('      No more pages available');
            break;
          }
          await this.randomDelay(3000, 5000); // Longer delay between pages
        }
      }

      return items;

    } catch (error) {
      console.error(`❌ Error scraping ${category}:`, error.message);
      return [];
    }
  }

  /**
   * Random delay to appear more human
   */
  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await this.page.waitForTimeout(delay);
  }

  /**
   * Simulate human scrolling behavior
   */
  async humanScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight / 2) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  /**
   * Parse product HTML using page.evaluate (works better for dynamic content)
   */
  async parseProductPageDynamic(category) {
    try {
      const products = await this.page.evaluate((cat) => {
        const pods = document.querySelectorAll('[data-testid="product-pod"]');
        const results = [];

        pods.forEach((pod) => {
          try {
            // Get all text content
            const text = pod.textContent || '';

            // Find price with regex - handle both $123 and $1,234 formats
            const priceMatch = text.match(/\$(\d+)(?:,(\d+))?\.?(\d{2})?/);

            // Find title
            const titleElem = pod.querySelector('h3, h2, [class*="product"]');
            const title = titleElem ? titleElem.textContent.trim() : '';

            // Find link
            const linkElem = pod.querySelector('a[href*="/p/"]');
            const url = linkElem ? linkElem.href : '';

            // Extract SKU from URL (/p/Product-Name/SKU)
            let sku = null;
            if (url) {
              const skuMatch = url.match(/\/p\/[^\/]+\/(\d+)/);
              if (skuMatch) sku = skuMatch[1];
            }

            // Find image
            const imgElem = pod.querySelector('img');
            const imageUrl = imgElem ? imgElem.src : null;

            // Try to find model number in text
            const modelMatch = text.match(/Model[#:\s]+([A-Z0-9-]+)/i);
            const modelNumber = modelMatch ? modelMatch[1] : null;

            if (priceMatch && title) {
              const dollars = priceMatch[1] + (priceMatch[2] || '');
              const cents = priceMatch[3] || '00';
              const price = parseFloat(`${dollars}.${cents}`);

              // Check if it's a clearance indicator price
              // .60 = 25% off (shows as .06 in-store)
              // .40 = 50% off (shows as .04 in-store)
              // .30 = 75% off (shows as .03 in-store)
              // .20 = 90% off (shows as .02 in-store)
              // .01 = penny item
              const lastDigit = cents[1];
              const isPennyDealPrice = ['0', '2', '3', '4', '6'].includes(lastDigit) && cents !== '00';

              const isClearancePrice = price <= 1.00 || isPennyDealPrice;

              if (isClearancePrice) {
                results.push({
                  title: title.substring(0, 200),
                  price,
                  priceText: `$${dollars}.${cents}`,
                  category: cat,
                  isClearancePrice: true,
                  isPennyDealPrice,
                  modelNumber: modelNumber || sku,
                  sku: sku,
                  url,
                  imageUrl,
                  scrapedAt: new Date().toISOString(),
                });
              }
            }
          } catch (e) {
            // Skip errors on individual products
          }
        });

        return results;
      }, category);

      return products;
    } catch (err) {
      console.error('Error parsing products:', err.message);
      return [];
    }
  }

  /**
   * Parse product HTML and extract clearance items (legacy cheerio method - fallback)
   */
  parseProductPage(html, category) {
    const $ = cheerio.load(html);
    const products = [];

    $('[data-testid="product-pod"]').each((i, element) => {
      try {
        const $pod = $(element);
        const podText = $pod.text();

        // Find price
        const priceMatch = podText.match(/\$(\d+)(?:,(\d+))?\.?(\d{2})?/);
        if (!priceMatch) return;

        const dollars = priceMatch[1] + (priceMatch[2] || '');
        const cents = priceMatch[3] || '00';
        const price = parseFloat(`${dollars}.${cents}`);

        // Check clearance indicators
        const lastDigit = cents[1];
        const isPennyDealPrice = ['0', '2', '3', '4', '6'].includes(lastDigit) && cents !== '00';
        const isClearancePrice = price <= 1.00 || isPennyDealPrice;

        if (!isClearancePrice) return;

        // Extract title
        let title = $pod.find('h3, h2').first().text().trim();

        // Extract link
        const link = $pod.find('a[href*="/p/"]').first().attr('href');

        // Extract image
        const image = $pod.find('img').first().attr('src');

        if (title) {
          products.push({
            title: title.substring(0, 200),
            price,
            priceText: `$${dollars}.${cents}`,
            category,
            isClearancePrice: true,
            isPennyDealPrice,
            modelNumber: null,
            url: link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : null,
            imageUrl: image,
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        // Skip errors
      }
    });

    return products;
  }

  /**
   * Navigate to next page of results
   */
  async goToNextPage() {
    try {
      const nextButton = await this.page.$('button[aria-label="Next"]');
      if (!nextButton) return false;

      const isDisabled = await nextButton.getAttribute('disabled');
      if (isDisabled !== null) return false;

      await nextButton.click();
      await this.page.waitForTimeout(1000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get product details including store availability
   */
  async getProductDetails(productUrl, zipCode = '90210') {
    try {
      await this.page.goto(productUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // Try to set ZIP code for local availability
      const zipInput = await this.page.$('input[data-testid="zip-code-input"]');
      if (zipInput) {
        await zipInput.fill(zipCode);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
      }

      const html = await this.page.content();
      const $ = cheerio.load(html);

      // Extract store availability data
      const storeData = [];
      $('[data-testid="store-availability-item"]').each((i, el) => {
        const storeName = $(el).find('[data-testid="store-name"]').text().trim();
        const stock = $(el).find('[data-testid="stock-status"]').text().trim();
        const distance = $(el).find('[data-testid="store-distance"]').text().trim();

        if (storeName) {
          storeData.push({ storeName, stock, distance });
        }
      });

      return { stores: storeData };

    } catch (error) {
      console.error('Error fetching product details:', error.message);
      return { stores: [] };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n✅ Browser closed');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const scraper = new HomeDepotScraper();

  try {
    await scraper.initialize();

    // Define categories to scrape
    const categories = [
      'Tools',
      'Lighting',
      'Outdoor',
      'Paint',
      'Hardware'
    ];

    const allProducts = [];

    for (const category of categories) {
      const items = await scraper.scrapeCategory(category, 2); // 2 pages per category
      allProducts.push(...items);
    }

    // Filter and display top clearance items
    const clearanceItems = allProducts
      .filter(item => item.isClearancePrice)
      .sort((a, b) => a.price - b.price)
      .slice(0, 50);

    console.log('\n\n🏆 TOP CLEARANCE FINDS:\n');
    console.log('=' .repeat(80));

    clearanceItems.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.title}`);
      console.log(`   💰 ${item.priceText} | 📦 ${item.category} | 🔖 ${item.modelNumber || 'N/A'}`);
      console.log(`   🔗 ${item.url}`);
      console.log('');
    });

    console.log('=' .repeat(80));
    console.log(`\n📊 Summary: Found ${allProducts.length} total items, ${clearanceItems.length} clearance-priced`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { HomeDepotScraper };
