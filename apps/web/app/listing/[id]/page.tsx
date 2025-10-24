import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sql } from '@vercel/postgres';
import { MapPin, Star, Phone, Globe, ExternalLink, ArrowLeft } from 'lucide-react';

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  if (isNaN(id)) {
    notFound();
  }

  // Fetch daycare from database
  const result = await sql`
    SELECT *
    FROM dog_daycares
    WHERE id = ${id}
  `;

  if (result.rows.length === 0) {
    notFound();
  }

  const daycare = result.rows[0];

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
            <h1 className="text-4xl md:text-5xl font-black mb-4">{daycare.name}</h1>
            <div className="flex items-center gap-2 text-lg mb-4">
              <MapPin className="w-5 h-5" />
              <span>{daycare.city}</span>
            </div>
            {daycare.address && (
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

            {/* Contact Info */}
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

            {/* Attribution */}
            <div className="text-sm text-gray-500 italic mb-4 text-center">
              Rating and business information from Google Maps
            </div>

            {/* Primary CTA - Business Website */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
