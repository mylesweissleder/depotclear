import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Add photos to a business
 * Requires authentication and business ownership
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessId, photoUrl } = body;

    if (!businessId || !photoUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user owns this business via approved claim
    const claimCheck = await sql`
      SELECT id FROM business_claims
      WHERE daycare_id = ${businessId}
        AND user_id = ${authResult.user.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found or you do not have permission' },
        { status: 403 }
      );
    }

    // Add photo to the photos array
    const result = await sql`
      UPDATE dog_daycares
      SET photos = array_append(COALESCE(photos, ARRAY[]::text[]), ${photoUrl}),
          updated_at = NOW()
      WHERE id = ${businessId}
      RETURNING photos
    `;

    return NextResponse.json({
      success: true,
      data: {
        photos: result.rows[0].photos,
      },
    });
  } catch (error: any) {
    console.error('Add photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add photo' },
      { status: 500 }
    );
  }
}

/**
 * Delete a photo from a business
 * Requires authentication and business ownership
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const photoUrl = searchParams.get('photoUrl');

    if (!businessId || !photoUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify user owns this business via approved claim
    const claimCheck = await sql`
      SELECT id FROM business_claims
      WHERE daycare_id = ${businessId}
        AND user_id = ${authResult.user.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found or you do not have permission' },
        { status: 403 }
      );
    }

    // Remove photo from the photos array
    const result = await sql`
      UPDATE dog_daycares
      SET photos = array_remove(photos, ${photoUrl}),
          updated_at = NOW()
      WHERE id = ${businessId}
      RETURNING photos
    `;

    return NextResponse.json({
      success: true,
      data: {
        photos: result.rows[0].photos,
      },
    });
  } catch (error: any) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
