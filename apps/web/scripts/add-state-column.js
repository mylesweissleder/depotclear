import { sql } from '@vercel/postgres';

async function addStateColumn() {
  try {
    console.log('Adding state column to dog_daycares...');

    await sql`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS state VARCHAR(2)
    `;

    console.log('✅ Successfully added state column');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addStateColumn();
