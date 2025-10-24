'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface Business {
  claimId: number;
  verifiedAt: string;
  business: {
    id: number;
    name: string;
    city: string;
    state: string;
    rating: number;
    reviewCount: number;
  };
  subscription: {
    id: number;
    plan: string;
    status: string;
    endsAt: string;
  } | null;
}

export default function DashboardPage() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchBusinesses();
    }
  }, [user, token]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/dashboard/businesses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.data.businesses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No businesses claimed yet
            </h2>
            <p className="text-gray-600 mb-6">
              Claim your business to manage your listing, add photos, and track analytics.
            </p>
            <Link
              href="/claim"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Claim Your Business
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Businesses
              </h2>
              <Link
                href="/claim"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Claim Another Business
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((biz) => (
                <div
                  key={biz.claimId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {biz.business.name}
                    </h3>
                    {biz.subscription ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {biz.subscription.plan}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Free
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {biz.business.city}, {biz.business.state}
                  </p>

                  <div className="flex items-center mb-4">
                    <span className="text-sm font-medium text-gray-900">
                      {biz.business.rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      ({biz.business.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/business/${biz.business.id}`}
                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Manage Listing
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
