'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface Business {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  description: string;
  businessHours: any;
  amenities: any;
  photos: string[];
  subscription: {
    id: number;
    plan: string;
    status: string;
    endsAt: string;
  } | null;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  validFrom: string;
  validUntil: string;
  termsConditions: string;
  active: boolean;
}

export default function BusinessManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'offers' | 'analytics'>('info');

  // Form states
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  // Offers states
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerFormData, setOfferFormData] = useState({
    title: '',
    description: '',
    discountAmount: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    validFrom: '',
    validUntil: '',
    termsConditions: '',
    active: true,
  });
  const [savingOffer, setSavingOffer] = useState(false);

  // Analytics states
  const [analytics, setAnalytics] = useState<{
    totals: {
      pageViews: number;
      clicks: number;
      phoneClicks: number;
      websiteClicks: number;
      directionsClicks: number;
    };
    dailyStats: Array<{
      date: string;
      pageViews: number;
      clicks: number;
      phoneClicks: number;
      websiteClicks: number;
      directionsClicks: number;
    }>;
  } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30');

  // Photo upload states
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Business hours editing states
  const [editingHours, setEditingHours] = useState(false);
  const [hoursFormData, setHoursFormData] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [savingHours, setSavingHours] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchBusiness();
      fetchOffers();
    }
  }, [user, token, id]);

  useEffect(() => {
    if (activeTab === 'analytics' && user && token) {
      fetchAnalytics();
    }
  }, [activeTab, analyticsPeriod, user, token, id]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/dashboard/businesses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business');
      }

      const data = await response.json();
      setBusiness(data.data.business);
      setFormData({
        name: data.data.business.name || '',
        phone: data.data.business.phone || '',
        email: data.data.business.email || '',
        website: data.data.business.website || '',
        description: data.data.business.description || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`/api/dashboard/offers?businessId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data.data.offers);
      }
    } catch (err: any) {
      console.error('Error fetching offers:', err);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(
        `/api/dashboard/analytics/${id}?period=${analyticsPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          totals: data.data.totals,
          dailyStats: data.data.dailyStats,
        });
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/dashboard/businesses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update business');
      }

      const data = await response.json();
      setBusiness({ ...business!, ...data.data.business });
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setOfferFormData({
      title: '',
      description: '',
      discountAmount: '',
      discountType: 'percentage',
      validFrom: '',
      validUntil: '',
      termsConditions: '',
      active: true,
    });
    setShowOfferModal(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferFormData({
      title: offer.title,
      description: offer.description,
      discountAmount: offer.discountAmount.toString(),
      discountType: offer.discountType,
      validFrom: offer.validFrom.split('T')[0],
      validUntil: offer.validUntil.split('T')[0],
      termsConditions: offer.termsConditions || '',
      active: offer.active,
    });
    setShowOfferModal(true);
  };

  const handleSaveOffer = async () => {
    setSavingOffer(true);
    setError('');

    try {
      const url = editingOffer
        ? `/api/dashboard/offers/${editingOffer.id}`
        : '/api/dashboard/offers';

      const method = editingOffer ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: parseInt(id),
          ...offerFormData,
          discountAmount: parseFloat(offerFormData.discountAmount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save offer');
      }

      await fetchOffers();
      setShowOfferModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingOffer(false);
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const response = await fetch(`/api/dashboard/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete offer');
      }

      await fetchOffers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Photo upload handlers
  const handleAddPhoto = async () => {
    if (!photoUrl.trim()) {
      alert('Please enter a photo URL');
      return;
    }

    setUploadingPhoto(true);
    try {
      const response = await fetch(`/api/dashboard/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: parseInt(id),
          photoUrl: photoUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add photo');
      }

      // Update business photos
      if (business) {
        setBusiness({
          ...business,
          photos: data.data.photos || business.photos,
        });
      }

      setPhotoUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to add photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(
        `/api/dashboard/photos?businessId=${id}&photoUrl=${encodeURIComponent(photoUrl)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete photo');
      }

      // Update business photos
      if (business) {
        setBusiness({
          ...business,
          photos: data.data.photos || business.photos,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo');
    }
  };

  // Business hours handlers
  const handleEditHours = () => {
    setEditingHours(true);
    // Pre-fill form with current hours
    if (business?.businessHours) {
      setHoursFormData({
        monday: business.businessHours.monday || '',
        tuesday: business.businessHours.tuesday || '',
        wednesday: business.businessHours.wednesday || '',
        thursday: business.businessHours.thursday || '',
        friday: business.businessHours.friday || '',
        saturday: business.businessHours.saturday || '',
        sunday: business.businessHours.sunday || '',
      });
    }
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      const response = await fetch(`/api/dashboard/businesses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessHours: hoursFormData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update hours');
      }

      // Update business state
      if (business) {
        setBusiness({
          ...business,
          businessHours: hoursFormData,
        });
      }

      setEditingHours(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update hours');
    } finally {
      setSavingHours(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Business not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
            </div>
            {business.subscription ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {business.subscription.plan} - {business.subscription.status}
              </span>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`${
                activeTab === 'info'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Business Info
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`${
                activeTab === 'photos'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`${
                activeTab === 'offers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Offers & Promotions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Business Info Tab */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: business.name || '',
                          phone: business.phone || '',
                          email: business.email || '',
                          website: business.website || '',
                          description: business.description || '',
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{business.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {business.address}, {business.city}, {business.state} {business.zip}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Contact support to update address</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{business.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{business.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{business.website || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-gray-900">{business.description || 'No description provided'}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ⭐ {business.rating?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">{business.reviewCount || 0} reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Section */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                  {!editingHours ? (
                    <button
                      onClick={handleEditHours}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Edit Hours
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingHours(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveHours}
                        disabled={savingHours}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                      >
                        {savingHours ? 'Saving...' : 'Save Hours'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 capitalize">{day}</label>
                      {editingHours ? (
                        <input
                          type="text"
                          value={hoursFormData[day as keyof typeof hoursFormData]}
                          onChange={(e) =>
                            setHoursFormData({
                              ...hoursFormData,
                              [day]: e.target.value,
                            })
                          }
                          placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {business.businessHours?.[day] || 'Not set'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Photo Gallery</h2>

              {/* Upload Form */}
              <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Photo</h3>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddPhoto}
                    disabled={uploadingPhoto || !photoUrl.trim()}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {uploadingPhoto ? 'Adding...' : 'Add Photo'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter a direct URL to an image. The image should be hosted publicly and end with .jpg, .png, or .webp
                </p>
              </div>

              {/* Photo Grid */}
              {business.photos && business.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {business.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`${business.name} photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Delete photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">No photos yet. Add your first photo above!</p>
                </div>
              )}
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Special Offers & Promotions</h2>
                <button
                  onClick={handleCreateOffer}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Create New Offer
                </button>
              </div>

              {offers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">No offers created yet</p>
                  <button
                    onClick={handleCreateOffer}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Create Your First Offer
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                offer.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {offer.active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
                              {offer.discountType === 'percentage'
                                ? `${offer.discountAmount}% OFF`
                                : `$${offer.discountAmount} OFF`}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{offer.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Valid: {new Date(offer.validFrom).toLocaleDateString()} -{' '}
                              {new Date(offer.validUntil).toLocaleDateString()}
                            </span>
                            {offer.termsConditions && (
                              <span className="text-xs">Terms apply</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditOffer(offer)}
                            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="px-3 py-1 text-sm text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Offer Modal */}
          {showOfferModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      value={offerFormData.title}
                      onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                      placeholder="e.g., First Day Free"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={offerFormData.description}
                      onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                      placeholder="Describe your offer..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type *
                      </label>
                      <select
                        value={offerFormData.discountType}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            discountType: e.target.value as 'percentage' | 'fixed',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Amount *
                      </label>
                      <input
                        type="number"
                        value={offerFormData.discountAmount}
                        onChange={(e) =>
                          setOfferFormData({ ...offerFormData, discountAmount: e.target.value })
                        }
                        placeholder={offerFormData.discountType === 'percentage' ? '20' : '50'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valid From *
                      </label>
                      <input
                        type="date"
                        value={offerFormData.validFrom}
                        onChange={(e) => setOfferFormData({ ...offerFormData, validFrom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valid Until *
                      </label>
                      <input
                        type="date"
                        value={offerFormData.validUntil}
                        onChange={(e) => setOfferFormData({ ...offerFormData, validUntil: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms & Conditions (Optional)
                    </label>
                    <textarea
                      value={offerFormData.termsConditions}
                      onChange={(e) =>
                        setOfferFormData({ ...offerFormData, termsConditions: e.target.value })
                      }
                      placeholder="Any restrictions or conditions..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={offerFormData.active}
                      onChange={(e) => setOfferFormData({ ...offerFormData, active: e.target.checked })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Active (visible to customers)
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOffer}
                    disabled={savingOffer}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                  >
                    {savingOffer ? 'Saving...' : editingOffer ? 'Update Offer' : 'Create Offer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Period Selector */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
                  <select
                    value={analyticsPeriod}
                    onChange={(e) => setAnalyticsPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>

                {analyticsLoading ? (
                  <div className="text-center py-12 text-gray-600">Loading analytics...</div>
                ) : analytics ? (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <p className="text-sm text-orange-700 font-medium">Page Views</p>
                        <p className="text-3xl font-bold text-orange-900 mt-2">
                          {analytics.totals.pageViews.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">Total Clicks</p>
                        <p className="text-3xl font-bold text-blue-900 mt-2">
                          {analytics.totals.clicks.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-700 font-medium">Phone Clicks</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">
                          {analytics.totals.phoneClicks.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-700 font-medium">Website Clicks</p>
                        <p className="text-3xl font-bold text-purple-900 mt-2">
                          {analytics.totals.websiteClicks.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm text-indigo-700 font-medium">Directions Clicks</p>
                        <p className="text-3xl font-bold text-indigo-900 mt-2">
                          {analytics.totals.directionsClicks.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Click-through Rate */}
                    {analytics.totals.pageViews > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Click-through Rate (CTR)</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Phone</span>
                              <span className="font-semibold">
                                {((analytics.totals.phoneClicks / analytics.totals.pageViews) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${Math.min((analytics.totals.phoneClicks / analytics.totals.pageViews) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Website</span>
                              <span className="font-semibold">
                                {((analytics.totals.websiteClicks / analytics.totals.pageViews) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500"
                                style={{
                                  width: `${Math.min((analytics.totals.websiteClicks / analytics.totals.pageViews) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Directions</span>
                              <span className="font-semibold">
                                {((analytics.totals.directionsClicks / analytics.totals.pageViews) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500"
                                style={{
                                  width: `${Math.min((analytics.totals.directionsClicks / analytics.totals.pageViews) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Daily Stats Chart */}
                    {analytics.dailyStats.length > 0 ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Daily Performance</h3>
                        <div className="overflow-x-auto">
                          <div className="min-w-full">
                            {/* Simple bar chart */}
                            <div className="space-y-2">
                              {analytics.dailyStats.slice(0, 14).reverse().map((day) => (
                                <div key={day.date} className="flex items-center space-x-3">
                                  <div className="w-24 text-xs text-gray-600 flex-shrink-0">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </div>
                                  <div className="flex-1 flex items-center space-x-1">
                                    <div
                                      className="bg-orange-500 h-6 rounded"
                                      style={{
                                        width: `${Math.max((day.pageViews / Math.max(...analytics.dailyStats.map(d => d.pageViews), 1)) * 100, 2)}%`,
                                      }}
                                      title={`${day.pageViews} views`}
                                    />
                                    <span className="text-xs text-gray-600 ml-2">{day.pageViews}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No analytics data available for this period yet.</p>
                        <p className="text-sm mt-2">Data will appear once users start viewing your listing.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No analytics data available yet.</p>
                    <p className="text-sm mt-2">Data will appear once users start viewing your listing.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
