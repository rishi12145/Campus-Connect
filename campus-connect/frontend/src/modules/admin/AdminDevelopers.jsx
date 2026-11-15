import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Star,
  ExternalLink,
  Sparkles,
  Info,
  Quote,
  Hash,
  GraduationCap,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDevelopers = () => {
  const { showToast } = useNotification();
  const [developers, setDevelopers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    year: 'B.Tech CSE (2023-2027)',
    batch: 'B.Tech CSE 2023-2027',
    rollNumber: '',
    quote: '',
    contactPhone: '',
    email: '',
    isLead: false,
    avatar: '',
    bio: ''
  });

  const loadDevelopers = () => {
    setDevelopers(storageService.getDevelopers());
  };

  useEffect(() => {
    loadDevelopers();
    window.addEventListener('campus_connect_update', loadDevelopers);
    return () => window.removeEventListener('campus_connect_update', loadDevelopers);
  }, []);

  const handleOpenAddModal = () => {
    setEditingDev(null);
    setFormData({
      name: '',
      role: 'Platform Developer',
      year: 'B.Tech CSE (2023-2027)',
      batch: 'B.Tech CSE 2023-2027',
      rollNumber: '',
      quote: '',
      contactPhone: '',
      email: '',
      isLead: false,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dev) => {
    setEditingDev(dev);
    setFormData({
      name: dev.name || '',
      role: dev.role || '',
      year: dev.year || 'B.Tech CSE (2023-2027)',
      batch: dev.batch || 'B.Tech CSE 2023-2027',
      rollNumber: dev.rollNumber || '',
      quote: dev.quote || '',
      contactPhone: dev.contactPhone || '',
      email: dev.email || '',
      isLead: !!dev.isLead,
      avatar: dev.avatar || '',
      bio: dev.bio || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactPhone.trim()) {
      showToast('Please provide both developer name and contact phone.', 'error');
      return;
    }

    try {
      if (editingDev) {
        storageService.updateDeveloper(editingDev.id, formData);
        showToast(`Profile for ${formData.name} updated successfully!`, 'success');
      } else {
        storageService.createDeveloper(formData);
        showToast(`New developer ${formData.name} added to the team!`, 'success');
      }
      setIsModalOpen(false);
      loadDevelopers();
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the developer roster?`)) {
      storageService.deleteDeveloper(id);
      showToast(`${name} removed from developer team.`, 'success');
      loadDevelopers();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform Administration
            </span>
            <span className="text-xs text-[#888888] font-bold">
              Core Engineering Team (B.Tech CSE 2023-2027)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Developer Team & Contributor Profiles
          </h2>
          <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-2xl leading-relaxed">
            Manage the student development team (Rishikesh Gopal, Sriya Reddy, Shivangi Goutam) displayed on the public About page. Edit roll numbers, photos, roles, quotes, and direct contact hotlines.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-lime text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#B7F34A]/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Developer</span>
        </button>
      </div>

      {/* Info notice about lead developer and support */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181818] border border-[#262626] flex items-start gap-3 text-xs text-[#AAAAAA]">
        <Info className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Public About Us Integration: </strong>
          All profiles below are dynamically showcased on the <strong className="text-[#B7F34A]">About Us (/about)</strong> page. Students can view authentic developer details, roll numbers, individual quotes, and direct WhatsApp / email contact links.
        </div>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev) => (
          <motion.div
            key={dev.id}
            whileHover={{ y: -3 }}
            className={`p-6 rounded-3xl bg-[#161616] border shadow-xl flex flex-col justify-between space-y-5 transition-all ${
              dev.isLead
                ? 'border-[#B7F34A]/60 bg-gradient-to-b from-[#192213] to-[#161616]'
                : 'border-[#262626]'
            }`}
          >
            <div>
              {/* Header with Photo & Name */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#333333] shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                  {dev.isLead && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#B7F34A] text-[#0A0A0A] text-[9px] font-black uppercase tracking-wider shrink-0 whitespace-nowrap shadow">
                      Lead
                    </span>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white truncate">{dev.name}</h3>
                  <p className="text-xs text-[#B7F34A] font-semibold leading-tight">{dev.role}</p>
                  
                  {/* Batch & Roll Number Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#222222] text-[#CCCCCC] border border-[#333333]">
                      {dev.batch || 'B.Tech CSE 2023-2027'}
                    </span>
                    {dev.rollNumber && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#B7F34A]/10 text-[#B7F34A] border border-[#B7F34A]/30">
                        Roll: {dev.rollNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Quote */}
              {dev.quote && (
                <div className="mt-4 p-3 rounded-2xl bg-[#1C1C1C] border border-[#2E2E2E] relative text-xs italic text-[#DDDDDD] flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">"{dev.quote}"</span>
                </div>
              )}

              {/* Bio */}
              <p className="text-xs text-[#AAAAAA] mt-3 leading-relaxed line-clamp-3">
                {dev.bio || 'Core engineering contributor for IIITV-ICD Campus Connect.'}
              </p>

              {/* Contacts */}
              <div className="mt-4 pt-3 border-t border-[#262626] space-y-1.5 text-xs">
                {dev.contactPhone && (
                  <div className="flex items-center gap-2 text-[#CCCCCC]">
                    <Phone className="w-3.5 h-3.5 text-[#B7F34A]" />
                    <span className="font-mono">{dev.contactPhone}</span>
                  </div>
                )}
                {dev.email && (
                  <div className="flex items-center gap-2 text-[#888888] truncate">
                    <Mail className="w-3.5 h-3.5 text-[#FF9F43]" />
                    <span className="truncate font-mono">{dev.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="pt-3 border-t border-[#262626] flex items-center gap-2">
              <button
                onClick={() => handleOpenEditModal(dev)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1F1F1F] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-xs font-bold text-white border border-[#2E2E2E] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => handleDelete(dev.id, dev.name)}
                className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#2E2E2E] transition-colors"
                title="Delete Developer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add / Edit Developer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDev ? `Edit ${editingDev.name}` : 'Add New Developer'}
        subtitle="Manage developer credentials, roll number, quote, and contact info displayed on /about."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rishikesh Gopal"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 202311072, 202311060, 202311079"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white font-mono outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                Role / Specialization *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Lead Full-Stack Architect"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                Batch / Program *
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="B.Tech CSE 2023-2027"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          {/* Short Quote Input */}
          <div>
            <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Inspirational Quote / Developer Motto *</span>
            </label>
            <textarea
              rows={2}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="e.g. Building resilient digital ecosystems that transform daily campus life..."
              className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A] italic"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g. 8340574363"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white font-mono outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                College / Official Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="202311072@iiitvadodara.ac.in"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white font-mono outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
              Avatar Image URL
            </label>
            <div className="flex items-center gap-3">
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt="Preview"
                className="w-10 h-10 rounded-xl object-cover border border-[#B7F34A] shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/... or /images/..."
                className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
              Short Bio / Contribution Details
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="e.g. Lead architect of Campus Connect. Oversees full-stack development..."
              className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1F1F1F] border border-[#2E2E2E]">
            <input
              type="checkbox"
              id="isLead"
              checked={formData.isLead}
              onChange={(e) => setFormData({ ...formData, isLead: e.target.checked })}
              className="w-4 h-4 rounded text-[#B7F34A] focus:ring-0 bg-[#282828] border-[#444444]"
            />
            <label htmlFor="isLead" className="text-xs font-bold text-white cursor-pointer">
              Set as Lead Developer (Featured with Lead badge)
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            {editingDev ? 'Save Changes' : 'Add to Team'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
