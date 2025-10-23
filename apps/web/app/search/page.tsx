'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Heart, Star, Phone, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const bayAreaCities = [
  'All',
  // By county
  'San Francisco', 'Oakland', 'Berkeley', 'San Jose', 'Palo Alto',
  'Mountain View', 'Sunnyvale', 'Fremont', 'Hayward', 'San Mateo',
  'Redwood City', 'Santa Rosa', 'Walnut Creek', 'San Rafael', 'Napa',
];

export default function SearchPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [daycares, setDaycares] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch daycares from API
  const fetchDaycares = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        city: selectedCity,
        minRating: minRating.toString(),
        limit: '100',
      });

      const response = await fetch(`/api/daycares?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Daycares API response:', data);

      if (data.success) {
        setDaycares(data.data || []);
      } else {
        setError(data.error || 'Failed to load daycares');
      }
    } catch (err: any) {
      setError(`Failed to load daycares: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load daycares on mount and when filters change
  useEffect(() => {
    fetchDaycares();
  }, [selectedCity, minRating]);

  const avgRating = daycares.length > 0
    ? (daycares.reduce((sum, d) => sum + (d.rating || 0), 0) / daycares.filter(d => d.rating).length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Bay Area Dog Daycare</h1>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {bayAreaCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating: {minRating > 0 ? `${minRating}★` : 'Any'}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Any</span>
                <span>5★</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {daycares.length} daycares found
            </div>
            <button
              onClick={fetchDaycares}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{daycares.length} Dog Daycares Found</h2>
              <p className="text-blue-100">
                {selectedCity === 'All' ? 'Across the Bay Area' : `in ${selectedCity}`}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{avgRating}★</div>
                <div className="text-blue-100 text-sm">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{daycares.filter(d => d.rating >= 4.5).length}</div>
                <div className="text-blue-100 text-sm">Top Rated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daycare Grid */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Finding daycares...</h3>
            <p className="text-gray-500">Searching across the Bay Area</p>
          </div>
        ) : daycares.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No daycares found</h3>
            <p className="text-gray-500">Try adjusting your filters or selecting a different city</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daycares.map(daycare => (
              <DaycareCard key={daycare.id} daycare={daycare} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DaycareCard({ daycare }: { daycare: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border-2 border-transparent hover:border-blue-600">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-gray-900">{daycare.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{daycare.city}</span>
            </div>
            {daycare.address && (
              <div className="text-xs text-gray-500 mt-1">{daycare.address}</div>
            )}
          </div>
        </div>

        {daycare.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{daycare.rating.toFixed(1)}</span>
            </div>
            {daycare.review_count && (
              <span className="text-gray-500 text-sm">({daycare.review_count} reviews)</span>
            )}
          </div>
        )}

        <div className="space-y-2 mb-4">
          {daycare.phone && (
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="w-4 h-4 text-blue-600 mr-2" />
              <a href={`tel:${daycare.phone}`} className="hover:text-blue-600">
                {daycare.phone}
              </a>
            </div>
          )}
          {daycare.website && (
            <div className="flex items-center text-sm text-gray-700">
              <Globe className="w-4 h-4 text-blue-600 mr-2" />
              <a
                href={daycare.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 truncate"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {daycare.google_maps_url && (
          <a
            href={daycare.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            View on Google Maps
            <ExternalLink className="inline-block w-3 h-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}
