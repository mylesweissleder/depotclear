import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import MonthlyNewsletter from '@/emails/MonthlyNewsletter';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { month, customMessage, winnerIds, entryIds, daycareIds, testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { success: false, error: 'Test email is required' },
        { status: 400 }
      );
    }

    // Fetch data
    const winnersData = winnerIds && winnerIds.length > 0
      ? await sql`SELECT * FROM pup_submissions WHERE id = ANY(${winnerIds}) ORDER BY votes DESC`
      : { rows: [] };

    const entriesData = entryIds && entryIds.length > 0
      ? await sql`SELECT * FROM pup_submissions WHERE id = ANY(${entryIds}) ORDER BY votes DESC`
      : { rows: [] };

    const daycaresData = daycareIds && daycareIds.length > 0
      ? await sql`SELECT * FROM dog_daycares WHERE id = ANY(${daycareIds})`
      : { rows: [] };

    // Send test email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Woof Spots <newsletter@woofspots.com>',
      to: [testEmail],
      subject: `[TEST] Woof Spots Monthly - ${month}`,
      react: MonthlyNewsletter({
        month,
        contestWinners: winnersData.rows as any,
        contestEntries: entriesData.rows as any,
        featuredDaycares: daycaresData.rows as any,
        customMessage,
        subscriberEmail: testEmail,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error: any) {
    console.error('Send test error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
