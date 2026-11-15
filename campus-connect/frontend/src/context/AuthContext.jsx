import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize storage seed data on app start
    storageService.init();
    const current = storageService.getCurrentUser();
    if (current) {
      setUser(current);
    }
    setLoading(false);

    const handleAuthChange = () => {
      const updated = storageService.getCurrentUser();
      setUser(updated);
    };

    window.addEventListener('campus_connect_update', handleAuthChange);
    return () => window.removeEventListener('campus_connect_update', handleAuthChange);
  }, []);

  const login = async (emailOrRoll, password) => {
    const res = storageService.login(emailOrRoll, password);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = storageService.register(userData);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    storageService.logout();
    setUser(null);
  };

  const updateUser = async (updates) => {
    if (!user) return null;
    const updated = storageService.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

