import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Create enticing premium listing examples
 */
async function createPremiumExamples() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('✨ Creating premium listing examples...\n');

    // Get a few highly-rated daycares to upgrade
    const result = await pool.query(`
      SELECT id, name, city, rating
      FROM dog_daycares
      WHERE rating >= 4.5
      AND city IN ('San Francisco', 'Oakland', 'San Rafael', 'Palo Alto')
      ORDER BY rating DESC, review_count DESC
      LIMIT 5
    `);

    console.log(`Found ${result.rows.length} top-rated daycares to upgrade:\n`);

    const premiumData = [
      {
        description: "🌟 Premier dog daycare with spacious indoor/outdoor play areas, professional staff, and webcam access. Your pup's home away from home! We offer climate-controlled facilities, one-on-one attention, and daily report cards.",
        amenities: JSON.stringify([
          "🎥 24/7 Webcam Access",
          "🏊 Swimming Pool & Splash Pads",
          "🎾 Large Outdoor Play Yards",
          "❄️ Climate-Controlled Indoor Areas",
          "🐕‍🦺 Certified Trainers on Staff",
          "🚿 Full-Service Grooming",
          "📱 Daily Photo Updates",
          "🍖 Premium Meal Service Available"
        ]),
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
          "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800"
        ]),
        featured_badge: "⭐ Premium Member"
      },
      {
        description: "🏆 Award-winning luxury dog daycare featuring specialized play groups, agility courses, and personalized care plans. Serving discerning pet parents since 2010. Every dog gets individual attention in our boutique-style facility.",
        amenities: JSON.stringify([
          "🏅 Small Group Play (Max 12 Dogs)",
          "🎪 Professional Agility Equipment",
          "💆 Spa Services & Massages",
          "🎓 Training Classes Included",
          "🚗 Pickup & Drop-off Service",
          "🏥 On-Call Veterinary Care",
          "🍽️ Organic Treat Bar",
          "🛏️ Luxury Boarding Suites"
        ]),
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
          "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=800",
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800"
        ]),
        featured_badge: "🏆 Top Rated"
      },
      {
        description: "🌈 San Francisco's most colorful and fun dog daycare! We specialize in high-energy play, socialization, and making tails wag. Our trained staff ensures every pup has a pawsome day with activities tailored to their personality and energy level.",
        amenities: JSON.stringify([
          "🎉 Themed Play Days",
          "💧 Splash Zones & Kiddie Pools",
          "🎾 Fetch & Frisbee Areas",
          "📸 Professional Photo Sessions",
          "🧘 Puppy Yoga Classes",
          "🎂 Birthday Party Packages",
          "🏃 Daily Exercise Reports",
          "🦴 Healthy Snack Selection"
        ]),
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800",
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800",
          "https://images.unsplash.com/photo-1561871088-5682e15e82de?w=800"
        ]),
        featured_badge: "🌟 Staff Favorite"
      },
      {
        description: "🌲 Nature-focused daycare with acres of outdoor space, hiking trails, and forest play areas. Perfect for adventurous pups who love the great outdoors! We provide supervised nature walks, creek play, and plenty of fresh air.",
        amenities: JSON.stringify([
          "🌳 5-Acre Natural Play Space",
          "🥾 Daily Nature Hikes",
          "💦 Creek & Water Play",
          "🐾 Trail Adventures",
          "🏕️ Outdoor Training Areas",
          "🦺 Safety-Certified Staff",
          "📹 Live Activity Feeds",
          "🌿 Eco-Friendly Facility"
        ]),
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1561212024-cb9ad0c33195?w=800",
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800",
          "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800"
        ]),
        featured_badge: "🌲 Nature Haven"
      },
      {
        description: "💎 Boutique dog daycare offering personalized attention in a calm, structured environment. Ideal for puppies, seniors, and dogs who prefer smaller playgroups. Our cage-free facility feels like a luxury home with attentive staff who know every dog by name.",
        amenities: JSON.stringify([
          "👥 Small Capacity (Max 20 Dogs)",
          "🏠 Home-Like Environment",
          "👴 Senior Dog Specialists",
          "🐶 Puppy Socialization Program",
          "🧩 Enrichment Activities",
          "💤 Quiet Rest Areas",
          "👨‍⚕️ Medication Administration",
          "💝 Special Needs Care"
        ]),
        photos: JSON.stringify([
          "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800",
          "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800",
          "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800"
        ]),
        featured_badge: "💎 Boutique Care"
      }
    ];

    for (let i = 0; i < Math.min(result.rows.length, premiumData.length); i++) {
      const daycare = result.rows[i];
      const premium = premiumData[i];

      // Set as premium with 1 year expiration
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await pool.query(`
        UPDATE dog_daycares
        SET
          is_premium = true,
          premium_expires_at = $1,
          premium_plan = 'annual',
          description = $2,
          amenities = $3,
          photos = $4,
          featured_badge = $5,
          business_email = $6,
          booking_url = $7
        WHERE id = $8
      `, [
        expiresAt.toISOString(),
        premium.description,
        premium.amenities,
        premium.photos,
        premium.featured_badge,
        `contact@${daycare.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        daycare.website || 'https://example.com/book',
        daycare.id
      ]);

      console.log(`✅ Upgraded: ${daycare.name} (${daycare.city}) - ${daycare.rating}★`);
      console.log(`   ${premium.featured_badge}`);
      console.log('');
    }

    console.log('\n🎉 Premium examples created successfully!');
    console.log('\nThese listings now feature:');
    console.log('   • Compelling descriptions');
    console.log('   • Beautiful photos');
    console.log('   • Detailed amenities');
    console.log('   • Featured badges');
    console.log('   • 1-year premium access');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createPremiumExamples();
