import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * POST /api/webhook
 * Stripe webhook handler for payment events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const email = session.metadata?.email;

        console.log('Payment completed for:', email);

        // TODO: Grant lifetime access in database
        // await sql`
        //   INSERT INTO users (email, stripe_customer_id, stripe_payment_id, has_lifetime_access, created_at)
        //   VALUES (${email}, ${session.customer}, ${session.payment_intent}, true, NOW())
        //   ON CONFLICT (email)
        //   DO UPDATE SET
        //     has_lifetime_access = true,
        //     stripe_payment_id = ${session.payment_intent}
        // `;

        // TODO: Send welcome email
        break;

      case 'charge.refunded':
        const charge = event.data.object;

        // Check if refund is within 7-day window
        const chargeCreated = new Date(charge.created * 1000);
        const now = new Date();
        const daysSinceCharge = (now.getTime() - chargeCreated.getTime()) / (1000 * 60 * 60 * 24);

        console.log(`Refund requested ${daysSinceCharge.toFixed(1)} days after purchase`);

        if (daysSinceCharge > 7) {
          console.warn('⚠️ Refund outside 7-day window - manual review required');
          // TODO: Send alert to admin
          // Still revoke access, but flag for review
        }

        // Revoke access
        // await sql`UPDATE users SET has_lifetime_access = false WHERE stripe_payment_id = ${charge.payment_intent}`;

        break;
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
