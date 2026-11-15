import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Layers,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminNotifications = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    targetBranch: 'All Branches',
    targetSemester: 'All Semesters',
    targetBatch: 'All Batches',
    isImportant: false,
    authorName: 'Academic Section'
  });

  const loadData = () => {
    setAnnouncements(storageService.getAnnouncements());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      targetBranch: 'All Branches',
      targetSemester: 'All Semesters',
      targetBatch: 'All Batches',
      isImportant: false,
      authorName: 'Academic Section'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditingItem(ann);
    setFormData({
      title: ann.title || '',
      description: ann.description || '',
      category: ann.category || 'Academic',
      targetBranch: ann.targetBranch || 'All Branches',
      targetSemester: ann.targetSemester || 'All Semesters',
      targetBatch: ann.targetBatch || 'All Batches',
      isImportant: !!ann.isImportant,
      authorName: ann.authorName || 'Academic Section'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Title and description are required.', 'error');
      return;
    }

    try {
      if (editingItem) {
        storageService.updateAnnouncement(editingItem.id, formData);
        showToast('Announcement updated successfully!', 'success');
      } else {
        storageService.createAnnouncement(formData);
        showToast('New announcement broadcast to students!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    try {
      storageService.deleteAnnouncement(itemToDelete.id);
      showToast('Announcement removed.', 'success');
      setItemToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.targetBranch && a.targetBranch.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              Circulars & Official Notices
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Manage Campus Announcements
          </h2>
          <p className="text-xs text-[#AAAAAA]">
            Broadcast academic circulars, exam notifications, and branch-specific advisories (Semesters 1–8 • CSE, AI, Cyber Security, ECE).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by keyword, branch, category..."
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-[#888888]">
          Total: <strong className="text-white">{announcements.length}</strong> announcements
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-white">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Notice Title & Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Target Branch & Semester</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#777777]">
                    No announcements published yet. Click "New Announcement" to publish one.
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#1E1E1E] transition-colors">
                    <td className="p-4 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {ann.isImportant && (
                            <span className="text-[10px] font-bold text-[#0A0A0A] bg-[#FF9F43] px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-mono">
                              <AlertTriangle className="w-3 h-3" /> Priority
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                        </div>
                        <p className="text-[11px] text-[#AAAAAA] line-clamp-1">{ann.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#242424] text-[#B7F34A] border border-[#333333]">
                        {ann.category}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#FF9F43] bg-[#222222] px-2 py-0.5 rounded font-mono">
                          {ann.targetBranch || 'All Branches'}
                        </span>
                        <span className="text-xs font-semibold text-white">{ann.targetSemester}</span>
                      </div>
                      <p className="text-[10px] text-[#777777]">{ann.targetBatch}</p>
                    </td>
                    <td className="p-4 text-xs text-[#888888]">
                      {new Date(ann.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] transition-colors inline-block"
                        title="Edit Announcement"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(ann)}
                        className="p-1.5 rounded-lg bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#333333] transition-colors inline-block"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Announcement' : 'Create Campus Announcement'}
        subtitle="Broadcast to specific branches, semesters (1–8), or the entire campus."
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. End-Semester Examination Schedule Announced"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Events">Events</option>
                <option value="General">General</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="e.g. Academic Section"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          {/* Target Branch and Target Semester (1 to 8) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Target Branch *
              </label>
              <select
                value={formData.targetBranch}
                onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All Branches">All Branches</option>
                <option value="CSE">CSE Only</option>
                <option value="AI">AI Only</option>
                <option value="Cyber Security">Cyber Security Only</option>
                <option value="ECE">ECE Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Target Semester (1–8) *
              </label>
              <select
                value={formData.targetSemester}
                onChange={(e) => setFormData({ ...formData, targetSemester: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All Semesters">All Semesters (1–8)</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Target Batch Year
            </label>
            <select
              value={formData.targetBatch}
              onChange={(e) => setFormData({ ...formData, targetBatch: e.target.value })}
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            >
              <option value="All Batches">All Batches</option>
              <option value="Batch 2026">Batch 2026</option>
              <option value="Batch 2025">Batch 2025</option>
              <option value="Batch 2024">Batch 2024</option>
              <option value="Batch 2023">Batch 2023</option>
              <option value="Batch 2022">Batch 2022</option>
              <option value="Batch 2021">Batch 2021</option>
              <option value="Hostellers Only">Hostellers Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Notice Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide complete circular details, room updates, schedules, or instructions..."
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#1A1A1A] rounded-xl border border-[#2E2E2E]">
            <input
              type="checkbox"
              id="isImportant"
              checked={formData.isImportant}
              onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
              className="w-4 h-4 rounded accent-[#B7F34A]"
            />
            <label htmlFor="isImportant" className="text-xs font-bold text-white cursor-pointer">
              Mark as High Priority / Urgent Notice
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            {editingItem ? 'Save Changes' : 'Broadcast Announcement'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${itemToDelete?.title}"?`}
        isDestructive
        confirmText="Delete Notice"
      />
    </div>
  );
};
