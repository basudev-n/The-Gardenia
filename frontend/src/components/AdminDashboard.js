import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Users, Phone, Calendar, Download, RefreshCw,
  Search, TrendingUp, Flame, Droplets, Wind, X,
  MessageSquare, BarChart2, CheckSquare, Square, Mail, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

const API_URL = 'https://keen-heart-production-4c82.up.railway.app';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'gardenia2024';

const STATUS_OPTIONS = ['New', 'Contacted', 'Site Visit Scheduled', 'Closed'];
const HEAT_OPTIONS = ['hot', 'warm', 'cold'];
const PREFERENCES = ['All', '2 BHK', '3 BHK', '3.5 BHK', '5 BHK Penthouse'];

const STATUS_COLORS = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Site Visit Scheduled': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Closed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const HEAT_CONFIG = {
  hot: { icon: Flame, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Hot' },
  warm: { icon: Droplets, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Warm' },
  cold: { icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Cold' },
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const getLocalMeta = () => JSON.parse(localStorage.getItem('gardenia_lead_meta') || '{}');
const saveLocalMeta = (meta) => localStorage.setItem('gardenia_lead_meta', JSON.stringify(meta));

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
  const [filterHeat, setFilterHeat] = useState('All');
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
      setBrochureLeads(br);
      setContactLeads(cr);
      setLastRefresh(new Date());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed) fetchLeads(); }, [authed, fetchLeads]);

  const allLeads = activeTab === 'brochure' ? brochureLeads : contactLeads;

  const filtered = allLeads.filter(lead => {
    const m = meta[lead.id] || {};
    const matchSearch = lead.name?.toLowerCase().includes(search.toLowerCase()) || lead.phone?.includes(search);
    const matchStatus = filterStatus === 'All' || (m.status || 'New') === filterStatus;
    const matchHeat = filterHeat === 'All' || (m.heat || 'warm') === filterHeat;
    const matchPref = activeTab !== 'brochure' || filterPref === 'All' || lead.preference === filterPref;
    const leadDate = new Date(lead.timestamp);
    const matchFrom = !dateFrom || leadDate >= new Date(dateFrom);
    const matchTo = !dateTo || leadDate <= new Date(dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchHeat && matchPref && matchFrom && matchTo;
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      brochure: brochureLeads.filter(l => new Date(l.timestamp).toDateString() === d.toDateString()).length,
      contact: contactLeads.filter(l => new Date(l.timestamp).toDateString() === d.toDateString()).length,
    };
  });

  const prefData = PREFERENCES.slice(1).map(p => ({
    name: p, value: brochureLeads.filter(l => l.preference === p).length
  })).filter(p => p.value > 0);

  const statusData = STATUS_OPTIONS.map(s => ({
    name: s, value: [...brochureLeads, ...contactLeads].filter(l => (meta[l.id]?.status || 'New') === s).length
  }));

  const todayBrochure = brochureLeads.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
  const todayContact = contactLeads.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
  const totalLeads = brochureLeads.length + contactLeads.length;
  const hotLeads = [...brochureLeads, ...contactLeads].filter(l => meta[l.id]?.heat === 'hot').length;

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(l => l.id));

  const exportCSV = (leadsToExport) => {
    const isBrochure = activeTab === 'brochure';
    const headers = isBrochure
      ? ['Name', 'Phone', 'Preference', 'Status', 'Heat', 'Notes', 'Date']
      : ['Name', 'Phone', 'Email', 'Visit Date', 'Visit Time', 'Message', 'Status', 'Heat', 'Notes', 'Date'];
    const rows = leadsToExport.map(l => {
      const m = meta[l.id] || {};
      if (isBrochure) {
        return [l.name, l.phone, l.preference || 'N/A', m.status || 'New', m.heat || 'warm',
          (m.notes || []).map(n => n.text).join(' | '), new Date(l.timestamp).toLocaleString('en-IN')];
      }
      return [l.name, l.phone, l.email || '', l.preferredDate || '', l.preferredTime || '',
        l.message || '', m.status || 'New', m.heat || 'warm',
        (m.notes || []).map(n => n.text).join(' | '), new Date(l.timestamp).toLocaleString('en-IN')];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gardenia-${activeTab}-leads.csv`;
    a.click();
  };

  const addNote = (leadId) => {
    if (!noteInput.trim()) return;
    const existing = meta[leadId]?.notes || [];
    updateMeta(leadId, { notes: [...existing, { text: noteInput.trim(), time: new Date().toISOString() }] });
    setNoteInput('');
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #050a07 0%, #0a1a0f 100%)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png" alt="The Gardenia" className="h-10 mx-auto mb-4 object-contain" />
            <h1 className="text-white text-xl font-bold">Sales CRM</h1>
            <p className="text-gray-500 text-xs mt-1">Admin Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-7 border border-gray-800 bg-white/3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-emerald-600/10 border border-emerald-500/20">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }}
              placeholder="Enter password" autoFocus
              className="w-full bg-white/5 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors mb-3 placeholder-gray-600" />
            {authError && <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{authError}</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#080c0a' }}>

      {/* Header */}
      <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between sticky top-0 z-30" style={{ background: 'rgba(8,12,10,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <img src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png" alt="The Gardenia" className="h-7 object-contain" />
          <span className="text-gray-600">|</span>
          <span className="text-sm font-semibold text-gray-300">Sales CRM</span>
          <div className="flex items-center gap-1 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && <span className="text-xs text-gray-600 hidden md:block">Updated {lastRefresh.toLocaleTimeString('en-IN')}</span>}
          <button onClick={fetchLeads} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs transition-all border border-white/5">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => exportCSV(allLeads)} className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs transition-all border border-emerald-500/20">
            <Download className="w-3 h-3" /> Export All
          </button>
          <button onClick={() => setAuthed(false)} className="bg-white/5 hover:bg-red-900/30 hover:text-red-400 p-2 rounded-lg transition-all border border-white/5">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-white', accent: '#10b981' },
            { label: 'Brochure Downloads', value: brochureLeads.length, icon: FileText, color: 'text-emerald-400', accent: '#10b981' },
            { label: 'Site Visit Requests', value: contactLeads.length, icon: Calendar, color: 'text-blue-400', accent: '#3b82f6' },
            { label: 'Hot Leads', value: hotLeads, icon: Flame, color: 'text-red-400', accent: '#ef4444' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-4 border border-white/5 relative overflow-hidden bg-white/2">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ background: kpi.accent, transform: 'translate(30%,-30%)' }} />
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-gray-500">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/3 border border-white/5 rounded-xl p-1 w-fit">
          {[
            { id: 'brochure', label: `Brochure Leads (${brochureLeads.length})`, icon: FileText },
            { id: 'contact', label: `Site Visit Requests (${contactLeads.length})`, icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 }
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedIds([]); setSearch(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border border-white/5 bg-white/2">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Leads — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="brochure" fill="#10b981" radius={[4, 4, 0, 0]} name="Brochure" />
                  <Bar dataKey="contact" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Site Visit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5 border border-white/5 bg-white/2">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Brochure Preference Breakdown</h3>
              {prefData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={prefData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {prefData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>}
            </div>

            <div className="rounded-2xl p-5 border border-white/5 bg-white/2">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Sales Funnel</h3>
              <div className="space-y-3">
                {statusData.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{s.name}</span>
                      <span className="text-white font-semibold">{s.value}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: totalLeads ? `${(s.value / totalLeads) * 100}%` : '0%', background: PIE_COLORS[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-white/5 bg-white/2">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Today's Activity</h3>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">Brochure Downloads</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{todayBrochure}</span>
                </div>
                <div className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Site Visit Requests</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{todayContact}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brochure & Contact Leads Tabs */}
        {(activeTab === 'brochure' || activeTab === 'contact') && (
          <>
            {/* Filters */}
            <div className="rounded-2xl p-4 border border-white/5 mb-4 space-y-3 bg-white/2">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" placeholder="Search name or phone..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600" />
                </div>
                <div className="flex gap-2">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="bg-white/5 border border-white/5 text-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500" />
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="bg-white/5 border border-white/5 text-gray-400 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500" />
                  {(dateFrom || dateTo) && (
                    <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl px-3 border border-white/5">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...STATUS_OPTIONS].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterStatus === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/3 text-gray-500 border-white/5 hover:border-white/10'}`}>
                    {s}
                  </button>
                ))}
                <span className="text-gray-700 self-center px-1">|</span>
                {['All', ...HEAT_OPTIONS].map(h => (
                  <button key={h} onClick={() => setFilterHeat(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border capitalize ${filterHeat === h ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/3 text-gray-500 border-white/5 hover:border-white/10'}`}>
                    {h}
                  </button>
                ))}
                {activeTab === 'brochure' && <>
                  <span className="text-gray-700 self-center px-1">|</span>
                  {PREFERENCES.map(p => (
                    <button key={p} onClick={() => setFilterPref(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterPref === p ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/3 text-gray-500 border-white/5 hover:border-white/10'}`}>
                      {p}
                    </button>
                  ))}
                </>}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between bg-emerald-600/20 border border-emerald-500/30 rounded-xl px-4 py-3 mb-4">
                <span className="text-sm text-emerald-400 font-medium">{selectedIds.length} selected</span>
                <div className="flex gap-2">
                  <button onClick={() => exportCSV(allLeads.filter(l => selectedIds.includes(l.id)))}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                    <Download className="w-3 h-3" /> Export Selected
                  </button>
                  <button onClick={() => setSelectedIds([])} className="bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2 rounded-lg text-xs transition-all">Clear</button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 px-4 py-2">
              <button onClick={toggleSelectAll} className="text-gray-500 hover:text-gray-300 transition-colors">
                {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
              </button>
              <span className="text-xs text-gray-600">{filtered.length} leads</span>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-600">
                  <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No leads found</p>
                </div>
              ) : filtered.map((lead) => {
                const m = meta[lead.id] || {};
                const status = m.status || 'New';
                const heat = m.heat || 'warm';
                const notes = m.notes || [];
                const HeatIcon = HEAT_CONFIG[heat].icon;
                const isExpanded = expandedId === lead.id;
                const isSelected = selectedIds.includes(lead.id);

                return (
                  <div key={lead.id} className={`rounded-2xl border transition-all overflow-hidden ${isSelected ? 'border-emerald-500/40 bg-emerald-600/5' : 'border-white/5 hover:border-white/10 bg-white/2'}`}>
                    <div className="flex items-center gap-3 px-4 py-4">
                      <button onClick={() => toggleSelect(lead.id)} className="text-gray-600 hover:text-gray-300 flex-shrink-0">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
                      </button>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold bg-emerald-600/15 text-emerald-400">
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{lead.name}</span>
                          <HeatIcon className={`w-3.5 h-3.5 ${HEAT_CONFIG[heat].color}`} />
                          {notes.length > 0 && <span className="text-xs text-gray-600">{notes.length} note{notes.length > 1 ? 's' : ''}</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <a href={`tel:${lead.phone}`} className="text-xs text-emerald-400">{lead.phone}</a>
                          {lead.email && <span className="text-xs text-gray-500">{lead.email}</span>}
                          {lead.preference && <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{lead.preference}</span>}
                          {lead.preferredDate && <span className="text-xs text-gray-600">📅 {lead.preferredDate}</span>}
                          {lead.preferredTime && <span className="text-xs text-gray-600">🕐 {lead.preferredTime}</span>}
                          <span className="text-xs text-gray-700">{new Date(lead.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {lead.message && <p className="text-xs text-gray-500 mt-1 truncate max-w-md">💬 {lead.message}</p>}
                      </div>
                      <select value={status} onChange={e => updateMeta(lead.id, { status: e.target.value })}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium bg-transparent cursor-pointer focus:outline-none hidden md:block ${STATUS_COLORS[status]}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                      </select>
                      <select value={heat} onChange={e => updateMeta(lead.id, { heat: e.target.value })}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium bg-transparent cursor-pointer focus:outline-none hidden md:block ${HEAT_CONFIG[heat].bg} ${HEAT_CONFIG[heat].color}`}>
                        {HEAT_OPTIONS.map(h => <option key={h} value={h} style={{ background: '#111', color: '#fff' }}>{HEAT_CONFIG[h].label}</option>)}
                      </select>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 flex items-center justify-center transition-all">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`}
                            className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 flex items-center justify-center transition-all">
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={() => { setExpandedId(isExpanded ? null : lead.id); setNoteInput(''); }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile selectors */}
                    <div className="flex gap-2 px-4 pb-3 md:hidden">
                      <select value={status} onChange={e => updateMeta(lead.id, { status: e.target.value })}
                        className={`flex-1 text-xs px-2 py-1.5 rounded-lg border font-medium bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[status]}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                      </select>
                      <select value={heat} onChange={e => updateMeta(lead.id, { heat: e.target.value })}
                        className={`flex-1 text-xs px-2 py-1.5 rounded-lg border font-medium bg-transparent cursor-pointer focus:outline-none ${HEAT_CONFIG[heat].bg} ${HEAT_CONFIG[heat].color}`}>
                        {HEAT_OPTIONS.map(h => <option key={h} value={h} style={{ background: '#111', color: '#fff' }}>{HEAT_CONFIG[h].label}</option>)}
                      </select>
                    </div>

                    {/* Notes Panel */}
                    {isExpanded && (
                      <div className="border-t border-white/5 px-4 py-4 bg-black/20">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notes</h4>
                        {notes.length === 0 ? (
                          <p className="text-xs text-gray-700 mb-3">No notes yet.</p>
                        ) : (
                          <div className="space-y-2 mb-3">
                            {notes.map((note, ni) => (
                              <div key={ni} className="flex items-start gap-2 bg-white/3 rounded-lg px-3 py-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-300">{note.text}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{new Date(note.time).toLocaleString('en-IN')}</p>
                                </div>
                                <button onClick={() => updateMeta(lead.id, { notes: notes.filter((_, i) => i !== ni) })}
                                  className="text-gray-700 hover:text-red-400 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addNote(lead.id)}
                            placeholder="Add a note... (Enter to save)"
                            className="flex-1 bg-white/5 border border-white/5 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder-gray-700" />
                          <button onClick={() => addNote(lead.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                            Add
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