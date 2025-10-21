import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
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

    // Debug: Check if keys are set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'Stripe configuration error - missing secret key' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error('STRIPE_PRICE_ID is not set');
      return NextResponse.json(
        { success: false, error: 'Stripe configuration error - missing price ID' },
        { status: 500 }
      );
    }

    console.log('Creating checkout session for:', email);
    console.log('Using price ID:', process.env.STRIPE_PRICE_ID);

    // Create embedded checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        email: email,
      },
    });

    console.log('Checkout session created successfully:', session.id);

    return NextResponse.json({
      success: true,
      clientSecret: session.client_secret,
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
