'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Check, Sparkles } from 'lucide-react';

const plans = {
  monthly: {
    name: 'Top Dog Monthly',
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
      'Top Dog badge',
    ],
  },
  annual: {
    name: 'Top Dog Annual',
    price: 990,
    interval: 'year',
    savings: 198,
    features: [
      'Everything in Monthly',
      'Save $198/year (2 months free)',
      'Priority support',
      'Early access to new features',
    ],
  },
};

export default function PricingPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (planType: 'monthly' | 'annual') => {
    // Get daycareId from URL if present
    const searchParams = new URLSearchParams(window.location.search);
    const daycareId = searchParams.get('id');

    if (!daycareId) {
      setError('Please select a listing first. Go to your listing page and click "Become a Top Dog".');
      return;
    }

    setLoading(planType);
    setError('');

    try {
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daycareId: parseInt(daycareId),
          plan: planType.toUpperCase(), // 'MONTHLY' or 'ANNUAL'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-gray-900">
              🐕 Woof Spots
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-orange-600 font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-orange-600 font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Limited Time Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-center text-white shadow-xl border-4 border-green-400">
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-black">
            <span className="text-3xl">⏰</span>
            Limited Time: Free listings available for first 100 businesses. Premium features coming soon!
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles className="inline-block w-4 h-4 mr-2" />
            TOP DOG PLANS
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Become a Top Dog 🐕
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Get featured at the top of search results, attract more customers, and grow your business with premium tools built for success.
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-2xl mx-auto rounded-2xl bg-red-50 border-2 border-red-200 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-200 hover:border-orange-300 transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2">Monthly</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-black">${plans.monthly.price}</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.monthly.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading === 'monthly'}
              className="w-full py-4 px-6 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading === 'monthly' ? 'Loading...' : 'Become a Top Dog'}
            </button>
          </div>

          {/* Annual Plan - Featured */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl shadow-2xl p-8 border-4 border-orange-400 relative transform md:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-black shadow-lg">
                BEST VALUE - SAVE $198
              </span>
            </div>

            <div className="mb-6 text-white">
              <h3 className="text-2xl font-black mb-2">Annual</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-black">${plans.annual.price}</span>
                <span className="ml-2">/year</span>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-xl line-through opacity-75">$1,188</span>
                <span className="ml-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Save ${plans.annual.savings}
                </span>
              </div>
              <p className="opacity-90">2 months free - our best deal!</p>
            </div>

            <ul className="space-y-4 mb-8 text-white">
              {plans.annual.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-6 h-6 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('annual')}
              disabled={loading === 'annual'}
              className="w-full py-4 px-6 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:bg-yellow-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              {loading === 'annual' ? 'Loading...' : 'Become a Top Dog - Save $198'}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-black text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">Unlimited Photos</h3>
              <p className="text-gray-600">
                Showcase your facility, staff, and happy pups with unlimited photo uploads
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Track views, clicks, and conversions. See what's working and optimize your listing
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Unlimited Promotions</h3>
              <p className="text-gray-600">
                Create special offers and promotions to attract new customers
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Priority Placement</h3>
              <p className="text-gray-600">
                Get featured at the top of search results and homepage listings
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-bold mb-2">Full Control</h3>
              <p className="text-gray-600">
                Edit your business info, hours, services, and description anytime
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Enhanced Visibility</h3>
              <p className="text-gray-600">
                Stand out with premium badges and highlighted listings
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time from your dashboard. Your premium features will remain active until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact us within 30 days for a full refund.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Can I switch plans?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. When switching from monthly to annual, we'll prorate the remaining time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Do I need to claim my business first?</h3>
              <p className="text-gray-600">
                Yes, you'll need to claim and verify your business listing before subscribing. Don't have a listing yet? <Link href="/claim" className="text-orange-600 font-semibold hover:underline">Claim your free listing here</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of dog care businesses getting discovered by pet parents every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:bg-yellow-50 transition-all shadow-lg"
              >
                Create Free Account
              </Link>
            )}
            <Link
              href="/claim"
              className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg"
            >
              Claim Your Business
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
