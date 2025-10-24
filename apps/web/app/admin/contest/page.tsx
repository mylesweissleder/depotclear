'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface Submission {
  id: number;
  pup_name: string;
  owner_name: string;
  owner_email: string;
  daycare_name: string | null;
  city: string | null;
  state: string | null;
  photo_url: string;
  caption: string;
  category: string;
  is_ai_generated: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  vote_count?: number;
}

export default function AdminContestPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contest', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (res.status === 401) {
        setAuthenticated(false);
        setMessage('Invalid password');
        return;
      }

      const data = await res.json();
      setSubmissions(data.submissions || []);
      setAuthenticated(true);
    } catch (error) {
      setMessage('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubmissions();
  };

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/contest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        await fetchSubmissions();
        setMessage(`Submission ${status} successfully`);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      setMessage('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/woofspotslogo.png"
              alt="Woof Spots"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-black mb-2 text-center">Contest Admin</h1>
          <p className="text-center text-gray-600 mb-6">🐾 Woof Spots</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl mb-4 focus:border-orange-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-red-600 text-center">{message}</p>
          )}
        </div>
      </div>
    );
  }

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter);

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  const categoryNames: Record<string, string> = {
    'goofiest-face': 'Goofiest Face',
    'best-smile': 'Best Smile',
    'cutest-pup': 'Cutest Pup',
    'most-photogenic': 'Most Photogenic'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-orange-500 font-semibold">
              <Image
                src="/woofspotslogo.png"
                alt="Woof Spots"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-orange-500">Woof Spots</span>
                <span className="text-xs text-orange-600 font-semibold">🐾 Contest Admin</span>
              </div>
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/featured" className="text-gray-700 hover:text-orange-500 font-semibold">
                Featured
              </Link>
              <Link href="/admin/social" className="text-gray-700 hover:text-orange-500 font-semibold">
                Social
              </Link>
              <Link href="/admin/newsletter" className="text-gray-700 hover:text-orange-500 font-semibold">
                Newsletter
              </Link>
              <Link href="/admin/contest" className="text-orange-500 font-bold border-b-2 border-orange-500">
                Contest
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-black mb-8">Contest Moderation</h1>

        {message && (
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold">{message}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-green-100'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-red-100'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              filter === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-100'
            }`}
          >
            All ({submissions.length})
          </button>
        </div>

        {/* Submissions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Photo */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={submission.photo_url}
                  alt={submission.pup_name}
                  className="w-full h-full object-cover"
                />
                {submission.is_ai_generated && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    AI Detected
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {categoryNames[submission.category]}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-2xl font-black mb-2">{submission.pup_name}</h3>
                {submission.caption && (
                  <p className="text-gray-600 mb-3 italic">"{submission.caption}"</p>
                )}

                <div className="space-y-1 text-sm text-gray-700 mb-4">
                  <p><strong>Owner:</strong> {submission.owner_name}</p>
                  <p><strong>Email:</strong> {submission.owner_email}</p>
                  {submission.daycare_name && (
                    <p><strong>Daycare:</strong> {submission.daycare_name}</p>
                  )}
                  {submission.city && submission.state && (
                    <p><strong>Location:</strong> {submission.city}, {submission.state}</p>
                  )}
                  <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
                  {submission.vote_count !== undefined && (
                    <p><strong>Votes:</strong> {submission.vote_count}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {submission.status === 'pending' && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                      Pending Review
                    </span>
                  )}
                  {submission.status === 'approved' && (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Approved
                    </span>
                  )}
                  {submission.status === 'rejected' && (
                    <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                      ✗ Rejected
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {submission.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(submission.id, 'approved')}
                      disabled={saving}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(submission.id, 'rejected')}
                      disabled={saving}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
                {submission.status === 'approved' && (
                  <button
                    onClick={() => updateStatus(submission.id, 'rejected')}
                    disabled={saving}
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                {submission.status === 'rejected' && (
                  <button
                    onClick={() => updateStatus(submission.id, 'approved')}
                    disabled={saving}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filter === 'pending' && 'No pending submissions'}
              {filter === 'approved' && 'No approved submissions yet'}
              {filter === 'rejected' && 'No rejected submissions'}
              {filter === 'all' && 'No submissions yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
