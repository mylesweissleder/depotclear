import { chromium } from 'playwright';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

/**
 * EXPANSION SCRAPER: 150+ cities to reach 5,000+ daycares
 * Focuses on: Major metro suburbs, mid-size cities, college towns
 */

const EXPANSION_CITIES = [
  // SF Bay Area Suburbs (20 cities)
  { city: 'Fremont', state: 'CA' },
  { city: 'Hayward', state: 'CA' },
  { city: 'Sunnyvale', state: 'CA' },
  { city: 'Mountain View', state: 'CA' },
  { city: 'Palo Alto', state: 'CA' },
  { city: 'Redwood City', state: 'CA' },
  { city: 'Menlo Park', state: 'CA' },
  { city: 'Los Gatos', state: 'CA' },
  { city: 'Campbell', state: 'CA' },
  { city: 'Cupertino', state: 'CA' },
  { city: 'Saratoga', state: 'CA' },
  { city: 'Los Altos', state: 'CA' },
  { city: 'Burlingame', state: 'CA' },
  { city: 'San Mateo', state: 'CA' },
  { city: 'Foster City', state: 'CA' },
  { city: 'Belmont', state: 'CA' },
  { city: 'San Carlos', state: 'CA' },
  { city: 'Millbrae', state: 'CA' },
  { city: 'South San Francisco', state: 'CA' },
  { city: 'Daly City', state: 'CA' },

  // LA Metro Suburbs (25 cities)
  { city: 'Pasadena', state: 'CA' },
  { city: 'Glendale', state: 'CA' },
  { city: 'Burbank', state: 'CA' },
  { city: 'Torrance', state: 'CA' },
  { city: 'El Segundo', state: 'CA' },
  { city: 'Manhattan Beach', state: 'CA' },
  { city: 'Hermosa Beach', state: 'CA' },
  { city: 'Redondo Beach', state: 'CA' },
  { city: 'Venice', state: 'CA' },
  { city: 'Culver City', state: 'CA' },
  { city: 'Beverly Hills', state: 'CA' },
  { city: 'West Hollywood', state: 'CA' },
  { city: 'Silverlake', state: 'CA' },
  { city: 'Calabasas', state: 'CA' },
  { city: 'Thousand Oaks', state: 'CA' },
  { city: 'Simi Valley', state: 'CA' },
  { city: 'Ventura', state: 'CA' },
  { city: 'Oxnard', state: 'CA' },
  { city: 'Anaheim', state: 'CA' },
  { city: 'Huntington Beach', state: 'CA' },
  { city: 'Newport Beach', state: 'CA' },
  { city: 'Costa Mesa', state: 'CA' },
  { city: 'Santa Ana', state: 'CA' },
  { city: 'Fullerton', state: 'CA' },
  { city: 'Garden Grove', state: 'CA' },

  // San Diego Suburbs (8 cities)
  { city: 'La Jolla', state: 'CA' },
  { city: 'Del Mar', state: 'CA' },
  { city: 'Encinitas', state: 'CA' },
  { city: 'Carlsbad', state: 'CA' },
  { city: 'Oceanside', state: 'CA' },
  { city: 'Escondido', state: 'CA' },
  { city: 'Chula Vista', state: 'CA' },
  { city: 'La Mesa', state: 'CA' },

  // Seattle Suburbs (12 cities)
  { city: 'Bellevue', state: 'WA' },
  { city: 'Redmond', state: 'WA' },
  { city: 'Kirkland', state: 'WA' },
  { city: 'Issaquah', state: 'WA' },
  { city: 'Sammamish', state: 'WA' },
  { city: 'Renton', state: 'WA' },
  { city: 'Kent', state: 'WA' },
  { city: 'Bothell', state: 'WA' },
  { city: 'Lynnwood', state: 'WA' },
  { city: 'Everett', state: 'WA' },
  { city: 'Olympia', state: 'WA' },
  { city: 'Spokane', state: 'WA' },

  // Portland Suburbs (8 cities)
  { city: 'Beaverton', state: 'OR' },
  { city: 'Hillsboro', state: 'OR' },
  { city: 'Tigard', state: 'OR' },
  { city: 'Lake Oswego', state: 'OR' },
  { city: 'Oregon City', state: 'OR' },
  { city: 'Gresham', state: 'OR' },
  { city: 'Eugene', state: 'OR' },
  { city: 'Salem', state: 'OR' },

  // Phoenix Suburbs (10 cities)
  { city: 'Scottsdale', state: 'AZ' },
  { city: 'Tempe', state: 'AZ' },
  { city: 'Mesa', state: 'AZ' },
  { city: 'Chandler', state: 'AZ' },
  { city: 'Gilbert', state: 'AZ' },
  { city: 'Glendale', state: 'AZ' },
  { city: 'Peoria', state: 'AZ' },
  { city: 'Surprise', state: 'AZ' },
  { city: 'Tucson', state: 'AZ' },
  { city: 'Flagstaff', state: 'AZ' },

  // Chicago Suburbs (15 cities)
  { city: 'Evanston', state: 'IL' },
  { city: 'Naperville', state: 'IL' },
  { city: 'Aurora', state: 'IL' },
  { city: 'Joliet', state: 'IL' },
  { city: 'Schaumburg', state: 'IL' },
  { city: 'Elgin', state: 'IL' },
  { city: 'Waukegan', state: 'IL' },
  { city: 'Oak Park', state: 'IL' },
  { city: 'Berwyn', state: 'IL' },
  { city: 'Des Plaines', state: 'IL' },
  { city: 'Skokie', state: 'IL' },
  { city: 'Wilmette', state: 'IL' },
  { city: 'Winnetka', state: 'IL' },
  { city: 'Highland Park', state: 'IL' },
  { city: 'Rockford', state: 'IL' },

  // Boston Suburbs (10 cities)
  { city: 'Cambridge', state: 'MA' },
  { city: 'Somerville', state: 'MA' },
  { city: 'Brookline', state: 'MA' },
  { city: 'Newton', state: 'MA' },
  { city: 'Quincy', state: 'MA' },
  { city: 'Waltham', state: 'MA' },
  { city: 'Worcester', state: 'MA' },
  { city: 'Springfield', state: 'MA' },
  { city: 'Lowell', state: 'MA' },
  { city: 'Lexington', state: 'MA' },

  // NYC Suburbs (12 cities)
  { city: 'Jersey City', state: 'NJ' },
  { city: 'Hoboken', state: 'NJ' },
  { city: 'Newark', state: 'NJ' },
  { city: 'Montclair', state: 'NJ' },
  { city: 'Princeton', state: 'NJ' },
  { city: 'Morristown', state: 'NJ' },
  { city: 'Stamford', state: 'CT' },
  { city: 'Norwalk', state: 'CT' },
  { city: 'Greenwich', state: 'CT' },
  { city: 'New Haven', state: 'CT' },
  { city: 'Hartford', state: 'CT' },
  { city: 'Bridgeport', state: 'CT' },

  // DC Suburbs (8 cities)
  { city: 'Arlington', state: 'VA' },
  { city: 'Alexandria', state: 'VA' },
  { city: 'Bethesda', state: 'MD' },
  { city: 'Silver Spring', state: 'MD' },
  { city: 'Rockville', state: 'MD' },
  { city: 'Annapolis', state: 'MD' },
  { city: 'Frederick', state: 'MD' },
  { city: 'Fairfax', state: 'VA' },

  // Texas Expansion (12 cities)
  { city: 'Plano', state: 'TX' },
  { city: 'Frisco', state: 'TX' },
  { city: 'McKinney', state: 'TX' },
  { city: 'Arlington', state: 'TX' },
  { city: 'Fort Worth', state: 'TX' },
  { city: 'Irving', state: 'TX' },
  { city: 'Garland', state: 'TX' },
  { city: 'Sugar Land', state: 'TX' },
  { city: 'The Woodlands', state: 'TX' },
  { city: 'Round Rock', state: 'TX' },
  { city: 'El Paso', state: 'TX' },
  { city: 'Lubbock', state: 'TX' },

  // Florida Expansion (8 cities)
  { city: 'Fort Lauderdale', state: 'FL' },
  { city: 'West Palm Beach', state: 'FL' },
  { city: 'Boca Raton', state: 'FL' },
  { city: 'Delray Beach', state: 'FL' },
  { city: 'Jacksonville', state: 'FL' },
  { city: 'Tallahassee', state: 'FL' },
  { city: 'Gainesville', state: 'FL' },
  { city: 'St. Petersburg', state: 'FL' },
];

class ExpansionScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.db = null;
  }

  async initialize() {
    console.log('🚀 Initializing EXPANSION scraper (150+ cities)...');

    this.browser = await chromium.launch({
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    this.db = new Client({ connectionString: process.env.DATABASE_URL });
    await this.db.connect();
    console.log('✅ Connected to database\n');
  }

  async scrapeCity(city, state) {
    const searchQuery = `dog daycare in ${city}, ${state}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

    console.log(`\n🔍 Searching: ${searchQuery}`);

    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForTimeout(4000);

      await this.scrollResults();

      const businessLinks = await this.extractBusinessLinks();
      console.log(`   Found ${businessLinks.length} businesses\n`);

      let processed = 0;
      for (const link of businessLinks) {
        try {
          processed++;
          console.log(`   [${processed}/${businessLinks.length}] Processing: ${link.name}`);

          const details = await this.scrapeBusinessDetails(link.url);

          if (details) {
            await this.saveToDatabase({ ...details, city, state });
            console.log(`      ✅ Saved`);
          }

          await this.page.waitForTimeout(2000 + Math.random() * 2000);

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
      for (let i = 0; i < 4; i++) {
        await this.page.evaluate(() => {
          const el = document.querySelector('[role="feed"]');
          if (el) el.scrollTop = el.scrollHeight;
        });
        await this.page.waitForTimeout(1200);
      }
    } catch (error) {
      console.log('   ⚠️  Scroll error (non-fatal)');
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
      await this.page.waitForTimeout(2500);

      const details = await this.page.evaluate(() => {
        const getText = (selector) => document.querySelector(selector)?.textContent?.trim() || null;
        const name = getText('h1');
        const ratingText = getText('[role="img"][aria-label*="stars"]');
        const rating = ratingText?.match(/[\d.]+/)?.[0];
        const reviewCount = ratingText?.match(/\d+(?=\sreview)/)?.[0];
        const phone = getText('button[data-item-id*="phone"]');
        const website = document.querySelector('a[data-item-id*="authority"]')?.href;
        const address = getText('button[data-item-id*="address"]');

        const coordMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        const latitude = coordMatch ? parseFloat(coordMatch[1]) : null;
        const longitude = coordMatch ? parseFloat(coordMatch[2]) : null;

        const placeIdMatch = window.location.href.match(/!1s([^!]+)/);
        const placeId = placeIdMatch ? placeIdMatch[1] : null;

        return { name, rating, reviewCount, phone, website, address, latitude, longitude, placeId };
      });

      return details.name ? details : null;

    } catch (error) {
      return null;
    }
  }

  async saveToDatabase(data) {
    const { name, city, state, address, phone, website, rating, reviewCount, latitude, longitude, placeId } = data;

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

async function main() {
  const scraper = new ExpansionScraper();

  try {
    await scraper.initialize();

    console.log(`\n🎯 EXPANSION SCRAPE: ${EXPANSION_CITIES.length} cities`);
    console.log(`📊 Target: 5,000+ total daycares\n`);

    let completed = 0;
    for (const { city, state } of EXPANSION_CITIES) {
      completed++;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📍 City ${completed}/${EXPANSION_CITIES.length}: ${city}, ${state}`);
      console.log(`${'='.repeat(60)}`);

      await scraper.scrapeCity(city, state);

      if (completed < EXPANSION_CITIES.length) {
        console.log(`\n⏸️  Cooling down for 8 seconds...\n`);
        await scraper.page.waitForTimeout(8000);
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🎉 EXPANSION COMPLETE! Scraped ${EXPANSION_CITIES.length} cities`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  } finally {
    await scraper.cleanup();
  }
}

main();
