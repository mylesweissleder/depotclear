import { sql } from '@vercel/postgres';

async function fixContestSchema() {
  try {
    console.log('🔧 Fixing contest schema mismatches...');

    // Check if pup_votes table exists, if not create it
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'pup_votes'
      );
    `;

    if (!tableCheck.rows[0].exists) {
      console.log('Creating pup_votes table...');
      await sql`
        CREATE TABLE pup_votes (
          id SERIAL PRIMARY KEY,
          submission_id INTEGER REFERENCES pup_submissions(id) ON DELETE CASCADE,
          voter_email VARCHAR(255) NOT NULL,
          ip_address TEXT NOT NULL,
          user_agent TEXT,
          vote_weight DECIMAL(3,2) DEFAULT 1.0,
          voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(submission_id, voter_email)
        );
      `;
      console.log('✅ Created pup_votes table with correct column names');
    } else {
      console.log('pup_votes table exists, checking columns...');

      // Fix column names if they're wrong
      // Rename voter_ip to ip_address if needed
      try {
        await sql`ALTER TABLE pup_votes RENAME COLUMN voter_ip TO ip_address;`;
        console.log('✅ Renamed voter_ip → ip_address');
      } catch (e) {
        if (e.message.includes('does not exist')) {
          console.log('   voter_ip column not found (already correct or different structure)');
        } else {
          console.log('   ip_address column already exists or error:', e.message);
        }
      }

      // Rename weight to vote_weight if needed
      try {
        await sql`ALTER TABLE pup_votes RENAME COLUMN weight TO vote_weight;`;
        console.log('✅ Renamed weight → vote_weight');
      } catch (e) {
        if (e.message.includes('does not exist')) {
          console.log('   weight column not found (already correct or different structure)');
        } else {
          console.log('   vote_weight column already exists or error:', e.message);
        }
      }
    }

    console.log('\n✅ Schema fixes complete!\n');

  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    process.exit(1);
  }
}

fixContestSchema();
