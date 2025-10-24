import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Business type detection rules based on name keywords
const typeRules = {
  daycare: ['daycare', 'day care', 'doggy daycare', 'doggie daycare'],
  boarding: ['boarding', 'kennel', 'lodge', 'hotel', 'resort', 'inn'],
  grooming: ['grooming', 'groomer', 'spa', 'salon', 'bath'],
  training: ['training', 'trainer', 'obedience', 'school', 'academy'],
  walking: ['walking', 'walker', 'walk', 'hiking'],
  sitting: ['sitting', 'sitter', 'pet sitting'],
  veterinary: ['vet', 'veterinary', 'veterinarian', 'animal hospital', 'clinic'],
  retail: ['pet store', 'pet shop', 'supply', 'supplies', 'petco', 'petsmart', 'pet supplies plus'],
  park: ['dog park', 'bark park'],
};

function detectBusinessTypes(name) {
  const nameLower = name.toLowerCase();
  const types = [];

  for (const [type, keywords] of Object.entries(typeRules)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        types.push(type);
        break; // Only add each type once
      }
    }
  }

  // If no types detected, default to daycare (most common)
  if (types.length === 0) {
    types.push('daycare');
  }

  return types;
}

async function categorizeBusinesses() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Fetch all businesses
    const result = await client.query('SELECT id, name, business_types FROM dog_daycares ORDER BY id');
    console.log(`\n📊 Found ${result.rows.length} businesses\n`);

    let updated = 0;
    let skipped = 0;

    for (const row of result.rows) {
      const { id, name, business_types } = row;

      // Skip if already has types
      if (business_types && business_types.length > 0) {
        console.log(`⏭️  #${id} ${name} - already has types: ${JSON.stringify(business_types)}`);
        skipped++;
        continue;
      }

      // Detect types
      const types = detectBusinessTypes(name);

      // Update database
      await client.query(
        'UPDATE dog_daycares SET business_types = $1 WHERE id = $2',
        [JSON.stringify(types), id]
      );

      console.log(`✅ #${id} ${name} → ${JSON.stringify(types)}`);
      updated++;
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${result.rows.length}`);

    // Show type distribution
    console.log(`\n📊 Type Distribution:`);
    const typeCounts = await client.query(`
      SELECT
        jsonb_array_elements_text(business_types) as type,
        COUNT(*) as count
      FROM dog_daycares
      WHERE business_types IS NOT NULL AND jsonb_array_length(business_types) > 0
      GROUP BY type
      ORDER BY count DESC
    `);

    for (const row of typeCounts.rows) {
      console.log(`   ${row.type}: ${row.count}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

categorizeBusinesses();
