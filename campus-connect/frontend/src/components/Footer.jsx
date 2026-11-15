import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-12 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#222222]">
          {/* Col 1: Identity & Campus Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#222222] to-[#0A0A0A] flex items-center justify-center border border-[#B7F34A]/40 text-[#B7F34A] font-extrabold text-base shadow-sm">
                CC
              </div>
              <span className="font-extrabold text-lg tracking-tight">CAMPUS CONNECT</span>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              "Your Campus. Everything Connected."
              <br />
              The centralized digital ecosystem for student academic schedules, verified announcements, lost & found recovery, crowdsourced study materials, and local Diu transport coordination.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-bold bg-[#181818] text-[#B7F34A] border border-[#2E2E2E] px-3 py-1 rounded-full">
                IIITV-ICD Student Digital Portal
              </span>
            </div>
          </div>

          {/* Col 2: Modules Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Campus Services
            </h4>
            <ul className="space-y-2 text-xs text-[#888888]">
              <li><Link to="/academic" className="hover:text-[#B7F34A] transition-colors">Academic Schedules</Link></li>
              <li><Link to="/notifications" className="hover:text-[#B7F34A] transition-colors">Announcements & Notices</Link></li>
              <li><Link to="/lost-found" className="hover:text-[#B7F34A] transition-colors">Lost & Found Portal</Link></li>
              <li><Link to="/transport" className="hover:text-[#B7F34A] transition-colors">Diu Bus & Auto Transport</Link></li>
              <li><Link to="/resources" className="hover:text-[#B7F34A] transition-colors">Study Vault & PYQs</Link></li>
              <li><Link to="/community" className="hover:text-[#B7F34A] transition-colors">Student Peer Forum</Link></li>
              <li><Link to="/explore" className="hover:text-[#B7F34A] transition-colors">Explore Diu (20 Spots)</Link></li>
            </ul>
          </div>

          {/* Col 3: Development Team (No roll numbers, no SPM) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Development Team
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888]">
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]"></span>
                <span className="font-bold">Sriya Reddy</span>
                <span className="text-[10px] text-[#777777]">• Frontend Architect</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]"></span>
                <span className="font-bold">Shivangi Goutam</span>
                <span className="text-[10px] text-[#777777]">• Platform Systems</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]"></span>
                <span className="font-bold">Rishikesh Gopal</span>
                <span className="text-[10px] text-[#777777]">• Full-Stack Engineer</span>
              </li>
              <li className="pt-2 text-[11px] text-[#777777]">
                Engineered for IIIT Vadodara – International Campus Diu
              </li>
            </ul>
          </div>

          {/* Col 4: Institute Reference */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Institute Reference
            </h4>
            <p className="text-xs text-[#888888] leading-relaxed mb-3">
              Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD).
              <br />
              Education Hub, Kevdi, Diu (U.T.) – 362520.
            </p>
            <a
              href="http://diu.iiitvadodara.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#B7F34A] hover:underline"
            >
              <span>diu.iiitvadodara.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar & Clean Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <p>
            © {new Date().getFullYear()} Campus Connect • IIIT Vadodara – International Campus Diu. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[11px] bg-[#161616] px-3.5 py-1.5 rounded-full border border-[#262626]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Official Student Platform • Built for IIITV-ICD Campus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
