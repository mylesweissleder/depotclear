import Link from 'next/link';
import { Dog, MapPin, Clock, Heart, Star, Users, Camera } from 'lucide-react';

export const metadata = {
  title: 'Dog Daycare Services - Find the Best Daycare Near You | Woof Spots',
  description: 'Find trusted dog daycare services in your area. Compare ratings, read reviews, and discover the perfect daycare for your pup. 5,000+ verified providers nationwide.',
};

export default function DaycarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-orange-500 font-semibold">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Woof Spots
              </h1>
              <p className="text-xs text-orange-600 font-semibold">🐾 Dog Daycare Directory</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              Find the Best Dog Daycare Near You
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Give your pup a day full of play, socialization, and fun. Browse 5,000+ verified daycare centers nationwide.
            </p>
            <Link
              href="/search?service=daycare"
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-orange-300 transition transform hover:scale-110"
            >
              🔍 Find Daycare Near You →
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-16">Why Choose Dog Daycare?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Users className="w-12 h-12 text-orange-500" />}
              title="Socialization"
              description="Let your dog make friends and develop healthy social skills with other pups in a supervised environment."
            />
            <BenefitCard
              icon={<Heart className="w-12 h-12 text-pink-500" />}
              title="Exercise & Play"
              description="Keep your dog active and healthy with hours of supervised play, exercise, and mental stimulation."
            />
            <BenefitCard
              icon={<Clock className="w-12 h-12 text-purple-500" />}
              title="Peace of Mind"
              description="Work worry-free knowing your pup is safe, happy, and getting professional care and attention."
            />
            <BenefitCard
              icon={<Camera className="w-12 h-12 text-blue-500" />}
              title="Photo Updates"
              description="Many daycares offer webcams and photo updates so you can check in on your furry friend throughout the day."
            />
            <BenefitCard
              icon={<Star className="w-12 h-12 text-yellow-500" />}
              title="Trained Staff"
              description="Professional staff trained in dog behavior, first aid, and creating a safe, fun environment for all dogs."
            />
            <BenefitCard
              icon={<MapPin className="w-12 h-12 text-green-500" />}
              title="Convenient Locations"
              description="Find daycare centers near your home or work with flexible drop-off and pick-up times."
            />
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-12">How to Choose the Right Daycare</h2>
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6">
            <Step
              number="1"
              title="Check Reviews & Ratings"
              description="Read real reviews from other pet parents. Look for consistent positive feedback about staff, cleanliness, and how dogs are treated."
            />
            <Step
              number="2"
              title="Visit the Facility"
              description="Schedule a tour to see the play areas, check cleanliness, meet the staff, and observe how they interact with dogs."
            />
            <Step
              number="3"
              title="Ask About Supervision"
              description="Ensure there's adequate staff-to-dog ratio, dogs are separated by size/temperament, and staff is trained in dog behavior and first aid."
            />
            <Step
              number="4"
              title="Understand Requirements"
              description="Check vaccination requirements, trial day policies, and whether they require a temperament test before admission."
            />
            <Step
              number="5"
              title="Compare Pricing & Packages"
              description="Look at daily rates, weekly packages, and any additional services included like feeding, training, or grooming."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-6">Ready to Find the Perfect Daycare?</h2>
          <p className="text-xl mb-8">Browse thousands of verified daycare centers and read real reviews from pet parents.</p>
          <Link
            href="/search?service=daycare"
            className="inline-block bg-white text-orange-500 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:bg-yellow-50 transition transform hover:scale-110"
          >
            Start Your Search →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-orange-400 hover:underline font-bold">
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
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-orange-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-black mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xl">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-black mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
