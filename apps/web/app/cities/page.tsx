import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@vercel/postgres';

// Helper to convert city name to slug
function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Get emoji for metro areas
function getMetroEmoji(metro: string): string {
  const emojiMap: Record<string, string> = {
    'san-francisco': '🌉',
    'bay-area': '🌉',
    'los-angeles': '🎬',
    'san-diego': '🏖️',
    'seattle': '☕',
    'portland': '🌲',
    'new-york': '🗽',
    'boston': '⚾',
    'chicago': '🌆',
    'austin': '🎸',
    'denver': '🏔️',
    'miami': '🌴',
    'phoenix': '🌵',
    'las-vegas': '🎰',
    'sacramento': '🏛️',
    'washington': '🏛️',
    'philadelphia': '🔔',
  };
  return emojiMap[metro] || '🏙️';
}

// Metro display names
function getMetroDisplayName(metro: string): string {
  const displayNames: Record<string, string> = {
    'bay-area': 'San Francisco Bay Area',
    'san-francisco': 'San Francisco Bay Area',
    'los-angeles': 'Los Angeles Metro',
    'san-diego': 'San Diego',
    'seattle': 'Seattle Metro',
    'portland': 'Portland Metro',
    'new-york': 'New York Metro',
    'boston': 'Boston Metro',
    'chicago': 'Chicago Metro',
    'austin': 'Austin',
    'denver': 'Denver Metro',
    'miami': 'Miami Metro',
    'phoenix': 'Phoenix Metro',
    'sacramento': 'Sacramento',
    'washington': 'Washington DC Metro',
    'philadelphia': 'Philadelphia Metro',
  };
  return displayNames[metro] || metro.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export const revalidate = 3600; // Revalidate every hour

interface CityData {
  city: string;
  state: string | null;
  metro: string | null;
  count: string;
}

export default async function CitiesPage() {
  // Fetch all cities with their daycare counts, grouped by metro
  const { rows } = await sql<CityData>`
    SELECT city, state, metro, COUNT(*) as count
    FROM dog_daycares
    WHERE city IS NOT NULL
    GROUP BY city, state, metro
    HAVING COUNT(*) >= 15
    ORDER BY COUNT(*) DESC, city ASC
  `;

  // Group cities by metro
  const citiesByMetro: Record<string, CityData[]> = {};
  const citiesWithoutMetro: CityData[] = [];

  rows.forEach((row) => {
    if (row.metro) {
      if (!citiesByMetro[row.metro]) {
        citiesByMetro[row.metro] = [];
      }
      citiesByMetro[row.metro].push(row);
    } else {
      citiesWithoutMetro.push(row);
    }
  });

  // Sort metros by total daycares
  const sortedMetros = Object.entries(citiesByMetro)
    .sort((a, b) => {
      const aTotal = a[1].reduce((sum, city) => sum + parseInt(city.count), 0);
      const bTotal = b[1].reduce((sum, city) => sum + parseInt(city.count), 0);
      return bTotal - aTotal;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-orange-500 font-semibold">
            <Image
              src="/woofspotslogo.png"
              alt="Woof Spots"
              width={50}
              height={50}
              className="drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Woof Spots
              </h1>
              <p className="text-xs text-orange-600 font-semibold">🐾 Dog Care Directory</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Browse Dog Daycares by Metro Area
          </h1>
          <p className="text-2xl mb-2">
            {sortedMetros.length} metro areas • {rows.length}+ cities
          </p>
          <p className="text-lg opacity-90">
            Select your metro area to see nearby cities
          </p>
        </div>
      </div>

      {/* Metro Areas Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sortedMetros.map(([metro, cities]) => {
            const totalDaycares = cities.reduce((sum, city) => sum + parseInt(city.count), 0);
            return (
              <div
                key={metro}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-1 border-4 border-orange-200"
              >
                {/* Metro Header */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{getMetroEmoji(metro)}</div>
                  <h2 className="text-2xl font-black mb-2">{getMetroDisplayName(metro)}</h2>
                  <p className="text-orange-600 font-bold">{totalDaycares} daycares • {cities.length} cities</p>
                </div>

                {/* Cities List */}
                <div className="space-y-2">
                  {cities.slice(0, 5).map((cityData) => (
                    <Link
                      key={`${cityData.city}-${cityData.state}`}
                      href={`/${cityToSlug(cityData.city)}`}
                      className="block p-3 rounded-xl hover:bg-orange-50 transition group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 group-hover:text-orange-600">
                          {cityData.city}
                        </span>
                        <span className="text-sm text-gray-600">{cityData.count} daycares</span>
                      </div>
                    </Link>
                  ))}
                  {cities.length > 5 && (
                    <p className="text-sm text-gray-500 italic text-center pt-2">
                      + {cities.length - 5} more cities
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Cities Section */}
        {citiesWithoutMetro.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-black mb-6">Other Cities</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {citiesWithoutMetro.map((cityData) => (
                <Link
                  key={`${cityData.city}-${cityData.state}`}
                  href={`/${cityToSlug(cityData.city)}`}
                  className="block p-4 rounded-xl hover:bg-orange-50 transition border-2 border-gray-200 hover:border-orange-300"
                >
                  <div className="font-bold text-gray-900">{cityData.city}</div>
                  <div className="text-sm text-gray-600">{cityData.state}</div>
                  <div className="text-sm text-orange-600 font-semibold mt-1">{cityData.count} daycares</div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
