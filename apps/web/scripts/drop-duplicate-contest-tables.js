import { sql } from '@vercel/postgres';

async function dropDuplicateContestTables() {
  try {
    console.log('Dropping duplicate contest tables...');

    await sql`DROP TABLE IF EXISTS contest_votes CASCADE`;
    await sql`DROP TABLE IF EXISTS contest_entries CASCADE`;

    console.log('✅ Successfully dropped duplicate contest tables');
    console.log('   - contest_votes (keeping pup_votes instead)');
    console.log('   - contest_entries (keeping pup_submissions instead)');

  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    process.exit(1);
  }
}

dropDuplicateContestTables();
