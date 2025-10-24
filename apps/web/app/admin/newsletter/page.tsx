'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Eye, Mail, Users, LogOut } from 'lucide-react';

interface ContestEntry {
  id: number;
  pup_name: string;
  photo_url: string;
  caption: string;
  category: string;
  votes: number;
}

interface Daycare {
  id: number;
  name: string;
  city: string;
  rating: number;
  review_count: number;
  website?: string;
  phone?: string;
}

export default function NewsletterAdmin() {
  const router = useRouter();
  const [month, setMonth] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));
  const [customMessage, setCustomMessage] = useState('');
  const [selectedWinners, setSelectedWinners] = useState<number[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [selectedDaycares, setSelectedDaycares] = useState<number[]>([]);

  const [availableEntries, setAvailableEntries] = useState<ContestEntry[]>([]);
  const [availableDaycares, setAvailableDaycares] = useState<Daycare[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  // Load contest entries and daycares
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
        router.push('/admin/login?returnTo=/admin/newsletter');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login?returnTo=/admin/newsletter');
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
      // Load contest entries
      const entriesRes = await fetch('/api/contest/entries?category=all');
      const entriesData = await entriesRes.json();
      if (entriesData.success) {
        // Sort by votes, take top entries
        const sorted = (entriesData.data || []).sort((a: ContestEntry, b: ContestEntry) => b.votes - a.votes);
        setAvailableEntries(sorted);

        // Auto-select top 3 as winners
        if (sorted.length >= 3) {
          setSelectedWinners([sorted[0].id, sorted[1].id, sorted[2].id]);
        }

        // Auto-select next 6 as featured entries
        if (sorted.length > 3) {
          setSelectedEntries(sorted.slice(3, 9).map((e: ContestEntry) => e.id));
        }
      }

      // Load daycares
      const daycaresRes = await fetch('/api/daycares?limit=100');
      const daycaresData = await daycaresRes.json();
      if (daycaresData.success) {
        // Filter for top-rated with websites
        const topDaycares = (daycaresData.data || [])
          .filter((d: Daycare) => d.rating >= 4.5 && d.website)
          .sort((a: Daycare, b: Daycare) => (b.rating - a.rating) || (b.review_count - a.review_count))
          .slice(0, 10);
        setAvailableDaycares(topDaycares);

        // Auto-select top 3
        if (topDaycares.length >= 3) {
          setSelectedDaycares(topDaycares.slice(0, 3).map((d: Daycare) => d.id));
        }
      }

      // Load subscriber count
      const subsRes = await fetch('/api/newsletter/subscribers/count');
      const subsData = await subsRes.json();
      if (subsData.success) {
        setSubscriberCount(subsData.count);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/newsletter/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          customMessage,
          winnerIds: selectedWinners,
          entryIds: selectedEntries,
          daycareIds: selectedDaycares,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Open preview in new window
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(data.html);
        }
      } else {
        alert('Preview failed: ' + data.error);
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to generate preview');
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          customMessage,
          winnerIds: selectedWinners,
          entryIds: selectedEntries,
          daycareIds: selectedDaycares,
          testEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`✅ Test email sent to ${testEmail}`);
      } else {
        setMessage(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Send test error:', error);
      setMessage('❌ Failed to send test email');
    } finally {
      setSending(false);
    }
  };

  const handleSendToAll = async () => {
    const confirmed = confirm(
      `Are you sure you want to send this newsletter to ${subscriberCount} subscribers? This cannot be undone.`
    );

    if (!confirmed) return;

    setSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          customMessage,
          winnerIds: selectedWinners,
          entryIds: selectedEntries,
          daycareIds: selectedDaycares,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`✅ Newsletter sent to ${data.sent} subscribers!`);
      } else {
        setMessage(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      setMessage('❌ Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedWinnerEntries = availableEntries.filter(e => selectedWinners.includes(e.id));
  const selectedEntryItems = availableEntries.filter(e => selectedEntries.includes(e.id));
  const selectedDaycareItems = availableDaycares.filter(d => selectedDaycares.includes(d.id));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Newsletter Admin</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{subscriberCount.toLocaleString()} subscribers</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Newsletter Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Month</label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                    placeholder="November 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Custom Message (Optional)</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3"
                    rows={3}
                    placeholder="Add a custom message to appear at the top of the newsletter..."
                  />
                </div>
              </div>
            </div>

            {/* Contest Winners */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">🏆 Contest Winners (Top 3)</h2>
              <div className="grid grid-cols-3 gap-4">
                {selectedWinnerEntries.map((entry, index) => (
                  <div key={entry.id} className="border-2 border-yellow-400 rounded-lg p-3">
                    <img src={entry.photo_url} alt={entry.pup_name} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <p className="font-bold text-sm">{index + 1}. {entry.pup_name}</p>
                    <p className="text-xs text-gray-600">{entry.votes} votes</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Entries */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">📸 Featured Entries (Up to 6)</h2>
              <div className="grid grid-cols-3 gap-4">
                {selectedEntryItems.slice(0, 6).map((entry) => (
                  <div key={entry.id} className="border-2 border-gray-200 rounded-lg p-3">
                    <img src={entry.photo_url} alt={entry.pup_name} className="w-full h-24 object-cover rounded-lg mb-2" />
                    <p className="font-bold text-xs">{entry.pup_name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Daycares */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">⭐ Featured Daycares (Up to 3)</h2>
              <div className="space-y-3">
                {selectedDaycareItems.slice(0, 3).map((daycare) => (
                  <div key={daycare.id} className="border-2 border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold">{daycare.name}</h3>
                    <p className="text-sm text-gray-600">📍 {daycare.city}</p>
                    <p className="text-sm text-yellow-600">⭐ {daycare.rating}/5.0 ({daycare.review_count} reviews)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Preview</h3>
              <button
                onClick={handlePreview}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview Newsletter
              </button>
            </div>

            {/* Test Email */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Send Test</h3>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-3"
                placeholder="test@example.com"
              />
              <button
                onClick={handleSendTest}
                disabled={sending}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Test Email
              </button>
            </div>

            {/* Send to All */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-4 border-orange-300">
              <h3 className="text-xl font-bold mb-2 text-orange-600">⚠️ Send to All Subscribers</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will send the newsletter to all {subscriberCount.toLocaleString()} subscribers. This action cannot be undone.
              </p>
              <button
                onClick={handleSendToAll}
                disabled={sending}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-black text-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {sending ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
