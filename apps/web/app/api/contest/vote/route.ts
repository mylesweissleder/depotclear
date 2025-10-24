import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { normalizeEmail, isDisposableEmail } from '@/lib/email-utils';

/**
 * POST /api/contest/vote
 * Vote for a contest entry
 *
 * Anti-gaming measures:
 * - One vote per submission per email (normalized to prevent Gmail + trick)
 * - Track IP address and browser fingerprint
 * - Rate limiting by IP
 * - Block disposable email addresses
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

    // Block disposable emails
    if (isDisposableEmail(voterEmail)) {
      return NextResponse.json(
        { success: false, error: 'Disposable email addresses are not allowed' },
        { status: 400 }
      );
    }

    // Normalize email to prevent gaming (removes + tricks and dots from Gmail)
    const normalizedEmail = normalizeEmail(voterEmail);

    // Get IP address and user agent for fraud detection
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if this normalized email already voted for this submission
    // This prevents user+1@gmail.com, user+2@gmail.com tricks
    const existingVote = await sql`
      SELECT id, voter_email FROM pup_votes
      WHERE submission_id = ${submissionId}
    `;

    // Check if any existing vote has the same normalized email
    const duplicateVote = existingVote.rows.find(vote =>
      normalizeEmail(vote.voter_email) === normalizedEmail
    );

    if (duplicateVote) {
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

    // Add email to newsletter (ignore if already exists)
    // This opts them into updates about contest winners and future contests
    let isNewSubscriber = false;
    try {
      const insertResult = await sql`
        INSERT INTO newsletter_subscribers
        (email, normalized_email, source, ip_address, user_agent, subscribed)
        VALUES (${voterEmail}, ${normalizedEmail}, 'contest_vote', ${ipAddress}, ${userAgent}, TRUE)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;

      // If a row was returned, this is a new subscriber
      isNewSubscriber = insertResult.rows.length > 0;
    } catch (newsletterError) {
      // Don't fail the vote if newsletter insert fails
      console.error('Newsletter insert error (non-fatal):', newsletterError);
    }

    // Send welcome email to new subscribers (async, don't wait for it)
    if (isNewSubscriber) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/newsletter/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: voterEmail }),
      }).catch(err => {
        // Non-blocking - just log if it fails
        console.error('Failed to send welcome email (non-fatal):', err);
      });
    }

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
 * Check if user already voted for this submission (using normalized email)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const voterEmail = searchParams.get('email');

    if (!submissionId || !voterEmail) {
      return NextResponse.json({ hasVoted: false });
    }

    // Normalize the email to check for duplicates
    const normalizedEmail = normalizeEmail(voterEmail);

    // Get all votes for this submission
    const result = await sql`
      SELECT voter_email FROM pup_votes
      WHERE submission_id = ${submissionId}
    `;

    // Check if any vote has the same normalized email
    const hasVoted = result.rows.some(vote =>
      normalizeEmail(vote.voter_email) === normalizedEmail
    );

    return NextResponse.json({ hasVoted });

  } catch (error: any) {
    console.error('Check vote error:', error);
    return NextResponse.json({ hasVoted: false });
  }
}
