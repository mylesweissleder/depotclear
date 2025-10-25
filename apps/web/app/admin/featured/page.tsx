'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ArrowUp, ArrowDown, Check, X } from 'lucide-react';

interface Daycare {
  id: number;
  name: string;
  city: string;
  state: string;
  rating: number;
  featured: boolean;
  featured_order: number | null;
  featured_until: string | null;
}

export default function AdminFeaturedPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDaycares = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/featured', {
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
      setDaycares(data.daycares || []);
      setAuthenticated(true);
    } catch (error) {
      setMessage('Failed to load daycares');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDaycares();
  };

  const toggleFeatured = async (id: number, currentlyFeatured: boolean) => {
    const currentFeatured = daycares.filter(d => d.featured);

    if (!currentlyFeatured && currentFeatured.length >= 10) {
      setMessage('Maximum 10 featured listings allowed');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          id,
          featured: !currentlyFeatured,
          featured_order: !currentlyFeatured ? currentFeatured.length + 1 : null
        })
      });

      if (res.ok) {
        await fetchDaycares();
        setMessage('Updated successfully');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      setMessage('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (daycare: Daycare) => {
    const featured = daycares.filter(d => d.featured).sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
    const currentIndex = featured.findIndex(d => d.id === daycare.id);

    if (currentIndex <= 0) return;

    const updates = [
      { id: daycare.id, featured_order: currentIndex },
      { id: featured[currentIndex - 1].id, featured_order: currentIndex + 1 }
    ];

    setSaving(true);
    try {
      await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ updates })
      });
      await fetchDaycares();
    } catch (error) {
      setMessage('Failed to reorder');
    } finally {
      setSaving(false);
    }
  };

  const moveDown = async (daycare: Daycare) => {
    const featured = daycares.filter(d => d.featured).sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
    const currentIndex = featured.findIndex(d => d.id === daycare.id);

    if (currentIndex >= featured.length - 1) return;

    const updates = [
      { id: daycare.id, featured_order: currentIndex + 2 },
      { id: featured[currentIndex + 1].id, featured_order: currentIndex + 1 }
    ];

    setSaving(true);
    try {
      await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ updates })
      });
      await fetchDaycares();
    } catch (error) {
      setMessage('Failed to reorder');
    } finally {
      setSaving(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-black mb-6">Admin Login</h1>
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

  const featuredDaycares = daycares.filter(d => d.featured).sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
  const otherDaycares = daycares.filter(d => !d.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-black mb-8">Manage Featured Listings</h1>

        {message && (
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold">{message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Featured Listings (Top 10) */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Featured (Top 10) - {featuredDaycares.length}/10
            </h2>
            <div className="space-y-2">
              {featuredDaycares.map((daycare, idx) => (
                <div key={daycare.id} className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-orange-200">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{daycare.name}</h3>
                    <p className="text-sm text-gray-600">{daycare.city}, {daycare.state} • ⭐ {daycare.rating}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveUp(daycare)}
                      disabled={idx === 0 || saving}
                      className="p-2 hover:bg-white rounded-lg disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(daycare)}
                      disabled={idx === featuredDaycares.length - 1 || saving}
                      className="p-2 hover:bg-white rounded-lg disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeatured(daycare.id, true)}
                      disabled={saving}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {featuredDaycares.length === 0 && (
                <p className="text-gray-500 text-center py-8">No featured listings yet</p>
              )}
            </div>
          </div>

          {/* Available Daycares */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-black mb-4">Available Daycares</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {otherDaycares.map((daycare) => (
                <div key={daycare.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-bold">{daycare.name}</h3>
                    <p className="text-sm text-gray-600">{daycare.city}, {daycare.state} • ⭐ {daycare.rating}</p>
                  </div>
                  <button
                    onClick={() => toggleFeatured(daycare.id, false)}
                    disabled={saving || featuredDaycares.length >= 10}
                    className="p-2 hover:bg-green-100 rounded-lg text-green-600 disabled:opacity-30"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
