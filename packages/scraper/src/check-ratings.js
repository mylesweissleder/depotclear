import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

async function checkRatings() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();

    // Check rating distribution
    console.log('\n📊 Rating Distribution:\n');
    const dist = await client.query(`
      SELECT
        FLOOR(rating) as rating_floor,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM dog_daycares
      WHERE rating IS NOT NULL
      GROUP BY FLOOR(rating)
      ORDER BY rating_floor DESC
    `);

    for (const row of dist.rows) {
      console.log(`${row.rating_floor}+ stars: ${row.count} (${row.percentage}%)`);
    }

    // Sample of different ratings
    console.log('\n📋 Sample Businesses by Rating:\n');
    const samples = await client.query(`
      SELECT name, rating, review_count, city
      FROM dog_daycares
      WHERE rating IS NOT NULL
      ORDER BY rating DESC, review_count DESC
      LIMIT 20
    `);

    for (const row of samples.rows) {
      console.log(`${row.rating}⭐ - ${row.name} (${row.review_count} reviews) - ${row.city}`);
    }

    // Check for low-rated businesses
    console.log('\n⚠️  Lower Rated Businesses (< 4.0):\n');
    const lowRated = await client.query(`
      SELECT name, rating, review_count, city
      FROM dog_daycares
      WHERE rating < 4.0
      ORDER BY rating ASC
      LIMIT 10
    `);

    if (lowRated.rows.length === 0) {
      console.log('No businesses with ratings below 4.0 found!');
    } else {
      for (const row of lowRated.rows) {
        console.log(`${row.rating}⭐ - ${row.name} (${row.review_count} reviews) - ${row.city}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkRatings();
