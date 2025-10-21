import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * GET /api/session-status?session_id=xxx
 * Check the status of a Stripe checkout session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'session_id required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      status: session.status,
      customer_email: session.customer_details?.email || null,
      payment_status: session.payment_status,
    });

  } catch (error) {
    console.error('Session status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
