import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

const REGIONS = {
  'San Francisco Bay Area': [
    { slug: 'san-francisco', name: 'San Francisco', state: 'CA', icon: '🌉', emoji: '🌁' },
    { slug: 'oakland', name: 'Oakland', state: 'CA', icon: '⚓', emoji: '🌳' },
    { slug: 'san-jose', name: 'San Jose', state: 'CA', icon: '☀️', emoji: '🏙️' },
    { slug: 'berkeley', name: 'Berkeley', state: 'CA', icon: '🎓', emoji: '📚' },
    { slug: 'palo-alto', name: 'Palo Alto', state: 'CA', icon: '🌲', emoji: '💻' },
    { slug: 'mountain-view', name: 'Mountain View', state: 'CA', icon: '⛰️', emoji: '🚀' },
    { slug: 'sunnyvale', name: 'Sunnyvale', state: 'CA', icon: '☀️', emoji: '🌻' },
    { slug: 'fremont', name: 'Fremont', state: 'CA', icon: '🏔️', emoji: '🌉' },
    { slug: 'hayward', name: 'Hayward', state: 'CA', icon: '🌊', emoji: '🏞️' },
    { slug: 'santa-clara', name: 'Santa Clara', state: 'CA', icon: '🏈', emoji: '🎢' },
  ],
  'Pacific Northwest': [
    { slug: 'seattle', name: 'Seattle', state: 'WA', icon: '🗼', emoji: '☕' },
  ],
  'Southern California': [
    { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', icon: '🌴', emoji: '🎬' },
    { slug: 'san-diego', name: 'San Diego', state: 'CA', icon: '🏖️', emoji: '⛵' },
  ],
};

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-3xl font-black text-gray-900">
            🐾 WoofSpots
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Browse Dog Daycares by City
          </h1>
          <p className="text-2xl mb-8">
            Find trusted dog care in your area
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Search className="w-6 h-6" />
            <span>Select your city below</span>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(REGIONS).map(([regionName, cities]) => (
          <div key={regionName} className="mb-12">
            <h2 className="text-3xl font-black mb-6 text-gray-900">
              {regionName}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105 border-2 border-transparent hover:border-orange-300 group"
                >
                  <div className="text-center mb-3">
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                      {city.icon}
                    </div>
                    <div className="text-2xl opacity-60">
                      {city.emoji}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-black text-xl mb-1">{city.name}</h3>
                    <p className="text-gray-600 text-sm">{city.state}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Add Your City CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl p-12 text-center text-white mt-16">
          <h2 className="text-4xl font-black mb-4">
            Don't see your city?
          </h2>
          <p className="text-xl mb-8">
            We're expanding to new areas every week. Add your business to help us grow!
          </p>
          <Link
            href="/claim"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Add Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}
