import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { TopNav } from '../components/TopNav';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
        <div className="w-10 h-10 border-3 border-white/20 border-t-[#B7F34A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/admin') return { title: 'Administrator Console', subtitle: 'System metrics, moderation and master records management' };
    if (path === '/admin/users') return { title: 'Student & User Accounts', subtitle: 'Manage student registrations, roles, and account statuses' };
    if (path === '/admin/notifications') return { title: 'Announcement Management', subtitle: 'Create, broadcast, and prioritize official campus circulars' };
    if (path === '/admin/academic') return { title: 'Academic Routines Management', subtitle: 'Update timetables, subject codes, rooms, and faculty allocations' };
    if (path === '/admin/lost-found') return { title: 'Lost & Found Moderation', subtitle: 'Review listings, update claim resolutions, or delete inappropriate content' };
    if (path === '/admin/transport') return { title: 'Transport & Shuttle Routes', subtitle: 'Maintain bus stops, timings, driver details and special schedules' };
    if (path === '/admin/resources') return { title: 'Study Resource Library', subtitle: 'Moderate user-uploaded study notes, question banks and materials' };
    if (path === '/admin/community') return { title: 'Community Forum Moderation', subtitle: 'Review discussion threads, manage reported topics and comments' };
    if (path === '/admin/explore') return { title: 'Explore Campus Directory', subtitle: 'Add and maintain verified campus landmarks and facilities' };
    if (path === '/admin/developers') return { title: 'Developer Team Management', subtitle: 'Manage core developer portfolio, profiles, and contributions' };
    if (path === '/admin/about') return { title: 'About Us & Website Controller', subtitle: 'Configure lead controller info, support channels, and institutional content' };
    if (path === '/admin/reports') return { title: 'Activity Logs & Analytics', subtitle: 'Audit trails, platform engagement statistics, and exportable reports' };
    return { title: 'Admin Console', subtitle: 'IIITV-ICD Central Management' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-[#EEEEEE]">
      {/* Desktop Fixed Admin Sidebar */}
      <div className="hidden lg:block w-64 fixed inset-y-0 z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-64 max-w-[80vw] h-full bg-[#111111] z-10"
            >
              <AdminSidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNav
          title={title}
          subtitle={subtitle}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

