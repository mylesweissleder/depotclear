import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

async function addMetroColumn() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add metro column
    await client.query(`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS metro VARCHAR(100)
    `);
    console.log('✅ Added metro column to dog_daycares');

    // Create index on metro
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_dog_daycares_metro
      ON dog_daycares(metro)
    `);
    console.log('✅ Created index on metro column');

    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

addMetroColumn();
