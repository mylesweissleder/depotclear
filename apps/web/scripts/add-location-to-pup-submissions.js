import { sql } from '@vercel/postgres';

async function addLocationFields() {
  try {
    console.log('Adding city and state columns to pup_submissions...');

    await sql`
      ALTER TABLE pup_submissions
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS state VARCHAR(2)
    `;

    console.log('✅ Successfully added location tracking columns');
    console.log('   - city: VARCHAR(100)');
    console.log('   - state: VARCHAR(2)');

  } catch (error) {
    console.error('❌ Error adding columns:', error);
    process.exit(1);
  }
}

addLocationFields();
