import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = searchParams.get('region') || 'bay-area';
    const city = searchParams.get('city') || 'All';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = `
      SELECT
        id, name, rating, review_count, address, phone, website,
        google_maps_url, price_level, city, region, scraped_at
      FROM dog_daycares
      WHERE region = $1
    `;

    const params: any[] = [region];
    let paramCount = 2;

    if (city !== 'All') {
      query += ` AND city = $${paramCount}`;
      params.push(city);
      paramCount++;
    }

    if (minRating > 0) {
      query += ` AND rating >= $${paramCount}`;
      params.push(minRating);
      paramCount++;
    }

    query += ` ORDER BY rating DESC NULLS LAST, review_count DESC NULLS LAST LIMIT $${paramCount}`;
    params.push(limit);

    const result = await pool.query(query, params);

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
