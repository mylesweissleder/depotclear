'use client';

import { useState, useEffect } from 'react';
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
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'goofiest-face', name: '🤪 Goofiest Face', description: 'Most ridiculous dog face', image: 'https://images.dog.ceo/breeds/bulldog-french/n02108915_1866.jpg' },
    { id: 'biggest-derp', name: '🥴 Biggest Derp', description: 'Ultimate derp moment captured', image: 'https://images.dog.ceo/breeds/husky/n02110185_1511.jpg' },
    { id: 'worst-haircut', name: '✂️ Worst Haircut', description: 'Grooming disaster hall of fame', image: 'https://images.dog.ceo/breeds/poodle-standard/n02113799_4261.jpg' },
    { id: 'funniest-fail', name: '😂 Epic Fail', description: 'Dogs being hilariously clumsy', image: 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_8415.jpg' },
    { id: 'most-dramatic', name: '🎭 Drama Queen/King', description: 'Overreacting to everything', image: 'https://images.dog.ceo/breeds/chihuahua/n02085620_3407.jpg' },
    { id: 'worst-sleeper', name: '😴 Weirdest Sleep', description: 'How is that even comfortable?', image: 'https://images.dog.ceo/breeds/setter-english/n02100735_4657.jpg' },
    { id: 'ai-dog', name: '🤖 AI Dog', description: 'Best AI-generated dog (AI ONLY!)', image: 'https://images.dog.ceo/breeds/shiba/shiba-13.jpg' },
  ];

  // Fetch entries from database
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/contest/entries?category=${selectedCategory}`);
        const data = await res.json();

        if (data.success) {
          setEntries(data.data);
        } else {
          console.error('Failed to fetch entries:', data.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedCategory]);

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
    const text = `Vote for ${entry.pup_name}! ${entry.caption}`;

    if (navigator.share) {
      navigator.share({
        title: `Vote for ${entry.pup_name}!`,
        text,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Filter entries by category
  const filteredEntries = selectedCategory === 'all'
    ? entries
    : entries.filter(e => e.category === selectedCategory);

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
              <span className="font-black text-xl">Woof Spots Contest</span>
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

          <p className="text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            Submit your dog's most embarrassing, hilarious, or just plain weird photo.
          </p>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-2xl px-8 py-4 inline-block mb-8 shadow-2xl transform -rotate-1">
            <p className="text-xl font-black">
              🗳️ Everyone votes • Top 3 dogs win cash • One grand prize across ALL categories!
            </p>
          </div>

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
            <h3 className="text-3xl font-black mb-4">🎁 Monthly Prizes</h3>
            <p className="text-lg text-purple-600 font-bold mb-6">
              Winners selected across ALL categories combined!
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <PrizeCard place="1st" prize="$500" color="from-yellow-400 to-orange-500" emoji="🥇" />
              <PrizeCard place="2nd" prize="$250" color="from-gray-300 to-gray-400" emoji="🥈" />
              <PrizeCard place="3rd" prize="$100" color="from-orange-400 to-yellow-700" emoji="🥉" />
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              Plus: Top 10 get featured on our homepage & social media! 📣
            </p>
            <div className="mt-4 bg-purple-50 rounded-xl p-4 text-sm text-gray-700">
              <strong>How winners are chosen:</strong> The 3 dogs with the most votes across ALL categories win. All entries compete together!
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">Choose Your Category 🏆</h2>
            <p className="text-xl text-gray-600">Pick the category that best fits your pup's brand of chaos</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  const entriesSection = document.querySelector('#contest-entries');
                  if (entriesSection) {
                    entriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:scale-105"
              >
                🌟 View All Entries
              </button>
            </div>
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
      <section id="contest-entries" className="py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">🏆 Contest Entries</h2>
            <p className="text-xl text-gray-600">Vote for your favorite ridiculous pups!</p>
            {selectedCategory !== 'all' ? (
              <div className="mt-4">
                <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg">
                  <p className="text-lg font-bold text-purple-600">
                    Showing: {categories.find(c => c.id === selectedCategory)?.name}
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-purple-600 hover:text-purple-700 font-bold underline"
                  >
                    ← View All Categories
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-700 mt-2 font-semibold">
                Showing all entries across all categories
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading entries...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <p className="text-2xl text-gray-600 mb-4">No entries yet for this category!</p>
              <p className="text-lg text-gray-500">Be the first to submit!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={entry.photo_url}
                        alt={entry.pup_name}
                        className="w-full h-full object-cover"
                      />
                      {/* Dog name badge - big, bold, and fun - positioned top-left to avoid covering dog */}
                      <div className="absolute top-6 left-6">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-2xl shadow-2xl transform -rotate-2">
                          <h3 className="text-3xl font-black text-white drop-shadow-lg">
                            {entry.pup_name}
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
            </>
          )}
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
              description="Upload your dog's most ridiculous moment in any category"
            />
            <StepCard
              number="2"
              emoji="🗳️"
              title="Get Votes"
              description="People vote by entering their email - one vote per email!"
            />
            <StepCard
              number="3"
              emoji="🏆"
              title="Win Prizes"
              description="Top 3 dogs overall (across all categories) win cash!"
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
                <span className="text-2xl">🚫</span>
                <span><strong>Gmail + trick blocked</strong> - user+1@gmail.com and user+2@gmail.com count as the same email (dots are also ignored)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <span><strong>No disposable emails</strong> - Temporary/throwaway email services are blocked</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>IP tracking</strong> - Suspicious voting patterns will be flagged</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span><strong>Rate limiting</strong> - Maximum 10 votes per IP per hour</span>
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
              <li className="text-blue-600">• <strong>Newsletter:</strong> By voting or submitting, you'll receive monthly newsletters featuring contest entries, winners, and featured daycares (unsubscribe anytime)</li>
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
    city: '',
    state: '',
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">City (Optional)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                placeholder="San Francisco"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">State (Optional)</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
              >
                <option value="">Select state...</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
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
              <strong>By submitting:</strong> You confirm you own this photo and grant Woof Spots rights to display it on our website and social media. You'll also receive monthly newsletters featuring contest entries, winners, and featured daycares. Unsubscribe anytime.
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
          <h2 className="text-4xl font-black mb-2">Vote for {entry.pup_name}! ❤️</h2>
          <p className="text-gray-600">Cast your vote to help them win!</p>
        </div>

        <div className="mb-6">
          <img
            src={entry.photo_url}
            alt={entry.pup_name}
            className="w-full h-48 object-cover rounded-2xl"
          />
          <p className="text-gray-700 italic mt-4">"{entry.caption}"</p>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
          <h3 className="font-black text-purple-900 mb-2">🗳️ How Voting Works:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Enter your email to vote</li>
            <li>• One vote per email address per dog</li>
            <li>• Top 3 dogs with most votes win prizes</li>
            <li>• Winners compete across ALL categories</li>
          </ul>
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
            <p className="text-xs text-gray-500 mt-2">
              🔒 By voting, you'll receive monthly newsletters featuring contest entries, winners, and featured daycares. No spam. Unsubscribe anytime.
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
