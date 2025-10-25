import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

/**
 * API Route: POST /api/admin/review-submission
 * Admin endpoint to approve or reject user-submitted businesses
 * Requires authentication (TODO: add auth middleware)
 */

const ReviewSchema = z.object({
  submissionId: z.number().int().positive(),
  action: z.enum(['approve', 'reject']),
  adminEmail: z.string().email(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Check admin authentication
    // const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Parse request body
    const body = await request.json();
    const validatedData = ReviewSchema.parse(body);

    if (validatedData.action === 'approve') {
      // Approve submission
      const result = await sql`
        SELECT approve_submission(
          ${validatedData.submissionId},
          ${validatedData.adminEmail},
          ${validatedData.notes || null}
        ) as success
      `;

      if (!result.rows[0].success) {
        return NextResponse.json(
          { error: 'Submission not found or already reviewed' },
          { status: 404 }
        );
      }

      // TODO: Send approval email to submitter
      // await sendApprovalEmail(submissionId);

      return NextResponse.json({
        success: true,
        message: 'Business approved and is now live',
      });

    } else {
      // Reject submission
      if (!validatedData.notes) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      const result = await sql`
        SELECT reject_submission(
          ${validatedData.submissionId},
          ${validatedData.adminEmail},
          ${validatedData.notes}
        ) as success
      `;

      if (!result.rows[0].success) {
        return NextResponse.json(
          { error: 'Submission not found or already reviewed' },
          { status: 404 }
        );
      }

      // TODO: Send rejection email to submitter
      // await sendRejectionEmail(submissionId, validatedData.notes);

      return NextResponse.json({
        success: true,
        message: 'Submission rejected',
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin dashboard stats
export async function GET() {
  try {
    const stats = await sql`
      SELECT * FROM submission_stats
      ORDER BY data_source, verification_status
    `;

    const pending = await sql`
      SELECT
        id,
        name,
        city,
        state,
        submitted_by_name,
        submitted_by_email,
        submitted_at,
        EXTRACT(EPOCH FROM (NOW() - submitted_at))/3600 AS hours_pending
      FROM dog_daycares
      WHERE verification_status = 'pending'
      ORDER BY submitted_at ASC
      LIMIT 50
    `;

    return NextResponse.json({
      stats: stats.rows,
      pending: pending.rows,
      totalPending: pending.rowCount,
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
