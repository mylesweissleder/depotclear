import { NextRequest, NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;
import { Filter } from 'bad-words';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const filter = new Filter();

/**
 * POST /api/contest/submit
 * Submit a contest photo entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pupName,
      ownerName,
      ownerEmail,
      category,
      caption,
      daycareName,
      photoUrl,
    } = body;

    // Validate required fields
    if (!pupName || !ownerName || !ownerEmail || !category || !caption || !photoUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for profanity in public-facing fields
    if (filter.isProfane(pupName)) {
      return NextResponse.json(
        { success: false, error: 'Dog name contains inappropriate language' },
        { status: 400 }
      );
    }
    if (filter.isProfane(caption)) {
      return NextResponse.json(
        { success: false, error: 'Caption contains inappropriate language' },
        { status: 400 }
      );
    }
    if (daycareName && filter.isProfane(daycareName)) {
      return NextResponse.json(
        { success: false, error: 'Daycare name contains inappropriate language' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!ownerEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'goofiest-face',
      'biggest-derp',
      'worst-haircut',
      'funniest-fail',
      'most-dramatic',
      'worst-sleeper',
      'ai-dog',
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Check if AI category
    const isAiGenerated = category === 'ai-dog';

    // Get current month for contest period
    const now = new Date();
    const contestMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Insert submission
    const result = await pool.query(
      `INSERT INTO pup_submissions (
        pup_name, owner_name, owner_email, daycare_name,
        photo_url, caption, category, is_ai_generated,
        contest_month, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        pupName,
        ownerName,
        ownerEmail,
        daycareName || null,
        photoUrl,
        caption,
        category,
        isAiGenerated,
        contestMonth,
        'pending', // Requires moderation approval
      ]
    );

    const submissionId = result.rows[0].id;

    console.log('Contest submission created:', {
      submissionId,
      pupName,
      category,
      contestMonth,
    });

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Submission received! It will be reviewed and posted within 24 hours.',
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit entry' },
      { status: 500 }
    );
  }
}
