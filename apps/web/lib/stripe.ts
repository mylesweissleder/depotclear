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
    name: 'Top Dog Monthly',
    priceId: process.env.STRIPE_TOP_DOG_MONTHLY_PRICE_ID || process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_1SLX6VCdC4FIQjaIo5aeRF5U',
    price: 99,
    interval: 'month',
    features: [
      'Priority placement in search results',
      'Photo gallery (up to 20 photos)',
      'Special offers & promotions',
      'Enhanced analytics dashboard',
      'Contact form integration',
      'Business hours editor',
      'Custom business description',
      'Premium badge',
    ],
  },
  ANNUAL: {
    name: 'Top Dog Annual',
    priceId: process.env.STRIPE_TOP_DOG_ANNUAL_PRICE_ID || process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || 'price_1SLX76CdC4FIQjaISizP0qg9',
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
