import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword, updatePassword } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user reached this page via Supabase recovery link (access_token with type=recovery in hash)
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || location.pathname === '/reset-password') {
      setIsResetMode(true);
    }
  }, [location]);

  const handleSendRecoveryLink = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your registered college email.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(cleanEmail);
      setSuccess(true);
      showToast('Password recovery link sent! Please check your inbox.', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send recovery link. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await updatePassword(newPassword);
      showToast('Password updated successfully! Please log in with your new password.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again or request a new recovery link.');
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

        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#222222] to-[#0A0A0A] flex items-center justify-center text-[#B7F34A] font-extrabold text-base border border-[#333333] shadow-md shadow-[#B7F34A]/10">
              CC
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CAMPUS CONNECT</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isResetMode ? 'Set New Password' : 'Reset Account Password'}
          </h2>
          <p className="text-xs text-[#888888]">
            {isResetMode
              ? 'Enter a secure new password for your Campus Connect account.'
              : 'Enter your registered IIITV-ICD email to receive a password reset link.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        {isResetMode ? (
          /* Step 2: Set New Password Form (from Supabase recovery link) */
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-lime text-xs font-extrabold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : success ? (
          /* Step 1 Success: Link Sent Confirmation */
          <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#B7F34A]/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B7F34A]/20 border border-[#B7F34A]/40 flex items-center justify-center text-[#B7F34A] mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[#B7F34A]" />
            </div>
            <h3 className="text-base font-bold text-white">Recovery Email Sent</h3>
            <p className="text-xs text-[#AAAAAA] leading-relaxed">
              We have dispatched a secure password reset link to <strong className="text-white">{email}</strong>. Please check your inbox and click the link to proceed.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-lime text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-[#B7F34A]/20"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Step 1 Form: Request Recovery Link */
          <form onSubmit={handleSendRecoveryLink} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Registered College Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rollno@diu.iiitvadodara.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-lime text-xs font-extrabold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending link...' : 'Send Password Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#262626] text-xs text-[#888888]">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#B7F34A] hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
