import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Users, Phone, Calendar, Download, RefreshCw,
  Search, X, MessageSquare, BarChart2, CheckSquare, Square,
  Mail, FileText, TrendingUp, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

const API_URL = 'https://keen-heart-production-4c82.up.railway.app';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'gardenia2024';

const STATUS_OPTIONS = ['New', 'Contacted', 'Site Visit Scheduled', 'Closed'];
const PREFERENCES = ['All', '2 BHK', '3 BHK', '3.5 BHK', '5 BHK Penthouse'];

const STATUS_CONFIG = {
  'New':                  { color: 'text-sky-400',    bg: 'bg-sky-500/15',    border: 'border-sky-500/30',    dot: 'bg-sky-400' },
  'Contacted':            { color: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  dot: 'bg-amber-400' },
  'Site Visit Scheduled': { color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  'Closed':               { color: 'text-emerald-400',bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',dot: 'bg-emerald-400' },
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const getLocalMeta = () => JSON.parse(localStorage.getItem('gardenia_lead_meta_v2') || '{}');
const saveLocalMeta = (meta) => localStorage.setItem('gardenia_lead_meta_v2', JSON.stringify(meta));

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [brochureLeads, setBrochureLeads] = useState([]);
  const [contactLeads, setContactLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPref, setFilterPref] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const [activeTab, setActiveTab] = useState('brochure');
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [meta, setMeta] = useState(getLocalMeta());

  const updateMeta = (leadId, updates) => {
    const updated = { ...meta, [leadId]: { ...(meta[leadId] || {}), ...updates } };
    setMeta(updated);
    saveLocalMeta(updated);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setAuthError(''); }
    else setAuthError('Incorrect password.');
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const [br, cr] = await Promise.all([
        fetch(`${API_URL}/api/brochure-leads`).then(r => r.json()),
        fetch(`${API_URL}/api/contact-leads`).then(r => r.json()),
      ]);
      br.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      cr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setBrochureLeads(Array.isArray(br) ? br : []);
      setContactLeads(Array.isArray(cr) ? cr : []);
      setLastRefresh(new Date());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed) fetchLeads(); }, [authed, fetchLeads]);

  const allLeads = activeTab === 'brochure' ? brochureLeads : contactLeads;

  const filtered = allLeads.filter(lead => {
    const m = meta[lead.id] || {};
    const matchSearch = !search ||
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search) ||
      lead.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || (m.status || 'New') === filterStatus;
    const matchPref = activeTab !== 'brochure' || filterPref === 'All' || lead.preference === filterPref;
    const leadDate = new Date(lead.timestamp);
    const matchFrom = !dateFrom || leadDate >= new Date(dateFrom);
    const matchTo = !dateTo || leadDate <= new Date(dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchPref && matchFrom && matchTo;
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      Brochure: brochureLeads.filter(l => new Date(l.timestamp).toDateString() === d.toDateString()).length,
      'Site Visit': contactLeads.filter(l => new Date(l.timestamp).toDateString() === d.toDateString()).length,
    };
  });

  const prefData = PREFERENCES.slice(1).map(p => ({
    name: p, value: brochureLeads.filter(l => l.preference === p).length
  })).filter(p => p.value > 0);

  const statusData = STATUS_OPTIONS.map(s => ({
    name: s,
    value: [...brochureLeads, ...contactLeads].filter(l => (meta[l.id]?.status || 'New') === s).length
  }));

  const totalLeads = brochureLeads.length + contactLeads.length;
  const todayLeads = [...brochureLeads, ...contactLeads].filter(l =>
    new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
  const closedLeads = [...brochureLeads, ...contactLeads].filter(l => meta[l.id]?.status === 'Closed').length;

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(l => l.id));

  const exportCSV = (leadsToExport) => {
    const isBrochure = activeTab === 'brochure';
    const headers = isBrochure
      ? ['Name', 'Phone', 'Preference', 'Status', 'Notes', 'Date']
      : ['Name', 'Phone', 'Email', 'Visit Date', 'Visit Time', 'Preferred Contact', 'Message', 'Status', 'Notes', 'Date'];
    const rows = leadsToExport.map(l => {
      const m = meta[l.id] || {};
      if (isBrochure) {
        return [l.name, l.phone, l.preference || 'N/A', m.status || 'New',
          (m.notes || []).map(n => n.text).join(' | '), new Date(l.timestamp).toLocaleString('en-IN')];
      }
      return [l.name, l.phone, l.email || '', l.preferredDate || '', l.preferredTime || '',
        l.preferredContact || '', l.message || '', m.status || 'New',
        (m.notes || []).map(n => n.text).join(' | '), new Date(l.timestamp).toLocaleString('en-IN')];
    });
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gardenia-${activeTab}-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const addNote = (leadId) => {
    if (!noteInput.trim()) return;
    const existing = meta[leadId]?.notes || [];
    updateMeta(leadId, { notes: [...existing, { text: noteInput.trim(), time: new Date().toISOString() }] });
    setNoteInput('');
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #050a07 0%, #0a1a0f 100%)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png" alt="The Gardenia" className="h-10 mx-auto mb-4 object-contain" />
            <h1 className="text-white text-xl font-bold">Sales CRM</h1>
            <p className="text-gray-500 text-xs mt-1">Admin Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-7 border border-gray-800" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }}
              placeholder="Enter admin password" autoFocus
              className="w-full border text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors mb-3 placeholder-gray-600"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: authError ? '#ef4444' : 'rgba(255,255,255,0.1)' }} />
            {authError && <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{authError}</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
              Login →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Dashboard ──
  return (
    <div className="min-h-screen text-white" style={{ background: '#060909' }}>

      {/* Header */}
      <div className="border-b px-6 py-3 flex items-center justify-between sticky top-0 z-30"
        style={{ background: 'rgba(6,9,9,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <img src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png" alt="The Gardenia" className="h-7 object-contain" />
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span className="text-sm font-semibold text-gray-300">Sales CRM</span>
          <div className="flex items-center gap-1.5 ml-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && <span className="text-xs text-gray-600 hidden md:block">{lastRefresh.toLocaleTimeString('en-IN')}</span>}
          <button onClick={fetchLeads} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border text-gray-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => exportCSV(allLeads)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border text-emerald-400 hover:bg-emerald-600/20"
            style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <Download className="w-3 h-3" /> Export CSV
          </button>
          <button onClick={() => setAuthed(false)}
            className="p-2 rounded-lg transition-all border text-gray-500 hover:text-red-400 hover:border-red-500/30"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Leads', value: totalLeads, icon: Users, color: '#10b981' },
            { label: 'Brochure Downloads', value: brochureLeads.length, icon: FileText, color: '#3b82f6' },
            { label: 'Site Visit Requests', value: contactLeads.length, icon: Calendar, color: '#8b5cf6' },
            { label: 'Deals Closed', value: closedLeads, icon: TrendingUp, color: '#f59e0b' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-5 border relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ background: kpi.color }} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500 font-medium">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-gray-600 mt-1">{todayLeads > 0 && i === 0 ? `+${todayLeads} today` : ' '}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { id: 'brochure', label: 'Brochure Leads', count: brochureLeads.length, icon: FileText },
            { id: 'contact', label: 'Site Visit Requests', count: contactLeads.length, icon: Calendar },
            { id: 'analytics', label: 'Analytics', count: null, icon: BarChart2 },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedIds([]); setSearch(''); setFilterStatus('All'); setFilterPref('All'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.count !== null && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Leads — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                  <Bar dataKey="Brochure" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Site Visit" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Preference Breakdown</h3>
              {prefData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={prefData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {prefData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>}
            </div>

            <div className="rounded-2xl p-5 border md:col-span-2" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-gray-300 mb-5">Sales Pipeline</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statusData.map((s, i) => {
                  const cfg = STATUS_CONFIG[s.name];
                  const pct = totalLeads ? Math.round((s.value / totalLeads) * 100) : 0;
                  return (
                    <div key={i} className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border}`}>
                      <div className={`flex items-center gap-2 mb-2`}>
                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs font-medium ${cfg.color}`}>{s.name}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{pct}% of total</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── LEADS TABS ── */}
        {(activeTab === 'brochure' || activeTab === 'contact') && (
          <>
            {/* Filters */}
            <div className="rounded-2xl p-4 border space-y-3" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" placeholder="Search by name, phone or email..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full border text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }} />
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"><X className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="border text-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }} />
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="border text-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }} />
                  {(dateFrom || dateTo) && (
                    <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                      className="border text-gray-400 hover:text-white rounded-xl px-3 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 self-center mr-1">Status:</span>
                {['All', ...STATUS_OPTIONS].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterStatus === s ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-500 hover:text-gray-300'}`}
                    style={filterStatus !== s ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' } : {}}>
                    {s}
                  </button>
                ))}
                {activeTab === 'brochure' && <>
                  <span className="text-gray-700 self-center px-2">|</span>
                  <span className="text-xs text-gray-600 self-center mr-1">Unit:</span>
                  {PREFERENCES.map(p => (
                    <button key={p} onClick={() => setFilterPref(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterPref === p ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-500 hover:text-gray-300'}`}
                      style={filterPref !== p ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' } : {}}>
                      {p}
                    </button>
                  ))}
                </>}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between bg-emerald-600/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <span className="text-sm text-emerald-400 font-medium">{selectedIds.length} lead{selectedIds.length > 1 ? 's' : ''} selected</span>
                <div className="flex gap-2">
                  <button onClick={() => exportCSV(allLeads.filter(l => selectedIds.includes(l.id)))}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                    <Download className="w-3 h-3" /> Export Selected
                  </button>
                  <button onClick={() => setSelectedIds([])}
                    className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs transition-all border"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Select All Row */}
            <div className="flex items-center gap-3 px-2">
              <button onClick={toggleSelectAll} className="text-gray-600 hover:text-gray-300 transition-colors">
                {selectedIds.length === filtered.length && filtered.length > 0
                  ? <CheckSquare className="w-4 h-4 text-emerald-400" />
                  : <Square className="w-4 h-4" />}
              </button>
              <span className="text-xs text-gray-600">{filtered.length} lead{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Lead Cards */}
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-600">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No leads found</p>
                  {search && <button onClick={() => setSearch('')} className="text-xs text-emerald-500 mt-2 hover:underline">Clear search</button>}
                </div>
              ) : filtered.map((lead) => {
                const m = meta[lead.id] || {};
                const status = m.status || 'New';
                const notes = m.notes || [];
                const cfg = STATUS_CONFIG[status];
                const isExpanded = expandedId === lead.id;
                const isSelected = selectedIds.includes(lead.id);

                return (
                  <div key={lead.id} className={`rounded-2xl border transition-all overflow-hidden ${isSelected ? 'border-emerald-500/30' : ''}`}
                    style={{ background: isSelected ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)', borderColor: isSelected ? undefined : 'rgba(255,255,255,0.06)' }}>

                    {/* Main Row */}
                    <div className="flex items-center gap-3 px-4 py-4">
                      <button onClick={() => toggleSelect(lead.id)} className="text-gray-600 hover:text-gray-300 flex-shrink-0">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
                      </button>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm text-white">{lead.name}</span>
                          {lead.preference && (
                            <span className="text-xs px-2 py-0.5 rounded-full border text-gray-400"
                              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                              {lead.preference}
                            </span>
                          )}
                          {notes.length > 0 && (
                            <span className="text-xs text-gray-600">· {notes.length} note{notes.length > 1 ? 's' : ''}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <a href={`tel:${lead.phone}`} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            <Phone className="w-3 h-3" />{lead.phone}
                          </a>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <Mail className="w-3 h-3" />{lead.email}
                            </a>
                          )}
                          {lead.preferredDate && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{lead.preferredDate}
                              {lead.preferredTime && ` at ${lead.preferredTime}`}
                            </span>
                          )}
                          <span className="text-xs text-gray-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{formatDate(lead.timestamp)} {formatTime(lead.timestamp)}
                          </span>
                        </div>
                        {lead.message && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-md">💬 {lead.message}</p>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div className="hidden md:block">
                        <select value={status} onChange={e => updateMeta(lead.id, { status: e.target.value })}
                          className={`text-xs px-3 py-2 rounded-lg border font-medium cursor-pointer focus:outline-none transition-all ${cfg.bg} ${cfg.color} ${cfg.border}`}
                          style={{ background: undefined }}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          title="WhatsApp"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-green-400 hover:bg-green-600/20"
                          style={{ background: 'rgba(22,163,74,0.1)' }}>
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} title="Email"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-blue-400 hover:bg-blue-600/20"
                            style={{ background: 'rgba(59,130,246,0.1)' }}>
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={() => { setExpandedId(isExpanded ? null : lead.id); setNoteInput(''); }}
                          title="Notes"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                          style={!isExpanded ? { background: 'rgba(255,255,255,0.06)' } : {}}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                          className="text-gray-600 hover:text-gray-400 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Status */}
                    <div className="flex gap-2 px-4 pb-3 md:hidden">
                      <select value={status} onChange={e => updateMeta(lead.id, { status: e.target.value })}
                        className={`flex-1 text-xs px-2 py-2 rounded-lg border font-medium cursor-pointer focus:outline-none ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                      </select>
                    </div>

                    {/* Expanded Panel */}
                    {isExpanded && (
                      <div className="border-t px-5 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                        {/* Full details for contact leads */}
                        {activeTab === 'contact' && (lead.message || lead.preferredContact) && (
                          <div className="mb-4 grid md:grid-cols-2 gap-3">
                            {lead.preferredContact && (
                              <div className="rounded-lg px-3 py-2.5 border text-xs" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                                <span className="text-gray-500">Preferred Contact:</span>
                                <span className="text-gray-300 ml-2 capitalize">{lead.preferredContact}</span>
                              </div>
                            )}
                            {lead.message && (
                              <div className="rounded-lg px-3 py-2.5 border text-xs md:col-span-2" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                                <span className="text-gray-500">Message:</span>
                                <span className="text-gray-300 ml-2">{lead.message}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Notes */}
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notes</h4>
                        {notes.length === 0
                          ? <p className="text-xs text-gray-700 mb-3">No notes yet. Add one below.</p>
                          : (
                            <div className="space-y-2 mb-3">
                              {notes.map((note, ni) => (
                                <div key={ni} className="flex items-start gap-2 rounded-lg px-3 py-2.5 border"
                                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-300">{note.text}</p>
                                    <p className="text-xs text-gray-700 mt-0.5">{new Date(note.time).toLocaleString('en-IN')}</p>
                                  </div>
                                  <button onClick={() => updateMeta(lead.id, { notes: notes.filter((_, i) => i !== ni) })}
                                    className="text-gray-700 hover:text-red-400 transition-colors mt-0.5">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        <div className="flex gap-2">
                          <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addNote(lead.id)}
                            placeholder="Type a note and press Enter..."
                            className="flex-1 border text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-gray-700"
                            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }} />
                          <button onClick={() => addNote(lead.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;