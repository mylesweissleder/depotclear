import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Add premium listing fields to dog_daycares table
 */
async function addPremiumFields() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔧 Adding premium fields to database...\n');

    // Add premium fields
    await pool.query(`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
      ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
      ADD COLUMN IF NOT EXISTS premium_plan TEXT CHECK (premium_plan IN ('monthly', 'annual')),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS amenities JSONB,
      ADD COLUMN IF NOT EXISTS photos JSONB,
      ADD COLUMN IF NOT EXISTS booking_url TEXT,
      ADD COLUMN IF NOT EXISTS business_email TEXT,
      ADD COLUMN IF NOT EXISTS featured_badge TEXT,
      ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0
    `);

    console.log('✅ Premium fields added successfully!\n');

    // Show current table structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'dog_daycares'
      ORDER BY ordinal_position
    `);

    console.log('📋 Current table structure:\n');
    result.rows.forEach(row => {
      console.log(`   ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addPremiumFields();
