import Link from 'next/link';
import { Dog, Home, Shield, Clock, Heart, Star } from 'lucide-react';

export const metadata = {
  title: 'Dog Boarding Services - Find Trusted Overnight Care | Woof Spots',
  description: 'Find trusted dog boarding facilities for overnight and extended stays. Compare rates, read reviews, and book with confidence. 5,000+ verified boarding kennels nationwide.',
};

export default function BoardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-blue-500 font-semibold">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-2xl shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Woof Spots
              </h1>
              <p className="text-xs text-blue-600 font-semibold">🐾 Dog Boarding Directory</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              Find Trusted Dog Boarding Near You
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Travel with peace of mind. Find safe, comfortable boarding facilities where your dog will be loved and cared for like family.
            </p>
            <Link
              href="/search?service=boarding"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-blue-300 transition transform hover:scale-110"
            >
              🔍 Find Boarding Near You →
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-16">Why Choose Dog Boarding?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Home className="w-12 h-12 text-blue-500" />}
              title="Home Away From Home"
              description="Comfortable accommodations with cozy sleeping areas, climate control, and familiar routines to keep your dog relaxed."
            />
            <BenefitCard
              icon={<Shield className="w-12 h-12 text-purple-500" />}
              title="24/7 Supervision"
              description="Round-the-clock care with trained staff monitoring your dog's health, safety, and happiness at all times."
            />
            <BenefitCard
              icon={<Heart className="w-12 h-12 text-pink-500" />}
              title="Personalized Care"
              description="Individual attention, feeding schedules, medication administration, and special accommodations for your dog's unique needs."
            />
            <BenefitCard
              icon={<Star className="w-12 h-12 text-yellow-500" />}
              title="Play & Exercise"
              description="Daily playtime, walks, and socialization to keep your dog active and entertained during their stay."
            />
            <BenefitCard
              icon={<Clock className="w-12 h-12 text-green-500" />}
              title="Flexible Stays"
              description="Overnight, weekend, or extended boarding options to accommodate your travel schedule and needs."
            />
            <BenefitCard
              icon={<Dog className="w-12 h-12 text-orange-500" />}
              title="Peace of Mind"
              description="Travel worry-free knowing your pup is in professional hands with emergency vet access and regular updates."
            />
          </div>
        </div>
      </section>

      {/* What to Look For */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-12">What to Look for in a Boarding Facility</h2>
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6">
            <Checklist
              title="Cleanliness & Safety"
              items={[
                "Clean, odor-free facility with regular sanitization",
                "Secure fencing and proper ventilation",
                "Separate areas for different dog sizes",
                "Emergency evacuation plan"
              ]}
            />
            <Checklist
              title="Staff & Care"
              items={[
                "Trained staff with pet first aid certification",
                "24/7 supervision and monitoring",
                "Clear communication about your dog's stay",
                "Medication administration if needed"
              ]}
            />
            <Checklist
              title="Amenities & Services"
              items={[
                "Comfortable sleeping areas (indoor/outdoor options)",
                "Daily exercise and playtime",
                "Grooming services available",
                "Webcam access to check on your pup"
              ]}
            />
            <Checklist
              title="Health & Requirements"
              items={[
                "Up-to-date vaccination requirements",
                "Veterinarian on-call or nearby",
                "Temperament evaluation before boarding",
                "Special diet accommodations"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-6">Ready to Book Boarding?</h2>
          <p className="text-xl mb-8">Compare boarding facilities, read reviews, and find the perfect place for your pup's stay.</p>
          <Link
            href="/search?service=boarding"
            className="inline-block bg-white text-blue-500 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:bg-blue-50 transition transform hover:scale-110"
          >
            Start Your Search →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-blue-400 hover:underline font-bold">
            ← Back to Home
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            © 2025 Woof Spots • Made with 🐾 and ❤️ for dogs everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-blue-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-black mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xl font-black mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
          ✓
        </div>
        {title}
      </h4>
      <ul className="space-y-2 ml-10">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-600">
            <span className="text-blue-500 font-bold">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
