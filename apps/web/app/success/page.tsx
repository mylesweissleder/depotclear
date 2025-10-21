'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tag, Check, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Check the session status
    fetch(`/api/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'complete') {
          setStatus('success');
          setCustomerEmail(data.customer_email || '');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [sessionId]);

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {status === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-depot-orange mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Processing your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your purchase</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Thank You for Your Purchase!
              </h2>
              <p className="text-xl text-gray-600">
                Welcome to DepotClear - You now have lifetime access 🎉
              </p>
            </div>

            <div className="bg-gradient-to-r from-depot-orange to-orange-500 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Confirmation Email Sent</div>
                  <div className="text-sm text-orange-100">
                    {customerEmail || 'Check your email for details'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-orange-100">
                Your login credentials and receipt have been sent to your email address.
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg">What's Next?</h3>
              <div className="space-y-3">
                <Step
                  number="1"
                  title="Check Your Email"
                  description="We've sent your login credentials and a receipt"
                />
                <Step
                  number="2"
                  title="Start Finding Deals"
                  description="Search for penny deals at all 2,300 Home Depot stores"
                />
                <Step
                  number="3"
                  title="Set Up Alerts"
                  description="Get notified when new penny deals appear near you"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="flex-1 bg-depot-orange text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Start Finding Deals →
              </Link>
              <a
                href="mailto:support@depotclear.com"
                className="flex-1 bg-gray-100 text-gray-700 text-center px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Contact Support
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold mb-4">Your Purchase Details:</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">DepotClear Lifetime Access</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">$20.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customerEmail}</span>
                </div>
                {sessionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-xs">{sessionId.slice(0, 20)}...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. This might be a temporary issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="bg-depot-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Try Again
              </Link>
              <a
                href="mailto:support@depotclear.com"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-depot-orange text-white rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-depot-orange"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
