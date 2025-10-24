import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Get a specific claim by ID
 * Requires authentication and user must own the claim
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const claimId = parseInt(params.id);
    if (isNaN(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    // Get claim with daycare details
    const result = await sql`
      SELECT
        bc.id,
        bc.status,
        bc.verification_method,
        bc.verified_at,
        bc.created_at,
        bc.updated_at,
        d.id as daycare_id,
        d.name as daycare_name,
        d.address,
        d.city,
        d.state,
        d.zip,
        d.phone,
        d.email,
        d.website,
        d.rating,
        d.review_count,
        d.business_hours,
        d.amenities,
        d.description
      FROM business_claims bc
      JOIN dog_daycares d ON bc.daycare_id = d.id
      WHERE bc.id = ${claimId} AND bc.user_id = ${auth.user!.id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const claim = {
      id: row.id,
      status: row.status,
      verificationMethod: row.verification_method,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      daycare: {
        id: row.daycare_id,
        name: row.daycare_name,
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
        amenities: row.amenities,
        description: row.description,
      },
    };

    return NextResponse.json({
      success: true,
      data: { claim },
    });
  } catch (error: any) {
    console.error('Get claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get claim' },
      { status: 500 }
    );
  }
}

/**
 * Delete/cancel a claim
 * Requires authentication and user must own the claim
 * Only pending claims can be deleted
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const claimId = parseInt(params.id);
    if (isNaN(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    // Check if claim exists and belongs to user
    const claimCheck = await sql`
      SELECT id, status
      FROM business_claims
      WHERE id = ${claimId} AND user_id = ${auth.user!.id}
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    const claim = claimCheck.rows[0];

    // Only allow deletion of pending claims
    if (claim.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Only pending claims can be cancelled' },
        { status: 400 }
      );
    }

    // Delete the claim
    await sql`
      DELETE FROM business_claims
      WHERE id = ${claimId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Claim cancelled successfully',
    });
  } catch (error: any) {
    console.error('Delete claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel claim' },
      { status: 500 }
    );
  }
}
