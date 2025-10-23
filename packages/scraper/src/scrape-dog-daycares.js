import { chromium } from 'playwright';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Scrape dog daycare businesses from Google Maps for SF Bay Area
 */
class DogDaycareScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing browser...');

    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Anti-detection
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
    });

    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });
  }

  async scrapeCity(city, state = 'CA') {
    const searchQuery = `dog daycare in ${city}, ${state}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

    console.log(`\n🔍 Searching: ${searchQuery}`);
    console.log(`   URL: ${url}`);

    try {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // Wait for results to load
      await this.page.waitForTimeout(5000);

      // Scroll through results to load more
      await this.scrollResults();

      const businesses = await this.extractBusinesses(city);
      console.log(`   ✅ Found ${businesses.length} dog daycares in ${city}`);

      return businesses;

    } catch (error) {
      console.error(`❌ Error scraping ${city}:`, error.message);
      return [];
    }
  }

  async scrollResults() {
    // Scroll the left sidebar to load more results
    try {
      const resultsPane = await this.page.$('[role="feed"]');
      if (resultsPane) {
        for (let i = 0; i < 5; i++) {
          await this.page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollTop = el.scrollHeight;
          }, '[role="feed"]');
          await this.page.waitForTimeout(2000);
        }
      }
    } catch (e) {
      console.log('   Could not scroll results');
    }
  }

  async extractBusinesses(city) {
    const businesses = await this.page.evaluate((cityName) => {
      const results = [];
      const placeLinks = document.querySelectorAll('a[href*="/maps/place/"]');

      placeLinks.forEach((link) => {
        try {
          // Get container
          let container = link.closest('div[jsaction]');
          if (!container) container = link.closest('div.Nv2PK') || link.parentElement;

          // Business name
          const name = link.querySelector('[class*="fontHeadline"]')?.textContent?.trim() ||
                      link.querySelector('div[role="heading"]')?.textContent?.trim() ||
                      link.getAttribute('aria-label');

          if (!name) return;

          // Rating and review count
          let rating = null;
          let reviewCount = null;
          const ratingEl = container.querySelector('span[role="img"]');
          if (ratingEl) {
            const ariaLabel = ratingEl.getAttribute('aria-label');
            if (ariaLabel) {
              const ratingMatch = ariaLabel.match(/(\d+\.?\d*)/);
              if (ratingMatch) rating = parseFloat(ratingMatch[1]);

              const reviewMatch = ariaLabel.match(/(\d+,?\d*)\s+review/);
              if (reviewMatch) {
                reviewCount = parseInt(reviewMatch[1].replace(',', ''));
              }
            }
          }

          // Try to get address from container text
          const allText = container.textContent || '';
          let address = null;
          // Look for patterns like "123 Main St" or addresses with CA
          const addressMatch = allText.match(/\d+\s+[A-Z][a-z]+\s+(?:St|Ave|Blvd|Rd|Dr|Way|Ln)[.,]?/);
          if (addressMatch) {
            address = addressMatch[0].trim();
          }

          // Get the Google Maps URL for this place
          const placeUrl = link.href;

          results.push({
            name,
            rating,
            reviewCount,
            address,
            phone: null, // Will need to visit detail page for this
            website: null, // Will need to visit detail page for this
            priceLevel: null,
            googleMapsUrl: placeUrl,
            city: cityName,
            scrapedAt: new Date().toISOString(),
          });

        } catch (e) {
          // Skip errors
        }
      });

      return results;
    }, city);

    return businesses;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n✅ Browser closed');
    }
  }
}

/**
 * Save businesses to database
 */
async function saveToDatabase(businesses) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  let savedCount = 0;
  let errorCount = 0;

  try {
    console.log('\n💾 Saving to database...');

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dog_daycares (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        rating DECIMAL(2,1),
        review_count INTEGER,
        address TEXT,
        phone TEXT,
        website TEXT,
        google_maps_url TEXT,
        price_level INTEGER,
        city TEXT NOT NULL,
        scraped_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, city)
      )
    `);

    for (const business of businesses) {
      try {
        await pool.query(
          `INSERT INTO dog_daycares (name, rating, review_count, address, phone, website, google_maps_url, price_level, city, scraped_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (name, city)
           DO UPDATE SET
             rating = EXCLUDED.rating,
             review_count = EXCLUDED.review_count,
             address = EXCLUDED.address,
             phone = EXCLUDED.phone,
             website = EXCLUDED.website,
             google_maps_url = EXCLUDED.google_maps_url,
             price_level = EXCLUDED.price_level,
             updated_at = CURRENT_TIMESTAMP`,
          [
            business.name,
            business.rating,
            business.reviewCount,
            business.address,
            business.phone,
            business.website,
            business.googleMapsUrl,
            business.priceLevel,
            business.city,
            business.scrapedAt
          ]
        );

        savedCount++;
      } catch (err) {
        errorCount++;
        console.error(`   ❌ Error saving ${business.name}: ${err.message}`);
      }
    }

    console.log(`\n✅ Saved ${savedCount} businesses to database`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} errors occurred`);
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await pool.end();
  }
}

/**
 * Main execution
 */
async function main() {
  const scraper = new DogDaycareScraper();

  try {
    await scraper.initialize();

    // Full SF Bay Area - 9 counties
    const cities = [
      // San Francisco County
      'San Francisco',
      // Alameda County
      'Oakland', 'Berkeley', 'Fremont', 'Hayward', 'Alameda', 'San Leandro', 'Union City', 'Albany', 'Emeryville',
      // Contra Costa County
      'Walnut Creek', 'Concord', 'Richmond', 'Antioch', 'Pittsburg', 'Martinez', 'Pleasant Hill', 'San Ramon', 'Danville',
      // Marin County
      'San Rafael', 'Novato', 'Mill Valley', 'Sausalito', 'Tiburon', 'Corte Madera', 'Larkspur',
      // Napa County
      'Napa', 'American Canyon', 'St. Helena', 'Calistoga', 'Yountville',
      // San Mateo County (Peninsula)
      'San Mateo', 'Redwood City', 'Palo Alto', 'Mountain View', 'Daly City', 'South San Francisco',
      'Burlingame', 'Menlo Park', 'San Bruno', 'Pacifica', 'Half Moon Bay', 'Foster City',
      // Santa Clara County
      'San Jose', 'Sunnyvale', 'Santa Clara', 'Milpitas', 'Cupertino', 'Los Gatos', 'Campbell', 'Saratoga',
      // Solano County
      'Vallejo', 'Fairfield', 'Vacaville', 'Benicia', 'Suisun City',
      // Sonoma County
      'Santa Rosa', 'Petaluma', 'Rohnert Park', 'Sonoma', 'Sebastopol', 'Healdsburg',
    ];

    const allBusinesses = [];

    for (const city of cities) {
      const businesses = await scraper.scrapeCity(city);
      allBusinesses.push(...businesses);

      // Random delay between cities to avoid detection
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    }

    console.log('\n📊 Scraping Summary:');
    console.log(`   Total dog daycares found: ${allBusinesses.length}`);
    console.log(`   Cities covered: ${cities.length}`);

    // Save to database
    if (allBusinesses.length > 0) {
      await saveToDatabase(allBusinesses);

      // Show top-rated businesses
      const topRated = allBusinesses
        .filter(b => b.rating && b.reviewCount >= 10)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      console.log('\n🏆 TOP 10 RATED DOG DAYCARES:\n');
      topRated.forEach((b, idx) => {
        console.log(`${idx + 1}. ${b.name} (${b.city})`);
        console.log(`   ⭐ ${b.rating} stars (${b.reviewCount} reviews)`);
        console.log(`   📍 ${b.address || 'N/A'}`);
        console.log(`   🔗 ${b.website || 'No website'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

main();
