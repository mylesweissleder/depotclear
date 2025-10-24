import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'depotclear2024';

function verifyPassword(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;

  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// GET - Fetch all submissions with vote counts
export async function GET(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch submissions with vote counts
    const result = await sql`
      SELECT
        s.*,
        COUNT(DISTINCT v.id) as vote_count
      FROM pup_submissions s
      LEFT JOIN pup_votes v ON v.submission_id = s.id
      GROUP BY s.id
      ORDER BY
        CASE
          WHEN s.status = 'pending' THEN 1
          WHEN s.status = 'approved' THEN 2
          WHEN s.status = 'rejected' THEN 3
        END,
        s.submitted_at DESC
    `;

    return NextResponse.json({
      submissions: result.rows
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST - Update submission status (approve/reject)
export async function POST(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request. Provide id and status (approved/rejected)' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE pup_submissions
      SET status = ${status}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
