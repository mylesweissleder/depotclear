import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

/**
 * Seed database with realistic demo data
 */
async function seedDemoData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🌱 Seeding demo data...\n');

    const demoProducts = [
      {
        product_id: 'demo-001',
        title: 'LED Work Light 1000 Lumens - Rechargeable',
        price: 0.03,
        category: 'Lighting',
        model_number: 'LED-1000',
        url: 'https://www.homedepot.com/p/1000-Lumens-Rechargeable-LED-Work-Light',
      },
      {
        product_id: 'demo-002',
        title: 'Cordless Drill 18V Battery Pack',
        price: 0.88,
        category: 'Tools',
        model_number: 'BAT-18V',
        url: 'https://www.homedepot.com/p/18V-ONE-Lithium-Ion-Battery-Pack',
      },
      {
        product_id: 'demo-003',
        title: 'Exterior House Paint 1 Gallon - Gray',
        price: 0.01,
        category: 'Paint',
        model_number: 'EXT-GRAY-1G',
        url: 'https://www.homedepot.com/p/BEHR-Premium-Plus-1-gal-Gray',
      },
      {
        product_id: 'demo-004',
        title: 'Garden Hose 50ft Heavy Duty Rubber',
        price: 0.99,
        category: 'Outdoor',
        model_number: 'HOSE-50HD',
        url: 'https://www.homedepot.com/p/50-ft-Heavy-Duty-Rubber-Hose',
      },
      {
        product_id: 'demo-005',
        title: 'Door Hinges Brass Finish (Pack of 6)',
        price: 0.06,
        category: 'Hardware',
        model_number: 'HINGE-BR-6',
        url: 'https://www.homedepot.com/p/Brass-Door-Hinges-6-Pack',
      },
      {
        product_id: 'demo-006',
        title: 'Power Drill Bit Set 21-Piece Titanium',
        price: 0.03,
        category: 'Tools',
        model_number: 'DBS-21TI',
        url: 'https://www.homedepot.com/p/DEWALT-21-Piece-Titanium-Drill-Bit-Set',
      },
      {
        product_id: 'demo-007',
        title: 'LED Ceiling Fan Light Kit - Bronze',
        price: 0.88,
        category: 'Lighting',
        model_number: 'FAN-LED-BR',
        url: 'https://www.homedepot.com/p/Hampton-Bay-Ceiling-Fan-LED-Light-Kit',
      },
      {
        product_id: 'demo-008',
        title: 'Interior Wood Stain 1 Quart - Dark Walnut',
        price: 0.06,
        category: 'Paint',
        model_number: 'STAIN-DW-1Q',
        url: 'https://www.homedepot.com/p/Minwax-Wood-Stain-Dark-Walnut',
      },
      {
        product_id: 'demo-009',
        title: 'Lawn Fertilizer 32lb Bag - Weed & Feed',
        price: 0.99,
        category: 'Outdoor',
        model_number: 'FERT-WF-32',
        url: 'https://www.homedepot.com/p/Scotts-Turf-Builder-Weed-and-Feed',
      },
      {
        product_id: 'demo-010',
        title: 'Cabinet Handles Brushed Nickel (10-Pack)',
        price: 0.01,
        category: 'Hardware',
        model_number: 'HANDLE-BN-10',
        url: 'https://www.homedepot.com/p/Cabinet-Handles-Brushed-Nickel',
      },
      {
        product_id: 'demo-011',
        title: 'Socket Wrench Set 40-Piece SAE Metric',
        price: 0.88,
        category: 'Tools',
        model_number: 'WR-40SM',
        url: 'https://www.homedepot.com/p/CRAFTSMAN-40-Piece-Socket-Set',
      },
      {
        product_id: 'demo-012',
        title: 'Under Cabinet LED Light Bar 24-inch',
        price: 0.03,
        category: 'Lighting',
        model_number: 'LED-UC-24',
        url: 'https://www.homedepot.com/p/Commercial-Electric-24-in-LED-Light-Bar',
      },
      {
        product_id: 'demo-013',
        title: 'Spray Paint Gloss Black (6 Pack)',
        price: 0.99,
        category: 'Paint',
        model_number: 'SPRAY-BLK-6',
        url: 'https://www.homedepot.com/p/Rust-Oleum-Spray-Paint-Gloss-Black',
      },
      {
        product_id: 'demo-014',
        title: 'Mulch Brown Dyed 2 Cu Ft Bag',
        price: 0.06,
        category: 'Outdoor',
        model_number: 'MULCH-BR-2',
        url: 'https://www.homedepot.com/p/Brown-Dyed-Mulch-2-cu-ft',
      },
      {
        product_id: 'demo-015',
        title: 'Drawer Slides Soft-Close 18-inch (Pair)',
        price: 0.01,
        category: 'Hardware',
        model_number: 'SLIDE-SC-18',
        url: 'https://www.homedepot.com/p/Soft-Close-Drawer-Slides-18-in',
      },
    ];

    let count = 0;
    for (const product of demoProducts) {
      await pool.query(
        `INSERT INTO products (product_id, title, price, price_text, category, model_number, url, is_clearance_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (product_id) DO NOTHING`,
        [
          product.product_id,
          product.title,
          product.price,
          `$${product.price.toFixed(2)}`,
          product.category,
          product.model_number,
          product.url,
          true
        ]
      );
      count++;
      console.log(`   ✓ Added: ${product.title} - $${product.price.toFixed(2)}`);
    }

    console.log(`\n✅ Successfully seeded ${count} demo products\n`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedDemoData();
