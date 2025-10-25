'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Filter, Heart, Star, Phone, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const bayAreaCities = [
  'All',
  // San Francisco County
  'San Francisco',
  // Alameda County
  'Oakland', 'Berkeley', 'Fremont', 'Hayward', 'Alameda',
  // Contra Costa County
  'Walnut Creek', 'Concord', 'Richmond',
  // Marin County
  'San Rafael', 'Novato', 'Mill Valley', 'Sausalito', 'Tiburon',
  // Napa County
  'Napa',
  // San Mateo County
  'San Mateo', 'Redwood City', 'Palo Alto', 'Mountain View',
  // Santa Clara County
  'San Jose', 'Sunnyvale', 'Santa Clara',
  // Sonoma County
  'Santa Rosa', 'Petaluma',
];

export default function SearchPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'reviews'>('rating');
  const [daycares, setDaycares] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch daycares from API
  const fetchDaycares = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        city: selectedCity,
        minRating: minRating.toString(),
        limit: '10000', // Load all results
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
  }, [selectedCity, minRating]);

  // Load daycares on mount and when filters change
  useEffect(() => {
    fetchDaycares();
  }, [fetchDaycares]);

  // Filter by search query and business type
  const filteredDaycares = daycares.filter(daycare => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        daycare.name?.toLowerCase().includes(query) ||
        daycare.address?.toLowerCase().includes(query) ||
        daycare.city?.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Business type filter
    if (selectedType !== 'all') {
      const types = daycare.business_types || [];
      if (!types.includes(selectedType)) return false;
    }

    return true;
  });

  // Sort daycares
  const sortedDaycares = [...filteredDaycares].sort((a, b) => {
    if (sortBy === 'rating') {
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;
      if (ratingB !== ratingA) return ratingB - ratingA; // Highest rating first
      return (b.review_count || 0) - (a.review_count || 0); // Then by review count
    } else if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'reviews') {
      return (b.review_count || 0) - (a.review_count || 0);
    }
    return 0;
  });

  // Paginate results
  const displayedDaycares = sortedDaycares.slice(0, displayCount);
  const hasMore = displayCount < sortedDaycares.length;

  const daycareswithRatings = filteredDaycares.filter(d => d.rating && d.rating > 0);
  const avgRating = daycareswithRatings.length > 0
    ? (daycareswithRatings.reduce((sum, d) => sum + parseFloat(d.rating), 0) / daycareswithRatings.length).toFixed(1)
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
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Name Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name or Location</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 'Woof Pack' or 'Market Street'"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="daycare">🏠 Daycare</option>
                  <option value="boarding">🛏️ Boarding</option>
                  <option value="grooming">✂️ Grooming</option>
                  <option value="training">🎓 Training</option>
                  <option value="walking">🚶 Walking</option>
                  <option value="sitting">👋 Sitting</option>
                  <option value="veterinary">🏥 Veterinary</option>
                  <option value="park">🌳 Dog Park</option>
                </select>
              </div>
            </div>

            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {displayedDaycares.length} of {sortedDaycares.length} daycares
              {sortedDaycares.length !== daycares.length && ` (filtered from ${daycares.length} total)`}
            </div>
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
        ) : sortedDaycares.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No daycares found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedDaycares.map(daycare => (
                <DaycareCard key={daycare.id} daycare={daycare} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + 50)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Load More ({sortedDaycares.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DaycareCard({ daycare }: { daycare: any }) {
  const tier = daycare.tier || 'unclaimed';

  return (
    <Link href={`/listing/${daycare.id}`} className="block">
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border-2 ${
        tier === 'top_dog' ? 'border-yellow-400' : 'border-transparent hover:border-blue-600'
      }`}>
        <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{daycare.name}</h3>
              {tier === 'top_dog' && (
                <span className="px-2 py-1 bg-yellow-400 text-gray-900 rounded-full font-black text-xs">
                  ⭐ TOP DOG
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{daycare.city}</span>
            </div>
            {/* Show full address only for claimed/premium */}
            {tier !== 'unclaimed' && daycare.address && (
              <div className="text-xs text-gray-500 mt-1">{daycare.address}</div>
            )}
          </div>
        </div>

        {daycare.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = parseFloat(daycare.rating);
                const filled = star <= rating;
                const partial = star > rating && star - 1 < rating;
                return (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      filled
                        ? 'fill-yellow-400 text-yellow-400'
                        : partial
                        ? 'fill-yellow-200 text-yellow-400'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                );
              })}
              <span className="font-bold text-lg ml-1">{parseFloat(daycare.rating).toFixed(1)}</span>
            </div>
            {daycare.review_count ? (
              <span className="text-gray-500 text-sm">({daycare.review_count} reviews)</span>
            ) : (
              <span className="text-gray-400 text-sm italic">No reviews yet</span>
            )}
          </div>
        )}

        {/* Contact info - only show for claimed/premium */}
        {tier !== 'unclaimed' ? (
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
        ) : (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              📞 Contact info available after claiming
            </p>
          </div>
        )}

        <div className="text-xs text-gray-400 italic text-center">
          Click to view full details
        </div>
        </div>
      </div>
    </Link>
  );
}
