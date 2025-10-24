import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { render } from '@react-email/components';
import MonthlyNewsletter from '@/emails/MonthlyNewsletter';

export async function POST(request: NextRequest) {
  try {
    const { month, customMessage, winnerIds, entryIds, daycareIds } = await request.json();

    // Fetch selected contest winners
    const winnersData = winnerIds && winnerIds.length > 0
      ? await sql`SELECT * FROM pup_submissions WHERE id = ANY(${winnerIds}) ORDER BY votes DESC`
      : { rows: [] };

    // Fetch selected contest entries
    const entriesData = entryIds && entryIds.length > 0
      ? await sql`SELECT * FROM pup_submissions WHERE id = ANY(${entryIds}) ORDER BY votes DESC`
      : { rows: [] };

    // Fetch selected daycares
    const daycaresData = daycareIds && daycareIds.length > 0
      ? await sql`SELECT * FROM dog_daycares WHERE id = ANY(${daycareIds})`
      : { rows: [] };

    // Render email to HTML
    const html = render(
      MonthlyNewsletter({
        month,
        contestWinners: winnersData.rows as any,
        contestEntries: entriesData.rows as any,
        featuredDaycares: daycaresData.rows as any,
        customMessage,
        subscriberEmail: 'preview@example.com',
      })
    );

    return NextResponse.json({
      success: true,
      html,
    });
  } catch (error: any) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
