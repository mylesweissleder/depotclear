import { chromium } from 'playwright';
import 'dotenv/config';

/**
 * Store-specific crawler for local inventory and penny deals
 * Home Depot has ~2,300 stores in the US
 */
class StoreCrawler {
  constructor() {
    this.baseUrl = 'https://www.homedepot.com';
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    });
  }

  /**
   * Get all Home Depot stores near a ZIP code
   * @param {string} zipCode - ZIP code to search
   * @param {number} radius - Radius in miles (default 25)
   */
  async getStoresNearZip(zipCode, radius = 25) {
    try {
      const url = `${this.baseUrl}/l/${zipCode}`;
      await this.page.goto(url, { timeout: 30000 });

      // Extract store data from the page
      const stores = await this.page.evaluate(() => {
        const storeElements = document.querySelectorAll('[data-component="StoreCard"]');
        const storeData = [];

        storeElements.forEach(el => {
          const name = el.querySelector('[data-testid="store-name"]')?.textContent?.trim();
          const address = el.querySelector('[data-testid="store-address"]')?.textContent?.trim();
          const distance = el.querySelector('[data-testid="store-distance"]')?.textContent?.trim();
          const storeId = el.getAttribute('data-store-id');

          if (name && storeId) {
            storeData.push({ name, address, distance, storeId });
          }
        });

        return storeData;
      });

      console.log(`✅ Found ${stores.length} stores near ${zipCode}`);
      return stores;

    } catch (error) {
      console.error('Error fetching stores:', error.message);
      return [];
    }
  }

  /**
   * Check product availability at specific store
   * This uses Home Depot's internal API (federation endpoint)
   */
  async checkStoreInventory(productId, storeId) {
    try {
      // Home Depot's federation API endpoint
      const apiUrl = `${this.baseUrl}/federation-gateway/graphql`;

      const response = await this.page.evaluate(async (url, pid, sid) => {
        const query = {
          operationName: 'productClientOnlyProduct',
          variables: {
            itemId: pid,
            storeId: sid,
          },
          query: `
            query productClientOnlyProduct($itemId: String!, $storeId: String!) {
              product(itemId: $itemId) {
                availabilityType {
                  type
                }
                fulfillment(storeId: $storeId) {
                  fulfillmentOptions {
                    type
                    services {
                      type
                      hasFreeShipping
                      locations {
                        inventory {
                          isOutOfStock
                          quantity
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query),
        });

        return res.json();
      }, apiUrl, productId, storeId);

      const inventory = response?.data?.product?.fulfillment?.fulfillmentOptions?.[0]?.services?.[0]?.locations?.[0]?.inventory;

      return {
        inStock: !inventory?.isOutOfStock,
        quantity: inventory?.quantity || 0,
      };

    } catch (error) {
      console.error(`Error checking inventory for ${productId}:`, error.message);
      return { inStock: false, quantity: 0 };
    }
  }

  /**
   * Scan a specific store for clearance items
   * Uses store-specific filters to find local deals
   */
  async scanStoreForDeals(storeId, storeName, categories = ['Tools', 'Lighting', 'Hardware']) {
    console.log(`\n🏪 Scanning ${storeName} (ID: ${storeId}) for clearance deals...`);

    const storeDeals = [];

    for (const category of categories) {
      try {
        // Search with store filter
        const searchUrl = `${this.baseUrl}/s/${category}%20clearance?NCNI-5&storeSelection=${storeId}`;
        await this.page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });

        await this.page.waitForSelector('[data-testid="product-pod"]', { timeout: 10000 });

        const products = await this.page.evaluate(() => {
          const pods = document.querySelectorAll('[data-testid="product-pod"]');
          const items = [];

          pods.forEach(pod => {
            const title = pod.querySelector('[data-testid="product-header"]')?.textContent?.trim();
            const priceText = pod.querySelector('[data-testid="product-price"]')?.textContent?.trim();
            const link = pod.querySelector('a[data-testid="product-pod-link"]')?.getAttribute('href');

            const priceMatch = priceText?.match(/\$?([\d,]+\.?\d*)/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;

            // Only grab penny deals and extreme clearance
            if (price !== null && price <= 5.00) {
              items.push({ title, price, priceText, url: link });
            }
          });

          return items;
        });

        console.log(`   📦 ${category}: Found ${products.length} clearance items ≤ $5`);
        storeDeals.push(...products.map(p => ({ ...p, category, storeId, storeName })));

        // Be respectful - rate limit
        await this.page.waitForTimeout(2000);

      } catch (error) {
        console.error(`   ❌ Error scanning ${category}:`, error.message);
      }
    }

    return storeDeals;
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

/**
 * Calculate how many stores we can realistically crawl
 */
export function calculateCrawlCapacity() {
  const stats = {
    totalStores: 2300, // Total Home Depot stores in US
    categoriesPerStore: 5, // Tools, Lighting, Hardware, Paint, Outdoor
    pagesPerCategory: 2, // First 2 pages of results
    requestsPerStore: 5 * 2, // 10 requests per store
    avgRequestTime: 3, // seconds (with rate limiting)
    timePerStore: 30, // seconds total per store

    // Hourly capacity
    storesPerHour: Math.floor(3600 / 30), // 120 stores/hour

    // Daily capacity (running 24/7)
    storesPerDay: Math.floor((3600 * 24) / 30), // 2,880 stores/day

    // Realistic: 6-hour windows, 4x per day
    storesPerWindow: Math.floor((3600 * 1.5) / 30), // 180 stores per 1.5hr window
    windowsPerDay: 4,
    realisticStoresPerDay: Math.floor((3600 * 1.5) / 30) * 4, // 720 stores/day
  };

  return stats;
}

/**
 * SMART CRAWL STRATEGY
 * Instead of crawling all stores, prioritize high-value targets
 */
export function smartCrawlStrategy() {
  return {
    tier1_hot_zones: {
      description: 'Major metros with highest user concentration',
      stores: 50, // Top 50 stores in NYC, LA, Chicago, Houston, Phoenix
      frequency: 'Every 6 hours', // 4x per day
      reason: 'Most users, highest ROI',
    },

    tier2_regional: {
      description: 'Regional hubs covering all major cities',
      stores: 200, // Cover top 100 cities (2 stores each)
      frequency: 'Every 12 hours', // 2x per day
      reason: 'Good coverage, manageable load',
    },

    tier3_on_demand: {
      description: 'User-requested stores (when user enters ZIP)',
      stores: 2050, // Remaining stores
      frequency: 'On-demand + weekly refresh',
      reason: 'Cache results, refresh when users search that area',
    },

    penny_deal_alerts: {
      description: 'Special scan for items < $1',
      frequency: 'Every 6 hours across Tier 1 & 2',
      notification: 'Push notification to users near that store',
    },
  };
}

// Example usage
async function demoStoreCrawl() {
  const crawler = new StoreCrawler();
  await crawler.initialize();

  // Example 1: Find stores near ZIP code
  const stores = await crawler.getStoresNearZip('90210', 25);
  console.log('\n📍 Stores near 90210:');
  stores.forEach((s, i) => console.log(`${i + 1}. ${s.name} - ${s.distance}`));

  // Example 2: Scan first store for deals
  if (stores.length > 0) {
    const deals = await crawler.scanStoreForDeals(stores[0].storeId, stores[0].name);

    console.log('\n🏆 PENNY DEALS FOUND:');
    deals
      .filter(d => d.price <= 1.00)
      .sort((a, b) => a.price - b.price)
      .forEach(d => {
        console.log(`💰 ${d.title}`);
        console.log(`   Price: ${d.priceText} | Category: ${d.category}`);
        console.log(`   Store: ${d.storeName}`);
        console.log('');
      });
  }

  await crawler.close();
}

// Show capacity calculations
console.log('\n📊 CRAWL CAPACITY ANALYSIS:');
console.log('═'.repeat(60));
const capacity = calculateCrawlCapacity();
console.log(`Total Home Depot Stores:     ${capacity.totalStores.toLocaleString()}`);
console.log(`Stores per hour (max):       ${capacity.storesPerHour}`);
console.log(`Stores per day (24/7):       ${capacity.storesPerDay.toLocaleString()}`);
console.log(`Realistic daily coverage:    ${capacity.realisticStoresPerDay} stores`);
console.log(`Days to crawl all stores:    ${Math.ceil(capacity.totalStores / capacity.realisticStoresPerDay)} days`);
console.log('');

console.log('💡 SMART STRATEGY:');
console.log('═'.repeat(60));
const strategy = smartCrawlStrategy();
console.log('Tier 1 (Hot Zones):      50 stores, every 6 hours');
console.log('Tier 2 (Regional):       200 stores, every 12 hours');
console.log('Tier 3 (On-Demand):      2,050 stores, weekly + when requested');
console.log('');
console.log('✅ Total Coverage: 100% of stores');
console.log('✅ Resource Usage: Optimized for high-value targets');
console.log('✅ User Experience: Fast results for most users');

export { StoreCrawler, demoStoreCrawl };
