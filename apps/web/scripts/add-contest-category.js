import { sql } from '@vercel/postgres';

async function addContestCategory() {
  try {
    console.log('Adding category column to contest_entries...');

    await sql`
      ALTER TABLE contest_entries
      ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'Goofiest Face'
    `;

    console.log('✅ Successfully added category column');

  } catch (error) {
    console.error('❌ Error adding category column:', error);
    process.exit(1);
  }
}

addContestCategory();
