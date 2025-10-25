import { chromium } from 'playwright';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

/**
 * Master scraper for 50 metros
 * Run from: packages/scraper/
 * Command: DATABASE_URL="..." node src/scrape-50-metros.js
 */

// All 37 new cities to scrape (we already have 13)
const NEW_CITIES = [
  // Tier 1: Major Metros (15)
  { city: 'New York', state: 'NY', region: 'northeast' },
  { city: 'Boston', state: 'MA', region: 'northeast' },
  { city: 'Washington', state: 'DC', region: 'northeast' },
  { city: 'Philadelphia', state: 'PA', region: 'northeast' },
  { city: 'Miami', state: 'FL', region: 'southeast' },
  { city: 'Atlanta', state: 'GA', region: 'southeast' },
  { city: 'Baltimore', state: 'MD', region: 'northeast' },
  { city: 'Chicago', state: 'IL', region: 'midwest' },
  { city: 'Minneapolis', state: 'MN', region: 'midwest' },
  { city: 'Denver', state: 'CO', region: 'mountain' },
  { city: 'Austin', state: 'TX', region: 'southwest' },
  { city: 'Phoenix', state: 'AZ', region: 'southwest' },
  { city: 'Las Vegas', state: 'NV', region: 'southwest' },
  { city: 'Portland', state: 'OR', region: 'pacific-northwest' },
  { city: 'Tacoma', state: 'WA', region: 'pacific-northwest' },

  // Tier 2: Secondary Markets (12)
  { city: 'Nashville', state: 'TN', region: 'southeast' },
  { city: 'Charlotte', state: 'NC', region: 'southeast' },
  { city: 'Raleigh', state: 'NC', region: 'southeast' },
  { city: 'Tampa', state: 'FL', region: 'southeast' },
  { city: 'Orlando', state: 'FL', region: 'southeast' },
  { city: 'Dallas', state: 'TX', region: 'southwest' },
  { city: 'Houston', state: 'TX', region: 'southwest' },
  { city: 'San Antonio', state: 'TX', region: 'southwest' },
  { city: 'Salt Lake City', state: 'UT', region: 'mountain' },
  { city: 'Albuquerque', state: 'NM', region: 'southwest' },
  { city: 'Sacramento', state: 'CA', region: 'california' },
  { city: 'San Luis Obispo', state: 'CA', region: 'california' },

  // Tier 3: Fill-in Markets (10)
  { city: 'San Rafael', state: 'CA', region: 'bay-area' },
  { city: 'Walnut Creek', state: 'CA', region: 'bay-area' },
  { city: 'Pleasanton', state: 'CA', region: 'bay-area' },
  { city: 'Santa Cruz', state: 'CA', region: 'california' },
  { city: 'Santa Monica', state: 'CA', region: 'socal' },
  { city: 'Long Beach', state: 'CA', region: 'socal' },
  { city: 'Irvine', state: 'CA', region: 'socal' },
  { city: 'Boulder', state: 'CO', region: 'mountain' },
  { city: 'Madison', state: 'WI', region: 'midwest' },
  { city: 'Ann Arbor', state: 'MI', region: 'midwest' },
];

class EnhancedDogDaycareScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.db = null;
  }

  async initialize() {
    console.log('🚀 Initializing enhanced scraper...');

    this.browser = await chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage', '--no-sandbox'],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Anti-detection
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
    });

    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Connect to database
    this.db = new Client({ connectionString: process.env.DATABASE_URL });
    await this.db.connect();
    console.log('✅ Connected to database\n');
  }

  async scrapeCity(city, state = 'CA', region = 'bay-area') {
    const searchQuery = `dog daycare in ${city}, ${state}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

    console.log(`\n🔍 Searching: ${searchQuery}`);

    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(5000);

      // Scroll to load more results
      await this.scrollResults();

      // Get all business links
      const businessLinks = await this.extractBusinessLinks();
      console.log(`   Found ${businessLinks.length} businesses\n`);

      let processed = 0;
      for (const link of businessLinks) {
        try {
          processed++;
          console.log(`   [${processed}/${businessLinks.length}] Processing: ${link.name}`);

          const details = await this.scrapeBusinessDetails(link.url);

          if (details) {
            await this.saveToDatabase({
              ...details,
              city,
              state,
              region,
            });
            console.log(`      ✅ Saved`);
          }

          // Random delay to avoid rate limiting
          await this.page.waitForTimeout(2000 + Math.random() * 3000);

        } catch (error) {
          console.error(`      ❌ Error: ${error.message}`);
        }
      }

      console.log(`\n✅ Completed ${city}: ${processed} businesses processed`);

    } catch (error) {
      console.error(`❌ Error scraping ${city}:`, error.message);
    }
  }

  async scrollResults() {
    try {
      const resultsPane = await this.page.$('[role="feed"]');
      if (resultsPane) {
        for (let i = 0; i < 5; i++) {
          await this.page.evaluate(() => {
            const el = document.querySelector('[role="feed"]');
            if (el) el.scrollTop = el.scrollHeight;
          });
          await this.page.waitForTimeout(1500);
        }
      }
    } catch (error) {
      console.log('   ⚠️  Scroll error (non-fatal):', error.message);
    }
  }

  async extractBusinessLinks() {
    return await this.page.evaluate(() => {
      const links = [];
      const items = document.querySelectorAll('a[href*="/maps/place/"]');

      items.forEach(item => {
        const name = item.getAttribute('aria-label');
        const href = item.getAttribute('href');
        if (name && href && !links.find(l => l.name === name)) {
          links.push({ name, url: href });
        }
      });

      return links;
    });
  }

  async scrapeBusinessDetails(url) {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForTimeout(3000);

      const details = await this.page.evaluate(() => {
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el?.textContent?.trim() || null;
        };

        const name = getText('h1');
        const rating = getText('[role="img"][aria-label*="stars"]')?.match(/[\d.]+/)?.[0];
        const reviewCount = getText('[role="img"][aria-label*="stars"]')?.match(/\\d+(?=\\sreview)/)?.[0];
        const phone = getText('button[data-item-id*="phone"]');
        const website = document.querySelector('a[data-item-id*="authority"]')?.href;
        const address = getText('button[data-item-id*="address"]');

        return { name, rating, reviewCount, phone, website, address };
      });

      return details.name ? details : null;

    } catch (error) {
      console.error(`      ⚠️  Details error: ${error.message}`);
      return null;
    }
  }

  async saveToDatabase(data) {
    const { name, city, state, region, address, phone, website, rating, reviewCount } = data;

    try {
      await this.db.query(
        `INSERT INTO dog_daycares
         (name, city, state, region, address, phone, website, rating, review_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (name, city) DO UPDATE SET
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           phone = EXCLUDED.phone,
           website = EXCLUDED.website`,
        [name, city, state, region, address, phone, website, parseFloat(rating) || 0, parseInt(reviewCount) || 0]
      );
    } catch (error) {
      console.error(`      ❌ DB error: ${error.message}`);
    }
  }

  async cleanup() {
    if (this.db) await this.db.end();
    if (this.browser) await this.browser.close();
  }
}

// Main execution
async function main() {
  const scraper = new EnhancedDogDaycareScraper();

  try {
    await scraper.initialize();

    console.log(`\n🎯 Starting scrape of ${NEW_CITIES.length} new metros...\n`);
    console.log(`📊 Progress will be saved to database in real-time\n`);

    let completed = 0;
    for (const { city, state, region } of NEW_CITIES) {
      completed++;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📍 Metro ${completed}/${NEW_CITIES.length}: ${city}, ${state}`);
      console.log(`${'='.repeat(60)}`);

      await scraper.scrapeCity(city, state, region);

      // Longer delay between cities to avoid rate limiting
      if (completed < NEW_CITIES.length) {
        console.log(`\n⏸️  Cooling down for 10 seconds before next city...\n`);
        await scraper.page.waitForTimeout(10000);
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🎉 ALL DONE! Scraped ${NEW_CITIES.length} metros`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  } finally {
    await scraper.cleanup();
  }
}

main();
