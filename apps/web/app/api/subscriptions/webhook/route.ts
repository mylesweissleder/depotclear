import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sql } from '@vercel/postgres';
import Stripe from 'stripe';

/**
 * Stripe webhook handler
 * Handles subscription lifecycle events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get subscription details
        if (session.subscription && session.metadata) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as Stripe.Subscription;

          // Create subscription record
          await sql`
            INSERT INTO subscriptions (
              user_id,
              daycare_id,
              plan,
              status,
              stripe_customer_id,
              stripe_subscription_id,
              stripe_price_id,
              current_period_start,
              current_period_end,
              created_at,
              updated_at
            )
            VALUES (
              ${parseInt(session.metadata.userId)},
              ${parseInt(session.metadata.daycareId)},
              ${session.metadata.plan},
              'active',
              ${session.customer as string},
              ${subscription.id},
              ${subscription.items.data[0].price.id},
              to_timestamp(${subscription.currentPeriodStart}),
              to_timestamp(${subscription.currentPeriodEnd}),
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
            )
          `;

          console.log('Subscription created:', subscription.id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Update subscription status
        await sql`
          UPDATE subscriptions
          SET status = ${subscription.status},
              current_period_start = to_timestamp(${subscription.current_period_start}),
              current_period_end = to_timestamp(${subscription.current_period_end}),
              updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Mark subscription as cancelled
        await sql`
          UPDATE subscriptions
          SET status = 'cancelled',
              updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ${subscription.id}
        `;

        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          // Update subscription with latest payment info
          await sql`
            UPDATE subscriptions
            SET status = 'active',
                updated_at = CURRENT_TIMESTAMP
            WHERE stripe_subscription_id = ${invoice.subscription as string}
          `;

          console.log('Payment succeeded for subscription:', invoice.subscription);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          // Mark subscription as past_due
          await sql`
            UPDATE subscriptions
            SET status = 'past_due',
                updated_at = CURRENT_TIMESTAMP
            WHERE stripe_subscription_id = ${invoice.subscription as string}
          `;

          console.log('Payment failed for subscription:', invoice.subscription);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
