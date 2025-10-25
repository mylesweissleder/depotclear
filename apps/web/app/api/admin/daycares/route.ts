import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { authenticateAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    // Get all daycares
    const result = await sql`
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
        tier,
        created_at
      FROM dog_daycares
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: {
        daycares: result.rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching daycares:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      city,
      state,
      address,
      phone,
      website,
      rating,
      review_count,
      place_id,
    } = body;

    // Validate required fields
    if (!name || !city) {
      return NextResponse.json(
        { success: false, error: 'Name and city are required' },
        { status: 400 }
      );
    }

    // Insert new daycare
    const result = await sql`
      INSERT INTO dog_daycares (
        name,
        city,
        state,
        address,
        phone,
        website,
        rating,
        review_count,
        place_id,
        created_at,
        updated_at
      ) VALUES (
        ${name},
        ${city},
        ${state || null},
        ${address || null},
        ${phone || null},
        ${website || null},
        ${rating || null},
        ${review_count || null},
        ${place_id || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: {
        daycare: result.rows[0],
      },
    });
  } catch (error: any) {
    console.error('Error creating daycare:', error);

    // Handle duplicate place_id or unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Daycare with this information already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
