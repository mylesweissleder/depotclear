'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Trophy, Share2, Heart, AlertCircle, Upload, X } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';

export default function ContestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [voterEmail, setVoterEmail] = useState('');
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [votedEntries, setVotedEntries] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'goofiest-face', name: '🤪 Goofiest Face', description: 'Most ridiculous dog face', image: 'https://images.dog.ceo/breeds/bulldog-french/n02108915_1866.jpg' },
    { id: 'biggest-derp', name: '🥴 Biggest Derp', description: 'Ultimate derp moment captured', image: 'https://images.dog.ceo/breeds/husky/n02110185_1511.jpg' },
    { id: 'worst-haircut', name: '✂️ Worst Haircut', description: 'Grooming disaster hall of fame', image: 'https://images.dog.ceo/breeds/poodle-standard/n02113799_4261.jpg' },
    { id: 'funniest-fail', name: '😂 Epic Fail', description: 'Dogs being hilariously clumsy', image: 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_8415.jpg' },
    { id: 'most-dramatic', name: '🎭 Drama Queen/King', description: 'Overreacting to everything', image: 'https://images.dog.ceo/breeds/chihuahua/n02085620_3407.jpg' },
    { id: 'worst-sleeper', name: '😴 Weirdest Sleep', description: 'How is that even comfortable?', image: 'https://images.dog.ceo/breeds/setter-english/n02100735_4657.jpg' },
    { id: 'ai-dog', name: '🤖 AI Dog', description: 'Best AI-generated dog (AI ONLY!)', image: 'https://images.dog.ceo/breeds/shiba/shiba-13.jpg' },
  ];

  // Handle vote button click
  const handleVoteClick = (entry: any) => {
    setSelectedEntry(entry);
    setShowVoteModal(true);
  };

  // Submit vote
  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEntry || !voterEmail) return;

    try {
      const res = await fetch('/api/contest/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedEntry.id,
          voterEmail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Update vote count locally
        setVoteCounts(prev => ({
          ...prev,
          [selectedEntry.id]: data.votes
        }));

        // Mark as voted
        setVotedEntries(prev => new Set([...prev, selectedEntry.id]));

        // Store email in localStorage
        localStorage.setItem('voterEmail', voterEmail);

        alert(data.message);
        setShowVoteModal(false);
        setVoterEmail('');
      } else {
        alert(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  // Share entry
  const handleShare = (entry: any) => {
    const url = `${window.location.origin}/contest/${entry.id}`;
    const text = `Vote for ${entry.pupName}! ${entry.caption}`;

    if (navigator.share) {
      navigator.share({
        title: `Vote for ${entry.pupName}!`,
        text,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Sample submissions to seed the contest
  const sampleSubmissions = [
    { id: 1, pupName: 'Maximus', category: 'goofiest-face', votes: 234, image: 'https://images.dog.ceo/breeds/pug/n02110958_14790.jpg', caption: 'My face when I hear the treat bag open' },
    { id: 2, pupName: 'Bella', category: 'biggest-derp', votes: 189, image: 'https://images.dog.ceo/breeds/shihtzu/n02086240_5830.jpg', caption: 'Tongue stuck mid-blink' },
    { id: 3, pupName: 'Charlie', category: 'worst-haircut', votes: 156, image: 'https://images.dog.ceo/breeds/poodle-toy/n02113624_1885.jpg', caption: 'The groomer said "trust me"...' },
    { id: 4, pupName: 'Luna', category: 'funniest-fail', votes: 278, image: 'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg', caption: 'Tried to jump, became a pancake' },
    { id: 5, pupName: 'Cooper', category: 'most-dramatic', votes: 201, image: 'https://images.dog.ceo/breeds/spaniel-cocker/n02102318_4843.jpg', caption: 'When you say NO to second breakfast' },
    { id: 6, pupName: 'Daisy', category: 'worst-sleeper', votes: 167, image: 'https://images.dog.ceo/breeds/beagle/n02088364_11843.jpg', caption: 'Upside down, half off the couch, living my best life' },
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

      {/* Current Entries */}
      <section className="py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">🏆 Contest Entries</h2>
            <p className="text-xl text-gray-600">Vote for your favorite ridiculous pups!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sampleSubmissions.map((entry) => (
              <div key={entry.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={entry.image}
                    alt={entry.pupName}
                    className="w-full h-full object-cover"
                  />
                  {/* Dog name badge - big, bold, and fun - positioned top-left to avoid covering dog */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-2xl shadow-2xl transform -rotate-2">
                      <h3 className="text-3xl font-black text-white drop-shadow-lg">
                        {entry.pupName}
                      </h3>
                    </div>
                  </div>
                  {/* Category badge - positioned bottom-right */}
                  <div className="absolute bottom-6 right-6">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                      <p className="text-sm font-bold text-purple-600">
                        {categories.find(c => c.id === entry.category)?.name || entry.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-lg mb-4 italic">"{entry.caption}"</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl">❤️</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {voteCounts[entry.id] !== undefined ? voteCounts[entry.id] : entry.votes}
                      </span>
                      <span className="text-gray-500">votes</span>
                    </div>

                    <button
                      onClick={() => handleShare(entry)}
                      className="text-gray-500 hover:text-purple-600 transition"
                      title="Share"
                    >
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleVoteClick(entry)}
                    disabled={votedEntries.has(entry.id)}
                    className={`w-full py-3 rounded-xl font-bold transition ${
                      votedEntries.has(entry.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {votedEntries.has(entry.id) ? '✓ Voted!' : '❤️ Vote'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:shadow-orange-300 transition transform hover:scale-110"
            >
              📸 Add Your Pup to the Contest!
            </button>
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

      {showVoteModal && (
        <VoteModal
          entry={selectedEntry}
          onClose={() => {
            setShowVoteModal(false);
            setSelectedEntry(null);
          }}
          onSubmit={handleVoteSubmit}
          voterEmail={voterEmail}
          setVoterEmail={setVoterEmail}
        />
      )}
    </div>
  );
}

function CategoryCard({ id, name, description, image, onClick }: any) {
  const handleClick = () => {
    // Set the category filter
    onClick();
    // Scroll to entries section
    const entriesSection = document.querySelector('#contest-entries');
    if (entriesSection) {
      entriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-4 border-transparent hover:border-purple-300 cursor-pointer"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <div className="p-8">
        <h3 className="text-4xl font-black mb-3">{name}</h3>
        <p className="text-gray-600 text-lg mb-4">{description}</p>
        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
        >
          View Entries →
        </button>
      </div>
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'goofiest-face', label: '🤪 Goofiest Face (Real Photos Only)' },
    { value: 'biggest-derp', label: '🥴 Biggest Derp (Real Photos Only)' },
    { value: 'worst-haircut', label: '✂️ Worst Haircut (Real Photos Only)' },
    { value: 'funniest-fail', label: '😂 Epic Fail (Real Photos Only)' },
    { value: 'most-dramatic', label: '🎭 Drama Queen/King (Real Photos Only)' },
    { value: 'worst-sleeper', label: '😴 Weirdest Sleep (Real Photos Only)' },
    { value: 'ai-dog', label: '🤖 AI Dog (AI-Generated ONLY!)' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const { startUpload } = useUploadThing("contestImage");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please select a photo to upload');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload photo using Uploadthing
      const uploadResult = await startUpload([selectedFile]);

      if (!uploadResult || uploadResult.length === 0) {
        throw new Error('Failed to upload photo');
      }

      const photoUrl = uploadResult[0].url;

      // 2. Submit contest entry
      const submitRes = await fetch('/api/contest/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photoUrl,
        }),
      });

      if (!submitRes.ok) {
        const submitError = await submitRes.json();
        throw new Error(submitError.error || 'Failed to submit entry');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
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

          <div>
            <label className="block font-bold mb-2">Photo * {previewUrl && '✅'}</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
              required
            />
            <label
              htmlFor="photo-upload"
              className="block border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer"
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <p className="text-purple-600 font-bold">Click to change photo</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-bold text-lg mb-2">Upload Photo</p>
                  <p className="text-gray-600 text-sm">Click to browse or drag and drop</p>
                  <p className="text-gray-500 text-xs mt-2">Max file size: 10MB • JPG, PNG, GIF, WebP</p>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-700">
              <strong>Success!</strong> Your submission has been received and will be reviewed within 24 hours. 🎉
            </div>
          )}

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <strong>By submitting:</strong> You confirm you own this photo and grant Woof Houses rights to display it on our website and social media. See full contest rules above.
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading || success}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {uploading ? 'Uploading... 🚀' : success ? 'Submitted! ✅' : 'Submit Entry 🎉'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Vote Modal Component
function VoteModal({ entry, onClose, onSubmit, voterEmail, setVoterEmail }: any) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-4xl font-black mb-2">Vote for {entry.pupName}! ❤️</h2>
          <p className="text-gray-600">Enter your email to cast your vote</p>
        </div>

        <div className="mb-6">
          <img
            src={entry.image}
            alt={entry.pupName}
            className="w-full h-48 object-cover rounded-2xl"
          />
          <p className="text-gray-700 italic mt-4">"{entry.caption}"</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Your Email *</label>
            <input
              type="email"
              required
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
              placeholder="you@example.com"
            />
            <p className="text-sm text-gray-500 mt-2">
              We'll only use this to prevent duplicate votes. One vote per dog per email.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Cast Your Vote! 🗳️
          </button>
        </form>
      </div>
    </div>
  );
}
