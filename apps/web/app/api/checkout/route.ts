import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/checkout
 * Creates a Stripe Checkout session for one-time payment
 * Using embedded checkout (like the sample code)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Create embedded checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID || 'price_1QTnbME4VhgqqnmRDrICL55m', // Replace with your actual Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        email: email,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: session.client_secret,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
