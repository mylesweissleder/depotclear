import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import { sql } from '@vercel/postgres';

// Helper to convert city name to slug
function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Helper to get emoji for city (some fun defaults)
function getCityEmoji(city: string): string {
  const emojiMap: Record<string, string> = {
    'San Francisco': '🌉',
    'Oakland': '⚓',
    'San Jose': '🏙️',
    'Berkeley': '🎓',
    'Seattle': '☕',
    'Los Angeles': '🎬',
    'San Diego': '🏖️',
    'Portland': '🌲',
    'Austin': '🎸',
    'New York': '🗽',
    'Boston': '⚾',
    'Chicago': '🌆',
    'Miami': '🌴',
    'Denver': '🏔️',
    'Phoenix': '🌵',
    'Las Vegas': '🎰',
  };
  return emojiMap[city] || '🐕';
}

export const revalidate = 3600; // Revalidate every hour

interface CityData {
  city: string;
  state: string | null;
  count: string;
}

export default async function CitiesPage() {
  // Fetch all cities with their daycare counts
  const { rows } = await sql<CityData>`
    SELECT city, state, COUNT(*) as count
    FROM dog_daycares
    WHERE city IS NOT NULL
    GROUP BY city, state
    HAVING COUNT(*) >= 15
    ORDER BY COUNT(*) DESC, city ASC
  `;

  // Group cities by state
  const citiesByState: Record<string, CityData[]> = {};

  rows.forEach((row) => {
    const state = row.state || 'Other';
    if (!citiesByState[state]) {
      citiesByState[state] = [];
    }
    citiesByState[state].push(row);
  });

  // Sort states by total daycares
  const sortedStates = Object.entries(citiesByState)
    .sort((a, b) => {
      const aTotal = a[1].reduce((sum, city) => sum + parseInt(city.count), 0);
      const bTotal = b[1].reduce((sum, city) => sum + parseInt(city.count), 0);
      return bTotal - aTotal;
    });

  // State name mapping
  const stateNames: Record<string, string> = {
    'CA': 'California',
    'WA': 'Washington',
    'OR': 'Oregon',
    'TX': 'Texas',
    'FL': 'Florida',
    'NY': 'New York',
    'IL': 'Illinois',
    'MA': 'Massachusetts',
    'CO': 'Colorado',
    'AZ': 'Arizona',
    'NV': 'Nevada',
    'GA': 'Georgia',
    'NC': 'North Carolina',
    'PA': 'Pennsylvania',
    'OH': 'Ohio',
    'MI': 'Michigan',
    'TN': 'Tennessee',
    'MD': 'Maryland',
    'VA': 'Virginia',
    'MN': 'Minnesota',
    'WI': 'Wisconsin',
    'NM': 'New Mexico',
    'UT': 'Utah',
    'IN': 'Indiana',
    'DC': 'District of Columbia',
    'Other': 'Other Cities',
  };

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
            {rows.length}+ cities with trusted dog care
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Search className="w-6 h-6" />
            <span>Select your city below</span>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sortedStates.map(([state, cities]) => (
          <div key={state} className="mb-12">
            <h2 className="text-3xl font-black mb-6 text-gray-900 flex items-center gap-3">
              <span>{stateNames[state] || state}</span>
              <span className="text-sm font-normal text-gray-500">
                ({cities.reduce((sum, city) => sum + parseInt(city.count), 0)} daycares)
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((cityData) => (
                <Link
                  key={`${cityData.city}-${cityData.state}`}
                  href={`/${cityToSlug(cityData.city)}`}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105 border-2 border-transparent hover:border-orange-300 group"
                >
                  <div className="text-center mb-3">
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                      {getCityEmoji(cityData.city)}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-black text-xl mb-1">{cityData.city}</h3>
                    <p className="text-gray-600 text-sm mb-2">{cityData.state || 'Various Locations'}</p>
                    <p className="text-orange-600 font-bold text-sm">{cityData.count} daycares</p>
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
