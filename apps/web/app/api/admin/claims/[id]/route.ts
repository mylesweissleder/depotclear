import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { authenticateAdmin } from '@/lib/auth-middleware';
import { sendClaimApprovalEmail, sendClaimRejectionEmail } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const claimId = parseInt(params.id);
    if (isNaN(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update claim status
    const result = await sql`
      UPDATE claim_requests
      SET
        status = ${newStatus},
        updated_at = NOW()
      WHERE id = ${claimId}
      RETURNING
        id,
        business_name as "businessName",
        owner_name as "ownerName",
        email,
        status
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    // Send email notification to the business owner
    const claim = result.rows[0];

    if (action === 'approve') {
      await sendClaimApprovalEmail({
        to: claim.email,
        ownerName: claim.ownerName,
        businessName: claim.businessName,
      });
    } else {
      await sendClaimRejectionEmail({
        to: claim.email,
        ownerName: claim.ownerName,
        businessName: claim.businessName,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        claim,
      },
    });
  } catch (error: any) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
