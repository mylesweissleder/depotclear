import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Create a special offer/promotion
 * Requires authentication and approved claim
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { daycareId, title, description, discountType, discountValue, startDate, endDate, terms } = body;

    // Validation
    if (!daycareId || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Daycare ID, title, and description are required' },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const claimCheck = await sql`
      SELECT id
      FROM business_claims
      WHERE daycare_id = ${daycareId}
        AND user_id = ${auth.user!.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to create offers for this business' },
        { status: 403 }
      );
    }

    // Create offer
    const result = await sql`
      INSERT INTO special_offers (
        daycare_id,
        title,
        description,
        discount_type,
        discount_value,
        start_date,
        end_date,
        terms,
        is_active,
        created_at,
        updated_at
      )
      VALUES (
        ${daycareId},
        ${title},
        ${description},
        ${discountType || null},
        ${discountValue || null},
        ${startDate || null},
        ${endDate || null},
        ${terms || null},
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const offer = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        offer: {
          id: offer.id,
          daycareId: offer.daycare_id,
          title: offer.title,
          description: offer.description,
          discountType: offer.discount_type,
          discountValue: offer.discount_value,
          startDate: offer.start_date,
          endDate: offer.end_date,
          terms: offer.terms,
          isActive: offer.is_active,
          createdAt: offer.created_at,
        },
      },
    });
  } catch (error: any) {
    console.error('Create offer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}

/**
 * Get all offers for a business
 * Requires authentication and approved claim
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const daycareId = searchParams.get('daycareId');

    if (!daycareId) {
      return NextResponse.json(
        { success: false, error: 'Daycare ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const claimCheck = await sql`
      SELECT id
      FROM business_claims
      WHERE daycare_id = ${parseInt(daycareId)}
        AND user_id = ${auth.user!.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view offers for this business' },
        { status: 403 }
      );
    }

    // Get all offers
    const result = await sql`
      SELECT *
      FROM special_offers
      WHERE daycare_id = ${parseInt(daycareId)}
      ORDER BY created_at DESC
    `;

    const offers = result.rows.map((row: any) => ({
      id: row.id,
      daycareId: row.daycare_id,
      title: row.title,
      description: row.description,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      startDate: row.start_date,
      endDate: row.end_date,
      terms: row.terms,
      isActive: row.is_active,
      viewCount: row.view_count,
      claimCount: row.claim_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        offers,
        count: offers.length,
      },
    });
  } catch (error: any) {
    console.error('Get offers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get offers' },
      { status: 500 }
    );
  }
}
