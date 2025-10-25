'use client';

import { Search, MapPin, Award, Heart, Filter, Star, Shield, Sparkles, PartyPopper, Dog } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/woofspotslogo.png"
                alt="Woof Spots"
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Woof Spots
                </h1>
                <p className="text-xs text-orange-600 font-semibold">🐾 Daycare, Playdates, Boarding & More</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/contest" className="text-purple-600 hover:text-purple-700 font-black animate-pulse">🏆 Contest</Link>
              <a href="#features" className="text-gray-700 hover:text-orange-500 font-semibold">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 font-semibold">How It Works</a>
              <a href="#for-businesses" className="text-gray-700 hover:text-orange-500 font-semibold">List Your Business</a>
            </nav>
            <Link href="/search" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-xl transition transform hover:scale-105 font-bold">
              🐕 Find Care
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Fun background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🐕</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">🦴</div>
          <div className="absolute bottom-20 left-20 text-4xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-bounce delay-75">🐶</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/woofspotslogo.png"
                alt="Woof Spots"
                width={240}
                height={240}
                className="drop-shadow-2xl animate-bounce"
              />
            </div>

            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                🎉 100% Free for Pet Parents!
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-gray-900">Find Trusted Dog Care Near You</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Link href="/services/daycare" className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:bg-orange-50 transition border-2 border-orange-200">
                Daycare
              </Link>
              <Link href="/services/boarding" className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition border-2 border-blue-200">
                Boarding
              </Link>
              <Link href="/services/grooming" className="bg-white text-pink-600 px-6 py-2 rounded-full font-bold hover:bg-pink-50 transition border-2 border-pink-200">
                Grooming
              </Link>
              <span className="bg-white text-gray-400 px-6 py-2 rounded-full font-bold border-2 border-gray-200 cursor-not-allowed opacity-60">
                Walking
              </span>
              <span className="bg-white text-gray-400 px-6 py-2 rounded-full font-bold border-2 border-gray-200 cursor-not-allowed opacity-60">
                Sitting
              </span>
              <span className="bg-white text-gray-400 px-6 py-2 rounded-full font-bold border-2 border-gray-200 cursor-not-allowed opacity-60">
                Training
              </span>
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium">
              Compare ratings, read real reviews, and find the perfect care for your furry friend.
            </p>

            {/* Location Search Widget */}
            <div className="max-w-2xl mx-auto mb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const city = formData.get('city') as string;
                  if (city?.trim()) {
                    router.push(`/search?city=${encodeURIComponent(city.trim())}`);
                  }
                }}
                className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-orange-200"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city or ZIP code..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-orange-300 transition transform hover:scale-105 whitespace-nowrap"
                  >
                    🔍 Search
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Or <Link href="/cities" className="text-orange-500 hover:underline font-semibold">browse all locations</Link>
                </p>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#for-businesses" className="bg-white border-4 border-orange-500 text-orange-600 px-10 py-5 rounded-full font-black text-lg shadow-xl hover:bg-orange-50 transition transform hover:scale-110">
                💼 List Your Business (Free!)
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-6 font-semibold">
              ✨ No signup required • 5,000+ care providers • 50+ cities • Updated daily
            </p>
          </div>
        </div>
      </section>

      {/* Viral Contest Banner */}
      <section className="py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-10 text-6xl animate-bounce">🏆</div>
          <div className="absolute top-2 right-10 text-6xl animate-bounce delay-75">😂</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-black mb-3 animate-pulse">
            NEW MONTHLY CONTEST!
          </div>
          <h3 className="text-4xl md:text-5xl font-black mb-3">
            🤪 Dogs Doing Ridiculous Things Contest
          </h3>
          <p className="text-xl mb-4">Submit your pup's funniest photo & win $500! 💰</p>
          <Link
            href="/contest"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-black text-lg shadow-2xl hover:bg-yellow-400 hover:text-gray-900 transition transform hover:scale-110"
          >
            Enter Contest →
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white/60 backdrop-blur border-y-4 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard emoji="🏆" number="5,000+" label="Care Providers" color="orange" />
            <StatCard emoji="📍" number="50" label="Major Metro Areas" color="pink" />
            <StatCard emoji="⭐" number="4.6★" label="Average Rating" color="yellow" />
            <StatCard emoji="🎁" number="Free" label="For Pet Owners" color="green" />
          </div>
        </div>
      </section>

      {/* Featured Daycares */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 transform -rotate-2">
              ⭐ MOST LOVED
            </div>
            <h3 className="text-5xl font-black mb-3 text-gray-900">
              Top-Rated Tail-Waggers! 🐕
            </h3>
            <p className="text-xl text-gray-600">These spots have dogs doing happy dances across the country!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <FunDaycareCard
              id={1}
              name="Pet Camp San Francisco"
              city="San Francisco"
              rating={4.7}
              reviews={856}
              badge="🎪 Most Fun"
              color="orange"
            />
            <FunDaycareCard
              id={5}
              name="Embarkadero Social Club"
              city="San Francisco"
              rating={4.9}
              reviews={342}
              badge="💎 Premium Pick"
              color="purple"
            />
            <FunDaycareCard
              id={25}
              name="Bark Avenue"
              city="San Francisco"
              rating={5.0}
              reviews={521}
              badge="💰 Best Value"
              color="green"
            />
          </div>

          <div className="text-center">
            <Link href="/search" className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:shadow-orange-300 transition transform hover:scale-110">
              <Dog className="w-6 h-6" />
              Browse All Providers
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black mb-4 text-gray-900">Why Pet Parents Love Us! 🐾</h3>
            <p className="text-xl text-gray-600">Finding the perfect daycare should be easy-peasy!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FunFeatureCard
              emoji="🔍"
              title="Super Easy Search"
              description="Browse dog care services across 50+ major US metros. Filter by city, rating, and more!"
              color="orange"
            />
            <FunFeatureCard
              emoji="⭐"
              title="Real Reviews"
              description="Read honest reviews from real pet parents in your neighborhood."
              color="yellow"
            />
            <FunFeatureCard
              emoji="🎯"
              title="Smart Filters"
              description="Find exactly what you need - by size, breed, amenities, and price."
              color="pink"
            />
            <FunFeatureCard
              emoji="📍"
              title="Near You"
              description="Search by city to find convenient options close to home or work."
              color="green"
            />
            <FunFeatureCard
              emoji="💯"
              title="100% Free"
              description="No hidden fees, no subscriptions, no gimmicks. Just happy dogs!"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black mb-4 text-gray-900">How It Works 🚀</h3>
            <p className="text-xl text-gray-600">Four easy steps to doggy paradise!</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <FunStepCard number="1" emoji="🔍" title="Search" description="Pick your city or browse all" />
            <FunStepCard number="2" emoji="📊" title="Compare" description="Read reviews & check ratings" />
            <FunStepCard number="3" emoji="📞" title="Contact" description="Call or visit for a tour" />
            <FunStepCard number="4" emoji="🎉" title="Celebrate!" description="Watch your pup make friends!" />
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Signals */}
      <section className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
              ⭐ TRUSTED BY PET PARENTS
            </div>
            <h3 className="text-5xl font-black mb-4 text-gray-900">Real Stories, Happy Tails! 🐕</h3>
            <p className="text-xl text-gray-600">See why thousands of pet parents trust Woof Spots</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <TestimonialCard
              name="Sarah M."
              location="San Francisco, CA"
              rating={5}
              text="Found the perfect daycare for my golden retriever in under 5 minutes! The reviews were spot-on and the staff is amazing. Charlie loves it there!"
              verified={true}
            />
            <TestimonialCard
              name="Mike T."
              location="Los Angeles, CA"
              rating={5}
              text="As a first-time dog owner, I was nervous about finding the right place. Woof Spots made it so easy to compare options and read real reviews. Highly recommend!"
              verified={true}
            />
            <TestimonialCard
              name="Jennifer K."
              location="Seattle, WA"
              rating={5}
              text="Love that I can search for boarding, grooming, AND training all in one place. Saved me so much time researching. My pup is getting the best care!"
              verified={true}
            />
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-10 text-white text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-black mb-2">5,000+</div>
                <div className="text-lg">Verified Providers</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2">4.6★</div>
                <div className="text-lg">Average Rating</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2">50+</div>
                <div className="text-lg">Cities Nationwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section id="for-businesses" className="py-20 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">💼</div>
          <div className="absolute bottom-10 right-10 text-8xl">🐕</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold mb-6">
            🎁 LIMITED TIME OFFER
          </div>
          <h3 className="text-5xl md:text-6xl font-black mb-6">Own a Dog Care Business?</h3>
          <p className="text-2xl mb-8 leading-relaxed">
            List your daycare, boarding, grooming, or training business <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg font-black">FREE</span> during our beta!
            <br />
            Get discovered by thousands of pet parents nationwide.
          </p>

          <div className="bg-white text-gray-900 rounded-3xl p-10 mb-10 shadow-2xl transform hover:scale-105 transition">
            <h4 className="text-3xl font-black mb-8">🎉 Free Beta Listing Includes:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <BizFeature emoji="📸" text="Full profile with photos" />
              <BizFeature emoji="📞" text="Direct contact info" />
              <BizFeature emoji="⭐" text="Customer reviews & ratings" />
              <BizFeature emoji="✨" text="Amenities showcase" />
              <BizFeature emoji="🚀" text="Priority placement" />
              <BizFeature emoji="📊" text="Analytics dashboard" />
            </div>
          </div>

          <Link
            href="/claim"
            className="inline-block bg-yellow-400 text-gray-900 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:bg-yellow-300 transition transform hover:scale-110"
          >
            🎯 Claim Your Free Listing →
          </Link>

          <div className="mt-10 bg-white/10 backdrop-blur border-2 border-white/30 rounded-2xl p-8">
            <h5 className="text-2xl font-black mb-4">💎 Premium Plans Coming Soon</h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-bold mb-2">🆓 Free Forever</p>
                <p className="text-white/90">Basic listing • Contact info • Reviews</p>
              </div>
              <div>
                <p className="font-bold mb-2">⭐ Pro ($49/mo)</p>
                <p className="text-white/90">Priority placement • Photo gallery • Booking integration</p>
              </div>
              <div>
                <p className="font-bold mb-2">💎 Premium ($99/mo)</p>
                <p className="text-white/90">Featured homepage spot • Analytics dashboard • Premium badge</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mt-4 text-center">
              🎁 All beta users locked into free tier forever, with first access to premium features at discounted rates
            </p>
          </div>

          <p className="text-sm text-white/80 mt-6 font-semibold">
            ⏰ Limited to first 100 businesses
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-700 text-white py-12 border-t-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/woofspotslogo.png"
                alt="Woof Spots"
                width={50}
                height={50}
                className="drop-shadow-lg"
              />
              <span className="font-black text-lg">Woof Spots</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-orange-400 transition">
                About
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-orange-400 transition">
                Blog
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition">
                Privacy Policy
              </Link>
              <a href="#for-businesses" className="text-gray-400 hover:text-orange-400 transition">
                For Businesses
              </a>
              <Link href="/contest" className="text-gray-400 hover:text-orange-400 transition">
                Contest
              </Link>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Made with 🐾 and ❤️ for dogs everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ emoji, number, label, color }: { emoji: string; number: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'from-orange-400 to-pink-500',
    pink: 'from-pink-400 to-purple-500',
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-400 to-teal-500',
  };

  return (
    <div className="text-center transform hover:scale-110 transition">
      <div className={`text-5xl mb-3 animate-bounce`}>{emoji}</div>
      <div className={`text-4xl font-black bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent mb-2`}>
        {number}
      </div>
      <div className="text-sm text-gray-700 font-semibold">{label}</div>
    </div>
  );
}

function FunFeatureCard({ emoji, title, description, color }: { emoji: string; title: string; description: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'from-orange-400 to-pink-500',
    yellow: 'from-yellow-400 to-orange-500',
    pink: 'from-pink-400 to-purple-500',
    green: 'from-green-400 to-teal-500',
    blue: 'from-blue-400 to-indigo-500',
    purple: 'from-purple-400 to-pink-500',
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-transparent hover:border-orange-300">
      <div className="text-6xl mb-4">{emoji}</div>
      <h4 className={`text-2xl font-black mb-3 bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
        {title}
      </h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FunStepCard({ number, emoji, title, description }: { number: string; emoji: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl transform hover:scale-110 transition">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 text-4xl animate-bounce">{emoji}</div>
      </div>
      <h4 className="text-2xl font-black mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600 font-medium">{description}</p>
    </div>
  );
}

function FunDaycareCard({ id, name, city, rating, reviews, badge, color }: { id: number; name: string; city: string; rating: number; reviews: number; badge: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'from-orange-400 to-pink-500',
    purple: 'from-purple-400 to-pink-500',
    green: 'from-green-400 to-teal-500',
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden border-4 border-orange-200 hover:border-orange-400">
      <div className={`h-3 bg-gradient-to-r ${colors[color]}`}></div>
      <div className="p-8">
        <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold mb-4 transform -rotate-2">
          {badge}
        </div>

        <h4 className="font-black text-2xl mb-2 text-gray-900">{name}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="font-semibold">{city}</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="font-black text-2xl">{rating}</span>
          </div>
          <span className="text-gray-500 font-semibold">({reviews} reviews)</span>
        </div>

        <Link
          href={`/listing/${id}`}
          className={`block w-full bg-gradient-to-r ${colors[color]} text-white text-center py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition transform hover:scale-105`}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

function BizFeature({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <span className="text-3xl">{emoji}</span>
      <span className="font-semibold text-lg">{text}</span>
    </div>
  );
}

function TestimonialCard({ name, location, rating, text, verified }: { name: string; location: string; rating: number; text: string; verified: boolean }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-orange-200">
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 leading-relaxed mb-6 italic">"{text}"</p>

      {/* Author Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
        {verified && (
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>
    </div>
  );
}
