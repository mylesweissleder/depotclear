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
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();

    // Set realistic headers
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });
  }

  /**
   * Search for clearance items in a specific category
   * @param {string} category - Category to search (e.g., 'Tools', 'Lighting')
   * @param {number} maxPages - Maximum pages to scrape
   */
  async scrapeCategory(category, maxPages = 3) {
    const searchUrl = `${this.baseUrl}/s/${encodeURIComponent(category)}%20clearance?NCNI-5`;
    console.log(`\n🔍 Searching: ${category} clearance`);
    console.log(`   URL: ${searchUrl}`);

    try {
      await this.page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for product grid to load
      await this.page.waitForSelector('[data-testid="product-pod"]', { timeout: 10000 });

      const items = [];

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        console.log(`   📄 Scraping page ${pageNum}...`);

        const html = await this.page.content();
        const pageItems = this.parseProductPage(html, category);
        items.push(...pageItems);

        console.log(`      Found ${pageItems.length} items on page ${pageNum}`);

        // Try to navigate to next page
        if (pageNum < maxPages) {
          const hasNext = await this.goToNextPage();
          if (!hasNext) {
            console.log('      No more pages available');
            break;
          }
          await this.page.waitForTimeout(2000); // Be respectful
        }
      }

      return items;

    } catch (error) {
      console.error(`❌ Error scraping ${category}:`, error.message);
      return [];
    }
  }

  /**
   * Parse product HTML and extract clearance items
   */
  parseProductPage(html, category) {
    const $ = cheerio.load(html);
    const products = [];

    $('[data-testid="product-pod"]').each((i, element) => {
      try {
        const $pod = $(element);

        // Extract product data
        const title = $pod.find('[data-testid="product-header"]').text().trim();
        const priceText = $pod.find('[data-testid="product-price"]').text().trim();
        const link = $pod.find('a[data-testid="product-pod-link"]').attr('href');
        const image = $pod.find('img').first().attr('src');
        const modelNumber = $pod.find('[data-testid="product-model"]').text().trim();

        // Parse price
        const priceMatch = priceText.match(/\$?([\d,]+\.?\d*)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;

        // Check if it's a clearance-priced item (ends in .01, .03, .06, .88, .99 or <= $1)
        const isClearancePrice = price !== null && (
          price <= 1.00 ||
          priceText.includes('.01') ||
          priceText.includes('.03') ||
          priceText.includes('.06') ||
          priceText.includes('.88') ||
          priceText.includes('.99')
        );

        if (title && price !== null) {
          products.push({
            title,
            price,
            priceText,
            category,
            isClearancePrice,
            modelNumber,
            url: link ? `${this.baseUrl}${link}` : null,
            imageUrl: image,
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error parsing product:', err.message);
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
