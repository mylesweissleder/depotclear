'use client';

import { useState } from 'react';
import { Tag, Lock, Check } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // TODO: Integrate with Stripe Checkout
    // For now, simulate processing
    setTimeout(() => {
      alert('Stripe integration coming soon! Email: ' + email);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Tag className="w-8 h-8 text-depot-orange" />
            <h1 className="text-2xl font-bold text-depot-dark">DepotClear</h1>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-depot-orange/10 p-3 rounded-lg">
                  <Tag className="w-8 h-8 text-depot-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">DepotClear Lifetime Access</h3>
                  <p className="text-sm text-gray-600">One-time payment • No subscriptions</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-depot-orange">$29</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <FeatureItem text="Unlimited clearance searches" />
                <FeatureItem text="Nationwide store availability" />
                <FeatureItem text="Real-time price tracking" />
                <FeatureItem text="AI-powered insights" />
                <FeatureItem text="Lifetime updates" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="w-5 h-5" />
                <span className="font-semibold">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
            <form onSubmit={handleCheckout} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-depot-orange focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive your login credentials here
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Details
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Stripe Checkout Integration</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Secure payment form will appear here
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-depot-orange text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? 'Processing...' : 'Pay $29 - Get Lifetime Access'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <div className="mt-6 text-center">
              <Link href="/search" className="text-depot-orange hover:underline text-sm">
                ← Back to demo
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <TrustBadge
              icon="💳"
              title="Secure Payments"
              description="Stripe-encrypted"
            />
            <TrustBadge
              icon="🔒"
              title="Privacy Protected"
              description="Your data is safe"
            />
            <TrustBadge
              icon="✅"
              title="30-Day Guarantee"
              description="Full refund available"
            />
            <TrustBadge
              icon="♾️"
              title="Lifetime Access"
              description="Pay once, use forever"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}

function TrustBadge({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}
