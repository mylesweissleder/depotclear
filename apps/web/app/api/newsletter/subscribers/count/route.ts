import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM newsletter_subscribers
      WHERE subscribed = TRUE
    `;

    return NextResponse.json({
      success: true,
      count: parseInt(result.rows[0].count),
    });
  } catch (error: any) {
    console.error('Subscriber count error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
