import { Search, MapPin, Zap, DollarSign, Tag, TrendingDown, Flame, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="w-8 h-8 text-depot-orange" />
              <h1 className="text-2xl font-bold text-depot-dark">DepotClear</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-depot-orange">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-depot-orange">Pricing</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-depot-orange">How It Works</a>
            </nav>
            <Link href="/search" className="bg-depot-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              Start Searching
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-depot-dark via-gray-900 to-depot-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">
              Find Hidden Home Depot Clearance Deals
              <span className="block text-depot-orange mt-2">Nationwide</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              AI-powered clearance finder that tracks items under $1, ending in .01/.03/.06, and local store availability in real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/search" className="bg-white text-depot-dark px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
                Try Free Demo
              </Link>
              <a href="#pricing" className="bg-depot-orange border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition text-lg">
                Get Lifetime Access - $20
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">One-time payment. No subscriptions. Lifetime updates.</p>
          </div>
        </div>
      </section>

      {/* Penny Deals Section - NEW! */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50 border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Flame className="w-4 h-4" />
              LIVE PENNY DEALS
            </div>
            <h3 className="text-3xl font-bold mb-2">🔥 Hot Deals Found Near You</h3>
            <p className="text-gray-600">We scan 2,300 stores nationwide every 6 hours to find these crazy deals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <PennyDealCard
              storeName="Home Depot - Pasadena"
              distance="2.3 miles"
              itemTitle="LED Work Light 1000 Lumens"
              price="$0.03"
              originalPrice="$29.99"
              category="Lighting"
              foundAgo="2 hours ago"
            />
            <PennyDealCard
              storeName="Home Depot - Glendale"
              distance="4.1 miles"
              itemTitle="Cordless Drill Battery Pack 18V"
              price="$0.01"
              originalPrice="$49.99"
              category="Tools"
              foundAgo="45 minutes ago"
              isPenny={true}
            />
            <PennyDealCard
              storeName="Home Depot - Burbank"
              distance="6.8 miles"
              itemTitle="Exterior Paint Gallon - Gray"
              price="$0.88"
              originalPrice="$34.99"
              category="Paint"
              foundAgo="3 hours ago"
            />
          </div>

          <div className="text-center">
            <Link href="/search" className="inline-block bg-depot-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
              Find Penny Deals Near You →
            </Link>
            <p className="text-sm text-gray-500 mt-3">Enter your ZIP code to see live deals at your local stores</p>
          </div>

          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-depot-orange">2,300</div>
                <div className="text-sm text-gray-600 mt-1">Stores Monitored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-depot-orange">Every 6h</div>
                <div className="text-sm text-gray-600 mt-1">Update Frequency</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-depot-orange">1,247</div>
                <div className="text-sm text-gray-600 mt-1">Deals Found Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-depot-orange">$42k</div>
                <div className="text-sm text-gray-600 mt-1">Saved by Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Why DepotClear?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-10 h-10 text-depot-orange" />}
              title="Smart Scraping"
              description="Continuously monitors Home Depot's entire catalog for clearance items nationwide."
            />
            <FeatureCard
              icon={<MapPin className="w-10 h-10 text-depot-orange" />}
              title="Local Availability"
              description="Enter your ZIP code and see what's in stock at nearby stores instantly."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-depot-orange" />}
              title="Real-Time Updates"
              description="Automated refresh every 6 hours ensures you never miss a hot deal."
            />
            <FeatureCard
              icon={<DollarSign className="w-10 h-10 text-depot-orange" />}
              title="Price Intelligence"
              description="Flags items under $1 and clearance markers (.01, .03, .06, .88, .99)."
            />
            <FeatureCard
              icon={<TrendingDown className="w-10 h-10 text-depot-orange" />}
              title="AI Insights"
              description="GPT-powered trend analysis shows which categories have the most deals."
            />
            <FeatureCard
              icon={<Tag className="w-10 h-10 text-depot-orange" />}
              title="Category Filters"
              description="Browse by Tools, Lighting, Paint, Hardware, Outdoor, and more."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-4">Simple, One-Time Pricing</h3>
          <p className="text-center text-gray-600 mb-12">Pay once, use forever. No recurring fees.</p>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-depot-orange">
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">DepotClear Lifetime</h4>
              <div className="flex items-baseline justify-center mb-6">
                <span className="text-5xl font-bold text-depot-orange">$20</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <PricingFeature text="Unlimited clearance searches" />
                <PricingFeature text="Nationwide store availability" />
                <PricingFeature text="Real-time price tracking" />
                <PricingFeature text="AI-powered deal insights" />
                <PricingFeature text="Category filters & sorting" />
                <PricingFeature text="Lifetime updates & support" />
                <PricingFeature text="No monthly fees ever" />
              </ul>
              <Link href="/checkout" className="block w-full bg-depot-orange text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition text-lg">
                Get Lifetime Access Now
              </Link>
              <p className="text-sm text-gray-500 mt-4">Secure payment via Stripe • 7-day money-back guarantee</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/search" className="text-depot-orange hover:underline">
              Or try the free demo first →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="1" title="Enter ZIP Code" description="Tell us where you want to shop" />
            <StepCard number="2" title="Browse Deals" description="View clearance items sorted by price and category" />
            <StepCard number="3" title="Check Availability" description="See real-time stock at nearby stores" />
            <StepCard number="4" title="Go Shopping" description="Head to the store and grab your deals!" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-depot-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Tag className="w-6 h-6" />
              <span className="font-semibold">DepotClear</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 DepotClear. Not affiliated with The Home Depot, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 hover:border-depot-orange transition">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center">
      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span>{text}</span>
    </li>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-depot-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function PennyDealCard({
  storeName,
  distance,
  itemTitle,
  price,
  originalPrice,
  category,
  foundAgo,
  isPenny = false,
}: {
  storeName: string;
  distance: string;
  itemTitle: string;
  price: string;
  originalPrice: string;
  category: string;
  foundAgo: string;
  isPenny?: boolean;
}) {
  const discount = Math.round(((parseFloat(originalPrice.replace('$', '')) - parseFloat(price.replace('$', ''))) / parseFloat(originalPrice.replace('$', ''))) * 100);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border-2 border-orange-200">
      {isPenny && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-center font-bold text-sm">
          🎉 PENNY DEAL! 🎉
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{storeName}</span>
            </div>
            <div className="text-xs text-gray-500">{distance}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{foundAgo}</span>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{itemTitle}</h4>

        <div className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium mb-3">
          {category}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-red-600">{price}</span>
          <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
            -{discount}%
          </span>
        </div>

        <div className="text-sm text-gray-700 font-medium">
          Save {(parseFloat(originalPrice.replace('$', '')) - parseFloat(price.replace('$', ''))).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
