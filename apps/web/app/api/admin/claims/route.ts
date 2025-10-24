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

    // Get all claim requests from the contact form
    const result = await sql`
      SELECT
        id,
        business_name as "businessName",
        owner_name as "ownerName",
        email,
        phone,
        city,
        website,
        message,
        status,
        created_at as "createdAt"
      FROM claim_requests
      ORDER BY
        CASE
          WHEN status = 'pending' THEN 1
          WHEN status = 'approved' THEN 2
          ELSE 3
        END,
        created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: {
        claims: result.rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
