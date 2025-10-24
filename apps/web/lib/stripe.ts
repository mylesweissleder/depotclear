import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: 'Premium Monthly',
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_1SLX6VCdC4FIQjaIo5aeRF5U',
    price: 99,
    interval: 'month',
    features: [
      'Edit business information',
      'Upload unlimited photos',
      'Advanced analytics',
      'Unlimited promotions',
      'Priority listing placement',
      'Enhanced visibility',
    ],
  },
  ANNUAL: {
    name: 'Premium Annual',
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || 'price_1SLX76CdC4FIQjaISizP0qg9',
    price: 990,
    interval: 'year',
    features: [
      'Everything in Monthly',
      'Save $198/year (2 months free)',
      'Priority support',
      'Early access to new features',
    ],
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;
