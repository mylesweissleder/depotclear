import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Image
            src="/woofspotslogo.png"
            alt="Woof Spots"
            width={120}
            height={120}
            className="mx-auto drop-shadow-2xl mb-6"
          />
          <h1 className="text-5xl md:text-6xl font-black mb-6">About Woof Spots</h1>
          <p className="text-2xl text-gray-600 mb-4">
            Built with love, inspired by two amazing pups
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-black mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Woof Spots exists to help pet parents find the perfect dog daycare for their furry family members.
            We believe every dog deserves safe, fun, and enriching care while their humans are away. Our
            comprehensive directory makes it easy to discover, compare, and connect with trusted dog care
            facilities across the country.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you're looking for daycare, boarding, grooming, or training, we're here to help you
            find the right fit for your pup's unique personality and needs.
          </p>
        </div>

        {/* The Inspiration */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border-4 border-purple-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-black text-lg mb-4">
              <Heart className="w-6 h-6 fill-white" />
              <span>The Inspiration</span>
            </div>
            <h2 className="text-4xl font-black mb-4">Pico & Twyla</h2>
            <p className="text-xl text-gray-700 italic">
              The amazing pups behind Woof Spots
            </p>
          </div>

          {/* Dog Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Pico */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                <Image
                  src="/pico.jpg"
                  alt="Pico"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-black mb-2 text-center">Pico</h3>
              <p className="text-gray-600 text-center">
                A gentle soul with an enormous heart
              </p>
            </div>

            {/* Twyla */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                <Image
                  src="/twyla.png"
                  alt="Twyla"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-black mb-2 text-center">Twyla</h3>
              <p className="text-gray-600 text-center">
                Full of energy, love, and endless joy
              </p>
            </div>
          </div>

          <div className="bg-white/50 rounded-2xl p-6 text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              This project was inspired by two incredible dogs who brought immeasurable joy and love into
              the lives of their family. Pico and Twyla are more than pets—they are family members,
              best friends, and constant companions.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              In loving memory of Pico, whose gentle spirit and enormous heart inspired us to create something
              meaningful. Twyla continues to bring endless energy, love, and joy, reminding us every day why
              quality care matters so much.
            </p>
            <p className="text-xl font-black text-purple-600">
              Pico forever in our hearts. Twyla forever inspiring us to help other pups thrive.
            </p>
          </div>
        </div>

        {/* How It Started */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-black mb-6 text-center">How It Started</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Woof Spots began as a simple idea: make it easier for pet parents to find trustworthy dog care.
            As dog owners ourselves, we understood the challenges of finding the right daycare—one that
            treats your dog like family, provides plenty of play and socialization, and gives you peace
            of mind while you're at work or away.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Today, we're proud to offer the most comprehensive directory of dog daycares, with thousands
            of listings across the United States, complete with reviews, ratings, and detailed information
            to help you make the best choice for your furry friend.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Join the Woof Spots Community</h2>
          <p className="text-xl mb-8">
            Help other pet parents find the perfect care for their pups
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/claim"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              List Your Business
            </Link>
            <Link
              href="/"
              className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Find a Daycare
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-700 text-white py-12 border-t-4 border-orange-500 mt-16">
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
              <a href="/#for-businesses" className="text-gray-400 hover:text-orange-400 transition">
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
