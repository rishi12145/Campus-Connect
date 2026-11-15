import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your institute email or roll number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(identifier.trim(), password);
      const userName = res?.user?.fullName || res?.user?.full_name || 'User';
      showToast(`Welcome back, ${userName}!`, 'success');
      if (res?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' || from === '/register' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0A] text-white relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#141414] rounded-3xl border border-[#262626] shadow-2xl p-8 space-y-6 relative overflow-hidden z-10"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B7F34A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#222222] to-[#0A0A0A] flex items-center justify-center text-[#B7F34A] font-extrabold text-base border border-[#333333] shadow-md shadow-[#B7F34A]/10">
              CC
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CAMPUS CONNECT</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-[#888888]">
            Enter your official IIITV-ICD email or roll number to continue.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
              Institute Email or Roll Number *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 202351001 or rollno@diu.iiitvadodara.ac.in"
                className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Password *
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#888888] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#B7F34A] w-3.5 h-3.5 rounded"
              />
              <span className="text-[#AAAAAA]">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-xs text-[#B7F34A] hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-lime text-xs uppercase tracking-wider font-extrabold py-3 shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to Campus Connect'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2 border-t border-[#262626]">
          <p className="text-xs text-[#888888]">
            New student?{' '}
            <Link to="/register" className="text-[#B7F34A] font-bold hover:underline">
              Create an account with College Email
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
