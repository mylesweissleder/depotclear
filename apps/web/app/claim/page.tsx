'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Globe, Send } from 'lucide-react';

interface Listing {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  claimed: boolean;
  claimPending: boolean;
}

export default function ClaimListingPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [results, setResults] = useState<Listing[]>([]);
  const [searching, setSearching] = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Pre-populate form from URL params
  useEffect(() => {
    const business = searchParams.get('business');
    const city = searchParams.get('city');
    const listingId = searchParams.get('id');

    if (business || city) {
      setFormData(prev => ({
        ...prev,
        businessName: business || prev.businessName,
        city: city || prev.city,
        message: listingId
          ? `I would like to claim listing #${listingId} for ${business}`
          : prev.message,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          city: '',
          website: '',
          message: '',
        });
      } else {
        setError(data.error || 'Failed to submit claim request');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
            🎁 LIMITED TIME OFFER
          </div>
          <h1 className="text-5xl font-black mb-4">Claim Your Free Listing</h1>
          <p className="text-xl text-gray-600">
            Get your dog care business in front of thousands of pet parents - absolutely free during our beta!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-black mb-6">What You'll Get (FREE!):</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📸</span>
              <div>
                <h3 className="font-bold">Full Profile</h3>
                <p className="text-sm text-gray-600">Photos, description, amenities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h3 className="font-bold">Customer Reviews</h3>
                <p className="text-sm text-gray-600">Build trust with ratings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">📞</span>
              <div>
                <h3 className="font-bold">Direct Contact</h3>
                <p className="text-sm text-gray-600">Phone, website, location</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="font-bold">Priority Placement</h3>
                <p className="text-sm text-gray-600">Featured on homepage</p>
              </div>
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-black mb-2">Request Received!</h3>
              <p className="text-gray-700">
                We'll review your submission and get back to you within 24-48 hours with next steps.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-bold mb-2">Business Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                    placeholder="e.g. Bark Avenue Dog Daycare"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                      placeholder="you@business.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                      placeholder="San Francisco"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-2">Additional Information (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                  rows={4}
                  placeholder="Tell us about your services, special features, or any questions..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Claim My Free Listing
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-700">
            <strong>⏰ Limited Time:</strong> Free listings available for first 100 businesses.
            Premium features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
