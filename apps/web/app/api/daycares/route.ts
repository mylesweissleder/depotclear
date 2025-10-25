import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = searchParams.get('region') || 'bay-area';
    const city = searchParams.get('city') || 'All';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query dynamically based on filters
    let result;

    if (city !== 'All' && minRating > 0) {
      result = await sql`
        SELECT
          id, name, rating, review_count, address, phone, website,
          google_maps_url, price_level, city, region, business_types, scraped_at, tier
        FROM dog_daycares
        WHERE region = ${region}
          AND city = ${city}
          AND rating >= ${minRating}
        ORDER BY
          CASE tier
            WHEN 'top_dog' THEN 1
            WHEN 'claimed' THEN 2
            ELSE 3
          END,
          rating DESC NULLS LAST,
          review_count DESC NULLS LAST
        LIMIT ${limit}
      `;
    } else if (city !== 'All') {
      result = await sql`
        SELECT
          id, name, rating, review_count, address, phone, website,
          google_maps_url, price_level, city, region, business_types, scraped_at, tier
        FROM dog_daycares
        WHERE region = ${region}
          AND city = ${city}
        ORDER BY
          CASE tier
            WHEN 'top_dog' THEN 1
            WHEN 'claimed' THEN 2
            ELSE 3
          END,
          rating DESC NULLS LAST,
          review_count DESC NULLS LAST
        LIMIT ${limit}
      `;
    } else if (minRating > 0) {
      result = await sql`
        SELECT
          id, name, rating, review_count, address, phone, website,
          google_maps_url, price_level, city, region, business_types, scraped_at, tier
        FROM dog_daycares
        WHERE region = ${region}
          AND rating >= ${minRating}
        ORDER BY
          CASE tier
            WHEN 'top_dog' THEN 1
            WHEN 'claimed' THEN 2
            ELSE 3
          END,
          rating DESC NULLS LAST,
          review_count DESC NULLS LAST
        LIMIT ${limit}
      `;
    } else {
      result = await sql`
        SELECT
          id, name, rating, review_count, address, phone, website,
          google_maps_url, price_level, city, region, business_types, scraped_at, tier
        FROM dog_daycares
        WHERE region = ${region}
        ORDER BY
          CASE tier
            WHEN 'top_dog' THEN 1
            WHEN 'claimed' THEN 2
            ELSE 3
          END,
          rating DESC NULLS LAST,
          review_count DESC NULLS LAST
        LIMIT ${limit}
      `;
    }

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
