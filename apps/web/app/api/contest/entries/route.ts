import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/contest/entries
 * Fetch approved contest entries
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM format

    let result;

    if (category && category !== 'all') {
      // Filter by category
      result = await sql`
        SELECT
          id,
          pup_name,
          owner_name,
          daycare_name,
          photo_url,
          caption,
          category,
          votes,
          unique_voters,
          contest_month,
          created_at
        FROM pup_submissions
        WHERE status = 'approved'
          AND category = ${category}
          AND contest_month = ${month}
        ORDER BY votes DESC, created_at DESC
      `;
    } else {
      // All entries
      result = await sql`
        SELECT
          id,
          pup_name,
          owner_name,
          daycare_name,
          photo_url,
          caption,
          category,
          votes,
          unique_voters,
          contest_month,
          created_at
        FROM pup_submissions
        WHERE status = 'approved'
          AND contest_month = ${month}
        ORDER BY votes DESC, created_at DESC
      `;
    }

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Fetch entries error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}
