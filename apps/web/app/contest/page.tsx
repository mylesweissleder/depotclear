'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Trophy, Share2, Heart, AlertCircle, Upload, X } from 'lucide-react';

export default function ContestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const categories = [
    { id: 'goofiest-face', name: '🤪 Goofiest Face', description: 'Most ridiculous dog face' },
    { id: 'biggest-derp', name: '🥴 Biggest Derp', description: 'Ultimate derp moment captured' },
    { id: 'worst-haircut', name: '✂️ Worst Haircut', description: 'Grooming disaster hall of fame' },
    { id: 'funniest-fail', name: '😂 Epic Fail', description: 'Dogs being hilariously clumsy' },
    { id: 'most-dramatic', name: '🎭 Drama Queen/King', description: 'Overreacting to everything' },
    { id: 'worst-sleeper', name: '😴 Weirdest Sleep', description: 'How is that even comfortable?' },
    { id: 'ai-dog', name: '🤖 AI Dog', description: 'Best AI-generated dog (AI ONLY!)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-purple-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl">Woof Houses Contest</span>
            </Link>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:scale-105"
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Submit Photo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-bounce">🏆</div>
          <div className="absolute top-20 right-20 text-7xl animate-pulse">😂</div>
          <div className="absolute bottom-20 left-20 text-6xl">🐕</div>
          <div className="absolute bottom-10 right-10 text-8xl animate-bounce delay-75">🎉</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
              🎉 MONTHLY CONTEST • WIN $500!
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Dogs Doing
            </span>
            <br />
            <span className="text-gray-900">Ridiculous Things</span>
            <br />
            <span className="text-purple-600">Contest 🐕😂</span>
          </h1>

          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Submit your dog's most embarrassing, hilarious, or just plain weird photo.
            <br />
            <span className="font-bold text-purple-600">Vote for the funniest pup & win prizes!</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:shadow-purple-300 transition transform hover:scale-110"
            >
              📸 Submit Your Pup
            </button>
            <a
              href="#categories"
              className="bg-white border-4 border-purple-500 text-purple-600 px-12 py-5 rounded-full font-black text-xl shadow-xl hover:bg-purple-50 transition transform hover:scale-110"
            >
              🏆 See Contest
            </a>
          </div>

          {/* Prize Section */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border-4 border-purple-200">
            <h3 className="text-3xl font-black mb-6">🎁 Monthly Prizes</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <PrizeCard place="1st" prize="$500" color="from-yellow-400 to-orange-500" emoji="🥇" />
              <PrizeCard place="2nd" prize="$250" color="from-gray-300 to-gray-400" emoji="🥈" />
              <PrizeCard place="3rd" prize="$100" color="from-orange-400 to-yellow-700" emoji="🥉" />
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              Plus: Top 10 get featured on our homepage & social media! 📣
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">Choose Your Category 🏆</h2>
            <p className="text-xl text-gray-600">Pick the category that best fits your pup's brand of chaos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">How It Works 🎯</h2>
            <p className="text-xl text-gray-600">Four simple steps to internet fame for your pup!</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              emoji="📸"
              title="Submit Photo"
              description="Upload your dog's most ridiculous moment"
            />
            <StepCard
              number="2"
              emoji="🗳️"
              title="Get Votes"
              description="Share with friends & family to collect votes"
            />
            <StepCard
              number="3"
              emoji="🏆"
              title="Win Prizes"
              description="Top 3 in each category win cash!"
            />
            <StepCard
              number="4"
              emoji="🎉"
              title="Get Famous"
              description="Featured on homepage & social media!"
            />
          </div>
        </div>
      </section>

      {/* Rules & Anti-Cheating */}
      <section className="py-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black mb-8 text-center">Contest Rules 📋</h2>

          <div className="bg-white text-gray-900 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              Voting Rules (No Cheating!)
            </h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>One vote per email</strong> - Email verification required to vote</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>IP tracking</strong> - Suspicious voting patterns will be flagged</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>Browser fingerprinting</strong> - VPNs and bot votes detected & removed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>Vote weight system</strong> - Suspicious votes count less or are removed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✗</span>
                <span className="text-red-600"><strong>Cheating = Disqualification</strong> - Automated voting, bots, or gaming will result in removal</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 text-gray-900 rounded-3xl p-8">
            <h3 className="text-2xl font-black mb-4">General Contest Rules</h3>
            <ul className="space-y-2">
              <li>• Photo must be of a dog (obviously)</li>
              <li>• Photo must be appropriate (no violence, nudity, etc.)</li>
              <li>• You must be the dog's owner or have permission</li>
              <li className="text-red-600 font-bold">• <strong>NO AI-GENERATED IMAGES</strong> in non-AI categories (AI Dog category only!)</li>
              <li className="text-green-600 font-bold">• <strong>AI Dog category:</strong> ONLY AI-generated images allowed (MidJourney, DALL-E, Stable Diffusion, etc.)</li>
              <li>• One submission per dog per category</li>
              <li>• Contest runs monthly (1st-last day of month)</li>
              <li>• Winners announced first Monday of following month</li>
              <li>• Prizes paid via PayPal, Venmo, or check</li>
              <li>• By submitting, you grant us rights to share your photo on social media</li>
              <li className="text-red-600">• <strong>Disqualification:</strong> AI images in non-AI categories will be removed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Submit Modal */}
      {showSubmitModal && (
        <SubmitPhotoModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}

function CategoryCard({ id, name, description, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-transparent hover:border-purple-300 cursor-pointer"
    >
      <h3 className="text-4xl font-black mb-3">{name}</h3>
      <p className="text-gray-600 text-lg mb-4">{description}</p>
      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
        View Entries →
      </button>
    </div>
  );
}

function PrizeCard({ place, prize, color, emoji }: any) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-2">{emoji}</div>
      <div className={`text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
        {prize}
      </div>
      <div className="text-gray-600 font-bold">{place} Place</div>
    </div>
  );
}

function StepCard({ number, emoji, title, description }: any) {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 text-4xl animate-bounce">{emoji}</div>
      </div>
      <h4 className="text-2xl font-black mb-2">{title}</h4>
      <p className="text-gray-600 font-medium">{description}</p>
    </div>
  );
}

function SubmitPhotoModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    pupName: '',
    ownerName: '',
    ownerEmail: '',
    category: 'goofiest-face',
    caption: '',
    daycareName: '',
  });

  const categories = [
    { value: 'goofiest-face', label: '🤪 Goofiest Face (Real Photos Only)' },
    { value: 'biggest-derp', label: '🥴 Biggest Derp (Real Photos Only)' },
    { value: 'worst-haircut', label: '✂️ Worst Haircut (Real Photos Only)' },
    { value: 'funniest-fail', label: '😂 Epic Fail (Real Photos Only)' },
    { value: 'most-dramatic', label: '🎭 Drama Queen/King (Real Photos Only)' },
    { value: 'worst-sleeper', label: '😴 Weirdest Sleep (Real Photos Only)' },
    { value: 'ai-dog', label: '🤖 AI Dog (AI-Generated ONLY!)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement photo upload and submission
    alert('Photo submission will be implemented!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-4xl font-black mb-2">Submit Your Pup! 📸</h2>
        <p className="text-gray-600 mb-6">Upload your dog's most ridiculous moment and compete for prizes!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Dog's Name *</label>
            <input
              type="text"
              required
              value={formData.pupName}
              onChange={(e) => setFormData({ ...formData, pupName: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
              placeholder="Max"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Your Email *</label>
              <input
                type="email"
                required
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Photo Caption *</label>
            <textarea
              required
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
              rows={3}
              placeholder="Describe the hilarious moment captured in this photo..."
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Dog Daycare (Optional)</label>
            <input
              type="text"
              value={formData.daycareName}
              onChange={(e) => setFormData({ ...formData, daycareName: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
              placeholder="Where does your pup go to daycare?"
            />
          </div>

          <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-bold text-lg mb-2">Upload Photo</p>
            <p className="text-gray-600 text-sm">Click to browse or drag and drop</p>
            <p className="text-gray-500 text-xs mt-2">Max file size: 10MB • JPG, PNG, GIF</p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <strong>By submitting:</strong> You confirm you own this photo and grant Woof Houses rights to display it on our website and social media. See full contest rules above.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Submit Entry 🎉
          </button>
        </form>
      </div>
    </div>
  );
}
