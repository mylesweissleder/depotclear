import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Update business listing details
 * Requires authentication and approved claim
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params; const businessId = parseInt(resolvedParams.id);
    if (isNaN(businessId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const claimCheck = await sql`
      SELECT id
      FROM business_claims
      WHERE daycare_id = ${businessId}
        AND user_id = ${auth.user!.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to edit this business' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      email,
      website,
      description,
      businessHours,
      amenities,
    } = body;

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (website !== undefined) {
      updates.push(`website = $${paramCount++}`);
      values.push(website);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (businessHours !== undefined) {
      updates.push(`business_hours = $${paramCount++}`);
      values.push(JSON.stringify(businessHours));
    }
    if (amenities !== undefined) {
      updates.push(`amenities = $${paramCount++}`);
      values.push(JSON.stringify(amenities));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add business ID to values
    values.push(businessId);

    // Execute update
    const query = `
      UPDATE dog_daycares
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    const business = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          address: business.address,
          city: business.city,
          state: business.state,
          zip: business.zip,
          phone: business.phone,
          email: business.email,
          website: business.website,
          rating: business.rating,
          reviewCount: business.review_count,
          businessHours: business.business_hours,
          amenities: business.amenities,
          description: business.description,
        },
      },
    });
  } catch (error: any) {
    console.error('Update business error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

/**
 * Get single business details for dashboard
 * Requires authentication and approved claim
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params; const businessId = parseInt(resolvedParams.id);
    if (isNaN(businessId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    // Get business with claim verification
    const result = await sql`
      SELECT
        d.*,
        bc.id as claim_id,
        bc.verified_at,
        s.id as subscription_id,
        s.plan as subscription_plan,
        s.status as subscription_status,
        s.current_period_end as subscription_ends
      FROM dog_daycares d
      JOIN business_claims bc ON d.id = bc.daycare_id
      LEFT JOIN subscriptions s ON d.id = s.daycare_id AND s.status = 'active'
      WHERE d.id = ${businessId}
        AND bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found or you do not have permission' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const business = {
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
      claimId: row.claim_id,
      verifiedAt: row.verified_at,
      subscription: row.subscription_id ? {
        id: row.subscription_id,
        plan: row.subscription_plan,
        status: row.subscription_status,
        endsAt: row.subscription_ends,
      } : null,
    };

    return NextResponse.json({
      success: true,
      data: { business },
    });
  } catch (error: any) {
    console.error('Get business error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get business' },
      { status: 500 }
    );
  }
}
