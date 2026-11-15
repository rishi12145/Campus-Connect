import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const loadNotifications = () => {
    const list = storageService.getNotifications(user?.id);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = (e) => {
      if (e.detail?.key?.includes('notification') || !e.detail?.key) {
        loadNotifications();
      }
    };

    window.addEventListener('campus_connect_update', handleUpdate);
    return () => window.removeEventListener('campus_connect_update', handleUpdate);
  }, [user]);

  const markAsRead = (id) => {
    storageService.markNotificationRead(id);
    loadNotifications();
  };

  const markAllAsRead = () => {
    storageService.markAllNotificationsRead(user?.id);
    loadNotifications();
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        showToast,
        refresh: loadNotifications
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-elevated border text-sm font-medium ${
                toast.type === 'error'
                  ? 'bg-[#111111] text-white border-red-500/30'
                  : toast.type === 'info'
                  ? 'bg-[#111111] text-white border-[#B7F34A]/30'
                  : 'bg-[#111111] text-white border-[#EEEEEC]/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                ) : toast.type === 'info' ? (
                  <Info className="w-5 h-5 text-[#B7F34A] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#B7F34A] shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

