import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * POST /api/checkout
 * Creates a Stripe Checkout session for premium listing upgrade
 */
export async function POST(request: NextRequest) {
  try {
    const { email, daycareId, plan = 'monthly' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email required' },
        { status: 400 }
      );
    }

    if (!daycareId) {
      return NextResponse.json(
        { success: false, error: 'Daycare ID required' },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ['monthly', 'annual'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Premium pricing (set these in Stripe Dashboard and env vars)
    const priceIds = {
      monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,  // $99/month
      annual: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID,    // $990/year (17% discount)
    };

    const priceId = priceIds[plan as keyof typeof priceIds];

    if (!priceId) {
      console.error(`Missing price ID for plan: ${plan}`);
      return NextResponse.json(
        { success: false, error: 'Pricing configuration error' },
        { status: 500 }
      );
    }

    console.log('Creating premium upgrade session for:', email, 'Plan:', plan);

    // Create embedded checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        email: email,
        daycareId: daycareId.toString(),
        plan: plan,
      },
    });

    console.log('Checkout session created:', session.id);

    return NextResponse.json({
      success: true,
      clientSecret: session.client_secret,
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
