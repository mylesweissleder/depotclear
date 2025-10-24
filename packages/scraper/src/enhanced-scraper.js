import { chromium } from 'playwright';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

/**
 * Enhanced Google Maps scraper - extracts ALL available data
 */
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
          await this.page.waitForTimeout(2000);
        }
      }
    } catch (e) {
      console.log('   Could not scroll results');
    }
  }

  async extractBusinessLinks() {
    return await this.page.evaluate(() => {
      const links = [];
      const placeLinks = document.querySelectorAll('a[href*="/maps/place/"]');

      placeLinks.forEach((link) => {
        const name = link.querySelector('[class*="fontHeadline"]')?.textContent?.trim() ||
                    link.getAttribute('aria-label');
        if (name && link.href) {
          links.push({ name, url: link.href });
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
        const data = {};

        // Name
        data.name = document.querySelector('h1')?.textContent?.trim();

        // Rating and reviews
        const ratingText = document.querySelector('[role="img"][aria-label*="star"]')?.getAttribute('aria-label');
        if (ratingText) {
          const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
          data.rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

          const reviewMatch = ratingText.match(/(\d+,?\d*)\s+review/i);
          data.reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : null;
        }

        // Address, phone, website
        const buttons = document.querySelectorAll('button[data-item-id]');
        buttons.forEach(btn => {
          const text = btn.textContent || '';
          const ariaLabel = btn.getAttribute('aria-label') || '';

          if (ariaLabel.includes('Address:')) {
            data.address = ariaLabel.replace('Address:', '').trim();
          }
          if (ariaLabel.includes('Phone:')) {
            data.phone = ariaLabel.replace('Phone:', '').trim();
          }
          if (ariaLabel.includes('Website:')) {
            data.website = ariaLabel.replace('Website:', '').trim();
          }
        });

        // Alternative selectors for contact info
        if (!data.address) {
          data.address = document.querySelector('[data-item-id="address"]')?.textContent?.trim();
        }
        if (!data.phone) {
          data.phone = document.querySelector('[data-item-id*="phone"]')?.textContent?.trim();
        }
        if (!data.website) {
          const websiteBtn = Array.from(document.querySelectorAll('a')).find(a =>
            a.textContent?.toLowerCase().includes('website') || a.href?.includes('http')
          );
          data.website = websiteBtn?.href;
        }

        // Business hours
        const hoursButton = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.getAttribute('aria-label')?.includes('Hours') ||
          btn.textContent?.includes('Hours')
        );

        if (hoursButton) {
          hoursButton.click();
          // Wait a bit for hours to load
          setTimeout(() => {
            const hourRows = document.querySelectorAll('[aria-label*="day"]');
            const hours = {};
            hourRows.forEach(row => {
              const label = row.getAttribute('aria-label') || '';
              const parts = label.split(',');
              if (parts.length >= 2) {
                const day = parts[0].trim().toLowerCase();
                const time = parts[1].trim();
                hours[day] = time;
              }
            });
            data.businessHours = hours;
          }, 1000);
        }

        // Categories/Types
        const categoryButtons = document.querySelectorAll('button[jsaction*="category"]');
        data.googleCategories = Array.from(categoryButtons).map(btn => btn.textContent?.trim()).filter(Boolean);

        // Place ID from URL
        const urlMatch = window.location.href.match(/!1s([^!]+)/);
        data.placeId = urlMatch ? urlMatch[1] : null;

        // Coordinates from URL
        const coordMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          data.latitude = parseFloat(coordMatch[1]);
          data.longitude = parseFloat(coordMatch[2]);
        }

        // Price level ($, $$, $$$)
        const priceText = Array.from(document.querySelectorAll('span')).find(span =>
          /^\$+$/.test(span.textContent?.trim())
        );
        data.priceLevel = priceText ? priceText.textContent.length : null;

        // Business status
        const statusEl = document.querySelector('[aria-label*="Closed"]') ||
                        document.querySelector('[aria-label*="Open"]');
        data.businessStatus = statusEl ?
          (statusEl.textContent?.toLowerCase().includes('closed') ? 'temporarily_closed' : 'open') :
          'open';

        // Amenities/Features - look for common keywords
        const allText = document.body.textContent?.toLowerCase() || '';
        data.amenities = {
          outdoorPlayArea: allText.includes('outdoor play') || allText.includes('outdoor area'),
          indoorFacility: allText.includes('indoor') || allText.includes('climate controlled'),
          grooming: allText.includes('grooming'),
          training: allText.includes('training'),
          webcams: allText.includes('webcam') || allText.includes('camera'),
          wheelchairAccessible: allText.includes('wheelchair accessible'),
        };

        // Service options
        data.serviceOptions = {
          onlineAppointments: allText.includes('online booking') || allText.includes('book online'),
          inPersonVisits: !allText.includes('online only'),
        };

        // Photos - get image URLs
        const images = Array.from(document.querySelectorAll('img[src*="googleusercontent"]'))
          .map(img => img.src)
          .filter(src => !src.includes('avatar') && !src.includes('icon'))
          .slice(0, 10); // Limit to 10 photos
        data.photos = images;

        data.googleMapsUrl = window.location.href.split('?')[0];
        data.scrapedAt = new Date().toISOString();

        return data;
      });

      return details;

    } catch (error) {
      console.error(`      Error scraping details: ${error.message}`);
      return null;
    }
  }

  async saveToDatabase(data) {
    await this.db.query(
      `INSERT INTO dog_daycares (
        name, rating, review_count, address, phone, website, google_maps_url,
        price_level, city, region, business_hours, business_status, google_categories,
        latitude, longitude, place_id, service_options, wheelchair_accessible,
        amenities, photos, scraped_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (name, city)
      DO UPDATE SET
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        website = EXCLUDED.website,
        google_maps_url = EXCLUDED.google_maps_url,
        price_level = EXCLUDED.price_level,
        business_hours = EXCLUDED.business_hours,
        business_status = EXCLUDED.business_status,
        google_categories = EXCLUDED.google_categories,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        place_id = EXCLUDED.place_id,
        service_options = EXCLUDED.service_options,
        wheelchair_accessible = EXCLUDED.wheelchair_accessible,
        amenities = EXCLUDED.amenities,
        photos = EXCLUDED.photos,
        scraped_at = EXCLUDED.scraped_at,
        updated_at = CURRENT_TIMESTAMP`,
      [
        data.name,
        data.rating,
        data.reviewCount,
        data.address,
        data.phone,
        data.website,
        data.googleMapsUrl,
        data.priceLevel,
        data.city,
        data.region,
        JSON.stringify(data.businessHours || {}),
        data.businessStatus || 'open',
        JSON.stringify(data.googleCategories || []),
        data.latitude,
        data.longitude,
        data.placeId,
        JSON.stringify(data.serviceOptions || {}),
        data.amenities?.wheelchairAccessible || false,
        JSON.stringify(data.amenities || {}),
        JSON.stringify(data.photos || []),
        data.scrapedAt,
      ]
    );
  }

  async close() {
    if (this.db) await this.db.end();
    if (this.browser) await this.browser.close();
  }
}

// Main execution
async function main() {
  const scraper = new EnhancedDogDaycareScraper();

  try {
    await scraper.initialize();

    // SF Bay Area cities
    const cities = [
      'San Francisco',
      'Oakland',
      'Berkeley',
      'San Jose',
      'Palo Alto',
      'Mountain View',
      'Sunnyvale',
      'Redwood City',
      'San Mateo',
      'Fremont',
      'Hayward',
      'San Rafael',
      'Walnut Creek',
    ];

    for (const city of cities) {
      await scraper.scrapeCity(city, 'CA', 'bay-area');
    }

    console.log('\n🎉 All done! Enhanced scraping complete.');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await scraper.close();
  }
}

main();
