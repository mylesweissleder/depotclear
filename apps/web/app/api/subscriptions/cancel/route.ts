import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { stripe } from '@/lib/stripe';
import { sql } from '@vercel/postgres';

/**
 * Cancel a subscription
 * Requires authentication and subscription ownership
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns this subscription
    const subCheck = await sql`
      SELECT s.*, bc.user_id
      FROM subscriptions s
      JOIN business_claims bc ON s.daycare_id = bc.daycare_id
      WHERE s.id = ${subscriptionId}
        AND bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
    `;

    if (subCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found or you do not have permission' },
        { status: 404 }
      );
    }

    const subscription = subCheck.rows[0];

    // Cancel in Stripe
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

    // Update local database
    await sql`
      UPDATE subscriptions
      SET status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${subscriptionId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
