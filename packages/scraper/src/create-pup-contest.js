import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Create pup contest table
 */
async function createPupContest() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🐕 Creating Pup of the Week contest table...\n');

    // Create pup submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pup_submissions (
        id SERIAL PRIMARY KEY,
        pup_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        owner_email TEXT NOT NULL,
        daycare_id INTEGER REFERENCES dog_daycares(id),
        daycare_name TEXT,
        photo_url TEXT NOT NULL,
        story TEXT,
        votes INTEGER DEFAULT 0,
        is_winner BOOLEAN DEFAULT FALSE,
        week_of DATE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP
      )
    `);

    // Create votes tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pup_votes (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES pup_submissions(id),
        voter_email TEXT NOT NULL,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(submission_id, voter_email)
      )
    `);

    console.log('✅ Contest tables created successfully!\n');

    // Show tables
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name IN ('pup_submissions', 'pup_votes')
      ORDER BY table_name, ordinal_position
    `);

    console.log('📋 Contest database structure:\n');
    let currentTable = '';
    result.rows.forEach(row => {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name;
        console.log(`\n${currentTable}:`);
      }
      console.log(`   ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createPupContest();
