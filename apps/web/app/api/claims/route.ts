import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

/**
 * Create a new business claim request
 * Requires authentication
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
    const { daycareId, verificationMethod } = body;

    // Validation
    if (!daycareId) {
      return NextResponse.json(
        { success: false, error: 'Daycare ID is required' },
        { status: 400 }
      );
    }

    if (!verificationMethod || !['email', 'phone', 'document'].includes(verificationMethod)) {
      return NextResponse.json(
        { success: false, error: 'Valid verification method is required (email, phone, or document)' },
        { status: 400 }
      );
    }

    // Check if daycare exists
    const daycareResult = await sql`
      SELECT id, name, email, phone, website
      FROM dog_daycares
      WHERE id = ${daycareId}
    `;

    if (daycareResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Daycare not found' },
        { status: 404 }
      );
    }

    const daycare = daycareResult.rows[0];

    // Check if user already has a claim for this daycare
    const existingClaim = await sql`
      SELECT id, status
      FROM business_claims
      WHERE user_id = ${auth.user!.id} AND daycare_id = ${daycareId}
    `;

    if (existingClaim.rows.length > 0) {
      const claim = existingClaim.rows[0];
      if (claim.status === 'approved') {
        return NextResponse.json(
          { success: false, error: 'You have already claimed this business' },
          { status: 400 }
        );
      }
      if (claim.status === 'pending') {
        return NextResponse.json(
          { success: false, error: 'You already have a pending claim for this business' },
          { status: 400 }
        );
      }
    }

    // Check if business is already claimed by someone else
    const otherClaims = await sql`
      SELECT id, user_id, status
      FROM business_claims
      WHERE daycare_id = ${daycareId}
        AND user_id != ${auth.user!.id}
        AND status = 'approved'
    `;

    if (otherClaims.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This business has already been claimed by another user' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create the claim
    const result = await sql`
      INSERT INTO business_claims (
        user_id,
        daycare_id,
        status,
        verification_method,
        verification_token,
        created_at,
        updated_at
      )
      VALUES (
        ${auth.user!.id},
        ${daycareId},
        'pending',
        ${verificationMethod},
        ${verificationToken},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id, user_id, daycare_id, status, verification_method, created_at
    `;

    const claim = result.rows[0];

    // TODO: Send verification email or SMS based on verification method
    // For now, just log the verification token
    if (verificationMethod === 'email' && daycare.email) {
      console.log('Verification email would be sent to:', daycare.email);
      console.log('Verification link:', `${process.env.NEXT_PUBLIC_APP_URL}/verify-claim?token=${verificationToken}`);
    } else if (verificationMethod === 'phone' && daycare.phone) {
      console.log('Verification SMS would be sent to:', daycare.phone);
      console.log('Verification code:', verificationToken.substring(0, 6).toUpperCase());
    }

    return NextResponse.json({
      success: true,
      data: {
        claim: {
          id: claim.id,
          daycareId: claim.daycare_id,
          status: claim.status,
          verificationMethod: claim.verification_method,
          createdAt: claim.created_at,
        },
        message: verificationMethod === 'document'
          ? 'Claim submitted. Please upload verification documents to complete your claim.'
          : `Verification ${verificationMethod === 'email' ? 'email' : 'SMS'} sent. Please check your ${verificationMethod === 'email' ? 'inbox' : 'phone'}.`,
      },
    });
  } catch (error: any) {
    console.error('Create claim error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}

/**
 * Get user's business claims
 * Requires authentication
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

    // Get all claims for this user with daycare details
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
        d.website,
        d.rating,
        d.review_count
      FROM business_claims bc
      JOIN dog_daycares d ON bc.daycare_id = d.id
      WHERE bc.user_id = ${auth.user!.id}
      ORDER BY bc.created_at DESC
    `;

    const claims = result.rows.map((row: any) => ({
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
        website: row.website,
        rating: row.rating,
        reviewCount: row.review_count,
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        claims,
        count: claims.length,
      },
    });
  } catch (error: any) {
    console.error('Get claims error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get claims' },
      { status: 500 }
    );
  }
}
