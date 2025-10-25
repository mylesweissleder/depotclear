import { sql } from '@vercel/postgres';

async function addFeaturedColumns() {
  try {
    console.log('Adding featured columns to dog_daycares table...');

    await sql`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS featured_order INTEGER,
      ADD COLUMN IF NOT EXISTS featured_until DATE
    `;

    console.log('✅ Successfully added featured columns');
    console.log('   - featured: BOOLEAN (default false)');
    console.log('   - featured_order: INTEGER (for manual ordering)');
    console.log('   - featured_until: DATE (optional expiration date)');

  } catch (error) {
    console.error('❌ Error adding featured columns:', error);
    process.exit(1);
  }
}

addFeaturedColumns();
