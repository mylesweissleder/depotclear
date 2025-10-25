import { notFound } from 'next/navigation';
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import { MapPin, Star, Phone, Globe, Search } from 'lucide-react';

// City slug to display name and icon mapping
const CITY_MAP: Record<string, { name: string; icon: string; emoji: string }> = {
  'san-francisco': { name: 'San Francisco', icon: '🌉', emoji: '🌁' },
  'oakland': { name: 'Oakland', icon: '⚓', emoji: '🌳' },
  'san-jose': { name: 'San Jose', icon: '☀️', emoji: '🏙️' },
  'berkeley': { name: 'Berkeley', icon: '🎓', emoji: '📚' },
  'palo-alto': { name: 'Palo Alto', icon: '🌲', emoji: '💻' },
  'mountain-view': { name: 'Mountain View', icon: '⛰️', emoji: '🚀' },
  'sunnyvale': { name: 'Sunnyvale', icon: '☀️', emoji: '🌻' },
  'fremont': { name: 'Fremont', icon: '🏔️', emoji: '🌉' },
  'hayward': { name: 'Hayward', icon: '🌊', emoji: '🏞️' },
  'santa-clara': { name: 'Santa Clara', icon: '🏈', emoji: '🎢' },
  'seattle': { name: 'Seattle', icon: '🗼', emoji: '☕' },
  'los-angeles': { name: 'Los Angeles', icon: '🌴', emoji: '🎬' },
  'san-diego': { name: 'San Diego', icon: '🏖️', emoji: '⛵' },
};

interface DaycareResult {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  zip: string;
  phone: string;
  website: string;
  rating: number;
  review_count: number;
  featured: boolean;
  premium: boolean;
}

async function getCityDaycares(cityName: string) {
  try {
    const { rows } = await sql<DaycareResult>`
      SELECT
        id, name, city, state, address, zip, phone, website,
        rating, review_count, featured, premium
      FROM dog_daycares
      WHERE LOWER(city) = LOWER(${cityName})
      ORDER BY premium DESC, featured DESC, rating DESC
      LIMIT 100
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching daycares:', error);
    return [];
  }
}

async function getCityCount(cityName: string) {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) as count
      FROM dog_daycares
      WHERE LOWER(city) = LOWER(${cityName})
    `;
    return rows[0]?.count || 0;
  } catch (error) {
    return 0;
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;

  // Convert slug to city data
  const cityData = CITY_MAP[citySlug];

  if (!cityData) {
    notFound();
  }

  const { name: cityName, icon: cityIcon, emoji: cityEmoji } = cityData;
  const daycares = await getCityDaycares(cityName);
  const totalCount = await getCityCount(cityName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-black text-gray-900">
              🐾 WoofSpots
            </Link>
            <Link
              href="/cities"
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition"
            >
              Browse Cities
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-7xl">{cityIcon}</div>
            <div className="text-4xl opacity-70">{cityEmoji}</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Dog Daycares in {cityName}
          </h1>
          <p className="text-2xl mb-8">
            {totalCount} trusted facilities for your furry friend
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <MapPin className="w-6 h-6" />
            <span>{cityName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {daycares.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-4">No daycares found</h2>
            <p className="text-gray-600 mb-6">
              We're still building our directory for {cityName}. Check back soon!
            </p>
            <Link
              href="/claim"
              className="inline-block bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition"
            >
              Add Your Business
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Listings */}
            {daycares.some(d => d.featured) && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  Featured Listings
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daycares.filter(d => d.featured).map((daycare) => (
                    <Link
                      key={daycare.id}
                      href={`/listing/${daycare.id}`}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-6 border-4 border-orange-300 hover:shadow-2xl transition transform hover:scale-105"
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-black inline-block mb-3">
                        ⭐ FEATURED
                      </div>
                      <h3 className="text-2xl font-black mb-2">{daycare.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{daycare.city}, {daycare.state}</span>
                      </div>
                      {daycare.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{daycare.rating}</span>
                          <span className="text-gray-500 text-sm">({daycare.review_count} reviews)</span>
                        </div>
                      )}
                      <div className="text-orange-600 font-bold">View Details →</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Listings */}
            <div>
              <h2 className="text-3xl font-black mb-6">All Daycares in {cityName}</h2>
              <div className="space-y-4">
                {daycares.filter(d => !d.featured).map((daycare) => (
                  <Link
                    key={daycare.id}
                    href={`/listing/${daycare.id}`}
                    className="block bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-2">{daycare.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{daycare.address}</span>
                        </div>
                        {daycare.rating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{daycare.rating}</span>
                            <span className="text-gray-500">({daycare.review_count} reviews)</span>
                          </div>
                        )}
                        <div className="flex gap-4 text-sm">
                          {daycare.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{daycare.phone}</span>
                            </div>
                          )}
                          {daycare.website && !daycare.website.includes('google.com/maps') && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Globe className="w-4 h-4" />
                              <span>Website</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-orange-600 font-bold ml-4">
                        View Details →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-4">Own a Dog Daycare in {cityName}?</h2>
          <p className="text-xl mb-8">
            Claim your free listing and get discovered by thousands of local pet parents!
          </p>
          <Link
            href={`/claim?city=${encodeURIComponent(cityName)}`}
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Claim Your Free Listing
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all known cities
export async function generateStaticParams() {
  return Object.keys(CITY_MAP).map((city) => ({
    city,
  }));
}
