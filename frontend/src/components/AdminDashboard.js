import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Users, Phone, Home, Calendar, Download, RefreshCw, Search, TrendingUp, Bell } from 'lucide-react';

const API_URL = 'https://keen-heart-production-4c82.up.railway.app';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'gardenia2024';

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPref, setFilterPref] = useState('All');
  const [lastRefresh, setLastRefresh] = useState(null);

  const preferences = ['All', '2 BHK', '3 BHK', '3.5 BHK', '5 BHK Penthouse'];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/brochure-leads`);
      const data = await res.json();
      // Sort by newest first
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLeads(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchLeads();
  }, [authed]);

  const filtered = leads.filter(lead => {
    const matchSearch = lead.name?.toLowerCase().includes(search.toLowerCase()) ||
                        lead.phone?.includes(search);
    const matchPref = filterPref === 'All' || lead.preference === filterPref;
    return matchSearch && matchPref;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Preference', 'Date'];
    const rows = leads.map(l => [
      l.name,
      l.phone,
      l.preference || 'Not specified',
      new Date(l.timestamp).toLocaleString('en-IN')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gardenia-leads.csv';
    a.click();
  };

  const prefCounts = preferences.slice(1).map(p => ({
    label: p,
    count: leads.filter(l => l.preference === p).length
  }));

  const todayLeads = leads.filter(l => {
    const today = new Date();
    const leadDate = new Date(l.timestamp);
    return leadDate.toDateString() === today.toDateString();
  }).length;

  // Login Screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png"
              alt="The Gardenia"
              className="h-12 mx-auto mb-4 object-contain"
            />
            <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Sales Lead Management</p>
          </div>

          <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png"
            alt="The Gardenia"
            className="h-8 object-contain"
          />
          <div className="h-5 w-px bg-gray-700" />
          <span className="text-sm font-semibold text-gray-300">Lead Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString('en-IN')}
            </span>
          )}
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-red-900/50 hover:text-red-400 px-3 py-2 rounded-lg text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Total Leads</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold">{leads.length}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Today</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{todayLeads}</p>
          </div>
          {prefCounts.slice(0, 2).map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">{p.label}</span>
                <Home className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400">{p.count}</p>
            </div>
          ))}
        </div>

        {/* Preference Breakdown */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Preference Breakdown</h3>
          <div className="flex flex-wrap gap-3">
            {prefCounts.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                <span className="text-sm text-gray-300">{p.label}</span>
                <span className="text-sm font-bold text-emerald-400">{p.count}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
              <span className="text-sm text-gray-300">Not specified</span>
              <span className="text-sm font-bold text-gray-400">
                {leads.filter(l => !l.preference).length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {preferences.map(p => (
              <button
                key={p}
                onClick={() => setFilterPref(p)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  filterPref === p
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold">
              All Leads
              <span className="ml-2 text-xs text-gray-500 font-normal">({filtered.length} results)</span>
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">#</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Name</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Phone</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Preference</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Date & Time</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, index) => (
                    <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-400 text-xs font-bold">
                              {lead.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`tel:${lead.phone}`} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                          {lead.preference || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(lead.timestamp).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-green-600/20 hover:bg-green-600/40 text-green-400 px-3 py-1.5 rounded-lg transition-all"
                        >
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;