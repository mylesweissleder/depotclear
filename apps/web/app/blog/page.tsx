import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
}

const articles: Article[] = [
  {
    id: 'choosing-perfect-daycare',
    title: '10 Tips for Choosing the Perfect Dog Daycare',
    excerpt: 'Not all dog daycares are created equal. Learn what to look for when selecting the best care for your furry friend, from safety protocols to socialization opportunities.',
    category: 'Guide',
    date: 'October 2025',
    readTime: '5 min read',
  },
  {
    id: 'socialization-benefits',
    title: 'The Benefits of Dog Daycare Socialization',
    excerpt: 'Discover how regular daycare attendance can improve your dog\'s social skills, reduce anxiety, and provide essential mental stimulation.',
    category: 'Education',
    date: 'October 2025',
    readTime: '4 min read',
  },
  {
    id: 'first-day-tips',
    title: 'Preparing Your Pup for Their First Day at Daycare',
    excerpt: 'Make your dog\'s first daycare experience smooth and stress-free with these preparation tips from experienced pet care professionals.',
    category: 'Tips',
    date: 'September 2025',
    readTime: '6 min read',
  },
  {
    id: 'dog-behavior-signs',
    title: 'Understanding Your Dog\'s Behavior at Daycare',
    excerpt: 'Learn to read the signs of a happy, well-adjusted dog at daycare versus signs of stress or discomfort that require attention.',
    category: 'Behavior',
    date: 'September 2025',
    readTime: '7 min read',
  },
  {
    id: 'daycare-vs-dog-walker',
    title: 'Dog Daycare vs. Dog Walker: Which is Right for You?',
    excerpt: 'Compare the pros and cons of dog daycare versus hiring a dog walker, and find the best solution for your dog\'s needs and your schedule.',
    category: 'Comparison',
    date: 'August 2025',
    readTime: '5 min read',
  },
  {
    id: 'best-breeds-for-daycare',
    title: 'Best Dog Breeds for Daycare Environments',
    excerpt: 'While any dog can enjoy daycare with proper introduction, some breeds naturally thrive in group play settings. Learn which ones and why.',
    category: 'Breeds',
    date: 'August 2025',
    readTime: '4 min read',
  },
];

export default function BlogPage() {
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
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 backdrop-blur px-6 py-2 rounded-full text-sm font-bold mb-4">
            📚 WOOF SPOTS BLOG
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Dog Care Tips & Guides
          </h1>
          <p className="text-2xl mb-8">
            Expert advice for keeping your pup happy, healthy, and well-cared-for
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden border-4 border-orange-200 hover:border-orange-400"
            >
              {/* Category Badge */}
              <div className="p-6 pb-4">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">
                  {article.category}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-black mb-3 text-gray-900 leading-tight">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Link
                  href={`/blog/${article.id}`}
                  className="inline-block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-3 rounded-2xl font-black shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Get Articles Delivered to Your Inbox</h2>
          <p className="text-xl mb-8">
            Subscribe to our monthly newsletter for dog care tips, featured daycares, and contest updates!
          </p>
          <Link
            href="/#newsletter"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Subscribe Now
          </Link>
        </div>
      </div>

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
