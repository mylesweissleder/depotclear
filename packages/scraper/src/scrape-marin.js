import { chromium } from 'playwright';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

const MARIN_CITIES = [
  'Novato, CA',
  'San Rafael, CA',
  'Mill Valley, CA',
  'Corte Madera, CA',
  'Larkspur, CA',
  'Sausalito, CA',
  'Tiburon, CA',
];

async function scrapeMarin() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  let totalScraped = 0;

  for (const city of MARIN_CITIES) {
    console.log(`\n🔍 Searching: ${city}`);

    // Search for dog daycares
    const searchUrl = `https://www.google.com/maps/search/dog+daycare+${encodeURIComponent(city)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    // Scroll to load all results
    const scrollContainer = await page.locator('div[role="feed"]').first();
    await scrollContainer.waitFor();

    let previousHeight = 0;
    let currentHeight = await scrollContainer.evaluate(el => el.scrollHeight);

    while (previousHeight !== currentHeight) {
      await scrollContainer.evaluate(el => el.scrollTo(0, el.scrollHeight));
      await page.waitForTimeout(3000);
      previousHeight = currentHeight;
      currentHeight = await scrollContainer.evaluate(el => el.scrollHeight);
    }

    // Get all business links
    const businesses = await page.locator('a[href*="/maps/place/"]').all();
    console.log(`📍 Found ${businesses.length} businesses in ${city}`);

    for (let i = 0; i < businesses.length; i++) {
      try {
        // Click business to open details
        await businesses[i].click();
        await page.waitForTimeout(3000);

        // Extract data
        const data = await page.evaluate(() => {
          const name = document.querySelector('h1')?.innerText || 'Unknown';
          const ratingText = document.querySelector('div[role="img"][aria-label*="stars"]')?.getAttribute('aria-label') || '';
          const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0]) || null;
          const reviewText = ratingText.match(/(\d+,?\d*)\s+reviews?/)?.[1]?.replace(',', '') || '0';
          const reviewCount = parseInt(reviewText) || 0;

          const addressEl = document.querySelector('button[data-item-id="address"]');
          const address = addressEl?.getAttribute('aria-label')?.replace('Address: ', '') || '';

          const phoneEl = document.querySelector('button[data-item-id*="phone"]');
          const phone = phoneEl?.getAttribute('aria-label')?.replace(/Phone: |\+1 /g, '') || '';

          const websiteEl = document.querySelector('a[data-item-id="authority"]');
          const website = websiteEl?.href || '';

          // Get coordinates from URL
          const url = window.location.href;
          const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          const latitude = coordMatch ? parseFloat(coordMatch[1]) : null;
          const longitude = coordMatch ? parseFloat(coordMatch[2]) : null;

          // Get place_id from URL
          const placeIdMatch = url.match(/!1s([^!]+)/);
          const placeId = placeIdMatch ? placeIdMatch[1] : null;

          return {
            name,
            rating,
            reviewCount,
            address,
            phone,
            website,
            latitude,
            longitude,
            placeId
          };
        });

        // Extract city and state from address
        const cityMatch = data.address.match(/,\s*([^,]+),\s*([A-Z]{2})/);
        const cityName = cityMatch ? cityMatch[1].trim() : city.replace(', CA', '');
        const state = cityMatch ? cityMatch[2] : 'CA';

        // Determine metro
        const metro = 'san-rafael'; // All Marin County cities map to San Rafael metro

        console.log(`  ${i + 1}/${businesses.length} - ${data.name} (${data.rating}⭐, ${data.reviewCount} reviews)`);

        // Insert into database
        await client.query(`
          INSERT INTO dog_daycares (
            name, address, city, state, metro, phone, website,
            rating, review_count, latitude, longitude, place_id,
            data_source, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          ON CONFLICT (place_id) DO UPDATE
          SET
            name = EXCLUDED.name,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            phone = EXCLUDED.phone,
            website = EXCLUDED.website,
            updated_at = NOW()
        `, [
          data.name,
          data.address,
          cityName,
          state,
          metro,
          data.phone,
          data.website,
          data.rating,
          data.reviewCount,
          data.latitude,
          data.longitude,
          data.placeId,
          'google_maps'
        ]);

        totalScraped++;

      } catch (error) {
        console.error(`  ❌ Error scraping business ${i + 1}: ${error.message}`);
      }
    }
  }

  await browser.close();
  await client.end();

  console.log(`\n✅ Scraping complete! Total: ${totalScraped} businesses from Marin County`);
}

scrapeMarin().catch(console.error);
