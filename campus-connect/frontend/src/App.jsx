import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Modules
import { StudentDashboard } from './pages/StudentDashboard';
import { AcademicPage } from './modules/academic/AcademicPage';
import { NotificationsPage } from './modules/notifications/NotificationsPage';
import { LostFoundPage } from './modules/lostfound/LostFoundPage';
import { TransportPage } from './modules/transport/TransportPage';
import { ResourcesPage } from './modules/resources/ResourcesPage';
import { CommunityPage } from './modules/community/CommunityPage';
import { ExplorePage } from './modules/explore/ExplorePage';
import { ProfilePage } from './modules/profile/ProfilePage';

// Admin Modules
import { AdminOverview } from './modules/admin/AdminOverview';
import { AdminUsers } from './modules/admin/AdminUsers';
import { AdminNotifications } from './modules/admin/AdminNotifications';
import { AdminAcademic } from './modules/admin/AdminAcademic';
import { AdminLostFound } from './modules/admin/AdminLostFound';
import { AdminTransport } from './modules/admin/AdminTransport';
import { AdminResources } from './modules/admin/AdminResources';
import { AdminCommunity } from './modules/admin/AdminCommunity';
import { AdminExplore } from './modules/admin/AdminExplore';
import { AdminDevelopers } from './modules/admin/AdminDevelopers';
import { AdminReports } from './modules/admin/AdminReports';
import { AdminAbout } from './modules/admin/AdminAbout';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes with Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        {!isAuthenticated && <Route path="/about" element={<AboutPage />} />}
      </Route>

      {/* Authentication Pages (Standalone) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ForgotPasswordPage />} />

      {/* Student Protected Modules */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/academic" element={<AcademicPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/lost-found" element={<LostFoundPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {isAuthenticated && <Route path="/about" element={<AboutPage />} />}
      </Route>

      {/* Administrator Protected Modules */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="academic" element={<AdminAcademic />} />
        <Route path="lost-found" element={<AdminLostFound />} />
        <Route path="transport" element={<AdminTransport />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="explore" element={<AdminExplore />} />
        <Route path="developers" element={<AdminDevelopers />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}


