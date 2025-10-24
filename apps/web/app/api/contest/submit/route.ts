import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Filter } from 'bad-words';
import { normalizeEmail, isDisposableEmail } from '@/lib/email-utils';

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
      city,
      state,
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

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert submission
    const result = await sql`
      INSERT INTO pup_submissions (
        pup_name, owner_name, owner_email, daycare_name,
        photo_url, caption, category, is_ai_generated,
        contest_month, status, city, state
      ) VALUES (
        ${pupName},
        ${ownerName},
        ${ownerEmail},
        ${daycareName || null},
        ${photoUrl},
        ${caption},
        ${category},
        ${isAiGenerated},
        ${contestMonth},
        ${'pending'},
        ${city || null},
        ${state || null}
      )
      RETURNING id
    `;

    const submissionId = result.rows[0].id;

    // Add email to newsletter (for contest updates, winners, and featured daycares)
    // This opts them into monthly updates about contest entries, winners, and premium accounts
    const normalizedEmail = normalizeEmail(ownerEmail);
    try {
      await sql`
        INSERT INTO newsletter_subscribers
        (email, normalized_email, source, ip_address, user_agent, subscribed)
        VALUES (${ownerEmail}, ${normalizedEmail}, 'contest_submission', ${ipAddress}, ${userAgent}, TRUE)
        ON CONFLICT (email) DO NOTHING
      `;
    } catch (newsletterError) {
      // Don't fail the submission if newsletter insert fails
      console.error('Newsletter insert error (non-fatal):', newsletterError);
    }

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
