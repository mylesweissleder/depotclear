import { HomeDepotScraper } from './index.js';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Save products to database
 */
async function saveToDatabase(products) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  let savedCount = 0;
  let errorCount = 0;

  try {
    console.log('\n💾 Saving to database...');

    for (const product of products) {
      try {
        // Generate product_id from URL or title
        const productId = product.url
          ? product.url.split('/').pop()
          : `${product.category}-${product.modelNumber || Date.now()}`;

        await pool.query(
          `INSERT INTO products (product_id, title, price, original_price, price_text, category, model_number, url, image_url, is_clearance_price, scraped_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (product_id)
           DO UPDATE SET
             price = EXCLUDED.price,
             price_text = EXCLUDED.price_text,
             updated_at = CURRENT_TIMESTAMP`,
          [
            productId,
            product.title,
            product.price,
            null, // original_price - we don't have this from scraping yet
            product.priceText,
            product.category,
            product.modelNumber || null,
            product.url,
            product.imageUrl,
            product.isClearancePrice,
            product.scrapedAt
          ]
        );

        savedCount++;
      } catch (err) {
        errorCount++;
        console.error(`   ❌ Error saving product: ${err.message}`);
      }
    }

    console.log(`\n✅ Saved ${savedCount} products to database`);
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
  const scraper = new HomeDepotScraper();

  try {
    await scraper.initialize();

    // Scrape the main clearance section (has all categories)
    const categories = [
      'All'  // This will use the main clearance URL
    ];

    const allProducts = [];

    console.log('🏠 Starting Home Depot clearance scraper...\n');

    for (const category of categories) {
      const items = await scraper.scrapeCategory(category, 10); // 10 pages for more breadth
      allProducts.push(...items);
    }

    // Filter clearance items
    const clearanceItems = allProducts.filter(item => item.isClearancePrice);

    console.log('\n📊 Scraping Summary:');
    console.log(`   Total items found: ${allProducts.length}`);
    console.log(`   Clearance-priced items: ${clearanceItems.length}`);

    // Save to database
    if (clearanceItems.length > 0) {
      await saveToDatabase(clearanceItems);

      // Show top 10 deals
      const topDeals = clearanceItems
        .sort((a, b) => a.price - b.price)
        .slice(0, 10);

      console.log('\n🏆 TOP 10 CLEARANCE FINDS:\n');
      topDeals.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.title}`);
        console.log(`   💰 ${item.priceText} | 📦 ${item.category}`);
        console.log('');
      });
    } else {
      console.log('\n⚠️  No clearance items found. Try again later or adjust search criteria.');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

main();
