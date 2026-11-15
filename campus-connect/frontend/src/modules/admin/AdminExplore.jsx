import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { fileService } from '../../services/fileService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Compass,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  Upload,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminExplore = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Academic Buildings',
    description: '',
    location: 'Education Hub, Kevdi, Diu',
    openingHours: '08:00 AM – 08:00 PM',
    imageUrl: '/images/campus/campus-main.jpg',
    mapUrl: 'https://maps.google.com/?q=Education+Hub+Diu',
    isVerified: true,
    features: 'High Speed WiFi, Air Conditioned'
  });

  const loadData = () => {
    setPlaces(storageService.getPlaces());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleOpenCreate = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      category: 'Academic Buildings',
      description: '',
      location: 'Education Hub, Kevdi, Diu',
      openingHours: '08:00 AM – 08:00 PM',
      imageUrl: '/images/campus/campus-main.jpg',
      mapUrl: 'https://maps.google.com/?q=Education+Hub+Diu',
      isVerified: true,
      features: 'High Speed WiFi, Air Conditioned'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPlace(p);
    setFormData({
      ...p,
      features: Array.isArray(p.features) ? p.features.join(', ') : p.features || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB.', 'error');
        return;
      }
      try {
        const base64 = await fileService.fileToBase64(file);
        setFormData({ ...formData, imageUrl: base64 });
        showToast('Image loaded.', 'info');
      } catch (err) {
        showToast('Failed to load image.', 'error');
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) {
      showToast('Facility name and location are required.', 'error');
      return;
    }

    try {
      if (editingPlace) {
        storageService.updatePlace(editingPlace.id, formData);
        showToast('Campus location updated!', 'success');
      } else {
        storageService.createPlace(formData);
        showToast('New campus landmark added!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDelete = () => {
    if (!placeToDelete) return;
    try {
      storageService.deletePlace(placeToDelete.id);
      showToast('Location removed.', 'success');
      setPlaceToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Campus Facilities & Landmark Catalog
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Manage Explore Directory
          </h2>
          <p className="text-xs text-[#777777]">
            Add official campus facilities, maintain verified photograph references, and update operational timings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEEEEC] shadow-subtle flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmarks or facilities..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-[#777777]">
          Total: <strong className="text-[#111111]">{places.length}</strong> catalogued locations
        </div>
      </div>

      {/* Places Table */}
      <div className="bg-white rounded-3xl border border-[#EEEEEC] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F8F6] border-b border-[#EEEEEC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Facility & Photograph</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location & Timings</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEC]">
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#777777]">
                    No locations found.
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#EEEEEC] shrink-0"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-[#111111]">{p.name}</h4>
                          <p className="text-[11px] text-[#777777] line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEEEEC] text-[#111111]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs font-semibold text-[#111111] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#91C932]" />
                        {p.location}
                      </p>
                      <p className="text-[11px] text-[#777777]">{p.openingHours}</p>
                    </td>
                    <td className="p-4">
                      {p.isVerified ? (
                        <span className="text-[10px] font-bold bg-[#B7F34A] text-[#111111] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#EEEEEC] text-[#777777] font-semibold px-2 py-0.5 rounded-full">
                          Sample Info
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-[#111111] bg-[#EEEEEC] hover:bg-[#D8D8D5] border border-[#D8D8D5] transition-colors"
                        title="Edit Location"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPlaceToDelete(p)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        title="Delete Location"
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

      {/* Place Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlace ? 'Edit Campus Location' : 'Add Campus Landmark'}
        subtitle="Catalog verified buildings or nearby student amenities."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
              Facility / Place Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Central Computing Laboratories"
              className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
              >
                <option value="Academic Buildings">Academic Buildings</option>
                <option value="Library">Library</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Sports Facilities">Sports Facilities</option>
                <option value="Hostels">Hostels</option>
                <option value="Medical Facilities">Medical Facilities</option>
                <option value="Nearby Places">Nearby Places</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="08:30 AM – 09:00 PM"
                className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
              Location Address *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Ground Floor, East Wing, Education Hub Diu"
              className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight key rooms, hardware, or access policies..."
              className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
              Key Amenities (Comma separated)
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="e.g. Linux Workstations, Dual Displays, Gigabit LAN"
              className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
            />
          </div>

          {/* Photograph Upload */}
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
              Photograph Attachment
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-[#EEEEEC] hover:bg-[#D8D8D5] rounded-xl text-xs font-bold text-[#111111] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photograph</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {formData.imageUrl && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Image attached
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#F8F8F6] rounded-xl border border-[#EEEEEC]">
            <input
              type="checkbox"
              id="isVerifiedPlace"
              checked={formData.isVerified}
              onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
              className="w-4 h-4 rounded accent-[#111111]"
            />
            <label htmlFor="isVerifiedPlace" className="text-xs font-bold text-[#111111] cursor-pointer">
              Mark as Verified Institute Facility (IIITV-ICD Diu)
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-primary text-xs font-bold py-3 uppercase tracking-wider"
          >
            {editingPlace ? 'Update Location Record' : 'Save New Location'}
          </button>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!placeToDelete}
        onClose={() => setPlaceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Location"
        message={`Delete "${placeToDelete?.name}"?`}
        isDestructive
        confirmText="Delete Location"
      />
    </div>
  );
};

