import { sql } from '@vercel/postgres';

async function addWebcamColumns() {
  try {
    console.log('Adding webcam columns to dog_daycares table...');

    await sql`
      ALTER TABLE dog_daycares
      ADD COLUMN IF NOT EXISTS webcam_url TEXT,
      ADD COLUMN IF NOT EXISTS webcam_provider VARCHAR(50),
      ADD COLUMN IF NOT EXISTS webcam_public BOOLEAN DEFAULT true
    `;

    console.log('✅ Successfully added webcam columns');
    console.log('   - webcam_url: TEXT');
    console.log('   - webcam_provider: VARCHAR(50)');
    console.log('   - webcam_public: BOOLEAN (default true)');

  } catch (error) {
    console.error('❌ Error adding webcam columns:', error);
    process.exit(1);
  }
}

addWebcamColumns();
