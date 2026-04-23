'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: number;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  mileage: number;
  condition: string;
  hasAccident: boolean;
  photoName: string | null;
  status: string;
  notes: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  offer_made: { label: 'Offer Made', color: 'bg-purple-100 text-purple-800' },
  acquired: { label: 'Acquired', color: 'bg-green-100 text-green-800' },
  dead: { label: 'Dead', color: 'bg-gray-100 text-gray-600' },
};

const CONDITION_LABEL: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

type SortKey = 'createdAt' | 'year' | 'mileage' | 'fullName' | 'make';

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sortBy, order: sortOrder });
    if (statusFilter !== 'all') params.set('status', statusFilter);
    const res = await fetch(`/api/leads?${params}`);
    if (res.ok) setLeads(await res.json());
    setLoading(false);
  }, [statusFilter, sortBy, sortOrder]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: number, status: string) {
    setSavingId(id);
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSavingId(null);
  }

  async function saveNotes(id: number) {
    setSavingId(id);
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notesValue }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: notesValue } : l)));
    setEditingNotes(null);
    setSavingId(null);
  }

  async function deleteLead(id: number) {
    if (!confirm('Delete this lead permanently?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  async function signOut() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  }

  function exportCSV() {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    window.open(`/api/leads/export?${params}`, '_blank');
  }

  const filtered = leads.filter((lead) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(q) ||
      lead.make.toLowerCase().includes(q) ||
      lead.model.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.includes(q)
    );
  });

  const counts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lead Dashboard</h1>
            <p className="text-xs text-gray-500">{filtered.length} leads shown</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Status summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={`rounded-xl p-3 text-left border-2 transition-all ${
                statusFilter === key ? 'border-blue-500 shadow-md' : 'border-transparent bg-white shadow-sm hover:shadow'
              }`}
            >
              <div className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color} mb-1`}>
                {cfg.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">{counts[key] ?? 0}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name, make, model, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <button
            onClick={fetchLeads}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading leads…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No leads found</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    {[
                      { key: 'createdAt' as SortKey, label: 'Date' },
                      { key: 'fullName' as SortKey, label: 'Contact' },
                      { key: 'make' as SortKey, label: 'Vehicle' },
                      { key: 'mileage' as SortKey, label: 'Mileage' },
                      { key: null, label: 'Condition' },
                      { key: null, label: 'ZIP' },
                      { key: null, label: 'Status' },
                      { key: null, label: 'Notes' },
                      { key: null, label: '' },
                    ].map((col, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-left whitespace-nowrap ${col.key ? 'cursor-pointer hover:text-gray-800 select-none' : ''}`}
                        onClick={() => col.key && handleSort(col.key)}
                      >
                        {col.label}
                        {col.key && sortBy === col.key && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{lead.fullName}</div>
                        <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline text-xs block">{lead.phone}</a>
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-xs block truncate max-w-[160px]">{lead.email}</a>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{lead.year} {lead.make} {lead.model}</div>
                        {lead.trim && <div className="text-xs text-gray-500">{lead.trim}</div>}
                        {lead.vin && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-gray-500 font-mono">{lead.vin}</span>
                            <a
                              href={`https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=${lead.vin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 px-1.5 py-0.5 rounded font-semibold transition-colors"
                            >
                              Carfax →
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {lead.hasAccident && (
                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Accident</span>
                          )}
                          {lead.photoName && (
                            <span className="text-xs text-gray-400">📷</span>
                          )}
                        </div>
                      </td>

                      {/* Mileage */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {lead.mileage.toLocaleString()} mi
                      </td>

                      {/* Condition */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          lead.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                          lead.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                          lead.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {CONDITION_LABEL[lead.condition] ?? lead.condition}
                        </span>
                      </td>

                      {/* ZIP */}
                      <td className="px-4 py-3 text-gray-600">{lead.zipCode}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          disabled={savingId === lead.id}
                          className={`text-xs font-semibold rounded-lg border-0 px-2 py-1.5 cursor-pointer focus:ring-2 focus:ring-blue-300 ${STATUS_CONFIG[lead.status]?.color ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3 max-w-[200px]">
                        {editingNotes === lead.id ? (
                          <div className="flex gap-1">
                            <textarea
                              className="text-xs w-full border border-blue-300 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                              rows={3}
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              autoFocus
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => saveNotes(lead.id)}
                                disabled={savingId === lead.id}
                                className="text-xs bg-blue-600 text-white px-1.5 py-1 rounded hover:bg-blue-700"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setEditingNotes(null)}
                                className="text-xs bg-gray-200 text-gray-700 px-1.5 py-1 rounded hover:bg-gray-300"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingNotes(lead.id); setNotesValue(lead.notes ?? ''); }}
                            className="text-xs text-gray-500 hover:text-gray-900 text-left w-full truncate"
                            title={lead.notes ?? 'Click to add notes'}
                          >
                            {lead.notes ? (
                              <span className="italic">{lead.notes}</span>
                            ) : (
                              <span className="text-gray-300">+ Add note</span>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete lead"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
