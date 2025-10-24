import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { authenticateAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    // Get total users
    const usersResult = await sql`
      SELECT COUNT(*) as count FROM users
    `;
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total businesses
    const businessesResult = await sql`
      SELECT COUNT(*) as count FROM dog_daycares
    `;
    const totalBusinesses = parseInt(businessesResult.rows[0].count);

    // Get total and pending claims
    const claimsResult = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending
      FROM claim_requests
    `;
    const totalClaims = parseInt(claimsResult.rows[0].total);
    const pendingClaims = parseInt(claimsResult.rows[0].pending);

    // Get active subscriptions count
    const subscriptionsResult = await sql`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE status = 'active'
        AND current_period_end > NOW()
    `;
    const activeSubscriptions = parseInt(subscriptionsResult.rows[0].count);

    // Calculate monthly revenue (active subscriptions)
    const revenueResult = await sql`
      SELECT
        SUM(
          CASE
            WHEN plan = 'MONTHLY' THEN 99
            WHEN plan = 'ANNUAL' THEN 82.50  -- $990 / 12 months
            ELSE 0
          END
        ) as revenue
      FROM subscriptions
      WHERE status = 'active'
        AND current_period_end > NOW()
    `;
    const monthlyRevenue = parseFloat(revenueResult.rows[0].revenue || 0);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalBusinesses,
          totalClaims,
          pendingClaims,
          activeSubscriptions,
          monthlyRevenue: Math.round(monthlyRevenue),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
