import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8F8F6] text-center">
      <div className="max-w-md space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#EEEEEC] shadow-elevated">
        <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#B7F34A] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-[#111111]">404</span>
          <h2 className="text-xl font-bold text-[#111111]">Page Not Found</h2>
          <p className="text-xs text-[#777777] leading-relaxed">
            The campus service or route you requested does not exist or has been relocated in the Campus Connect ecosystem.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/" className="btn-primary text-xs font-bold px-6 py-3">
            <ArrowLeft className="w-4 h-4 mr-1 text-[#B7F34A]" />
            <span>Return to Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

