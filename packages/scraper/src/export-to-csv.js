import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const db = new Client({
  connectionString: 'postgresql://neondb_owner:npg_fPL4max0wRvy@ep-snowy-water-ahobfnp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

await db.connect();

console.log('📊 Exporting daycares to CSV...\n');

const result = await db.query(`
  SELECT
    id,
    name,
    city,
    state,
    address,
    phone,
    website,
    rating,
    review_count,
    latitude,
    longitude,
    place_id,
    created_at,
    updated_at
  FROM dog_daycares
  ORDER BY city, name
`);

// Helper to escape CSV values
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Create CSV content
const headers = [
  'ID',
  'Name',
  'City',
  'State',
  'Address',
  'Phone',
  'Website',
  'Rating',
  'Review Count',
  'Latitude',
  'Longitude',
  'Google Place ID',
  'Created At',
  'Updated At'
];

let csv = headers.join(',') + '\n';

result.rows.forEach(row => {
  const values = [
    row.id,
    escapeCsv(row.name),
    escapeCsv(row.city),
    escapeCsv(row.state),
    escapeCsv(row.address),
    escapeCsv(row.phone),
    escapeCsv(row.website),
    row.rating || '',
    row.review_count || '',
    row.latitude || '',
    row.longitude || '',
    escapeCsv(row.place_id),
    row.created_at ? new Date(row.created_at).toISOString() : '',
    row.updated_at ? new Date(row.updated_at).toISOString() : ''
  ];
  csv += values.join(',') + '\n';
});

// Write to file
const filename = `dog-daycares-export-${new Date().toISOString().split('T')[0]}.csv`;
fs.writeFileSync(filename, csv);

console.log(`✅ Export complete!`);
console.log(`📁 File: ${filename}`);
console.log(`📊 Total daycares: ${result.rows.length}`);
console.log(`\nPreview (first 3 rows):`);
console.log(csv.split('\n').slice(0, 4).join('\n'));

await db.end();
