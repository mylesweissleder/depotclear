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

    // TODO: Verify webhook signature and handle events
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    //
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );
    //
    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     const session = event.data.object;
    //     const email = session.metadata.email;
    //
    //     // Grant lifetime access
    //     await sql`
    //       INSERT INTO users (email, stripe_customer_id, stripe_payment_id, has_lifetime_access)
    //       VALUES (${email}, ${session.customer}, ${session.payment_intent}, true)
    //       ON CONFLICT (email)
    //       DO UPDATE SET
    //         has_lifetime_access = true,
    //         stripe_payment_id = ${session.payment_intent}
    //     `;
    //
    //     // Send welcome email with login credentials
    //     // await sendWelcomeEmail(email);
    //     break;
    //
    //   case 'charge.refunded':
    //     // Handle refund - revoke access
    //     const charge = event.data.object;
    //     // await revokeAccess(charge.customer);
    //     break;
    // }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
