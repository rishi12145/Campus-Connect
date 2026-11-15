import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  SearchCode,
  Bus,
  FolderArchive,
  MessagesSquare,
  Compass,
  UserCheck,
  Users,
  LogOut,
  ExternalLink,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Academic', path: '/academic', icon: CalendarDays },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Lost & Found', path: '/lost-found', icon: SearchCode },
    { name: 'Transport & Bus', path: '/transport', icon: Bus, badge: '₹10 Bus' },
    { name: 'Resources', path: '/resources', icon: FolderArchive },
    { name: 'Community', path: '/community', icon: MessagesSquare },
    { name: 'Explore Diu', path: '/explore', icon: Compass, badge: '20 Spots' },
    { name: 'Profile & Settings', path: '/profile', icon: UserCheck },
    { name: 'About Us', path: '/about', icon: Users, badge: 'Chat' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#121212] border-r border-[#262626] flex flex-col h-full select-none text-white">
      {/* Brand Header: Links to main Home page */}
      <div className="p-6 border-b border-[#262626] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group" title="Return to Campus Connect Home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center text-white border border-[#333333] group-hover:border-[#B7F34A] transition-colors shadow-md shadow-[#B7F34A]/10">
            <span className="font-extrabold text-base tracking-wider text-[#B7F34A]">CC</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#B7F34A] transition-colors">CAMPUS CONNECT</span>
            </div>
            <p className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider">
              IIITV-ICD Student Portal
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {user?.role === 'admin' && (
          <div className="mb-4 p-2.5 rounded-2xl bg-gradient-to-r from-[#1E2613] to-[#151C0C] border border-[#B7F34A]/40 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Active
              </span>
              <span className="text-[9px] font-bold bg-[#B7F34A] text-[#0A0A0A] px-1.5 py-0.2 rounded font-mono">
                Full Control
              </span>
            </div>
            <NavLink
              to="/admin"
              onClick={isMobile ? onCloseMobile : undefined}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-[#0A0A0A] bg-[#B7F34A] hover:bg-[#cbfd6b] rounded-xl shadow-md transition-all"
            >
              <span>Open Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        )}

        <div className="px-3 pb-2 text-[10px] font-bold text-[#777777] uppercase tracking-wider">
          Student Services
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#222222] text-white border border-[#333333] shadow-md'
                    : 'text-[#999999] hover:text-white hover:bg-[#1A1A1A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#B7F34A]' : 'text-[#888888]'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badge === '₹10 Bus' 
                        ? 'bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40' 
                        : 'bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="w-1.5 h-4 bg-[#B7F34A] rounded-full shrink-0 shadow-sm shadow-[#B7F34A]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Current Student Profile Snapshot & Logout (Default Initials Avatar) */}
      <div className="p-4 border-t border-[#262626] bg-[#161616]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#222222] to-[#121212] border border-[#333333] flex items-center justify-center text-[#B7F34A] font-bold text-xs select-none shrink-0">
            {user?.fullName ? (user.fullName.trim().split(' ').length >= 2 ? `${user.fullName.trim().split(' ')[0][0]}${user.fullName.trim().split(' ')[1][0]}`.toUpperCase() : user.fullName.slice(0, 2).toUpperCase()) : 'CC'}
          </div>
          <div className="overflow-hidden flex-1">
            <h5 className="text-xs font-bold text-white truncate">{user?.fullName || 'Student'}</h5>
            <p className="text-[11px] text-[#888888] truncate">{user?.rollNumber || '202351001'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#CCCCCC] bg-[#222222] border border-[#333333] rounded-xl hover:bg-[#2A2A2A] hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
