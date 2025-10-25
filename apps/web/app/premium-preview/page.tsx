import Link from 'next/link';
import { MapPin, Star, Phone, Globe, ExternalLink, ArrowLeft, Clock, Award, Camera, Wifi, Dog, Heart, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';

/**
 * Premium Listing Preview/Mockup
 * Shows what a premium listing looks like with all enhanced features
 */
export default function PremiumPreviewPage() {
  // Mock premium business data
  const business = {
    name: "Bark Avenue Dog Daycare & Boarding",
    city: "San Francisco",
    address: "123 Bark Street, San Francisco, CA 94102",
    phone: "(415) 555-WOOF",
    website: "https://barkavenuedaycare.com",
    email: "hello@barkavenuedaycare.com",
    rating: 4.9,
    reviewCount: 247,
    description: "Welcome to Bark Avenue, San Francisco's premier dog daycare and boarding facility! We provide a safe, fun, and enriching environment where your furry friends can play, socialize, and be pampered. Our certified staff ensures every pup receives individual attention and care.",
    webcamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example webcam embed URL
    webcamProvider: "YouTube Live",
    amenities: [
      "🎾 Indoor & Outdoor Play Areas",
      "🏊 Splash Pool & Water Play",
      "📹 Live Webcams",
      "🚿 Professional Grooming",
      "🎓 Training Classes",
      "🛌 Overnight Boarding",
      "🍖 Specialized Diets Available",
      "♿ Wheelchair Accessible"
    ],
    hours: {
      "Monday": "7:00 AM - 7:00 PM",
      "Tuesday": "7:00 AM - 7:00 PM",
      "Wednesday": "7:00 AM - 7:00 PM",
      "Thursday": "7:00 AM - 7:00 PM",
      "Friday": "7:00 AM - 7:00 PM",
      "Saturday": "8:00 AM - 6:00 PM",
      "Sunday": "9:00 AM - 5:00 PM"
    },
    photos: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
      "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800"
    ],
    specialOffer: {
      title: "First Day Free!",
      description: "New customers get their first daycare session absolutely free. Valid for new clients only.",
      expires: "Limited time offer"
    },
    certifications: [
      "Certified Pet Care Facility",
      "Fear Free Certified",
      "Pet First Aid Certified Staff"
    ]
  };

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

      {/* Premium Badge Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-white font-black text-lg">
            <Sparkles className="w-6 h-6" />
            <span>PREMIUM LISTING - VERIFIED BUSINESS</span>
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-2 gap-2 p-2">
                {business.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t">
                <button className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700">
                  <Camera className="w-5 h-5" />
                  View All Photos (12)
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4">{business.name}</h1>
                  <div className="flex items-center gap-2 text-lg mb-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{business.city}</span>
                  </div>
                  {business.address && (
                    <p className="text-gray-600 ml-7">{business.address}</p>
                  )}
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-black text-sm whitespace-nowrap">
                  ⭐ PREMIUM
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-4xl">{business.rating}</span>
                </div>
                <span className="text-gray-500 text-lg">({business.reviewCount} reviews)</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-black mb-4">About Us</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{business.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-black mb-4">Amenities & Services</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {business.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                      <span className="text-lg">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-8">
                <h2 className="text-2xl font-black mb-4">Certifications</h2>
                <div className="flex flex-wrap gap-3">
                  {business.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-full px-4 py-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Business Hours
                </h2>
                <div className="grid gap-2">
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="font-semibold">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Special Offer */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-6 text-white sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 fill-white" />
                <h3 className="text-2xl font-black">Special Offer!</h3>
              </div>
              <h4 className="text-3xl font-black mb-3">{business.specialOffer.title}</h4>
              <p className="mb-4 text-white/90">{business.specialOffer.description}</p>
              <p className="text-sm text-white/75 mb-6">{business.specialOffer.expires}</p>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-green-600 text-center py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Claim Offer Now!
              </a>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-2xl font-black mb-4">Contact</h3>
              <div className="space-y-4">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-3 hover:text-orange-500 transition">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-lg font-semibold">{business.phone}</span>
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-orange-500 transition"
                  >
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Globe className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-lg font-semibold">Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Visit Official Website
                <ExternalLink className="inline-block w-5 h-5 ml-2" />
              </a>
              <a
                href="https://google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white border-2 border-orange-500 text-orange-500 text-center py-3 rounded-2xl font-bold text-base hover:bg-orange-50 transition"
              >
                View Reviews & Directions on Google Maps
                <ExternalLink className="inline-block w-4 h-4 ml-2" />
              </a>
            </div>

            {/* Webcam Preview - Only shown if webcam URL exists */}
            {business.webcamUrl && (
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wifi className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-black">Live Webcams</h3>
                </div>
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={business.webcamUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-600 mb-3">Watch your pup play in real-time!</p>
                {business.webcamProvider && (
                  <p className="text-xs text-gray-500">Powered by {business.webcamProvider}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
