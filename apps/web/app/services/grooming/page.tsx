import Link from 'next/link';
import { Dog, Scissors, Sparkles, Heart, Star, Droplet } from 'lucide-react';

export const metadata = {
  title: 'Dog Grooming Services - Find Professional Groomers Near You | Woof Spots',
  description: 'Find trusted dog grooming services in your area. Compare prices, read reviews, and book appointments with professional groomers. Bath, haircut, nail trim & more.',
};

export default function GroomingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-pink-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-pink-500 font-semibold">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-3 rounded-2xl shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Woof Spots
              </h1>
              <p className="text-xs text-pink-600 font-semibold">🐾 Dog Grooming Directory</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              Find Professional Dog Groomers Near You
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Keep your pup looking and feeling their best. Find trusted groomers for baths, haircuts, nail trims, and full spa treatments.
            </p>
            <Link
              href="/search?service=grooming"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-pink-300 transition transform hover:scale-110"
            >
              🔍 Find Groomers Near You →
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-16">Common Grooming Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Droplet className="w-12 h-12 text-blue-500" />}
              title="Bath & Blow Dry"
              description="Full bath with premium shampoo, conditioner, blow dry, and brush out. Includes ear cleaning and paw pad trim."
              price="$40-80"
            />
            <ServiceCard
              icon={<Scissors className="w-12 h-12 text-pink-500" />}
              title="Full Haircut"
              description="Complete grooming package with bath, haircut, nail trim, ear cleaning, and anal gland expression."
              price="$60-120"
            />
            <ServiceCard
              icon={<Sparkles className="w-12 h-12 text-purple-500" />}
              title="Nail Trim"
              description="Professional nail trimming and filing to keep your dog's paws healthy and comfortable."
              price="$15-25"
            />
            <ServiceCard
              icon={<Heart className="w-12 h-12 text-red-500" />}
              title="De-Shedding Treatment"
              description="Specialized treatment to remove loose undercoat and reduce shedding. Perfect for heavy shedders."
              price="$30-60"
            />
            <ServiceCard
              icon={<Star className="w-12 h-12 text-yellow-500" />}
              title="Teeth Brushing"
              description="Dental care service to remove plaque and keep your dog's teeth and gums healthy."
              price="$10-20"
            />
            <ServiceCard
              icon={<Dog className="w-12 h-12 text-orange-500" />}
              title="Spa Package"
              description="Premium pampering including bath, haircut, nail trim, teeth brushing, and special treatments."
              price="$80-150"
            />
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-12">How to Choose a Groomer</h2>
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6">
            <Tip
              title="Check Credentials & Experience"
              description="Look for certified groomers with experience handling your dog's breed. Ask about training and how long they've been grooming."
            />
            <Tip
              title="Read Reviews Carefully"
              description="Pay attention to reviews mentioning gentle handling, patience with anxious dogs, and the quality of the finished groom."
            />
            <Tip
              title="Visit the Facility"
              description="Check for cleanliness, safe equipment, and a calm environment. Observe how groomers interact with other dogs."
            />
            <Tip
              title="Discuss Special Needs"
              description="Communicate any health issues, anxieties, or specific grooming requirements before booking. A good groomer will accommodate your dog's needs."
            />
            <Tip
              title="Start with a Basic Service"
              description="If trying a new groomer, start with a simple nail trim or bath to see how your dog responds before committing to a full groom."
            />
            <Tip
              title="Ask About Products Used"
              description="Ensure they use quality, pet-safe products. Ask about options for sensitive skin or allergies."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-6">Ready to Book a Grooming Appointment?</h2>
          <p className="text-xl mb-8">Find professional groomers in your area, compare services, and read reviews from other pet parents.</p>
          <Link
            href="/search?service=grooming"
            className="inline-block bg-white text-pink-500 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:bg-pink-50 transition transform hover:scale-110"
          >
            Start Your Search →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-pink-400 hover:underline font-bold">
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

function ServiceCard({ icon, title, description, price }: { icon: React.ReactNode; title: string; description: string; price: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-pink-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-black mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-pink-600 font-black text-xl">{price}</p>
    </div>
  );
}

function Tip({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        ✓
      </div>
      <div>
        <h4 className="text-xl font-black mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
