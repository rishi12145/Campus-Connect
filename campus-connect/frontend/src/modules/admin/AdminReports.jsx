import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { fileService } from '../../services/fileService';
import { useNotification } from '../../context/NotificationContext';
import {
  BarChart3,
  Download,
  Activity,
  Users,
  FolderArchive,
  MessagesSquare,
  SearchCode,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

export const AdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    announcements: 0,
    resources: 0,
    discussions: 0,
    lostFound: 0,
    transport: 0,
    places: 0
  });

  const { showToast } = useNotification();

  useEffect(() => {
    const loadReportData = () => {
      const u = storageService.getUsers();
      const a = storageService.getAnnouncements();
      const r = storageService.getResources();
      const d = storageService.getDiscussions();
      const lf = storageService.getLostFound();
      const tr = storageService.getTransport();
      const pl = storageService.getPlaces();
      const allLogs = storageService.getActivityLogs();

      setStats({
        users: u.length,
        announcements: a.length,
        resources: r.length,
        discussions: d.length,
        lostFound: lf.length,
        transport: tr.length,
        places: pl.length
      });
      setLogs(allLogs);
    };

    loadReportData();
    window.addEventListener('campus_connect_update', loadReportData);
    return () => window.removeEventListener('campus_connect_update', loadReportData);
  }, []);

  const engagementTrend = [
    { day: 'Mon', activeUsers: 42, interactions: 110 },
    { day: 'Tue', activeUsers: 58, interactions: 145 },
    { day: 'Wed', activeUsers: 64, interactions: 180 },
    { day: 'Thu', activeUsers: 71, interactions: 195 },
    { day: 'Fri', activeUsers: 85, interactions: 240 },
    { day: 'Sat', activeUsers: 39, interactions: 80 },
    { day: 'Sun', activeUsers: 31, interactions: 65 }
  ];

  const handleDownloadReport = () => {
    const reportText = `=====================================================
CAMPUS CONNECT — PLATFORM AUDIT & ACTIVITY REPORT
Indian Institute of Information Technology Vadodara — ICD
Official Campus Digital Ecosystem 2026
Report Generated: ${new Date().toLocaleString()}
=====================================================

1. SYSTEM EXECUTIVE SUMMARY:
- Total Registered Student & Staff Accounts: ${stats.users}
- Active Announcements & Circulars: ${stats.announcements}
- Academic Study Resources in Repository: ${stats.resources}
- Community Discussion Threads: ${stats.discussions}
- Lost & Found Listings Tracked: ${stats.lostFound}
- Transit Routes Catalogued: ${stats.transport}
- Verified Diu Campus Landmarks: ${stats.places}

2. AUDIT LOGS TRAIL (LAST 15 ACTIONS):
${logs.slice(0, 15).map((l, i) => `${i + 1}. [${l.timestamp}] ${l.actorName} (${l.actorRole}) - ${l.action}: ${l.details} [${l.targetModule}]`).join('\n')}

=====================================================
Status: Production Grade Deployment
Team: Sriya Reddy, Shivangi Goutam, Rishikesh Gopal
IIIT Vadodara International Campus Diu (IIITV-ICD)
=====================================================`;

    fileService.downloadTextFile(`CampusConnect_Platform_Report_${Date.now()}.txt`, reportText, 'text/plain');
    showToast('Platform report downloaded to machine!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              System Audit & Analytics
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Platform Reports & Audit Logs
          </h2>
          <p className="text-xs text-[#777777]">
            Review user interactions, resource utilization metrics, and download audit logs.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-[#111111]" />
          <span>Export Audit Summary</span>
        </button>
      </div>

      {/* Analytics Visualization (Recharts Line Chart) */}
      <div className="p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEC]">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Weekly Interaction Velocity</h3>
            <p className="text-xs text-[#777777]">Simulated engagement across student sessions</p>
          </div>
          <span className="text-xs font-bold text-[#91C932] bg-[#B7F34A]/10 px-2.5 py-1 rounded-lg">
            +38% vs Previous Sprint
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEC" />
              <XAxis dataKey="day" stroke="#777777" fontSize={11} />
              <YAxis stroke="#777777" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111111', borderRadius: '12px', border: 'none', color: '#fff' }}
              />
              <Line type="monotone" dataKey="interactions" stroke="#111111" strokeWidth={3} dot={{ fill: '#B7F34A', r: 5 }} />
              <Line type="monotone" dataKey="activeUsers" stroke="#91C932" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-3xl border border-[#EEEEEC] shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-[#EEEEEC] bg-[#F8F8F6] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Platform Event Audit Trail</h3>
            <p className="text-xs text-[#777777]">Granular chronological log of administrative and student actions</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#777777]">
            {logs.length} Logged Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F8F6] border-b border-[#EEEEEC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor & Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module Target</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEC]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                  <td className="p-4 text-[11px] font-mono text-[#777777] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#111111]">{log.actorName}</span>
                      <span className="text-[10px] uppercase text-[#777777] block font-mono">({log.actorRole})</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#111111]">
                    {log.action}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEEEEC] text-[#111111]">
                      {log.targetModule}
                    </span>
                  </td>
                  <td className="p-4 text-[#777777] text-xs max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

