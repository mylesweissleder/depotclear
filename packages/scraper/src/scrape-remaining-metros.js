import { chromium } from 'playwright';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

/**
 * Scraper for remaining 13 metros (the biggest ones!)
 * These are the metros we haven't covered yet
 */

const REMAINING_METROS = [
  // Bay Area - The Big 3
  { city: 'San Francisco', state: 'CA', region: 'bay-area' },
  { city: 'Oakland', state: 'CA', region: 'bay-area' },
  { city: 'San Jose', state: 'CA', region: 'bay-area' },

  // SoCal - Major Markets
  { city: 'Los Angeles', state: 'CA', region: 'socal' },
  { city: 'San Diego', state: 'CA', region: 'socal' },

  // Pacific Northwest
  { city: 'Seattle', state: 'WA', region: 'pacific-northwest' },

  // Midwest - Industrial Hubs
  { city: 'Detroit', state: 'MI', region: 'midwest' },
  { city: 'Columbus', state: 'OH', region: 'midwest' },
  { city: 'Indianapolis', state: 'IN', region: 'midwest' },
  { city: 'Cleveland', state: 'OH', region: 'midwest' },
  { city: 'Pittsburgh', state: 'PA', region: 'northeast' },

  // Southeast
  { city: 'Richmond', state: 'VA', region: 'southeast' },
  { city: 'Memphis', state: 'TN', region: 'southeast' },
];

class EnhancedDogDaycareScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.db = null;
  }

  async initialize() {
    console.log('🚀 Initializing enhanced scraper for REMAINING METROS...');

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
        const ratingText = getText('[role="img"][aria-label*="stars"]');
        const rating = ratingText?.match(/[\d.]+/)?.[0];
        const reviewCount = ratingText?.match(/\d+(?=\sreview)/)?.[0];
        const phone = getText('button[data-item-id*="phone"]');
        const website = document.querySelector('a[data-item-id*="authority"]')?.href;
        const address = getText('button[data-item-id*="address"]');

        // Get coordinates from URL
        const coordMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        const latitude = coordMatch ? parseFloat(coordMatch[1]) : null;
        const longitude = coordMatch ? parseFloat(coordMatch[2]) : null;

        // Get place_id
        const placeIdMatch = window.location.href.match(/!1s([^!]+)/);
        const placeId = placeIdMatch ? placeIdMatch[1] : null;

        return { name, rating, reviewCount, phone, website, address, latitude, longitude, placeId };
      });

      return details.name ? details : null;

    } catch (error) {
      console.error(`      ⚠️  Details error: ${error.message}`);
      return null;
    }
  }

  async saveToDatabase(data) {
    const { name, city, state, region, address, phone, website, rating, reviewCount, latitude, longitude, placeId } = data;

    try {
      await this.db.query(
        `INSERT INTO dog_daycares
         (name, city, state, address, phone, website, rating, review_count, latitude, longitude, place_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
         ON CONFLICT (place_id) DO UPDATE SET
           name = EXCLUDED.name,
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           phone = EXCLUDED.phone,
           website = EXCLUDED.website,
           updated_at = NOW()`,
        [name, city, state, address, phone, website, parseFloat(rating) || 0, parseInt(reviewCount) || 0, latitude, longitude, placeId]
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

    console.log(`\n🎯 Starting scrape of ${REMAINING_METROS.length} REMAINING metros...\n`);
    console.log(`📊 These are the BIG ONES: SF, LA, Seattle, San Diego, etc.\n`);

    let completed = 0;
    for (const { city, state, region } of REMAINING_METROS) {
      completed++;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📍 Metro ${completed}/${REMAINING_METROS.length}: ${city}, ${state}`);
      console.log(`${'='.repeat(60)}`);

      await scraper.scrapeCity(city, state, region);

      // Longer delay between cities to avoid rate limiting
      if (completed < REMAINING_METROS.length) {
        console.log(`\n⏸️  Cooling down for 10 seconds before next city...\n`);
        await scraper.page.waitForTimeout(10000);
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🎉 ALL DONE! Scraped ${REMAINING_METROS.length} metros`);
    console.log(`🎉 TOTAL: 37 + ${REMAINING_METROS.length} = ${37 + REMAINING_METROS.length} metros complete!`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  } finally {
    await scraper.cleanup();
  }
}

main();
