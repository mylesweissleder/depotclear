import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Update an existing offer
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

    const resolvedParams = await params; const offerId = parseInt(resolvedParams.id);
    if (isNaN(offerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid offer ID' },
        { status: 400 }
      );
    }

    // Get offer and verify ownership
    const offerCheck = await sql`
      SELECT so.*, bc.user_id
      FROM special_offers so
      JOIN business_claims bc ON so.daycare_id = bc.daycare_id
      WHERE so.id = ${offerId}
        AND bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
    `;

    if (offerCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Offer not found or you do not have permission' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, discountType, discountValue, startDate, endDate, terms, isActive } = body;

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (discountType !== undefined) {
      updates.push(`discount_type = $${paramCount++}`);
      values.push(discountType);
    }
    if (discountValue !== undefined) {
      updates.push(`discount_value = $${paramCount++}`);
      values.push(discountValue);
    }
    if (startDate !== undefined) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(startDate);
    }
    if (endDate !== undefined) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(endDate);
    }
    if (terms !== undefined) {
      updates.push(`terms = $${paramCount++}`);
      values.push(terms);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(offerId);

    const query = `
      UPDATE special_offers
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql.query(query, values);
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
          updatedAt: offer.updated_at,
        },
      },
    });
  } catch (error: any) {
    console.error('Update offer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

/**
 * Delete an offer
 * Requires authentication and approved claim
 */
export async function DELETE(
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

    const resolvedParams = await params; const offerId = parseInt(resolvedParams.id);
    if (isNaN(offerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid offer ID' },
        { status: 400 }
      );
    }

    // Verify ownership
    const offerCheck = await sql`
      SELECT so.id
      FROM special_offers so
      JOIN business_claims bc ON so.daycare_id = bc.daycare_id
      WHERE so.id = ${offerId}
        AND bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
    `;

    if (offerCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Offer not found or you do not have permission' },
        { status: 404 }
      );
    }

    // Delete offer
    await sql`
      DELETE FROM special_offers
      WHERE id = ${offerId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete offer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
