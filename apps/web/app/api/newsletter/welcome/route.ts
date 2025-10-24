import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sql } from '@vercel/postgres';
import WelcomeEmail from '@/emails/WelcomeEmail';
import crypto from 'crypto';

// Initialize Resend with fallback for build time
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

/**
 * POST /api/newsletter/welcome
 * Send welcome email to a new subscriber
 *
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if subscriber exists and hasn't received welcome email
    const subscriber = await sql`
      SELECT id, email, welcome_email_sent
      FROM newsletter_subscribers
      WHERE email = ${email}
      AND subscribed = TRUE
    `;

    if (subscriber.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    const sub = subscriber.rows[0];

    // Check if welcome email already sent
    if (sub.welcome_email_sent) {
      return NextResponse.json(
        { success: false, error: 'Welcome email already sent to this subscriber' },
        { status: 400 }
      );
    }

    // Generate unsubscribe token
    const unsubscribeToken = crypto
      .createHash('sha256')
      .update(`${email}-${Date.now()}-${process.env.RESEND_API_KEY || 'secret'}`)
      .digest('hex');

    // Update subscriber with unsubscribe token
    await sql`
      UPDATE newsletter_subscribers
      SET unsubscribe_token = ${unsubscribeToken}
      WHERE email = ${email}
    `;

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'Woof Spots <newsletter@woofspots.com>',
      to: [email],
      subject: 'Welcome to Woof Spots! 🐕',
      react: WelcomeEmail({
        subscriberEmail: email,
        unsubscribeToken,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }

    // Mark welcome email as sent
    await sql`
      UPDATE newsletter_subscribers
      SET welcome_email_sent = TRUE,
          welcome_email_sent_at = NOW()
      WHERE email = ${email}
    `;

    console.log(`Welcome email sent to ${email}`);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: 'Welcome email sent successfully',
    });

  } catch (error: any) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
