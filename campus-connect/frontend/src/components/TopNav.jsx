import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Search, Menu, User, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TopNav = ({ title, subtitle, onToggleMobileMenu }) => {
  const { user, logout, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#262626] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-white">
        {/* Left: Mobile trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-[#202020] border border-[#333333]"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-[#888888] hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        {/* Right: Global Search Trigger, Notifications & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Fast Switch Button */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B7F34A]/20 hover:bg-[#B7F34A] text-[#B7F34A] hover:text-[#0A0A0A] border border-[#B7F34A]/40 text-xs font-bold transition-all shadow-sm"
              title="Switch to Administrator Management Console"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#AAAAAA] bg-[#1C1C1C] hover:bg-[#242424] border border-[#2E2E2E] rounded-xl transition-all shadow-md group"
          >
            <Search className="w-4 h-4 text-[#888888] group-hover:text-[#B7F34A]" />
            <span className="hidden md:inline">Search campus...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono bg-[#282828] px-1.5 py-0.5 rounded border border-[#3A3A3A] text-[#B7F34A]">
              Ctrl+K
            </kbd>
          </button>

          {/* Notification Bell Dropdown */}
          <NotificationDropdown />

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#202020] border border-transparent hover:border-[#333333] transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#222222] to-[#121212] border border-[#333333] flex items-center justify-center text-[#B7F34A] text-xs font-bold select-none shrink-0">
                {user?.fullName ? (user.fullName.trim().split(' ').length >= 2 ? `${user.fullName.trim().split(' ')[0][0]}${user.fullName.trim().split(' ')[1][0]}`.toUpperCase() : user.fullName.slice(0, 2).toUpperCase()) : 'CC'}
              </div>
              <span className="hidden xl:inline text-xs font-bold text-white max-w-[120px] truncate">
                {user?.fullName?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-[#181818] rounded-campus-lg shadow-2xl border border-[#2E2E2E] py-2 z-50 text-xs text-white"
                >
                  <div className="px-4 py-2 border-b border-[#2A2A2A] mb-1">
                    <p className="font-bold text-white truncate">{user?.fullName}</p>
                    <p className="text-[#888888] truncate">{user?.collegeEmail}</p>
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B7F34A] text-[#0A0A0A]">
                      {user?.role || 'Student'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-[#CCCCCC] hover:bg-[#222222] hover:text-white font-medium"
                  >
                    <User className="w-4 h-4 text-[#888888]" />
                    <span>My Profile</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-[#CCCCCC] hover:bg-[#222222] hover:text-white font-medium"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#B7F34A]" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <div className="border-t border-[#2A2A2A] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-[#241515] font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
