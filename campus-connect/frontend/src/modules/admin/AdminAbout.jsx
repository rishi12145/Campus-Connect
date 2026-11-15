import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { INITIAL_ABOUT_CONTENT } from '../../data/initialData';
import { useNotification } from '../../context/NotificationContext';
import {
  ShieldCheck,
  User,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Building2,
  Compass,
  Layers,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAbout = () => {
  const { showToast } = useNotification();
  const [content, setContent] = useState(() => storageService.getAboutContent() || INITIAL_ABOUT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('controller'); // 'controller', 'hero', 'vision', 'gallery', 'benefits'

  // Sync state if external change happens
  useEffect(() => {
    const handleUpdate = () => {
      setContent(storageService.getAboutContent() || INITIAL_ABOUT_CONTENT);
    };
    window.addEventListener('campus_connect_update', handleUpdate);
    return () => window.removeEventListener('campus_connect_update', handleUpdate);
  }, []);

  // Update controller fields
  const handleControllerChange = (field, value) => {
    const updatedController = {
      ...content.controller,
      [field]: value
    };
    // Auto-sync WhatsApp URL if phone changes
    if (field === 'whatsappNumber' || field === 'phone') {
      const cleanNum = value.replace(/[^0-9]/g, '');
      updatedController.whatsappLink = `https://wa.me/91${cleanNum}?text=Hi%20Rishikesh,%20regarding%20Campus%20Connect`;
    }
    setContent({
      ...content,
      controller: updatedController
    });
  };

  // Update hero fields
  const handleHeroChange = (field, value) => {
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value
      }
    });
  };

  // Update vision fields
  const handleVisionChange = (field, value) => {
    setContent({
      ...content,
      vision: {
        ...content.vision,
        [field]: value
      }
    });
  };

  // Update scope fields
  const handleScopeChange = (field, value) => {
    setContent({
      ...content,
      scope: {
        ...content.scope,
        [field]: value
      }
    });
  };

  // Gallery manipulation
  const handleAddImage = () => {
    const newImage = {
      url: '/images/campus/campus-main.jpg',
      caption: 'Education Hub Campus View, Kevdi Diu'
    };
    setContent({
      ...content,
      showcaseImages: [...(content.showcaseImages || []), newImage]
    });
  };

  const handleUpdateImage = (index, field, value) => {
    const updated = [...(content.showcaseImages || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, showcaseImages: updated });
  };

  const handleRemoveImage = (index) => {
    const updated = [...(content.showcaseImages || [])];
    updated.splice(index, 1);
    setContent({ ...content, showcaseImages: updated });
  };

  // Benefits manipulation
  const handleAddBenefit = () => {
    const newBenefit = {
      title: 'New Campus Capability',
      description: 'Description of key student service or feature.'
    };
    setContent({
      ...content,
      benefits: [...(content.benefits || []), newBenefit]
    });
  };

  const handleUpdateBenefit = (index, field, value) => {
    const updated = [...(content.benefits || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, benefits: updated });
  };

  const handleRemoveBenefit = (index) => {
    const updated = [...(content.benefits || [])];
    updated.splice(index, 1);
    setContent({ ...content, benefits: updated });
  };

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      storageService.updateAboutContent(content);
      showToast('About Us & Website Controller content saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset all About Us content and Controller information to institute defaults?')) {
      setContent(INITIAL_ABOUT_CONTENT);
      storageService.updateAboutContent(INITIAL_ABOUT_CONTENT);
      showToast('About Us content reset to default settings.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-16 text-white max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Content Management
            </span>
            <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-3 py-1 rounded-full border border-[#FF9F43]/30">
              100% Admin Editable
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage About Us & Website Controller
          </h2>
          <p className="text-xs text-[#AAAAAA] max-w-2xl leading-relaxed">
            Directly customize the Website Controller credentials (Rishikesh Gopal), contact channels,
            misinformation reporting guidelines, showcase campus imagery, and institutional scope displayed on the public About page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/about"
            target="_blank"
            className="btn-secondary text-xs font-bold px-4 py-2.5 flex items-center gap-2"
            title="View public live About Us page"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Live Preview</span>
          </Link>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#AAAAAA] hover:text-white border border-[#333333] transition-colors"
            title="Reset to institute defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-lime text-xs font-extrabold px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-[#B7F34A]/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#262626] text-xs font-bold">
        <button
          onClick={() => setActiveTab('controller')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'controller'
              ? 'bg-[#B7F34A] text-[#0A0A0A] font-extrabold shadow-md shadow-[#B7F34A]/20'
              : 'bg-[#181818] text-[#AAAAAA] hover:text-white border border-[#2A2A2A]'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>Website Controller (Rishikesh Gopal)</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'hero'
              ? 'bg-[#B7F34A] text-[#0A0A0A] font-extrabold shadow-md shadow-[#B7F34A]/20'
              : 'bg-[#181818] text-[#AAAAAA] hover:text-white border border-[#2A2A2A]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('vision')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'vision'
              ? 'bg-[#B7F34A] text-[#0A0A0A] font-extrabold shadow-md shadow-[#B7F34A]/20'
              : 'bg-[#181818] text-[#AAAAAA] hover:text-white border border-[#2A2A2A]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vision & Scope</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'gallery'
              ? 'bg-[#B7F34A] text-[#0A0A0A] font-extrabold shadow-md shadow-[#B7F34A]/20'
              : 'bg-[#181818] text-[#AAAAAA] hover:text-white border border-[#2A2A2A]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Showcase Photos ({content.showcaseImages?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'benefits'
              ? 'bg-[#B7F34A] text-[#0A0A0A] font-extrabold shadow-md shadow-[#B7F34A]/20'
              : 'bg-[#181818] text-[#AAAAAA] hover:text-white border border-[#2A2A2A]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Key Benefits ({content.benefits?.length || 0})</span>
        </button>

        <Link
          to="/admin/developers"
          className="px-4 py-2.5 rounded-xl bg-[#1A2213] text-[#B7F34A] hover:bg-[#B7F34A] hover:text-[#0A0A0A] border border-[#B7F34A]/40 flex items-center gap-2 shrink-0 transition-colors"
          title="Manage Developer Roster, Roll Numbers, Quotes, and Photos"
        >
          <Users className="w-4 h-4" />
          <span>Developer Team Profiles & Roll Numbers</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WEBSITE CONTROLLER SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'controller' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center border border-[#B7F34A]/30">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Lead Website Controller & Administrator</h3>
                <p className="text-xs text-[#888888]">
                  This banner appears at the very top of the public /about page for immediate student contact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Controller Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={content.controller?.name || ''}
                    onChange={(e) => handleControllerChange('name', e.target.value)}
                    placeholder="Rishikesh Gopal"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Official Position / Title *
                </label>
                <input
                  type="text"
                  value={content.controller?.title || ''}
                  onChange={(e) => handleControllerChange('title', e.target.value)}
                  placeholder="Website Controller & Platform Administrator"
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Academic Standing & Branch *
                </label>
                <input
                  type="text"
                  value={content.controller?.year || ''}
                  onChange={(e) => handleControllerChange('year', e.target.value)}
                  placeholder="4th Year (B.Tech CSE)"
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Badge Label *
                </label>
                <input
                  type="text"
                  value={content.controller?.badge || ''}
                  onChange={(e) => handleControllerChange('badge', e.target.value)}
                  placeholder="Website Controller & Lead Administrator"
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Official Institute Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={content.controller?.email || ''}
                    onChange={(e) => handleControllerChange('email', e.target.value)}
                    placeholder="202311072@iiitvadodara.ac.in"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  WhatsApp Support Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={content.controller?.whatsappNumber || content.controller?.phone || ''}
                    onChange={(e) => handleControllerChange('whatsappNumber', e.target.value)}
                    placeholder="8340574363"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none font-mono"
                    required
                  />
                </div>
                <span className="text-[11px] text-[#888888] mt-1 block">
                  Students will see a 1-click WhatsApp chat button linking directly to this number without exposing raw telephone strings.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Controller Photo / Avatar URL *
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={content.controller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#B7F34A] shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                  }}
                />
                <input
                  type="url"
                  value={content.controller?.avatar || ''}
                  onChange={(e) => handleControllerChange('avatar', e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/campus/..."
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Notice to Students Regarding Misinformation & Timetable Changes *
              </label>
              <textarea
                rows={3}
                value={content.controller?.message || ''}
                onChange={(e) => handleControllerChange('message', e.target.value)}
                placeholder="Notice any outdated bus timing, incorrect classroom room number, missing subject syllabus..."
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none leading-relaxed"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HERO & OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white pb-3 border-b border-[#262626]">
              Hero Banner Content
            </h3>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Header Badge
              </label>
              <input
                type="text"
                value={content.hero?.badge || ''}
                onChange={(e) => handleHeroChange('badge', e.target.value)}
                placeholder="IIITV-ICD Student Digital Ecosystem"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Main Page Title
              </label>
              <input
                type="text"
                value={content.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="About Campus Connect"
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Subtitle / Ecosystem Summary
              </label>
              <textarea
                rows={3}
                value={content.hero?.subtitle || ''}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                placeholder="Integrated Digital Campus Ecosystem for Student Information..."
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:border-[#B7F34A] outline-none leading-relaxed"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VISION & SCOPE */}
      {/* ========================================================================= */}
      {activeTab === 'vision' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-4">
              <h3 className="text-base font-black text-white pb-3 border-b border-[#262626]">
                Platform Vision
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Vision Section Title</label>
                <input
                  type="text"
                  value={content.vision?.title || ''}
                  onChange={(e) => handleVisionChange('title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Problem Statement</label>
                <textarea
                  rows={3}
                  value={content.vision?.description1 || ''}
                  onChange={(e) => handleVisionChange('description1', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Solution Description</label>
                <textarea
                  rows={3}
                  value={content.vision?.description2 || ''}
                  onChange={(e) => handleVisionChange('description2', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Tagline</label>
                <input
                  type="text"
                  value={content.vision?.tagline || ''}
                  onChange={(e) => handleVisionChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>
            </div>

            {/* Scope Card */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-4">
              <h3 className="text-base font-black text-white pb-3 border-b border-[#262626]">
                Student-Centric Scope
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Scope Section Title</label>
                <input
                  type="text"
                  value={content.scope?.title || ''}
                  onChange={(e) => handleScopeChange('title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Scope Description 1</label>
                <textarea
                  rows={3}
                  value={content.scope?.description1 || ''}
                  onChange={(e) => handleScopeChange('description1', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Scope Description 2</label>
                <textarea
                  rows={3}
                  value={content.scope?.description2 || ''}
                  onChange={(e) => handleScopeChange('description2', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-1">Campus Note Badge</label>
                <input
                  type="text"
                  value={content.scope?.campusNote || ''}
                  onChange={(e) => handleScopeChange('campusNote', e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white focus:border-[#B7F34A] outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SHOWCASE PHOTOS */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <h3 className="text-lg font-black text-white">Showcase Campus Photos</h3>
                <p className="text-xs text-[#888888]">
                  Curate the photos that illustrate IIITV-ICD Education Hub and campus infrastructure.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddImage}
                className="btn-lime text-xs font-bold px-4 py-2 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(content.showcaseImages || []).map((img, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-3 relative group"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#333333]">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/campus/campus-main.jpg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                      Image URL or Path
                    </label>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleUpdateImage(idx, 'url', e.target.value)}
                      placeholder="/images/campus/campus-main.jpg"
                      className="w-full px-3 py-1.5 bg-[#222222] border border-[#3A3A3A] rounded-lg text-xs text-white focus:border-[#B7F34A] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                      Caption / Description
                    </label>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleUpdateImage(idx, 'caption', e.target.value)}
                      placeholder="Education Hub Main Complex, Kevdi Diu"
                      className="w-full px-3 py-1.5 bg-[#222222] border border-[#3A3A3A] rounded-lg text-xs text-white focus:border-[#B7F34A] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KEY BENEFITS */}
      {/* ========================================================================= */}
      {activeTab === 'benefits' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <h3 className="text-lg font-black text-white">Key Platform Benefits</h3>
                <p className="text-xs text-[#888888]">
                  Feature cards highlighting the key innovations of Campus Connect for students.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBenefit}
                className="btn-lime text-xs font-bold px-4 py-2 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Benefit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(content.benefits || []).map((ben, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={ben.title}
                      onChange={(e) => handleUpdateBenefit(idx, 'title', e.target.value)}
                      placeholder="Benefit Title"
                      className="w-full px-3 py-1.5 bg-[#222222] border border-[#3A3A3A] rounded-lg text-xs font-bold text-white focus:border-[#B7F34A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors shrink-0"
                      title="Remove benefit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={ben.description}
                    onChange={(e) => handleUpdateBenefit(idx, 'description', e.target.value)}
                    placeholder="Benefit detailed explanation..."
                    className="w-full px-3 py-1.5 bg-[#222222] border border-[#3A3A3A] rounded-lg text-xs text-[#CCCCCC] focus:border-[#B7F34A] outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Save Bar */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-lime px-6 py-3.5 text-xs font-black uppercase tracking-wider rounded-2xl shadow-2xl shadow-[#B7F34A]/30 flex items-center gap-2 border-2 border-white/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};

