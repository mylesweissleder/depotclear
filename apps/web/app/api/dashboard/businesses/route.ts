import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Get all approved business claims for the authenticated user
 * This is the main endpoint for the business dashboard
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

    // Get all approved business claims with full daycare details
    const result = await sql`
      SELECT
        bc.id as claim_id,
        bc.verified_at,
        d.*,
        s.id as subscription_id,
        s.plan as subscription_plan,
        s.status as subscription_status,
        s.current_period_end as subscription_ends
      FROM business_claims bc
      JOIN dog_daycares d ON bc.daycare_id = d.id
      LEFT JOIN subscriptions s ON d.id = s.daycare_id AND s.status = 'active'
      WHERE bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
      ORDER BY bc.verified_at DESC
    `;

    const businesses = result.rows.map((row: any) => ({
      claimId: row.claim_id,
      verifiedAt: row.verified_at,
      business: {
        id: row.id,
        name: row.name,
        address: row.address,
        city: row.city,
        state: row.state,
        zip: row.zip,
        phone: row.phone,
        email: row.email,
        website: row.website,
        rating: row.rating,
        reviewCount: row.review_count,
        businessHours: row.business_hours,
        businessStatus: row.business_status,
        amenities: row.amenities,
        description: row.description,
        photos: row.photos,
        latitude: row.latitude,
        longitude: row.longitude,
      },
      subscription: row.subscription_id ? {
        id: row.subscription_id,
        plan: row.subscription_plan,
        status: row.subscription_status,
        endsAt: row.subscription_ends,
      } : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        businesses,
        count: businesses.length,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard businesses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get businesses' },
      { status: 500 }
    );
  }
}
