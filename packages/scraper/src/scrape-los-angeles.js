import { chromium } from 'playwright';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// LA Metro cities to scrape
const laCities = [
  // Core LA
  'Los Angeles', 'Santa Monica', 'West Hollywood', 'Beverly Hills', 'Culver City',
  // West LA
  'Brentwood', 'Pacific Palisades', 'Venice', 'Marina del Rey', 'Playa del Rey',
  // East LA
  'Pasadena', 'Glendale', 'Burbank', 'Alhambra', 'South Pasadena',
  // South Bay
  'Long Beach', 'Torrance', 'Redondo Beach', 'Manhattan Beach', 'Hermosa Beach', 'El Segundo',
  // San Fernando Valley
  'Van Nuys', 'Sherman Oaks', 'Encino', 'Woodland Hills', 'Northridge', 'Studio City',
  // San Gabriel Valley
  'Arcadia', 'Monrovia', 'Glendora', 'West Covina', 'Pomona',
  // Orange County (LA Metro)
  'Irvine', 'Newport Beach', 'Huntington Beach', 'Costa Mesa', 'Anaheim',
];

class DogDaycareScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing browser for LA Metro...');
    this.browser = await chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage', '--no-sandbox'],
    });
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
    });
  }

  async scrapeCity(city, state = 'CA') {
    const searchQuery = `dog daycare in ${city}, ${state}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

    console.log(`\n🔍 Searching: ${searchQuery}`);

    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(5000);
      await this.scrollResults();

      const businesses = await this.page.evaluate((cityName) => {
        const results = [];
        const placeLinks = document.querySelectorAll('a[href*="/maps/place/"]');

        placeLinks.forEach((link) => {
          try {
            let container = link.closest('div[jsaction]') || link.closest('div.Nv2PK') || link.parentElement;
            const name = link.querySelector('[class*="fontHeadline"]')?.textContent?.trim() ||
                        link.querySelector('div[role="heading"]')?.textContent?.trim() ||
                        link.getAttribute('aria-label');
            if (!name) return;

            let rating = null, reviewCount = null;
            const ratingEl = container.querySelector('span[role="img"]');
            if (ratingEl) {
              const ariaLabel = ratingEl.getAttribute('aria-label');
              if (ariaLabel) {
                const ratingMatch = ariaLabel.match(/(\d+\.?\d*)/);
                if (ratingMatch) rating = parseFloat(ratingMatch[1]);
                const reviewMatch = ariaLabel.match(/(\d+,?\d*)\s+review/);
                if (reviewMatch) reviewCount = parseInt(reviewMatch[1].replace(',', ''));
              }
            }

            const allText = container.textContent || '';
            let address = null;
            const addressMatch = allText.match(/\d+\s+[A-Z][a-z]+\s+(?:St|Ave|Blvd|Rd|Dr|Way|Ln)[.,]?/);
            if (addressMatch) address = addressMatch[0].trim();

            results.push({
              name, rating, reviewCount, address,
              phone: null, website: null, priceLevel: null,
              googleMapsUrl: link.href,
              city: cityName,
              region: 'los-angeles',
              scrapedAt: new Date().toISOString(),
            });
          } catch (e) {}
        });
        return results;
      }, city);

      console.log(`   ✅ Found ${businesses.length} dog daycares in ${city}`);
      return businesses;
    } catch (error) {
      console.error(`❌ Error scraping ${city}:`, error.message);
      return [];
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
          await this.page.waitForTimeout(2000);
        }
      }
    } catch (e) {}
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

async function saveToDatabase(businesses) {
  let savedCount = 0;
  try {
    console.log('\n💾 Saving LA daycares to database...');
    for (const business of businesses) {
      try {
        await pool.query(
          `INSERT INTO dog_daycares (name, rating, review_count, address, phone, website, google_maps_url, price_level, city, region, scraped_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (name, city) DO UPDATE SET
             rating = EXCLUDED.rating, review_count = EXCLUDED.review_count,
             address = EXCLUDED.address, google_maps_url = EXCLUDED.google_maps_url,
             updated_at = CURRENT_TIMESTAMP`,
          [business.name, business.rating, business.reviewCount, business.address,
           business.phone, business.website, business.googleMapsUrl, business.priceLevel,
           business.city, business.region, business.scrapedAt]
        );
        savedCount++;
      } catch (err) {
        console.error(`   ❌ Error saving ${business.name}: ${err.message}`);
      }
    }
    console.log(`\n✅ Saved ${savedCount} businesses to database`);
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

async function main() {
  const scraper = new DogDaycareScraper();
  try {
    await scraper.initialize();
    const allBusinesses = [];

    console.log(`🏙️ Starting LA Metro scraper (${laCities.length} cities)...\n`);

    for (const city of laCities) {
      const businesses = await scraper.scrapeCity(city);
      allBusinesses.push(...businesses);
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    }

    console.log(`\n📊 Scraping Summary: ${allBusinesses.length} total daycares found in LA Metro`);

    if (allBusinesses.length > 0) {
      await saveToDatabase(allBusinesses);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await scraper.close();
    await pool.end();
  }
}

main();
