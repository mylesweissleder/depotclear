import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { sql } from '@vercel/postgres';

/**
 * Get analytics data for a specific business
 * Requires authentication and approved claim
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const businessId = parseInt(params.id);
    if (isNaN(businessId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const claimCheck = await sql`
      SELECT id
      FROM business_claims
      WHERE daycare_id = ${businessId}
        AND user_id = ${auth.user!.id}
        AND status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view analytics for this business' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period);

    // Get summary stats from analytics_summary table
    const summaryResult = await sql`
      SELECT *
      FROM analytics_summary
      WHERE daycare_id = ${businessId}
        AND date >= CURRENT_DATE - INTERVAL '${periodDays} days'
      ORDER BY date DESC
    `;

    // Get recent individual events (last 100)
    const eventsResult = await sql`
      SELECT
        id,
        event_type,
        user_agent,
        referrer,
        created_at
      FROM analytics_events
      WHERE daycare_id = ${businessId}
        AND created_at >= CURRENT_TIMESTAMP - INTERVAL '${periodDays} days'
      ORDER BY created_at DESC
      LIMIT 100
    `;

    // Calculate totals
    const totals = {
      pageViews: 0,
      clicks: 0,
      phoneClicks: 0,
      websiteClicks: 0,
      directionsClicks: 0,
    };

    summaryResult.rows.forEach((row: any) => {
      totals.pageViews += row.page_views || 0;
      totals.clicks += row.clicks || 0;
      totals.phoneClicks += row.phone_clicks || 0;
      totals.websiteClicks += row.website_clicks || 0;
      totals.directionsClicks += row.directions_clicks || 0;
    });

    // Format daily stats
    const dailyStats = summaryResult.rows.map((row: any) => ({
      date: row.date,
      pageViews: row.page_views,
      clicks: row.clicks,
      phoneClicks: row.phone_clicks,
      websiteClicks: row.website_clicks,
      directionsClicks: row.directions_clicks,
    }));

    // Format recent events
    const recentEvents = eventsResult.rows.map((row: any) => ({
      id: row.id,
      eventType: row.event_type,
      userAgent: row.user_agent,
      referrer: row.referrer,
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        period: periodDays,
        totals,
        dailyStats,
        recentEvents,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
