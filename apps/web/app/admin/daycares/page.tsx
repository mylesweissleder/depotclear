'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Trash2,
  Edit,
  Plus,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Globe,
  Star,
  X,
  Save
} from 'lucide-react';

interface Daycare {
  id: number;
  name: string;
  city: string;
  state: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
  tier: string | null;
  created_at: string;
}

interface NewDaycare {
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  review_count: number;
  latitude: number | null;
  longitude: number | null;
  place_id: string;
}

export default function DaycaresAdmin() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [filteredDaycares, setFilteredDaycares] = useState<Daycare[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDaycare, setEditingDaycare] = useState<Daycare | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [newDaycare, setNewDaycare] = useState<NewDaycare>({
    name: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    website: '',
    rating: 0,
    review_count: 0,
    latitude: null,
    longitude: null,
    place_id: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchDaycares();
    }
  }, [user, token]);

  useEffect(() => {
    filterDaycares();
  }, [searchQuery, cityFilter, tierFilter, daycares]);

  const fetchDaycares = async () => {
    try {
      const response = await fetch('/api/admin/daycares', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDaycares(data.daycares);
        setFilteredDaycares(data.daycares);
      }
    } catch (error) {
      console.error('Failed to fetch daycares:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDaycares = () => {
    let filtered = [...daycares];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.city?.toLowerCase().includes(query) ||
          d.state?.toLowerCase().includes(query)
      );
    }

    if (cityFilter) {
      filtered = filtered.filter((d) => d.city === cityFilter);
    }

    if (tierFilter) {
      if (tierFilter === 'unclaimed') {
        filtered = filtered.filter((d) => !d.tier || d.tier === 'unclaimed');
      } else {
        filtered = filtered.filter((d) => d.tier === tierFilter);
      }
    }

    setFilteredDaycares(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this daycare?')) return;

    try {
      const response = await fetch(`/api/admin/daycares/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setDaycares(daycares.filter((d) => d.id !== id));
      } else {
        alert('Failed to delete daycare');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting daycare');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} daycares?`)) return;

    try {
      const response = await fetch('/api/admin/daycares/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (response.ok) {
        setDaycares(daycares.filter((d) => !selectedIds.has(d.id)));
        setSelectedIds(new Set());
      } else {
        alert('Failed to delete daycares');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Error deleting daycares');
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/daycares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDaycare),
      });

      if (response.ok) {
        const data = await response.json();
        setDaycares([data.daycare, ...daycares]);
        setShowAddModal(false);
        setNewDaycare({
          name: '',
          city: '',
          state: '',
          address: '',
          phone: '',
          website: '',
          rating: 0,
          review_count: 0,
          latitude: null,
          longitude: null,
          place_id: '',
        });
      } else {
        alert('Failed to add daycare');
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Error adding daycare');
    }
  };

  const handleEdit = async () => {
    if (!editingDaycare) return;

    try {
      const response = await fetch(`/api/admin/daycares/${editingDaycare.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingDaycare),
      });

      if (response.ok) {
        const data = await response.json();
        setDaycares(daycares.map((d) => (d.id === data.daycare.id ? data.daycare : d)));
        setShowEditModal(false);
        setEditingDaycare(null);
      } else {
        alert('Failed to update daycare');
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Error updating daycare');
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDaycares.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDaycares.map((d) => d.id)));
    }
  };

  const uniqueCities = [...new Set(daycares.map((d) => d.city).filter(Boolean))].sort();

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">Manage Daycares</h1>
              <span className="text-sm text-gray-500">
                {filteredDaycares.length} of {daycares.length} total
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Add Daycare
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, city, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">All Tiers</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="claimed">Claimed (Free)</option>
              <option value="top-dog">Top Dog</option>
            </select>

            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete {selectedIds.size} Selected
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredDaycares.length && filteredDaycares.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">City</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">State</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Rating</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Tier</th>
                  <th className="px-4 py-3 text-right font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDaycares.map((daycare) => (
                  <tr key={daycare.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(daycare.id)}
                        onChange={() => toggleSelect(daycare.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{daycare.name}</div>
                      {daycare.website && (
                        <a
                          href={daycare.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{daycare.city || '-'}</td>
                    <td className="px-4 py-3 text-sm">{daycare.state || '-'}</td>
                    <td className="px-4 py-3 text-sm">{daycare.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {daycare.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {daycare.rating} ({daycare.review_count || 0})
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          daycare.tier === 'top-dog'
                            ? 'bg-purple-100 text-purple-700'
                            : daycare.tier === 'claimed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {daycare.tier || 'unclaimed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingDaycare(daycare);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(daycare.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDaycares.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No daycares found matching your filters
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Daycare</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={newDaycare.name}
                    onChange={(e) => setNewDaycare({ ...newDaycare, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Happy Paws Daycare"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      value={newDaycare.city}
                      onChange={(e) => setNewDaycare({ ...newDaycare, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input
                      type="text"
                      value={newDaycare.state}
                      onChange={(e) => setNewDaycare({ ...newDaycare, state: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="CA"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={newDaycare.address}
                    onChange={(e) => setNewDaycare({ ...newDaycare, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={newDaycare.phone}
                      onChange={(e) => setNewDaycare({ ...newDaycare, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                      type="url"
                      value={newDaycare.website}
                      onChange={(e) => setNewDaycare({ ...newDaycare, website: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newDaycare.rating}
                      onChange={(e) => setNewDaycare({ ...newDaycare, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Review Count</label>
                    <input
                      type="number"
                      min="0"
                      value={newDaycare.review_count}
                      onChange={(e) => setNewDaycare({ ...newDaycare, review_count: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Google Place ID</label>
                  <input
                    type="text"
                    value={newDaycare.place_id}
                    onChange={(e) => setNewDaycare({ ...newDaycare, place_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newDaycare.name || !newDaycare.city || !newDaycare.state}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Add Daycare
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingDaycare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Daycare</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={editingDaycare.name}
                    onChange={(e) => setEditingDaycare({ ...editingDaycare, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      value={editingDaycare.city}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={editingDaycare.state || ''}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, state: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={editingDaycare.address || ''}
                    onChange={(e) => setEditingDaycare({ ...editingDaycare, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={editingDaycare.phone || ''}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                      type="url"
                      value={editingDaycare.website || ''}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, website: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editingDaycare.rating || 0}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Review Count</label>
                    <input
                      type="number"
                      min="0"
                      value={editingDaycare.review_count || 0}
                      onChange={(e) => setEditingDaycare({ ...editingDaycare, review_count: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tier</label>
                  <select
                    value={editingDaycare.tier || 'unclaimed'}
                    onChange={(e) => setEditingDaycare({ ...editingDaycare, tier: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="unclaimed">Unclaimed</option>
                    <option value="claimed">Claimed (Free)</option>
                    <option value="top-dog">Top Dog</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
