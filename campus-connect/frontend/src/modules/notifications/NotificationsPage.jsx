import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import {
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
  Target,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || 'All Branches');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readIds, setReadIds] = useState([]);

  const { markAllAsRead, showToast } = useNotification();

  const categories = ['All', 'Academic', 'Examination', 'Events', 'General', 'Emergency'];
  const branches = ['All Branches', 'CSE', 'AI', 'Cyber Security', 'ECE'];

  const loadData = () => {
    setAnnouncements(storageService.getAnnouncements());
    const storedReads = JSON.parse(localStorage.getItem('cc_read_announcements') || '[]');
    setReadIds(storedReads);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleOpenNotice = (notice) => {
    setSelectedNotice(notice);
    if (!readIds.includes(notice.id)) {
      const updated = [...readIds, notice.id];
      setReadIds(updated);
      localStorage.setItem('cc_read_announcements', JSON.stringify(updated));
    }
  };

  const handleDeleteAnnouncement = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this official announcement?')) {
      storageService.deleteAnnouncement(id);
      showToast('Announcement removed.', 'success');
      loadData();
      if (selectedNotice?.id === id) setSelectedNotice(null);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadIds(allIds);
    localStorage.setItem('cc_read_announcements', JSON.stringify(allIds));
    markAllAsRead();
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCat = selectedCategory === 'All' || ann.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      ann.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch =
      selectedBranch === 'All Branches' ||
      !ann.targetBranch ||
      ann.targetBranch === 'All Branches' ||
      ann.targetBranch === selectedBranch;
    return matchesCat && matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
              Official Campus Communication
            </span>
            {user?.branch && (
              <span className="text-xs text-[#888888] font-bold">
                Student Branch: <strong className="text-[#B7F34A]">{user.branch}</strong>
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notices & Announcements
          </h2>
          <p className="text-xs sm:text-sm text-[#AAAAAA]">
            Official institute circulars, mid-sem schedules, branch-targeted notices, and emergency alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {user?.role === 'admin' && (
            <Link
              to="/admin/notifications"
              className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </Link>
          )}
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 rounded-xl border border-[#333333] bg-[#1E1E1E] text-xs font-bold text-[#CCCCCC] hover:text-white hover:bg-[#282828] transition-all flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="text-xs font-semibold text-[#888888]">
            Showing <span className="text-white font-bold">{filteredAnnouncements.length}</span> announcement(s)
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Filter by Target Branch:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {branches.map((b) => {
              const isSelected = selectedBranch === b;
              return (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                      : 'bg-[#1F1F1F] text-[#AAAAAA] hover:bg-[#282828] hover:text-white border border-[#2E2E2E]'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#FF9F43]" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-[#0A0A0A] shadow-md'
                      : 'bg-[#1F1F1F] text-[#AAAAAA] hover:bg-[#282828] hover:text-white border border-[#2E2E2E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
            No announcements found matching your search and filters.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRead = readIds.includes(ann.id);
            const isTargetedForMyBranch =
              user?.branch &&
              ann.targetBranch &&
              ann.targetBranch !== 'All Branches' &&
              ann.targetBranch === user.branch;

            return (
              <motion.div
                key={ann.id}
                whileHover={{ y: -2 }}
                onClick={() => handleOpenNotice(ann)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !isRead
                    ? 'bg-[#161616] border-[#B7F34A]/50 shadow-lg'
                    : 'bg-[#161616]/70 border-[#262626]'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#222222] text-[#B7F34A] border border-[#333333]">
                      {ann.category}
                    </span>

                    {ann.targetBranch && ann.targetBranch !== 'All Branches' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-white border border-[#333333]">
                        {ann.targetBranch}
                      </span>
                    )}

                    {isTargetedForMyBranch && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1 shadow-sm">
                        <Target className="w-3 h-3" />
                        Targeted for your branch ({user.branch})
                      </span>
                    )}

                    {ann.isImportant && (
                      <span className="text-[10px] font-bold text-[#0A0A0A] bg-[#FF9F43] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Important
                      </span>
                    )}

                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse" />
                    )}

                    <span className="text-[11px] text-[#888888] ml-auto sm:ml-2">
                      Target: {ann.targetSemester} • {ann.targetBatch}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug hover:text-[#B7F34A] transition-colors">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-[#AAAAAA] line-clamp-2 leading-relaxed">
                    {ann.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#262626] shrink-0 text-xs">
                  <span className="text-[11px] text-[#888888] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FF9F43]" />
                    {new Date(ann.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-[#777777] font-semibold mt-1">
                    By {ann.authorName}
                  </span>
                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => handleDeleteAnnouncement(ann.id, e)}
                      className="mt-2 p-1.5 rounded-lg bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#333333] transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title={selectedNotice?.title || 'Announcement Details'}
        subtitle={`Published by ${selectedNotice?.authorName} on ${
          selectedNotice?.publishedAt ? new Date(selectedNotice.publishedAt).toLocaleDateString() : ''
        }`}
      >
        <div className="space-y-4 text-xs leading-relaxed text-[#CCCCCC]">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#222222] text-[#B7F34A]">
              Category: {selectedNotice?.category}
            </span>
            <span className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E]">
              Branch: {selectedNotice?.targetBranch || 'All Branches'}
            </span>
            <span className="text-[10px] font-bold text-[#AAAAAA] px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E]">
              Target: {selectedNotice?.targetSemester} ({selectedNotice?.targetBatch})
            </span>
            {selectedNotice?.isImportant && (
              <span className="text-[10px] font-bold bg-[#FF9F43] text-[#0A0A0A] px-2.5 py-0.5 rounded-full">
                High Priority Notice
              </span>
            )}
          </div>

          <div className="text-sm text-white leading-relaxed whitespace-pre-line py-2">
            {selectedNotice?.description}
          </div>

          <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#2E2E2E] text-[11px] text-[#888888]">
            This circular is officially catalogued in the IIIT Vadodara – International Campus Diu student portal.
          </div>
        </div>
      </Modal>
    </div>
  );
};
