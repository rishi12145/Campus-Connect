import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { fileService } from '../../services/fileService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import {
  SearchCode,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Upload,
  Tag,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LostFoundPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState('All'); // 'All', 'lost', 'found', 'my'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'open', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactName: user?.fullName || '',
    contactPhone: user?.phoneNumber || '',
    contactEmail: user?.collegeEmail || '',
    imageFile: null,
    imagePreview: ''
  });

  const loadData = async () => {
    setItems(storageService.getLostFound());
    if (typeof storageService?.syncFromSupabase === 'function') {
      try {
        await storageService.syncFromSupabase();
        setItems(storageService.getLostFound());
      } catch (err) {}
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit.', 'error');
        return;
      }
      try {
        const base64 = await fileService.fileToBase64(file);
        setFormData({ ...formData, imageFile: file, imagePreview: base64 });
      } catch (err) {
        showToast('Failed to load image preview.', 'error');
      }
    }
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.contactPhone.trim()) {
      showToast('Please fill in title, location, and phone number.', 'error');
      return;
    }

    try {
      const reportedById = user?.user_id || user?.id || 'usr-student-1';
      storageService.createLostFound({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        contactName: formData.contactName || user?.fullName || 'Student',
        contactPhone: formData.contactPhone || user?.phoneNumber || '',
        contactEmail: formData.contactEmail || user?.collegeEmail || user?.email || '',
        imageUrl: formData.imagePreview,
        reportedBy: reportedById
      });

      showToast(`Successfully reported ${formData.type === 'lost' ? 'lost' : 'found'} item!`, 'success');
      setIsReportModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'lost',
        category: 'Electronics',
        location: '',
        date: new Date().toISOString().split('T')[0],
        contactName: user?.fullName || '',
        contactPhone: user?.phoneNumber || '',
        contactEmail: user?.collegeEmail || '',
        imageFile: null,
        imagePreview: ''
      });
      loadData();
    } catch (err) {
      showToast('Failed to submit listing.', 'error');
    }
  };

  const handleToggleResolve = (item, e) => {
    e.stopPropagation();
    storageService.toggleResolveLostFound(item.id);
    showToast(`Listing marked as ${item.status === 'resolved' ? 'Open' : 'Resolved'}!`, 'success');
    loadData();
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this listing?')) {
      storageService.deleteLostFound(id);
      showToast('Listing deleted successfully.', 'success');
      loadData();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesType =
      filterType === 'All'
        ? true
        : filterType === 'my'
        ? item.reportedBy === user?.id
        : item.type === filterType;

    const matchesStatus =
      filterStatus === 'All' ? true : item.status === filterStatus;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
              Student Recovery Network
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lost & Found Community Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#AAAAAA]">
            Report lost belongings, browse items found across campus, and coordinate safe returns.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, locations..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#888888]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#1F1F1F] border border-[#2E2E2E] text-white outline-none focus:border-[#B7F34A]"
            >
              <option value="All">All Statuses</option>
              <option value="open">Active / Open Only</option>
              <option value="resolved">Resolved Items</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262626]">
          {[
            { label: 'All Items', value: 'All' },
            { label: 'Lost Belongings', value: 'lost' },
            { label: 'Found Belongings', value: 'found' },
            { label: 'My Reported Listings', value: 'my' }
          ].map((tab) => {
            const isSelected = filterType === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilterType(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                    : 'bg-[#1F1F1F] text-[#AAAAAA] hover:bg-[#282828] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
            No items found matching the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedItem(item)}
                className="bg-[#161616] rounded-2xl border border-[#262626] shadow-xl overflow-hidden hover:border-[#B7F34A] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Preview */}
                  <div className="relative aspect-[16/10] bg-[#1F1F1F] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.type === 'lost'
                            ? 'bg-[#0A0A0A] text-[#FF9F43] border border-[#FF9F43]/40'
                            : 'bg-[#0A0A0A] text-[#B7F34A] border border-[#B7F34A]/40'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.status === 'resolved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#222222]/90 text-white backdrop-blur-sm border border-[#333333]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9F43]">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 hover:text-[#B7F34A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#AAAAAA] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="p-5 pt-0 space-y-2 text-xs border-t border-[#262626] mt-3">
                  <div className="flex items-center justify-between text-[#888888] pt-3">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="text-[11px] shrink-0">{item.date}</span>
                  </div>

                  {/* Direct Contact Phone Button */}
                  {item.contactPhone && (
                    <a
                      href={`tel:${item.contactPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03f] text-[#0A0A0A] text-xs font-black flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {item.contactName ? item.contactName.split(' ')[0] : 'Owner'}: {item.contactPhone}</span>
                    </a>
                  )}

                  {/* Action row */}
                  {(item.reportedBy === user?.id || user?.role === 'admin') && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => handleToggleResolve(item, e)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold border border-[#2E2E2E] bg-[#1F1F1F] hover:bg-[#B7F34A] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-1.5 text-[#CCCCCC]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="p-1.5 rounded-lg border border-[#2E2E2E] bg-[#1F1F1F] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report an Item"
        subtitle="Provide details to assist in finding or returning the item."
      >
        <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'lost' })}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                formData.type === 'lost'
                  ? 'bg-[#FF9F43] text-[#0A0A0A] border-[#FF9F43]'
                  : 'bg-[#1F1F1F] text-[#AAAAAA] border-[#2E2E2E]'
              }`}
            >
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'found' })}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                formData.type === 'found'
                  ? 'bg-[#B7F34A] text-[#0A0A0A] border-[#B7F34A]'
                  : 'bg-[#1F1F1F] text-[#AAAAAA] border-[#2E2E2E]'
              }`}
            >
              I Found Something
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Item Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Blue Milton 1L Water Bottle"
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
                <option value="Electronics">Electronics</option>
                <option value="Personal Belongings">Personal Belongings</option>
                <option value="Study Material">Study Material</option>
                <option value="Keys & Accessories">Keys & Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Campus Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Room 204 or Computing Lab 1"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide color, brand, identifiable marks, or details on how to claim..."
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Photograph (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-[#252525] hover:bg-[#333333] rounded-xl text-xs font-bold text-white cursor-pointer transition-colors border border-[#333333]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {formData.imagePreview && (
                <span className="text-[11px] text-[#B7F34A] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-[#262626] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="Contact Person Name"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="Phone Number (+91)"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider"
          >
            Publish Listing
          </button>
        </form>
      </Modal>

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Item Details'}
        subtitle={`Reported as ${selectedItem?.type?.toUpperCase()} on ${selectedItem?.date}`}
      >
        <div className="space-y-4 text-xs text-[#CCCCCC]">
          {selectedItem?.imageUrl && (
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#1F1F1F]">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                selectedItem?.type === 'lost'
                  ? 'bg-[#FF9F43] text-[#0A0A0A]'
                  : 'bg-[#B7F34A] text-[#0A0A0A]'
              }`}
            >
              {selectedItem?.type}
            </span>
            <span className="text-[10px] font-bold bg-[#222222] text-[#B7F34A] px-2.5 py-0.5 rounded-full border border-[#333333]">
              Category: {selectedItem?.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                selectedItem?.status === 'resolved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500/20 text-[#FF9F43] border border-[#FF9F43]/40'
              }`}
            >
              {selectedItem?.status}
            </span>
          </div>

          <p className="text-sm text-white leading-relaxed py-1">
            {selectedItem?.description}
          </p>

          <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">
              Location & Contact Details
            </h5>
            <div className="flex items-center gap-2 text-[#AAAAAA]">
              <MapPin className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Location: <strong className="text-white">{selectedItem?.location}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#AAAAAA]">
              <Phone className="w-3.5 h-3.5 text-[#FF9F43]" />
              <span>Contact Person: <strong className="text-white">{selectedItem?.contactName || 'Reporter'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#AAAAAA]">
              <Phone className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Contact Phone: <strong className="text-white">{selectedItem?.contactPhone}</strong></span>
            </div>
            {selectedItem?.contactEmail && (
              <div className="flex items-center gap-2 text-[#AAAAAA]">
                <Mail className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>Contact Email: <strong className="text-white">{selectedItem?.contactEmail}</strong></span>
              </div>
            )}

            {/* Direct Contact Buttons */}
            {selectedItem?.contactPhone && (
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={`tel:${selectedItem.contactPhone}`}
                  className="btn-lime text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 flex-1 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedItem.contactPhone}</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedItem.contactPhone.replace(/[^0-9]/g, '')}?text=Hi,%20regarding%20the%20${selectedItem.type}%20item%20"${encodeURIComponent(selectedItem.title)}"%20on%20Campus%20Connect`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-white hover:bg-[#25D366] hover:text-[#0A0A0A] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
