import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { CampusNightAnimation } from '../components/CampusNightAnimation';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#222222] border-t-[#B7F34A] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#888888]">Loading Campus Connect...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Student Dashboard', subtitle: 'Real-time overview of academics, notices and campus activity' };
    if (path === '/academic') return { title: 'Academic Routines', subtitle: 'Daily & weekly timetable, lecture halls, and faculty schedules' };
    if (path === '/notifications') return { title: 'Campus Announcements', subtitle: 'Official notices, exam updates, events and emergency alerts' };
    if (path === '/lost-found') return { title: 'Lost & Found Community Portal', subtitle: 'Report missing items, view found belongings, and claim items' };
    if (path === '/transport') return { title: 'Campus Transport & Bus Routes', subtitle: 'Timetables, stops, driver contacts and shuttle schedules' };
    if (path === '/resources') return { title: 'Academic Resources & PYQs', subtitle: 'Student-shared notes, past question papers, and study materials' };
    if (path === '/community') return { title: 'Student Community Forum', subtitle: 'Discuss coursework, share updates, ask questions, and collaborate' };
    if (path === '/explore') return { title: 'Explore Diu Campus & Nearby', subtitle: 'Academic blocks, labs, library, coastal spots and local amenities' };
    if (path === '/profile') return { title: 'Student Profile & Settings', subtitle: 'Manage personal details, credentials, and notification preferences' };
    if (path === '/about') return { title: 'About Us & Support', subtitle: 'Platform overview, core developers, direct WhatsApp chat, and verified campus assistance' };
    return { title: 'Campus Connect', subtitle: 'IIIT Vadodara — International Campus Diu' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-[#EEEEEE] relative selection:bg-[#B7F34A] selection:text-[#0A0A0A]">
      <CampusNightAnimation />
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block w-64 fixed inset-y-0 z-40">
        <Sidebar />
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-64 max-w-[80vw] h-full bg-[#121212] z-10 border-r border-[#262626]"
            >
              <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10 bg-transparent">
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
