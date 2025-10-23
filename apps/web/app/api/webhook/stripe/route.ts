import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@vercel/postgres';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * POST /api/webhook/stripe
 * Stripe webhook handler for premium subscription events
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

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { email, daycareId, plan } = session.metadata || {};

        if (!email || !daycareId) {
          console.error('Missing metadata:', session.metadata);
          break;
        }

        console.log(`Premium purchase complete: ${email}, daycare ${daycareId}, plan ${plan}`);

        // Determine expiration date
        let expiresAt: Date;
        if (plan === 'annual') {
          // Annual: expires in 1 year
          expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          // Monthly: expires in 1 month (will be renewed by subscription)
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        // Update daycare to premium
        await sql`
          UPDATE dog_daycares
          SET is_premium = true,
              premium_expires_at = ${expiresAt.toISOString()},
              premium_plan = ${plan || 'monthly'},
              stripe_customer_id = ${session.customer as string},
              stripe_subscription_id = ${session.subscription as string || null},
              business_email = ${email},
              updated_at = NOW()
          WHERE id = ${parseInt(daycareId)}
        `;

        console.log(`✅ Daycare ${daycareId} upgraded to premium (${plan})`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;

        // Update expiration date when subscription renews
        const expiresAt = new Date(subscription.current_period_end * 1000);

        await sql`
          UPDATE dog_daycares
          SET premium_expires_at = ${expiresAt.toISOString()},
              is_premium = ${subscription.status === 'active'},
              updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log(`✅ Subscription ${subscription.id} updated, expires ${expiresAt}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Subscription cancelled - downgrade to free
        await sql`
          UPDATE dog_daycares
          SET is_premium = false,
              premium_expires_at = NOW(),
              stripe_subscription_id = NULL,
              updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log(`❌ Subscription ${subscription.id} cancelled - downgraded to free`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;

        // Monthly renewal successful - extend premium
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
          const expiresAt = new Date(subscription.current_period_end * 1000);

          await sql`
            UPDATE dog_daycares
            SET premium_expires_at = ${expiresAt.toISOString()},
                is_premium = true,
                updated_at = NOW()
            WHERE stripe_subscription_id = ${subscription.id}
          `;

          console.log(`💰 Invoice paid for subscription ${subscription.id}, extended to ${expiresAt}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        // Payment failed - mark as at risk but don't immediately downgrade
        // Stripe will retry, we'll only downgrade on subscription.deleted
        console.warn(`⚠️ Payment failed for subscription ${invoice.subscription}`);

        // Could send an email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
