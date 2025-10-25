import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    const migrationPath = join(__dirname, '../migrations/add-tier-system.sql');
    const sql = readFileSync(migrationPath, 'utf8');

    console.log('🚀 Running tier system migration...\n');

    // Run the entire SQL file as one transaction
    // This properly handles PostgreSQL functions with $$ delimiters
    try {
      await client.query(sql);
      console.log('✅ Migration SQL executed successfully!');
    } catch (err) {
      // Check if it's just duplicate objects (which is fine)
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log('⏭️  Some objects already exist (this is fine)');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 Verifying tier system setup...');

    // Verify the tier enum exists
    const enumCheck = await client.query(`
      SELECT enumlabel
      FROM pg_enum
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
      WHERE pg_type.typname = 'listing_tier'
      ORDER BY enumsortorder
    `);

    console.log('✅ Tier enum values:', enumCheck.rows.map(r => r.enumlabel).join(', '));

    // Check if tier column exists
    const columnCheck = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'dog_daycares' AND column_name = 'tier'
    `);

    if (columnCheck.rows.length > 0) {
      console.log('✅ Tier column added to dog_daycares table');
      console.log('   Default:', columnCheck.rows[0].column_default);
    }

    // Check functions
    const functionCheck = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
        AND routine_name IN ('claim_listing', 'upgrade_to_top_dog', 'downgrade_from_top_dog', 'is_top_dog_active')
      ORDER BY routine_name
    `);

    console.log('✅ Functions created:', functionCheck.rows.map(r => r.routine_name).join(', '));

    // Check view
    const viewCheck = await client.query(`
      SELECT table_name
      FROM information_schema.views
      WHERE table_schema = 'public' AND table_name = 'top_dog_listings_summary'
    `);

    if (viewCheck.rows.length > 0) {
      console.log('✅ View created: top_dog_listings_summary');
    }

    // Check current tier distribution
    const tierStats = await client.query(`
      SELECT
        COALESCE(tier::text, 'unclaimed') as tier,
        COUNT(*) as count
      FROM dog_daycares
      GROUP BY tier
      ORDER BY tier
    `);

    console.log('\n📈 Current tier distribution:');
    tierStats.rows.forEach(row => {
      console.log(`   ${row.tier}: ${row.count} listings`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

runMigration();
