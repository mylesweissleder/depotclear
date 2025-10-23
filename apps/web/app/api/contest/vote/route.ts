import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * POST /api/contest/vote
 * Vote for a contest entry
 *
 * Anti-gaming measures:
 * - One vote per submission per email
 * - Track IP address and browser fingerprint
 * - Rate limiting by IP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, voterEmail } = body;

    if (!submissionId || !voterEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing submission ID or email' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!voterEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get IP address and user agent for fraud detection
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if this email already voted for this submission
    const existingVote = await sql`
      SELECT id FROM pup_votes
      WHERE submission_id = ${submissionId} AND voter_email = ${voterEmail}
    `;

    if (existingVote.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You already voted for this pup!' },
        { status: 400 }
      );
    }

    // Check rate limiting - max 10 votes per IP in 1 hour
    const recentVotes = await sql`
      SELECT COUNT(*) as count FROM pup_votes
      WHERE ip_address = ${ipAddress}
      AND created_at > NOW() - INTERVAL '1 hour'
    `;

    if (parseInt(recentVotes.rows[0].count) >= 10) {
      return NextResponse.json(
        { success: false, error: 'Too many votes. Please try again later.' },
        { status: 429 }
      );
    }

    // Record the vote
    await sql`
      INSERT INTO pup_votes
      (submission_id, voter_email, ip_address, user_agent, vote_weight)
      VALUES (${submissionId}, ${voterEmail}, ${ipAddress}, ${userAgent}, 1.0)
    `;

    // Update submission vote counts
    const result = await sql`
      UPDATE pup_submissions
      SET votes = votes + 1,
          unique_voters = (
            SELECT COUNT(DISTINCT voter_email)
            FROM pup_votes
            WHERE submission_id = ${submissionId}
          ),
          updated_at = NOW()
      WHERE id = ${submissionId}
      RETURNING votes, unique_voters, pup_name
    `;

    const updated = result.rows[0];

    console.log(`Vote recorded: ${updated.pup_name} now has ${updated.votes} votes`);

    return NextResponse.json({
      success: true,
      votes: updated.votes,
      uniqueVoters: updated.unique_voters,
      message: 'Vote recorded! Thanks for participating! 🎉'
    });

  } catch (error: any) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record vote' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contest/vote?submissionId=X&email=Y
 * Check if user already voted for this submission
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const voterEmail = searchParams.get('email');

    if (!submissionId || !voterEmail) {
      return NextResponse.json({ hasVoted: false });
    }

    const result = await sql`
      SELECT id FROM pup_votes
      WHERE submission_id = ${submissionId} AND voter_email = ${voterEmail}
    `;

    return NextResponse.json({ hasVoted: result.rows.length > 0 });

  } catch (error: any) {
    console.error('Check vote error:', error);
    return NextResponse.json({ hasVoted: false });
  }
}
