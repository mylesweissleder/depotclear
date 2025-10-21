'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Mock data for demo - will be replaced with real DB queries
const mockProducts = [
  {
    id: 1,
    title: 'LED Work Light 1000 Lumens',
    price: 0.03,
    originalPrice: 29.99,
    category: 'Lighting',
    modelNumber: 'LED-1000',
    imageUrl: 'https://images.thdstatic.com/productImages/placeholder.jpg',
    url: 'https://www.homedepot.com/p/123456',
    inStock: true,
    distance: '2.3 miles',
    storeName: 'Home Depot - Pasadena',
  },
  {
    id: 2,
    title: 'Cordless Drill Battery Pack',
    price: 0.88,
    originalPrice: 49.99,
    category: 'Tools',
    modelNumber: 'BAT-18V',
    imageUrl: 'https://images.thdstatic.com/productImages/placeholder.jpg',
    url: 'https://www.homedepot.com/p/789012',
    inStock: true,
    distance: '4.1 miles',
    storeName: 'Home Depot - Glendale',
  },
  {
    id: 3,
    title: 'Exterior Paint Gallon - Gray',
    price: 0.01,
    originalPrice: 34.99,
    category: 'Paint',
    modelNumber: 'EXT-GRAY-1G',
    imageUrl: 'https://images.thdstatic.com/productImages/placeholder.jpg',
    url: 'https://www.homedepot.com/p/345678',
    inStock: false,
    distance: '2.3 miles',
    storeName: 'Home Depot - Pasadena',
  },
  {
    id: 4,
    title: 'Garden Hose 50ft Heavy Duty',
    price: 0.99,
    originalPrice: 24.99,
    category: 'Outdoor',
    modelNumber: 'HOSE-50HD',
    imageUrl: 'https://images.thdstatic.com/productImages/placeholder.jpg',
    url: 'https://www.homedepot.com/p/901234',
    inStock: true,
    distance: '6.8 miles',
    storeName: 'Home Depot - Burbank',
  },
  {
    id: 5,
    title: 'Door Hinges Brass Finish (Pack of 6)',
    price: 0.06,
    originalPrice: 12.99,
    category: 'Hardware',
    modelNumber: 'HINGE-BR-6',
    imageUrl: 'https://images.thdstatic.com/productImages/placeholder.jpg',
    url: 'https://www.homedepot.com/p/567890',
    inStock: true,
    distance: '2.3 miles',
    storeName: 'Home Depot - Pasadena',
  },
];

const categories = ['All', 'Tools', 'Lighting', 'Paint', 'Hardware', 'Outdoor'];

export default function SearchPage() {
  const [zipCode, setZipCode] = useState('90210');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000.00);
  const [showInStockOnly, setShowInStockOnly] = useState(true);
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        maxPrice: maxPrice.toString(),
        zipCode: zipCode,
        limit: '50',
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Network error - using demo data');
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, maxPrice, zipCode]);

  // Filter products locally
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (product.price > maxPrice) return false;
    if (showInStockOnly && !product.inStock) return false;
    return true;
  });

  const savings = filteredProducts.reduce((sum, p) => sum + (p.originalPrice - p.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Tag className="w-8 h-8 text-depot-orange" />
            <h1 className="text-2xl font-bold text-depot-dark">DepotClear</h1>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-depot-orange focus:border-transparent"
                  maxLength={5}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-depot-orange focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price: ${maxPrice.toFixed(2)}</label>
              <input
                type="range"
                min="0.01"
                max="1000.00"
                step="1.00"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-depot-orange"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="w-4 h-4 text-depot-orange bg-gray-100 border-gray-300 rounded focus:ring-depot-orange"
              />
              <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                Show in-stock items only
              </label>
            </div>
            <button
              onClick={fetchProducts}
              disabled={isLoading}
              className="bg-depot-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search Deals'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Local Store Info */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Your Local Stores ({zipCode})</h3>
              <p className="text-sm text-green-100">3 Home Depot locations within 10 miles</p>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-gradient-to-r from-depot-orange to-orange-500 text-white rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{filteredProducts.length} Clearance Items Found</h2>
              <p className="text-orange-100">Updated 2 hours ago • Markdown stages tracked</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredProducts.filter(p => p.price <= 1).length}</div>
                <div className="text-orange-100 text-sm">Deep Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredProducts.filter(p => {
                  const cents = p.price.toFixed(2).split('.')[1];
                  const lastDigit = cents[1];
                  return ['2', '3', '4', '6'].includes(lastDigit);
                }).length}</div>
                <div className="text-orange-100 text-sm">Markdown Indicators</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-orange-400/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-yellow-300">💡</span>
                <span>Price endings (.60→.06, .40→.04, etc.) indicate markdown stages</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-300">🔥</span>
                <span>Always scan in-store - prices may be lower than online</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-300">⏰</span>
                <span>Penny deals are stealth - not advertised or guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-depot-orange mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Searching for deals...</h3>
            <p className="text-gray-500">Scanning 2,300 stores nationwide</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters or checking a different ZIP code</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: typeof mockProducts[0] }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Determine markdown level based on price ending
  const priceStr = product.price.toFixed(2);
  const cents = priceStr.split('.')[1];
  const lastDigit = cents[1];

  let markdownLevel = '';
  let markdownBadgeColor = '';
  let pennyDealPotential = '';

  if (lastDigit === '0' && cents !== '00') {
    markdownLevel = '1st Markdown';
    markdownBadgeColor = 'bg-blue-500';
    pennyDealPotential = 'Watch for further markdowns to $.X6';
  } else if (lastDigit === '2') {
    markdownLevel = '4th Markdown';
    markdownBadgeColor = 'bg-purple-600';
    pennyDealPotential = '🔥 Possible penny deal - scan in-store!';
  } else if (lastDigit === '3') {
    markdownLevel = '3rd Markdown';
    markdownBadgeColor = 'bg-indigo-600';
    pennyDealPotential = 'May mark down further - check in-store';
  } else if (lastDigit === '4') {
    markdownLevel = '2nd Markdown';
    markdownBadgeColor = 'bg-teal-600';
    pennyDealPotential = 'Potential for additional markdown';
  } else if (lastDigit === '6') {
    markdownLevel = 'Final Markdown';
    markdownBadgeColor = 'bg-orange-500';
    pennyDealPotential = 'Last stage - scan for penny pricing';
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border-2 border-transparent hover:border-depot-orange">
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
        {markdownLevel && (
          <div className={`absolute top-2 left-2 ${markdownBadgeColor} text-white px-2 py-1 rounded text-xs font-bold shadow-lg`}>
            {markdownLevel}
          </div>
        )}
        {product.price <= 1 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            PENNY!
          </div>
        )}
        <div className="text-gray-400 text-sm">Image Placeholder</div>
      </div>
      <div className="p-4">
        <div className="text-xs text-depot-orange font-semibold mb-1">{product.category}</div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-depot-orange">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {pennyDealPotential && (
          <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 mb-3">
            <p className="text-xs text-yellow-800 font-medium">💡 {pennyDealPotential}</p>
          </div>
        )}

        <div className="flex items-center text-sm mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-gray-600">{product.distance} • {product.storeName}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          {product.inStock ? (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              In Stock Nearby
            </span>
          ) : (
            <span className="text-gray-500 text-sm">Check local stores</span>
          )}
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-depot-orange text-white text-center py-2 rounded-lg hover:bg-orange-600 transition font-medium text-sm"
        >
          View on HomeDepot.com
          <ExternalLink className="inline-block w-3 h-3 ml-1" />
        </a>
      </div>
    </div>
  );
}
