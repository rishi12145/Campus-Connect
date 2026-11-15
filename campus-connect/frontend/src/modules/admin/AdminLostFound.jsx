import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  SearchCode,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLostFound = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [itemToDelete, setItemToDelete] = useState(null);

  const { showToast } = useNotification();

  const loadData = () => {
    setItems(storageService.getLostFound());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleToggleResolve = (id) => {
    try {
      const updated = storageService.toggleResolveLostFound(id);
      showToast(`Listing status updated to ${updated.status}!`, 'info');
      loadData();
    } catch (err) {
      showToast('Status update failed.', 'error');
    }
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    try {
      storageService.deleteLostFound(itemToDelete.id);
      showToast('Item listing removed.', 'success');
      setItemToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Student Belongings Recovery
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Lost & Found Moderation
          </h2>
          <p className="text-xs text-[#777777]">
            Monitor reported student belongings, verify resolution claims, and delete inappropriate content.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F8F6] border border-[#EEEEEC] px-3.5 py-2 rounded-2xl text-xs font-bold text-[#111111]">
          <SearchCode className="w-4 h-4 text-[#91C932]" />
          <span>{items.length} Total Listings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEEEEC] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations, contacts..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#777777]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F8F6] border border-[#EEEEEC] text-[#111111] outline-none"
          >
            <option value="All">All Items</option>
            <option value="open">Open / Unclaimed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-3xl border border-[#EEEEEC] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F8F6] border-b border-[#EEEEEC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Item & Photograph</th>
                <th className="p-4">Type & Category</th>
                <th className="p-4">Location & Date</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEC]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777777]">
                    No listings found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#EEEEEC] shrink-0"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-[#111111]">{item.title}</h4>
                          <p className="text-[11px] text-[#777777] line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.type === 'lost' ? 'bg-[#111111] text-[#B7F34A]' : 'bg-[#B7F34A] text-[#111111]'
                      }`}>
                        {item.type}
                      </span>
                      <p className="text-[11px] text-[#777777]">{item.category}</p>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs font-semibold text-[#111111] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#91C932]" />
                        {item.location}
                      </p>
                      <p className="text-[11px] text-[#777777]">{item.date}</p>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs font-bold text-[#111111]">{item.contactName}</p>
                      <p className="text-[11px] text-[#777777]">{item.contactPhone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        item.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleResolve(item.id)}
                        className="btn-secondary text-[11px] font-bold px-2.5 py-1"
                        title="Toggle Resolution Status"
                      >
                        {item.status === 'resolved' ? 'Mark Open' : 'Resolve'}
                      </button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        title="Remove Inappropriate Listing"
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

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Listing"
        message={`Delete "${itemToDelete?.title}" from the student recovery board?`}
        isDestructive
        confirmText="Remove Listing"
      />
    </div>
  );
};

