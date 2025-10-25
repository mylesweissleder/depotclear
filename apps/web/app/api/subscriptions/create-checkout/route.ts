import { NextRequest, NextResponse } from 'next/server';
import { stripe, SUBSCRIPTION_PLANS, PlanType } from '@/lib/stripe';
import { sql } from '@vercel/postgres';

/**
 * Create a Stripe checkout session for Top Dog subscription
 * Simplified - allows any claimed listing to upgrade
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { daycareId, plan, email } = body;

    // Validation
    if (!daycareId || !plan) {
      return NextResponse.json(
        { success: false, error: 'Daycare ID and plan are required' },
        { status: 400 }
      );
    }

    if (!SUBSCRIPTION_PLANS[plan as PlanType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Verify listing exists and get details
    const daycareResult = await sql`
      SELECT id, name, tier, claimed_by_email, stripe_subscription_id
      FROM dog_daycares
      WHERE id = ${daycareId}
    `;

    if (daycareResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    const daycare = daycareResult.rows[0];

    // Verify listing is claimed (unclaimed listings can't upgrade directly)
    if (daycare.tier === 'unclaimed') {
      return NextResponse.json(
        { success: false, error: 'Please claim this listing first before upgrading to Top Dog' },
        { status: 400 }
      );
    }

    // Check if already Top Dog
    if (daycare.tier === 'top_dog' && daycare.stripe_subscription_id) {
      return NextResponse.json(
        { success: false, error: 'This listing already has an active Top Dog subscription' },
        { status: 400 }
      );
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as PlanType];

    // Create or retrieve Stripe customer
    let stripeCustomerId: string;

    if (daycare.stripe_customer_id) {
      // Use existing customer ID from daycare record
      stripeCustomerId = daycare.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customerEmail = email || daycare.claimed_by_email || `listing-${daycareId}@woofspots.com`;

      const customer = await stripe.customers.create({
        email: customerEmail,
        name: daycare.name,
        metadata: {
          daycareId: daycareId.toString(),
          daycareNa: daycare.name,
        },
      });
      stripeCustomerId = customer.id;

      // Save customer ID to daycare record
      await sql`
        UPDATE dog_daycares
        SET stripe_customer_id = ${stripeCustomerId}
        WHERE id = ${daycareId}
      `;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://woofspots.com'}/listing/${daycareId}?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://woofspots.com'}/listing/${daycareId}?upgrade=cancelled`,
      metadata: {
        daycareId: daycareId.toString(),
        plan: plan,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
