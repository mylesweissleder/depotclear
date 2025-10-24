import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { stripe, SUBSCRIPTION_PLANS, PlanType } from '@/lib/stripe';
import { sql } from '@vercel/postgres';

/**
 * Create a Stripe checkout session for subscription
 * Requires authentication and approved claim
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
    const { daycareId, plan } = body;

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

    // Verify user owns this business
    const claimCheck = await sql`
      SELECT bc.id, d.name
      FROM business_claims bc
      JOIN dog_daycares d ON bc.daycare_id = d.id
      WHERE bc.daycare_id = ${daycareId}
        AND bc.user_id = ${auth.user!.id}
        AND bc.status = 'approved'
    `;

    if (claimCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to subscribe for this business' },
        { status: 403 }
      );
    }

    const daycare = claimCheck.rows[0];

    // Check if business already has an active subscription
    const existingSub = await sql`
      SELECT id
      FROM subscriptions
      WHERE daycare_id = ${daycareId}
        AND status = 'active'
    `;

    if (existingSub.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This business already has an active subscription' },
        { status: 400 }
      );
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as PlanType];

    // Create or retrieve Stripe customer
    let stripeCustomerId: string;

    const existingCustomer = await sql`
      SELECT stripe_customer_id
      FROM subscriptions
      WHERE daycare_id = ${daycareId}
        AND stripe_customer_id IS NOT NULL
      LIMIT 1
    `;

    if (existingCustomer.rows.length > 0 && existingCustomer.rows[0].stripe_customer_id) {
      stripeCustomerId = existingCustomer.rows[0].stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: auth.user!.email,
        name: auth.user!.name || undefined,
        metadata: {
          userId: auth.user!.id.toString(),
          daycareId: daycareId.toString(),
          daycareNa: daycare.name,
        },
      });
      stripeCustomerId = customer.id;
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/businesses/${daycareId}?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/businesses/${daycareId}?subscription=cancelled`,
      metadata: {
        userId: auth.user!.id.toString(),
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
