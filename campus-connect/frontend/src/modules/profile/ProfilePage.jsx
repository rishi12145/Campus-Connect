import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  User,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Calendar,
  Lock,
  Bell,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useNotification();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [semester, setSemester] = useState(user?.semester || 'Semester 4');
  const [branch, setBranch] = useState(user?.branch || 'CSE');

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.bio) setBio(user.bio);
      if (user.semester) setSemester(user.semester);
      if (user.branch) setBranch(user.branch);
    }
  }, [user]);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences
  const [prefs, setPrefs] = useState(user?.notificationPrefs || {
    email: true,
    announcements: true,
    community: true,
    lostFound: false
  });

  const getInitials = (name) => {
    if (!name) return 'CC';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      showToast('Phone number is required.', 'error');
      return;
    }

    try {
      await updateUser({
        fullName,
        phoneNumber,
        bio,
        semester,
        branch,
        notificationPrefs: prefs
      });
      showToast('Profile details updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      await updateUser({ customPassword: newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast('Password update failed.', 'error');
    }
  };

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    updateUser({ notificationPrefs: updated });
    showToast('Preferences saved.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner with Automatic Initials Avatar (No photo upload) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#222222] to-[#121212] border-2 border-[#B7F34A] flex items-center justify-center text-[#B7F34A] text-2xl font-black shadow-xl shadow-[#B7F34A]/10 select-none shrink-0 tracking-wider">
            {getInitials(user?.fullName)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{user?.fullName}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B7F34A] text-[#0A0A0A]">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-[#AAAAAA]">
              {user?.collegeEmail} • Roll: <strong className="text-white font-mono">{user?.rollNumber}</strong>
            </p>
            <p className="text-xs text-[#888888]">
              {user?.batch} • {user?.semester}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Account Active
          </span>
        </div>
      </div>

      {/* Grid: Edit Personal Information & Change Password */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Information (7 Cols) */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-6">
          <div className="pb-3 border-b border-[#262626]">
            <h3 className="text-base font-bold text-white">Student Information</h3>
            <p className="text-xs text-[#888888]">Update your personal contact details</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Roll Number (Fixed)
                </label>
                <input
                  type="text"
                  value={user?.rollNumber || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-xs font-mono text-[#777777] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-[#B7F34A]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Academic Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-[#B7F34A]"
                >
                  {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Branch / Stream
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-[#B7F34A]"
                >
                  {['CSE', 'AI', 'Cyber Security', 'ECE'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Bio / Specialization
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. B.Tech CSE undergrad interested in Full Stack & Cloud Computing..."
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-[#B7F34A]"
              />
            </div>

            <button
              type="submit"
              className="btn-lime text-xs font-bold py-2.5 px-5"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password & Notification Preferences (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Password Card */}
          <div className="p-6 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
            <div className="pb-3 border-b border-[#262626]">
              <h3 className="text-base font-bold text-white">Security & Password</h3>
              <p className="text-xs text-[#888888]">Change your portal login credentials</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-secondary text-xs font-bold py-2 justify-center"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Preferences Card */}
          <div className="p-6 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
            <div className="pb-3 border-b border-[#262626]">
              <h3 className="text-base font-bold text-white">Notification Preferences</h3>
              <p className="text-xs text-[#888888]">Select channels to receive alerts</p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#CCCCCC]">Academic & Exam Circulars</span>
                <input
                  type="checkbox"
                  checked={prefs.announcements}
                  onChange={() => togglePref('announcements')}
                  className="accent-[#B7F34A] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#CCCCCC]">Community Replies & Likes</span>
                <input
                  type="checkbox"
                  checked={prefs.community}
                  onChange={() => togglePref('community')}
                  className="accent-[#B7F34A] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#CCCCCC]">Lost & Found Item Alerts</span>
                <input
                  type="checkbox"
                  checked={prefs.lostFound}
                  onChange={() => togglePref('lostFound')}
                  className="accent-[#B7F34A] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
