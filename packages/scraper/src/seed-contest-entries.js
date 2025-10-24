import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Seed the contest with sample entries to kick things off
 */
async function seedContestEntries() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🌱 Seeding contest with sample entries...\\n');

    const sampleEntries = [
      {
        pup_name: 'Maximus',
        owner_name: 'Sarah Johnson',
        owner_email: 'sarah@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/pug/n02110958_14790.jpg',
        caption: 'My face when I hear the treat bag open 🤤',
        category: 'goofiest-face',
        votes: 234,
        unique_voters: 198
      },
      {
        pup_name: 'Bella',
        owner_name: 'Mike Chen',
        owner_email: 'mike@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/shihtzu/n02086240_5830.jpg',
        caption: 'Tongue stuck mid-blink... help 😛',
        category: 'biggest-derp',
        votes: 189,
        unique_voters: 156
      },
      {
        pup_name: 'Charlie',
        owner_name: 'Jessica Martinez',
        owner_email: 'jessica@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/poodle-toy/n02113624_1885.jpg',
        caption: 'The groomer said "trust me"... I should have known better ✂️',
        category: 'worst-haircut',
        votes: 156,
        unique_voters: 134
      },
      {
        pup_name: 'Luna',
        owner_name: 'David Kim',
        owner_email: 'david@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg',
        caption: 'Tried to jump on the couch, became a pancake instead 🥞',
        category: 'funniest-fail',
        votes: 278,
        unique_voters: 223
      },
      {
        pup_name: 'Cooper',
        owner_name: 'Amanda Williams',
        owner_email: 'amanda@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/spaniel-cocker/n02102318_4843.jpg',
        caption: 'When you say NO to second breakfast... the AUDACITY 🎭',
        category: 'most-dramatic',
        votes: 201,
        unique_voters: 167
      },
      {
        pup_name: 'Daisy',
        owner_name: 'Tom Anderson',
        owner_email: 'tom@woofspots.com',
        photo_url: 'https://images.dog.ceo/breeds/beagle/n02088364_11843.jpg',
        caption: 'Upside down, half off the couch, living my best life 😴',
        category: 'worst-sleeper',
        votes: 167,
        unique_voters: 143
      },
    ];

    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2025-01'

    for (const entry of sampleEntries) {
      await pool.query(
        `INSERT INTO pup_submissions
        (pup_name, owner_name, owner_email, photo_url, caption, category,
         votes, unique_voters, contest_month, status, created_at, approved_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'approved', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')
        ON CONFLICT DO NOTHING`,
        [
          entry.pup_name,
          entry.owner_name,
          entry.owner_email,
          entry.photo_url,
          entry.caption,
          entry.category,
          entry.votes,
          entry.unique_voters,
          currentMonth
        ]
      );

      console.log(`✅ Added ${entry.pup_name} - ${entry.category} (${entry.votes} votes)`);
    }

    console.log(`\\n🎉 Contest seeded with ${sampleEntries.length} entries!`);
    console.log('These entries are approved and ready to vote on.\\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

seedContestEntries();
