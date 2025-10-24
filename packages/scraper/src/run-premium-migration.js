import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrationPath = join(__dirname, '../migrations/add-premium-features.sql');
    const sql = readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running premium features migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
