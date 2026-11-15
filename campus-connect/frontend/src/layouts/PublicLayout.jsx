import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CampusNightAnimation } from '../components/CampusNightAnimation';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#EEEEEE] relative selection:bg-[#B7F34A] selection:text-[#0A0A0A]">
      <CampusNightAnimation />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
