import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

async function runMigration() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add voter_zip to pup_votes
    await client.query(`
      ALTER TABLE pup_votes
      ADD COLUMN IF NOT EXISTS voter_zip VARCHAR(5)
    `);
    console.log('✅ Added voter_zip column to pup_votes');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pup_votes_zip ON pup_votes(voter_zip)
    `);
    console.log('✅ Created index on pup_votes.voter_zip');

    // Add zip_code to newsletter_subscribers
    await client.query(`
      ALTER TABLE newsletter_subscribers
      ADD COLUMN IF NOT EXISTS zip_code VARCHAR(5)
    `);
    console.log('✅ Added zip_code column to newsletter_subscribers');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_newsletter_zip ON newsletter_subscribers(zip_code)
    `);
    console.log('✅ Created index on newsletter_subscribers.zip_code');

    // Add metro field to newsletter_subscribers
    await client.query(`
      ALTER TABLE newsletter_subscribers
      ADD COLUMN IF NOT EXISTS metro VARCHAR(100)
    `);
    console.log('✅ Added metro column to newsletter_subscribers');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_newsletter_metro ON newsletter_subscribers(metro)
    `);
    console.log('✅ Created index on newsletter_subscribers.metro');

    console.log('\n🎉 Migration complete!');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await client.end();
  }
}

runMigration();
