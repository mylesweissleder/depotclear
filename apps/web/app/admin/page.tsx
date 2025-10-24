'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { CheckCircle, XCircle, Clock, DollarSign, Users, Building2, TrendingUp } from 'lucide-react';

interface Claim {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  website: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalBusinesses: number;
  totalClaims: number;
  pendingClaims: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

export default function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'users' | 'subscriptions'>('overview');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalClaims: 0,
    pendingClaims: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingClaim, setProcessingClaim] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchAdminData();
    }
  }, [user, token]);

  const fetchAdminData = async () => {
    try {
      // Fetch claims
      const claimsResponse = await fetch('/api/admin/claims', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json();
        setClaims(claimsData.data.claims);
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data.stats);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAction = async (claimId: number, action: 'approve' | 'reject') => {
    setProcessingClaim(claimId);
    setError('');

    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process claim');
      }

      // Refresh claims
      await fetchAdminData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingClaim(null);
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
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-black text-gray-900">
                🐕 Woof Spots
              </Link>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                ADMIN
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                User Dashboard
              </Link>
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
            <p className="text-sm text-gray-600">Total Businesses</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingClaims}</p>
            <p className="text-sm text-gray-600">Pending Claims</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClaims}</p>
            <p className="text-sm text-gray-600">Total Claims</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            <p className="text-sm text-gray-600">Active Subs</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`${
                activeTab === 'claims'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Claims ({stats.pendingClaims})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`${
                activeTab === 'subscriptions'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Subscriptions
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-600">Coming soon - Recent user activity, claims, and subscriptions</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Chart</h3>
                  <p className="text-gray-600">Coming soon - Monthly revenue trends</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                  <p className="text-gray-600">Coming soon - User and business growth metrics</p>
                </div>
              </div>
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Business Claims</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {claims.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-600">
                    No claims to review
                  </div>
                ) : (
                  claims.map((claim) => (
                    <div key={claim.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {claim.businessName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                claim.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : claim.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {claim.status}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Owner: {claim.ownerName}</p>
                              <p className="text-sm text-gray-600">Email: {claim.email}</p>
                              <p className="text-sm text-gray-600">Phone: {claim.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">City: {claim.city}</p>
                              {claim.website && (
                                <p className="text-sm text-gray-600">
                                  Website:{' '}
                                  <a
                                    href={claim.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-600 hover:underline"
                                  >
                                    {claim.website}
                                  </a>
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Submitted: {new Date(claim.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {claim.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700">{claim.message}</p>
                            </div>
                          )}

                          {claim.status === 'pending' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleClaimAction(claim.id, 'approve')}
                                disabled={processingClaim === claim.id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleClaimAction(claim.id, 'reject')}
                                disabled={processingClaim === claim.id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600">Coming soon - User list with search, filtering, and management options</p>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h2>
              <p className="text-gray-600">Coming soon - Active subscriptions, cancellations, and revenue tracking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
