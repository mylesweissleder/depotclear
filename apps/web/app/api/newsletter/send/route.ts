import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import MonthlyNewsletter from '@/emails/MonthlyNewsletter';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { month, customMessage, winnerIds, entryIds, daycareIds } = await request.json();

    // Fetch all subscribed newsletter subscribers
    const subscribers = await sql`
      SELECT email, normalized_email
      FROM newsletter_subscribers
      WHERE subscribed = TRUE
      ORDER BY created_at ASC
    `;

    if (subscribers.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No subscribers found' },
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

    // Send emails in batches (Resend allows batch sending)
    let sent = 0;
    const batchSize = 100; // Resend's batch limit
    const batches = Math.ceil(subscribers.rows.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const batch = subscribers.rows.slice(i * batchSize, (i + 1) * batchSize);

      try {
        const { data, error } = await resend.batch.send(
          batch.map((sub) => ({
            from: 'Woof Spots <newsletter@woofspots.com>',
            to: [sub.email],
            subject: `Woof Spots Monthly - ${month} 🐕`,
            react: MonthlyNewsletter({
              month,
              contestWinners: winnersData.rows as any,
              contestEntries: entriesData.rows as any,
              featuredDaycares: daycaresData.rows as any,
              customMessage,
              subscriberEmail: sub.email,
              unsubscribeToken: sub.normalized_email, // Use normalized email as token
            }),
          }))
        );

        if (error) {
          console.error(`Batch ${i + 1} error:`, error);
        } else {
          sent += batch.length;
        }

        // Rate limiting - wait between batches
        if (i < batches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (batchError) {
        console.error(`Batch ${i + 1} failed:`, batchError);
      }
    }

    console.log(`Newsletter sent to ${sent}/${subscribers.rows.length} subscribers`);

    return NextResponse.json({
      success: true,
      sent,
      total: subscribers.rows.length,
    });
  } catch (error: any) {
    console.error('Send newsletter error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
