import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Add region support and set Bay Area as default
 */
async function addRegions() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🌎 Adding multi-region support...\n');

    // Add region column
    await pool.query(`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'bay-area'
    `);

    // Set all existing records to bay-area
    const result = await pool.query(`
      UPDATE dog_daycares
      SET region = 'bay-area'
      WHERE region IS NULL OR region = ''
    `);

    console.log(`✅ Updated ${result.rowCount} records to 'bay-area' region\n`);

    // Show count by region
    const stats = await pool.query(`
      SELECT region, COUNT(*) as count
      FROM dog_daycares
      GROUP BY region
      ORDER BY count DESC
    `);

    console.log('📊 Listings by region:\n');
    stats.rows.forEach(row => {
      console.log(`   ${row.region}: ${row.count} daycares`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addRegions();
