import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Verify a business claim using a verification token
 * This endpoint is called when a business owner clicks the verification link
 * sent to their email or enters the verification code from SMS
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    // Validation
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find the claim with this verification token
    const claimResult = await sql`
      SELECT bc.*, d.name as daycare_name
      FROM business_claims bc
      JOIN dog_daycares d ON bc.daycare_id = d.id
      WHERE bc.verification_token = ${token}
        AND bc.status = 'pending'
    `;

    if (claimResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    const claim = claimResult.rows[0];

    // Update claim status to approved
    await sql`
      UPDATE business_claims
      SET status = 'approved',
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${claim.id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Business claim verified successfully',
      data: {
        claim: {
          id: claim.id,
          daycareId: claim.daycare_id,
          daycareNa: claim.daycare_name,
          status: 'approved',
          verifiedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error('Verify claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify claim' },
      { status: 500 }
    );
  }
}
