import { sql } from '@vercel/postgres';

async function createContestTables() {
  try {
    console.log('Creating photo contest tables...');

    // Contest entries table
    await sql`
      CREATE TABLE IF NOT EXISTS contest_entries (
        id SERIAL PRIMARY KEY,
        photo_url TEXT NOT NULL,
        dog_name VARCHAR(100) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        owner_email VARCHAR(255) NOT NULL,
        daycare_id INTEGER REFERENCES dog_daycares(id),
        caption TEXT,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved BOOLEAN DEFAULT false
      )
    `;

    // Votes tracking table (prevents duplicate voting)
    await sql`
      CREATE TABLE IF NOT EXISTS contest_votes (
        id SERIAL PRIMARY KEY,
        entry_id INTEGER REFERENCES contest_entries(id) ON DELETE CASCADE,
        voter_ip VARCHAR(45) NOT NULL,
        voter_fingerprint VARCHAR(255),
        voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entry_id, voter_ip)
      )
    `;

    // Create indexes for performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_contest_votes_desc
      ON contest_entries(votes DESC, created_at DESC)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_contest_approved
      ON contest_entries(approved, votes DESC)
    `;

    console.log('✅ Successfully created contest tables:');
    console.log('   - contest_entries (photos, dog info, votes)');
    console.log('   - contest_votes (prevents duplicate voting)');
    console.log('   - Created performance indexes');

  } catch (error) {
    console.error('❌ Error creating contest tables:', error);
    process.exit(1);
  }
}

createContestTables();
