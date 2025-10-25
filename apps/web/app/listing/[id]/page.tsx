import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sql } from '@vercel/postgres';
import { MapPin, Star, Phone, Globe, ExternalLink, ArrowLeft, Award } from 'lucide-react';

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  if (isNaN(id)) {
    notFound();
  }

  // Fetch daycare from database including tier info
  const result = await sql`
    SELECT *
    FROM dog_daycares
    WHERE id = ${id}
  `;

  if (result.rows.length === 0) {
    notFound();
  }

  const daycare = result.rows[0];
  const tier = daycare.tier || 'unclaimed'; // Default to unclaimed if not set

  // Check if website is actually a Google Maps URL (data quality issue)
  const isWebsiteGoogleMaps = daycare.website && daycare.website.includes('google.com/maps');
  const actualWebsite = isWebsiteGoogleMaps ? null : daycare.website;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-8 text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black">{daycare.name}</h1>
              {tier === 'premium' && (
                <div className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black text-sm shadow-lg">
                  <Award className="w-5 h-5" />
                  PREMIUM
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-lg mb-4">
              <MapPin className="w-5 h-5" />
              <span>{daycare.city}</span>
            </div>
            {/* Show full address only for claimed and premium tiers */}
            {tier !== 'unclaimed' && daycare.address && (
              <p className="text-white/90">{daycare.address}</p>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8">
            {daycare.rating && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-4xl">{parseFloat(daycare.rating).toFixed(1)}</span>
                </div>
                {daycare.review_count && (
                  <span className="text-gray-500 text-lg">({daycare.review_count} reviews)</span>
                )}
              </div>
            )}

            {/* Contact Info - Only show for claimed and premium tiers */}
            {tier !== 'unclaimed' && (
              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-black mb-4">Contact Information</h2>
                {daycare.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <a href={`tel:${daycare.phone}`} className="text-lg hover:text-orange-500">
                      {daycare.phone}
                    </a>
                  </div>
                )}
                {actualWebsite && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <a
                      href={actualWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg hover:text-orange-500"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Attribution */}
            <div className="text-sm text-gray-500 italic mb-4 text-center">
              Rating and business information from Google Maps
            </div>

            {/* Primary CTA - Only show for claimed/premium tiers */}
            {tier !== 'unclaimed' && (
              <>
                {actualWebsite ? (
                  <div className="space-y-3">
                    <a
                      href={actualWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                    >
                      Visit Official Website
                      <ExternalLink className="inline-block w-5 h-5 ml-2" />
                    </a>
                    {daycare.google_maps_url && (
                      <a
                        href={daycare.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white border-2 border-orange-500 text-orange-500 text-center py-3 rounded-2xl font-bold text-base hover:bg-orange-50 transition"
                      >
                        View Reviews & Directions on Google Maps
                        <ExternalLink className="inline-block w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                ) : daycare.google_maps_url ? (
                  <a
                    href={daycare.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                  >
                    View Full Details & Reviews on Google Maps
                    <ExternalLink className="inline-block w-5 h-5 ml-2" />
                  </a>
                ) : null}
              </>
            )}

            {/* Tier-Based CTAs */}
            {tier === 'unclaimed' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-black text-xl text-gray-900 mb-2">
                        Is this your business?
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Claim your free listing to add your website, phone number, and full address. Attract more customers!
                      </p>
                      <Link
                        href={`/claim?business=${encodeURIComponent(daycare.name)}&city=${encodeURIComponent(daycare.city)}&id=${id}`}
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                      >
                        Claim This Listing - FREE
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tier === 'claimed' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <Award className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-black text-xl text-gray-900 mb-2">
                        Get 5x More Leads with Premium
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Upgrade to Premium to appear first in search results, add photos, special offers, and get detailed analytics.
                      </p>
                      <ul className="text-gray-700 text-sm mb-4 space-y-1">
                        <li>✅ Priority placement in search</li>
                        <li>✅ Photo gallery & videos</li>
                        <li>✅ Special offers & promotions</li>
                        <li>✅ Enhanced analytics dashboard</li>
                      </ul>
                      <Link
                        href={`/pricing?id=${id}`}
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105"
                      >
                        Upgrade to Premium - $99/mo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
