import { sql } from '@vercel/postgres';

async function addPremiumColumn() {
  try {
    console.log('Adding premium column to dog_daycares table...');

    await sql`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT false
    `;

    console.log('✅ Successfully added premium column');
    console.log('   - premium: BOOLEAN (default false)');

  } catch (error) {
    console.error('❌ Error adding premium column:', error);
    process.exit(1);
  }
}

addPremiumColumn();
