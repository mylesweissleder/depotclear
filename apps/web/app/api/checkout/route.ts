import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout session for one-time payment
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

    // TODO: Integrate with Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   customer_email: email,
    //   line_items: [
    //     {
    //       price: process.env.STRIPE_PRICE_ID, // $29 one-time price ID
    //       quantity: 1,
    //     },
    //   ],
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    //   metadata: {
    //     email: email,
    //   },
    // });
    //
    // return NextResponse.json({
    //   success: true,
    //   checkoutUrl: session.url,
    // });

    // Mock response for now
    return NextResponse.json({
      success: true,
      checkoutUrl: '/success?demo=true',
      message: 'Stripe integration pending',
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
