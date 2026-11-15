import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/#features' },
    { name: 'Campus Life', href: '/#campus' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#262626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C1C1C] to-[#0D0D0D] flex items-center justify-center text-white border border-[#333333] group-hover:border-[#B7F34A] transition-colors shadow-md shadow-[#B7F34A]/10">
            <span className="font-bold text-lg tracking-wider text-[#B7F34A]">CC</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">CAMPUS CONNECT</span>
              <span className="w-2 h-2 rounded-full bg-[#B7F34A] shadow-[0_0_8px_#B7F34A]"></span>
            </div>
            <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
              IIIT Vadodara — ICD
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-semibold transition-colors hover:text-[#B7F34A] ${
                location.pathname === link.href ? 'text-[#B7F34A]' : 'text-[#AAAAAA]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="btn-lime text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#B7F34A]/20"
            >
              Go to {isAdmin ? 'Admin Console' : 'Dashboard'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#CCCCCC] px-4 py-2 rounded-xl hover:bg-[#1C1C1C] hover:text-white transition-colors border border-[#2E2E2E]"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-lime text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#B7F34A]/20"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-[#1C1C1C] rounded-xl transition-colors border border-[#333333]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#262626] bg-[#121212] px-4 py-6 space-y-4 text-white"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#CCCCCC] hover:bg-[#202020] hover:text-[#B7F34A]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#262626] space-y-2">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-lime text-xs font-bold py-2.5 justify-center flex items-center"
                >
                  Go to {isAdmin ? 'Admin Console' : 'Dashboard'}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full btn-secondary text-xs font-bold py-2.5 justify-center flex items-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full btn-lime text-xs font-bold py-2.5 justify-center flex items-center"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
