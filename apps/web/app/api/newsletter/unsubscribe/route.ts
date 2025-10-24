import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    // Token is the normalized_email
    // Mark subscriber as unsubscribed
    const result = await sql`
      UPDATE newsletter_subscribers
      SET subscribed = FALSE,
          unsubscribed_at = CURRENT_TIMESTAMP
      WHERE normalized_email = ${token}
      RETURNING email
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    console.log(`Unsubscribed: ${result.rows[0].email}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
