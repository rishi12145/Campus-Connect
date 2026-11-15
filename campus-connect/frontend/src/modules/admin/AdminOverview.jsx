import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { supabaseSyncService } from '../../services/supabaseSyncService';
import {
  Users,
  Bell,
  CalendarCheck,
  SearchCode,
  Bus,
  FolderArchive,
  MessagesSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Database,
  RefreshCw,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    announcements: 0,
    routines: 0,
    lostFound: 0,
    transport: 0,
    resources: 0,
    discussions: 0,
    places: 0
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const isSupabaseLive = supabaseSyncService.isConfigured();

  const handleSyncToSupabase = async () => {
    try {
      setSyncing(true);
      setSyncMessage('Starting Supabase sync...');
      setSyncProgress(5);
      await storageService.syncAllToSupabase((msg, pct) => {
        setSyncMessage(msg);
        setSyncProgress(pct);
      });
      setTimeout(() => {
        setSyncing(false);
        setSyncMessage('');
      }, 2500);
    } catch (err) {
      alert(err.message || 'Sync failed.');
      setSyncing(false);
    }
  };

  useEffect(() => {
    const loadStats = () => {
      const users = storageService.getUsers();
      const announcements = storageService.getAnnouncements();
      const routines = storageService.getRoutines();
      const lostFound = storageService.getLostFound();
      const transport = storageService.getTransport();
      const resources = storageService.getResources();
      const discussions = storageService.getDiscussions();
      const places = storageService.getPlaces();
      const logs = storageService.getActivityLogs();

      setStats({
        users: users.length,
        announcements: announcements.length,
        routines: routines.length,
        lostFound: lostFound.length,
        transport: transport.length,
        resources: resources.length,
        discussions: discussions.length,
        places: places.length
      });

      setRecentLogs(logs.slice(0, 5));
      setPendingItems(lostFound.filter(i => i.status === 'open').slice(0, 3));
    };

    loadStats();
    window.addEventListener('campus_connect_update', loadStats);
    return () => window.removeEventListener('campus_connect_update', loadStats);
  }, []);

  const chartData = [
    { name: 'Announcements', count: stats.announcements },
    { name: 'Timetables', count: stats.routines },
    { name: 'Lost/Found', count: stats.lostFound },
    { name: 'Transport', count: stats.transport },
    { name: 'Resources', count: stats.resources },
    { name: 'Discussions', count: stats.discussions },
    { name: 'Places', count: stats.places }
  ];

  const pieData = [
    { name: 'Academic & Notes', value: stats.resources + stats.routines, color: '#111111' },
    { name: 'Community Threads', value: stats.discussions, color: '#91C932' },
    { name: 'Announcements', value: stats.announcements, color: '#B7F34A' },
    { name: 'Lost & Found', value: stats.lostFound, color: '#777777' }
  ];

  const statCards = [
    { label: 'Registered Students', value: stats.users, icon: Users, link: '/admin/users' },
    { label: 'Official Notices', value: stats.announcements, icon: Bell, link: '/admin/notifications' },
    { label: 'Active Routines', value: stats.routines, icon: CalendarCheck, link: '/admin/academic' },
    { label: 'Lost & Found', value: stats.lostFound, icon: SearchCode, link: '/admin/lost-found' },
    { label: 'Study Resources', value: stats.resources, icon: FolderArchive, link: '/admin/resources' },
    { label: 'Discussion Posts', value: stats.discussions, icon: MessagesSquare, link: '/admin/community' },
    { label: 'Bus Routes', value: stats.transport, icon: Bus, link: '/admin/transport' },
    { label: 'Campus Locations', value: stats.places, icon: Compass, link: '/admin/explore' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#111111] text-white shadow-elevated border border-[#262626]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
              Central Administrative Control
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="text-xs text-gray-400">
            Real-time management of IIITV-ICD academic circulars, student timetables, and platform records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/notifications"
            className="btn-lime text-xs font-bold px-4 py-2.5"
          >
            Post Notice
          </Link>
          <Link
            to="/admin/academic"
            className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-bold px-4 py-2.5"
          >
            Add Routine
          </Link>
        </div>
      </div>

      {/* Supabase Cloud Database Status & Sync Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#2A2A2A] shadow-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${isSupabaseLive ? 'bg-emerald-950/60 border-emerald-500/40 text-[#B7F34A]' : 'bg-amber-950/40 border-amber-500/40 text-amber-400'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-extrabold text-white tracking-tight">Supabase Cloud Database</h4>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${isSupabaseLive ? 'bg-emerald-950/80 text-[#B7F34A] border-emerald-500/50' : 'bg-amber-950/80 text-amber-300 border-amber-600/50'}`}>
                {isSupabaseLive ? '● Connected & Active' : '○ Offline / Local Reactive Mode'}
              </span>
            </div>
            <p className="text-xs text-[#888888] max-w-2xl leading-relaxed">
              {isSupabaseLive 
                ? 'All routines, notices, study resources, lost & found claims, and user profiles are live in PostgreSQL with 1 MB Supabase Storage.'
                : 'Run campus-connect/supabase_schema.sql in your Supabase SQL Editor and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to activate.'}
            </p>
            {syncMessage && (
              <p className="text-xs font-bold text-[#B7F34A] pt-1">
                {syncMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <button
            onClick={handleSyncToSupabase}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#B7F34A] border border-[#333333] text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? `Syncing (${syncProgress}%)...` : 'Sync Local Data to Supabase'}</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.link}
              className="p-5 rounded-2xl bg-white border border-[#EEEEEC] shadow-subtle hover:border-[#111111] hover:shadow-elevated transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#777777] uppercase tracking-wider">
                  {c.label}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#F8F8F6] border border-[#EEEEEC] group-hover:bg-[#111111] group-hover:text-[#B7F34A] flex items-center justify-center text-[#111111] transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#111111]">{c.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module Content Distribution Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEC]">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Platform Content Distribution</h3>
              <p className="text-xs text-[#777777]">Total records across all 7 operational modules</p>
            </div>
            <span className="text-xs font-bold bg-[#111111] text-[#B7F34A] px-2.5 py-1 rounded-lg">
              Live Data
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#777777" fontSize={10} tickLine={false} />
                <YAxis stroke="#777777" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderRadius: '12px', border: 'none', color: '#fff' }}
                  cursor={{ fill: 'rgba(183, 243, 74, 0.08)' }}
                />
                <Bar dataKey="count" fill="#111111" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Breakdown Pie Chart (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#EEEEEC]">
              <h3 className="text-base font-bold text-[#111111]">Student Engagement Split</h3>
              <p className="text-xs text-[#777777]">Share of active records by category</p>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111111', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#EEEEEC]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[#777777] truncate">{p.name}: <strong className="text-[#111111]">{p.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Pending Moderation & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Open Lost & Found Listings (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEC]">
            <div className="flex items-center gap-2">
              <SearchCode className="w-4 h-4 text-[#91C932]" />
              <h3 className="text-base font-bold text-[#111111]">Pending Lost & Found Moderation</h3>
            </div>
            <Link to="/admin/lost-found" className="text-xs font-bold text-[#111111] hover:text-[#91C932]">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#F8F8F6] border border-[#EEEEEC] flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#111111] text-[#B7F34A]">
                      {item.type}
                    </span>
                    <h5 className="text-xs font-bold text-[#111111] truncate">{item.title}</h5>
                  </div>
                  <p className="text-[11px] text-[#777777] truncate">
                    {item.location} • Reported by {item.contactName}
                  </p>
                </div>
                <Link
                  to="/admin/lost-found"
                  className="btn-secondary text-[11px] px-3 py-1.5 font-bold shrink-0"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Audit Logs (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEC]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#91C932]" />
              <h3 className="text-base font-bold text-[#111111]">Recent Activity Audit Trail</h3>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-[#111111] hover:text-[#91C932]">
              View All Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#F8F8F6] border border-[#EEEEEC] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#91C932]">
                    {log.targetModule}
                  </span>
                  <span className="text-[10px] text-[#777777]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-[#111111]">{log.action}</h5>
                <p className="text-[11px] text-[#777777] line-clamp-1">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

