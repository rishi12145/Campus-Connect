import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { showToast } = useNotification();

  const loadUsers = () => {
    setUsers(storageService.getUsers());
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener('campus_connect_update', loadUsers);
    return () => window.removeEventListener('campus_connect_update', loadUsers);
  }, []);

  const handleToggleStatus = (userId) => {
    try {
      const u = storageService.toggleUserStatus(userId);
      showToast(`User status set to ${u.status}!`, 'info');
      loadUsers();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    try {
      storageService.deleteUser(userToDelete.id);
      showToast('User account deleted.', 'success');
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      storageService.updateProfile(selectedUser.id, selectedUser);
      showToast('User details updated!', 'success');
      setIsEditModalOpen(false);
      loadUsers();
    } catch (err) {
      showToast('Update failed.', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.collegeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Student Directory & Access Management
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            User Accounts
          </h2>
          <p className="text-xs text-[#777777]">
            Review registered students, edit records, and toggle account activation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F8F6] border border-[#EEEEEC] px-3.5 py-2 rounded-2xl text-xs font-bold text-[#111111]">
          <Users className="w-4 h-4 text-[#91C932]" />
          <span>{users.length} Total Registered Accounts</span>
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
            placeholder="Search by name, roll, or email..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#777777]">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F8F6] border border-[#EEEEEC] text-[#111111] outline-none"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-[#EEEEEC] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F8F6] border-b border-[#EEEEEC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Student Name & Roll</th>
                <th className="p-4">College Email & Phone</th>
                <th className="p-4">Semester & Batch</th>
                <th className="p-4">Role & Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEC]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#777777]">
                    No accounts found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-[#EEEEEC]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#111111]">{u.fullName}</h4>
                          <span className="text-[10px] font-mono text-[#777777]">{u.rollNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs text-[#111111]">{u.collegeEmail}</p>
                      <p className="text-[11px] text-[#777777]">{u.phoneNumber}</p>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs font-semibold text-[#111111]">{u.batch}</p>
                      <p className="text-[11px] text-[#777777]">{u.semester}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          u.role === 'admin' ? 'bg-[#111111] text-[#B7F34A]' : 'bg-[#EEEEEC] text-[#111111]'
                        }`}>
                          {u.role}
                        </span>
                        <span className={`text-[10px] font-semibold ${
                          u.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          ● {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          u.status === 'active'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={u.status === 'active' ? 'Deactivate account' : 'Activate account'}
                      >
                        {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#111111] bg-[#EEEEEC] hover:bg-[#D8D8D5] border border-[#D8D8D5] transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Record"
        subtitle={`Updating profile for ${selectedUser?.fullName}`}
      >
        {selectedUser && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={selectedUser.phoneNumber}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Semester</label>
                <select
                  value={selectedUser.semester}
                  onChange={(e) => setSelectedUser({ ...selectedUser, semester: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] outline-none"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs font-bold py-3 uppercase tracking-wider">
              Save User Updates
            </button>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to delete ${userToDelete?.fullName} (${userToDelete?.rollNumber})? This cannot be undone.`}
        isDestructive
        confirmText="Delete Account"
      />
    </div>
  );
};

