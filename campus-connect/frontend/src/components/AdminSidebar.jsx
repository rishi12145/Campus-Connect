import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Bell,
  CalendarCheck,
  SearchCode,
  Bus,
  FolderArchive,
  MessagesSquare,
  Compass,
  BarChart3,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminSidebar = ({ isMobile = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminMenuItems = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Accounts', path: '/admin/users', icon: Users },
    { name: 'Announcements', path: '/admin/notifications', icon: Bell },
    { name: 'Academic Routines', path: '/admin/academic', icon: CalendarCheck },
    { name: 'Lost & Found', path: '/admin/lost-found', icon: SearchCode },
    { name: 'Transport Routes', path: '/admin/transport', icon: Bus },
    { name: 'Study Resources', path: '/admin/resources', icon: FolderArchive },
    { name: 'Community Forum', path: '/admin/community', icon: MessagesSquare },
    { name: 'Explore Places', path: '/admin/explore', icon: Compass },
    { name: 'Team & Developers', path: '/admin/developers', icon: Users },
    { name: 'About & Controller', path: '/admin/about', icon: Info },
    { name: 'Platform Reports', path: '/admin/reports', icon: BarChart3 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#111111] text-white border-r border-[#262626] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#262626] flex items-center justify-between">
        <NavLink to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B7F34A] border border-[#B7F34A]/30">
            <ShieldCheck className="w-5 h-5 text-[#B7F34A]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight">ADMIN CONSOLE</span>
            </div>
            <p className="text-[10px] font-semibold text-[#777777] uppercase tracking-wider">
              IIITV-ICD Management
            </p>
          </div>
        </NavLink>
      </div>

      {/* Admin Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#777777] uppercase tracking-wider">
          System Administration
        </div>
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={isMobile ? onCloseMobile : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-white/10 text-white shadow-subtle border border-[#B7F34A]/30'
                    : 'text-[#777777] hover:text-white hover:bg-[#191919]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#B7F34A]' : 'text-[#777777]'}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="adminSidebarActivePill"
                      className="w-1.5 h-4 bg-[#B7F34A] rounded-full shrink-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Switch to Student Portal / Logout */}
      <div className="p-4 border-t border-[#262626] bg-[#191919]">
        <NavLink
          to="/dashboard"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#B7F34A] bg-[#111111] rounded-xl hover:bg-black transition-colors mb-3 border border-[#262626]"
        >
          <span>View Student Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-black border border-[#262626] rounded-xl hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};

