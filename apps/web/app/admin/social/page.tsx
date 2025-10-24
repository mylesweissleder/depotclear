'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Instagram, Facebook, Twitter, MessageCircle, TrendingUp, Award, MapPin, LogOut } from 'lucide-react';

interface ContestPhoto {
  id: number;
  pup_name: string;
  photo_url: string;
  caption: string;
  category: string;
  votes: number;
  city?: string;
  state?: string;
}

interface PremiumDaycare {
  id: number;
  name: string;
  city: string;
  rating: number;
  review_count: number;
  website?: string;
}

interface PostContent {
  reddit: string;
  twitter: string;
  instagram: string;
  facebook: string;
}

export default function SocialMediaAdmin() {
  const router = useRouter();
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [availablePhotos, setAvailablePhotos] = useState<ContestPhoto[]>([]);
  const [premiumDaycares, setPremiumDaycares] = useState<PremiumDaycare[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const [postType, setPostType] = useState<'contest' | 'winner' | 'daycare' | 'news'>('contest');
  const [targetCity, setTargetCity] = useState('');
  const [targetState, setTargetState] = useState('CA');
  const [generatedContent, setGeneratedContent] = useState<PostContent>({
    reddit: '',
    twitter: '',
    instagram: '',
    facebook: '',
  });

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  // Load data after authentication
  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
      } else {
        router.push('/admin/login?returnTo=/admin/social');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login?returnTo=/admin/social');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load top contest photos
      const photosRes = await fetch('/api/contest/entries?category=all');
      const photosData = await photosRes.json();
      if (photosData.success) {
        const sorted = photosData.data.sort((a: ContestPhoto, b: ContestPhoto) => b.votes - a.votes);
        setAvailablePhotos(sorted.slice(0, 20));
        if (sorted.length > 0) {
          setSelectedPhotos([sorted[0].id]); // Auto-select top photo
        }
      }

      // Load premium daycares
      const daycaresRes = await fetch('/api/daycares?limit=50');
      const daycaresData = await daycaresRes.json();
      if (daycaresData.success) {
        const premium = daycaresData.data
          .filter((d: PremiumDaycare) => d.rating >= 4.5 && d.website)
          .slice(0, 10);
        setPremiumDaycares(premium);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = () => {
    const selectedPhotoData = availablePhotos.filter(p => selectedPhotos.includes(p.id));

    if (postType === 'contest') {
      generateContestPost(selectedPhotoData);
    } else if (postType === 'winner') {
      generateWinnerPost(selectedPhotoData);
    } else if (postType === 'daycare') {
      generateDaycarePost();
    }
  };

  const generateContestPost = (photos: ContestPhoto[]) => {
    const photo = photos[0];
    if (!photo) return;

    const cityTag = targetCity ? ` in ${targetCity}` : '';
    const stateTag = targetState ? `, ${targetState}` : '';
    const location = targetCity || targetState ? `${cityTag}${stateTag}` : '';

    // Reddit - detailed, engaging, community-focused
    const reddit = `🐕 Dogs Doing Ridiculous Things Contest${location}!

Meet ${photo.pup_name}! "${photo.caption}"

We're running a monthly photo contest and ${photo.pup_name} is currently leading the pack with ${photo.votes} votes! 😂

**How to enter:**
1. Upload your dog's funniest photo at woofspots.com/contest
2. Share with friends to get votes
3. Win $500 cash prize! 💰

**Categories:**
- Goofiest Face 🤪
- Biggest Derp 🥴
- Worst Haircut ✂️
- Epic Fail 😂
- And more!

**Prizes:**
- 🥇 1st Place: $500
- 🥈 2nd Place: $250
- 🥉 3rd Place: $100

Top 10 get featured on our homepage + social media!

**No entry fee. 100% free to enter and vote.**

👉 woofspots.com/contest

[Photo: ${photo.photo_url}]`;

    // Twitter/X - concise, punchy, hashtags
    const twitter = `🐕 ${photo.pup_name} is KILLING IT in our Dogs Doing Ridiculous Things Contest!

"${photo.caption.substring(0, 80)}${photo.caption.length > 80 ? '...' : ''}"

${photo.votes} votes and counting! 🏆

💰 Win $500 cash
📸 Upload your pup
🗳️ Vote now

woofspots.com/contest

#DogContest #FunnyDogs #DogPhotography${location ? ` #${targetCity?.replace(/\s/g, '')}Dogs` : ''}`;

    // Instagram - visual-first, emoji-heavy, story-driven
    const instagram = `🐕💕 MEET ${photo.pup_name.toUpperCase()}!

"${photo.caption}" 😂

${photo.pup_name} is competing in our Dogs Doing Ridiculous Things Contest and has ${photo.votes} votes! Can you beat it? 🏆

💰 WIN $500 CASH! 💰
Plus $250 for 2nd, $100 for 3rd

📸 HOW TO ENTER:
1️⃣ Go to link in bio (woofspots.com/contest)
2️⃣ Upload your dog's funniest photo
3️⃣ Share to get votes!

🏆 CATEGORIES:
🤪 Goofiest Face
🥴 Biggest Derp
✂️ Worst Haircut
😂 Epic Fail
🎭 Drama Queen/King
😴 Weirdest Sleep
🤖 AI Dog

✨ 100% FREE to enter!
✨ Contest ends end of month!

#DogsDoingRidiculousThings #DogContest #FunnyDogs #DogPhotography #DogsOfInstagram #ContestAlert #WinCash #DogLovers${location ? ` #${targetCity?.replace(/\s/g, '')}Dogs #${targetState}Dogs` : ''}`;

    // Facebook - friendly, detailed, community-oriented
    const facebook = `🐶 Dogs Doing Ridiculous Things Contest${location}! 🏆

Check out ${photo.pup_name}! "${photo.caption}" 😂

${photo.pup_name} has ${photo.votes} votes and is in the running to win $500! Think your pup is funnier? Enter now!

💰 MONTHLY PRIZES:
🥇 1st Place: $500
🥈 2nd Place: $250
🥉 3rd Place: $100

📸 HOW TO ENTER (FREE!):
1. Visit woofspots.com/contest
2. Upload your dog's most hilarious photo
3. Choose a category (Goofiest Face, Biggest Derp, Worst Haircut, Epic Fail, etc.)
4. Share with friends to get votes!

🗳️ VOTING:
- One vote per email
- No spam, no bots (we have anti-cheating measures!)
- Everyone can vote, even if you didn't enter

🎁 BONUS: Top 10 get featured on our homepage and across our social media!

Contest runs monthly. Current contest ends [end of month]. New contest starts [1st of next month].

👉 Enter now: woofspots.com/contest

[Attach photo: ${photo.photo_url}]

#DogContest #FunnyDogs #DogPhotography #ContestAlert #Win${targetCity ? ` #${targetCity?.replace(/\s/g, '')}` : ''}${targetState ? ` #${targetState}` : ''}`;

    setGeneratedContent({ reddit, twitter, instagram, facebook });
  };

  const generateWinnerPost = (photos: ContestPhoto[]) => {
    const winner = photos[0];
    if (!winner) return;

    const reddit = `🏆 CONTEST WINNER ANNOUNCEMENT! 🏆

Congratulations to ${winner.pup_name} for winning our Dogs Doing Ridiculous Things Contest!

"${winner.caption}"

${winner.pup_name} earned ${winner.votes} votes and takes home $500! 🎉💰

**Next contest starts NOW!**

Enter your pup at woofspots.com/contest

Same great prizes:
- 🥇 $500 for 1st
- 🥈 $250 for 2nd
- 🥉 $100 for 3rd

Free to enter. Voting open all month!

[Photo: ${winner.photo_url}]`;

    const twitter = `🏆 WINNER ALERT!

${winner.pup_name} wins $500 in our Dogs Doing Ridiculous Things Contest!

${winner.votes} votes 🔥

"${winner.caption.substring(0, 100)}"

Next contest OPEN NOW 👉 woofspots.com/contest

#DogContest #Winner #FunnyDogs`;

    const instagram = `🎉 CONTEST WINNER! 🎉

${winner.pup_name.toUpperCase()} WINS $500! 💰

"${winner.caption}" 😂

With ${winner.votes} incredible votes, ${winner.pup_name} takes 1st place! 🏆

🚨 NEW CONTEST STARTS NOW! 🚨

Think your pup can win? Enter at link in bio!

📸 woofspots.com/contest

#ContestWinner #DogsOfInstagram #FunnyDogs #DogContest #WinnerAnnouncement`;

    const facebook = `🏆 WINNER ANNOUNCEMENT! 🏆

Congratulations to ${winner.pup_name} for winning our Dogs Doing Ridiculous Things Contest!

"${winner.caption}" 😂

${winner.pup_name} crushed it with ${winner.votes} votes and wins $500 CASH! 🎉💰

Thank you to everyone who entered and voted. The competition was fierce!

🚨 NEXT CONTEST IS NOW OPEN! 🚨

Enter your pup for a chance to win:
🥇 $500 (1st Place)
🥈 $250 (2nd Place)
🥉 $100 (3rd Place)

👉 woofspots.com/contest

Free to enter. Contest runs all month. Vote for your favorites!

[Photo: ${winner.photo_url}]

#DogContest #Winner #FunnyDogs`;

    setGeneratedContent({ reddit, twitter, instagram, facebook });
  };

  const generateDaycarePost = () => {
    const featured = premiumDaycares.slice(0, 3);

    const daycareList = featured.map(d =>
      `- ${d.name} (${d.city}) - ⭐ ${d.rating}/5 (${d.review_count} reviews)`
    ).join('\n');

    const reddit = `🐕 Top-Rated Dog Daycares${targetCity ? ` in ${targetCity}` : ''}

Looking for the perfect daycare for your pup? Here are some highly-rated options:

${daycareList}

**All verified with:**
✓ Real Google reviews
✓ Verified business info
✓ Direct website links
✓ Contact information

Find more daycares at woofspots.com

💡 Business owners: Claim your free listing to get discovered by pet parents!`;

    const twitter = `🐕 Top Dog Daycares${targetCity ? ` in ${targetCity}` : ''}:

${featured.map(d => `⭐ ${d.name} - ${d.rating}/5`).join('\n')}

Find the perfect spot for your pup 👉 woofspots.com

#DogDaycare #DogCare${targetCity ? ` #${targetCity?.replace(/\s/g, '')}` : ''}`;

    const instagram = `🐕 BEST DOG DAYCARES${targetCity ? ` IN ${targetCity.toUpperCase()}` : ''}! 🏆

Looking for top-rated care for your pup?

${featured.map((d, i) => `${i + 1}. ${d.name}\n⭐ ${d.rating}/5 (${d.review_count} reviews)`).join('\n\n')}

📍 Find more at link in bio
👉 woofspots.com

#DogDaycare #DogCare #DogsOfInstagram${targetCity ? ` #${targetCity?.replace(/\s/g, '')}Dogs` : ''}`;

    const facebook = `🐕 Top-Rated Dog Daycares${targetCity ? ` in ${targetCity}` : ''}! 🌟

${daycareList}

📍 Visit woofspots.com to:
✓ Browse 1000+ verified daycares
✓ Read real Google reviews
✓ Compare ratings & services
✓ Contact directly

💼 Business owners: List your daycare FREE!

#DogDaycare #DogCare${targetCity ? ` #${targetCity?.replace(/\s/g, '')}` : ''}`;

    setGeneratedContent({ reddit, twitter, instagram, facebook });
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Social Media Manager</h1>
            <p className="text-gray-600">Generate viral content for Reddit, Twitter, Instagram, and Facebook</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Content Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setPostType('contest')}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    postType === 'contest'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📸 Contest Invite
                </button>
                <button
                  onClick={() => setPostType('winner')}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    postType === 'winner'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏆 Winner
                </button>
                <button
                  onClick={() => setPostType('daycare')}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    postType === 'daycare'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏠 Daycare
                </button>
                <button
                  onClick={() => setPostType('news')}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    postType === 'news'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled
                >
                  📰 News
                </button>
              </div>
            </div>

            {/* Target Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Target Location (for Reddit)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">City</label>
                  <input
                    type="text"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                    placeholder="San Francisco"
                  />
                  <p className="text-xs text-gray-500 mt-1">For r/sanfrancisco, r/bayarea, etc.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">State</label>
                  <select
                    value={targetState}
                    onChange={(e) => setTargetState(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="WA">Washington</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Selection */}
            {(postType === 'contest' || postType === 'winner') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Select Featured Photo</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {availablePhotos.slice(0, 12).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhotos([photo.id])}
                      className={`cursor-pointer rounded-lg overflow-hidden border-4 transition ${
                        selectedPhotos.includes(photo.id)
                          ? 'border-orange-500 ring-2 ring-orange-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={photo.photo_url} alt={photo.pup_name} className="w-full h-32 object-cover" />
                      <div className="p-2 bg-white">
                        <p className="font-bold text-sm truncate">{photo.pup_name}</p>
                        <p className="text-xs text-gray-600">{photo.votes} votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateContent}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-black text-lg hover:shadow-xl transition"
            >
              ✨ Generate Social Posts
            </button>
          </div>

          {/* Right Column - Generated Content */}
          <div className="space-y-6">
            {/* Reddit */}
            <ContentBlock
              platform="Reddit"
              icon={<MessageCircle className="w-6 h-6" />}
              color="bg-orange-500"
              content={generatedContent.reddit}
              onCopy={() => copyToClipboard(generatedContent.reddit, 'reddit')}
              copied={copiedPlatform === 'reddit'}
            />

            {/* Twitter */}
            <ContentBlock
              platform="Twitter/X"
              icon={<Twitter className="w-6 h-6" />}
              color="bg-blue-500"
              content={generatedContent.twitter}
              onCopy={() => copyToClipboard(generatedContent.twitter, 'twitter')}
              copied={copiedPlatform === 'twitter'}
            />

            {/* Instagram */}
            <ContentBlock
              platform="Instagram"
              icon={<Instagram className="w-6 h-6" />}
              color="bg-pink-500"
              content={generatedContent.instagram}
              onCopy={() => copyToClipboard(generatedContent.instagram, 'instagram')}
              copied={copiedPlatform === 'instagram'}
            />

            {/* Facebook */}
            <ContentBlock
              platform="Facebook"
              icon={<Facebook className="w-6 h-6" />}
              color="bg-blue-600"
              content={generatedContent.facebook}
              onCopy={() => copyToClipboard(generatedContent.facebook, 'facebook')}
              copied={copiedPlatform === 'facebook'}
            />
          </div>
        </div>

        {/* Reddit Strategy Guide */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-8 border-2 border-orange-200">
          <h2 className="text-3xl font-black mb-6">📋 Reddit Strategy Guide</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">🎯 Target Subreddits</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Metro Subreddits:</strong> r/sanfrancisco, r/bayarea, r/oakland, r/seattle, r/LosAngeles</li>
                <li><strong>Dog Communities:</strong> r/dogs, r/dogpictures, r/rarepuppers, r/aww</li>
                <li><strong>Local Dog Groups:</strong> r/BayAreaDogs, r/SFDogs (if they exist)</li>
                <li><strong>Contest/Photo:</strong> r/PhotoshopBattles, r/pics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">⚠️ Reddit Rules</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Check each subreddit's self-promotion rules</li>
                <li>✓ Engage authentically, don't just spam</li>
                <li>✓ Use throwaway accounts if posting frequently</li>
                <li>✓ Respond to comments to build engagement</li>
                <li>✓ Time posts for max visibility (mornings/evenings)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">📅 Posting Schedule</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Week 1:</strong> Launch contest announcement</li>
                <li><strong>Week 2:</strong> Feature funny entry "check this out!"</li>
                <li><strong>Week 3:</strong> "Last week to vote!" reminder</li>
                <li><strong>Week 4:</strong> Winner announcement</li>
                <li><strong>Month End:</strong> Next contest launch</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">💡 Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Lead with value (funny photo), then mention contest</li>
                <li>✓ Use genuine, non-salesy language</li>
                <li>✓ Include prizes upfront ($500 catches attention)</li>
                <li>✓ Emphasize "free to enter"</li>
                <li>✓ Cross-post to multiple relevant subs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentBlock({
  platform,
  icon,
  color,
  content,
  onCopy,
  copied,
}: {
  platform: string;
  icon: React.ReactNode;
  color: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className={`${color} text-white p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-bold">{platform}</span>
        </div>
        <button
          onClick={onCopy}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg flex items-center gap-2 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4">
        {content ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{content}</pre>
        ) : (
          <p className="text-gray-400 italic">Generate content to see preview...</p>
        )}
      </div>
    </div>
  );
}
