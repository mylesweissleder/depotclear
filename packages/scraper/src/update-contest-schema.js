import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Update contest schema for viral categories with anti-gaming measures
 */
async function updateContestSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔥 Updating contest schema for viral categories...\n');

    // Drop existing tables to recreate with new schema
    await pool.query(`DROP TABLE IF EXISTS pup_votes CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS pup_submissions CASCADE`);

    // Create viral contest submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pup_submissions (
        id SERIAL PRIMARY KEY,

        -- Dog & Owner Info
        pup_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        owner_email TEXT NOT NULL,
        owner_phone TEXT,

        -- Daycare Association
        daycare_id INTEGER REFERENCES dog_daycares(id),
        daycare_name TEXT,
        city TEXT,

        -- Photo & Story
        photo_url TEXT NOT NULL,
        photo_thumbnail TEXT,
        caption TEXT NOT NULL,

        -- Contest Category (VIRAL!)
        category TEXT NOT NULL CHECK (category IN (
          'goofiest-face',
          'biggest-derp',
          'worst-haircut',
          'funniest-fail',
          'most-dramatic',
          'worst-sleeper',
          'ai-dog'
        )),

        -- AI Flag
        is_ai_generated BOOLEAN DEFAULT FALSE,

        -- Voting & Status
        votes INTEGER DEFAULT 0,
        unique_voters INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0,
        is_winner BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,

        -- Contest Period
        contest_month TEXT,  -- e.g., '2025-01' for January 2025
        week_of DATE,

        -- Moderation
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
        rejection_reason TEXT,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        featured_at TIMESTAMP
      )
    `);

    // Create votes table with anti-gaming measures
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pup_votes (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES pup_submissions(id) ON DELETE CASCADE,

        -- Voter Identity (multiple checks)
        voter_email TEXT NOT NULL,
        voter_ip TEXT NOT NULL,
        user_agent TEXT,
        fingerprint TEXT,  -- Browser fingerprint from FingerprintJS

        -- Vote Weight & Fraud Detection
        weight DECIMAL DEFAULT 1.0,  -- Can be reduced if suspicious activity detected
        is_suspicious BOOLEAN DEFAULT FALSE,
        fraud_score INTEGER DEFAULT 0,  -- 0-100, higher = more suspicious

        -- Source Tracking
        referrer TEXT,
        utm_source TEXT,
        utm_campaign TEXT,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Anti-gaming: One vote per email per submission
        UNIQUE(submission_id, voter_email),

        -- Anti-gaming: Limit votes from same IP (enforced in app logic)
        -- Anti-gaming: Limit votes from same fingerprint (enforced in app logic)
        CHECK (weight >= 0 AND weight <= 1)
      )
    `);

    // Create index for fast vote counting
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_votes_submission ON pup_votes(submission_id);
    `);

    // Create index for fraud detection
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_votes_ip ON pup_votes(voter_ip);
    `);

    // Create index for category browsing
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_category ON pup_submissions(category, status);
    `);

    // Create fraud tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vote_fraud_log (
        id SERIAL PRIMARY KEY,
        vote_id INTEGER REFERENCES pup_votes(id),
        fraud_type TEXT NOT NULL,  -- 'duplicate_ip', 'vpn_detected', 'bot_detected', 'rapid_voting'
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Viral contest schema created!\n');

    console.log('📋 Contest Categories:\n');
    console.log('   🤪 goofiest-face - "Goofiest Face Competition"');
    console.log('   🥴 biggest-derp - "Biggest Derp Award"');
    console.log('   ✂️ worst-haircut - "Worst Grooming Disaster"');
    console.log('   😂 funniest-fail - "Epic Dog Fail"');
    console.log('   🎭 most-dramatic - "Drama Queen/King Award"');
    console.log('   😴 worst-sleeper - "Weirdest Sleep Position"');
    console.log('   🤖 ai-dog - "Best AI Generated Dog (AI ONLY!)"\n');

    console.log('🛡️ Anti-Gaming Features:\n');
    console.log('   ✓ Email verification required');
    console.log('   ✓ IP address tracking');
    console.log('   ✓ Browser fingerprinting');
    console.log('   ✓ Vote weight adjustment for suspicious activity');
    console.log('   ✓ Fraud score calculation');
    console.log('   ✓ Rate limiting per IP/email');
    console.log('   ✓ Unique voter count (email-based)');
    console.log('   ✓ Share tracking for virality metrics\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateContestSchema();
