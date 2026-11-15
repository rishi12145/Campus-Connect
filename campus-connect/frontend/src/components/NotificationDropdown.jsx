import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Bell, CheckCheck, ExternalLink, Calendar, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <AlertCircle className="w-4 h-4 text-[#B7F34A]" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'academic':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#B7F34A]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-[#111111] hover:bg-[#EEEEEC] border border-[#EEEEEC] transition-colors bg-white shadow-subtle"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#111111]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#111111] text-[#B7F34A] border-2 border-white text-[10px] font-black flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-campus-lg shadow-elevated border border-[#EEEEEC] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#EEEEEC] flex items-center justify-between bg-[#F8F8F6]">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#111111]">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#B7F34A] text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[#777777] hover:text-[#111111] flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#91C932]" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#EEEEEC]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#777777]">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-3.5 hover:bg-[#F8F8F6] transition-colors cursor-pointer flex items-start gap-3 ${
                      !item.isRead ? 'bg-[#B7F34A]/5' : ''
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h5 className={`text-xs font-semibold truncate ${!item.isRead ? 'text-[#111111]' : 'text-[#777777]'}`}>
                          {item.title}
                        </h5>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#B7F34A] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#777777] line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-[#777777] mt-1 block">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer View All */}
            <div className="p-2.5 border-t border-[#EEEEEC] bg-[#F8F8F6] text-center">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#111111] hover:text-[#91C932] transition-colors inline-flex items-center gap-1"
              >
                <span>View all announcements & alerts</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

