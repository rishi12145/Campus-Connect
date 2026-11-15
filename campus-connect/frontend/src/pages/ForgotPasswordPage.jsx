import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { storageService } from '../services/storageService';
import { Mail, KeyRound, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your college email.');
      return;
    }
    setError('');
    setStep(2);
    showToast('Simulation: Demo verification code sent (Code: 7392)', 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== '7392' && otp !== '1234') {
      setError('Invalid code. Use simulated code 7392.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Update in storage if user exists
    const users = storageService.getUsers();
    const user = users.find(u => u.collegeEmail.toLowerCase() === email.toLowerCase());
    if (user) {
      storageService.updateProfile(user.id, { customPassword: newPassword });
    }

    showToast('Password reset successfully. Please log in.', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F8F8F6]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#EEEEEC] shadow-elevated p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-[#B7F34A] font-extrabold text-base border border-[#262626]">
              CC
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">CAMPUS CONNECT</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">Reset Account Password</h2>
          <p className="text-xs text-[#777777]">
            Recover access using your registered IIITV-ICD email address.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Request Code */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                Registered College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs sm:text-sm text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs font-bold py-3 uppercase tracking-wider">
              Send Verification Code
            </button>
          </form>
        )}

        {/* Step 2: Simulated OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-[#B7F34A]/10 border border-[#B7F34A]/40 rounded-xl text-xs text-[#111111]">
              <span className="font-bold block mb-1">Local Demo Simulation:</span>
              Use demo verification code <strong className="font-mono bg-[#111111] text-[#B7F34A] px-1.5 py-0.5 rounded">7392</strong> to proceed.
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                Enter 4-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="7392"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs sm:text-sm text-[#111111] focus:bg-white focus:border-[#111111] outline-none tracking-widest font-mono text-center"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs font-bold py-3 uppercase tracking-wider">
              Verify Code
            </button>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs sm:text-sm text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs font-bold py-3 uppercase tracking-wider">
              Update Password
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#EEEEEC] text-xs text-[#777777]">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#111111] hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

