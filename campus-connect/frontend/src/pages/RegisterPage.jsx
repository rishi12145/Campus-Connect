import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, Hash, BookOpen, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    collegeEmail: '',
    phoneNumber: '',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2023',
    semester: 'Semester 4',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const streams = ['B.Tech', 'M.Tech', 'MCA', 'PhD'];
  const branches = [
    { code: 'CSE', label: 'Computer Science & Engineering (CSE)' },
    { code: 'AI', label: 'Artificial Intelligence (AI)' },
    { code: 'Cyber Security', label: 'Cyber Security' },
    { code: 'ECE', label: 'Electronics & Communication (ECE)' }
  ];
  const batchYears = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const semesters = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.fullName.trim() || !formData.rollNumber.trim() || !formData.collegeEmail.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // STRICT INSTITUTE EMAIL VERIFICATION
    const email = formData.collegeEmail.trim().toLowerCase();
    const isInstituteEmail = email.endsWith('@diu.iiitvadodara.ac.in') || email.endsWith('@iiitvadodara.ac.in');
    if (!isInstituteEmail) {
      setError('Access restricted: Please enter your official institute email address ending with @diu.iiitvadodara.ac.in or @iiitvadodara.ac.in');
      return;
    }

    const phoneRegex = /^[0-9+ -]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setError('Please provide a valid 10-digit phone number.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      // Combine stream, branch, and single year into batch representation
      const payload = {
        ...formData,
        batch: `${formData.stream} ${formData.branch} ${formData.batchYear}`,
        batchYear: formData.batchYear,
        stream: formData.stream,
        branch: formData.branch
      };
      const res = await register(payload);
      if (res?.requiresConfirmation) {
        setSuccessMessage(`Registration successful! A verification email has been sent to ${formData.collegeEmail}. Please check your inbox and verify your email, then proceed to sign in.`);
      } else {
        showToast(`Welcome to Campus Connect, ${res?.user?.fullName || 'Student'}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
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
        className="w-full max-w-xl bg-[#141414] rounded-3xl border border-[#262626] shadow-2xl p-8 space-y-6 relative overflow-hidden z-10"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#222222] to-[#0A0A0A] flex items-center justify-center text-[#B7F34A] font-extrabold text-base border border-[#333333] shadow-md shadow-[#B7F34A]/10">
              CC
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CAMPUS CONNECT</span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Student Account</h2>
          <p className="text-xs text-[#888888]">
            Restricted to verified students of IIIT Vadodara – International Campus Diu.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#B7F34A]/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B7F34A]/20 border border-[#B7F34A]/40 flex items-center justify-center text-[#B7F34A] mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#B7F34A]" />
            </div>
            <h3 className="text-lg font-black text-white">Check Your Inbox</h3>
            <p className="text-xs text-[#AAAAAA] leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-lime text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-[#B7F34A]/20"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Patel"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Roll Number *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 202351042"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Institute Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="collegeEmail"
                  value={formData.collegeEmail}
                  onChange={handleChange}
                  placeholder="name@diu.iiitvadodara.ac.in"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                  required
                />
              </div>
              <span className="text-[10px] text-[#777777] mt-1 block">
                Must end with @diu.iiitvadodara.ac.in or @iiitvadodara.ac.in
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* STREAM, BRANCH, BATCH YEAR, SEMESTER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5">
                Stream / Degree
              </label>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs font-bold text-white focus:border-[#B7F34A] outline-none transition-all"
              >
                {streams.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5">
                Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs font-bold text-white focus:border-[#B7F34A] outline-none transition-all"
              >
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>{b.code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5">
                Batch Year
              </label>
              <select
                name="batchYear"
                value={formData.batchYear}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs font-bold text-white focus:border-[#B7F34A] outline-none transition-all"
              >
                {batchYears.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider mb-1.5">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs font-bold text-white focus:border-[#B7F34A] outline-none transition-all"
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
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

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-lime text-xs uppercase tracking-wider font-extrabold py-3.5 shadow-lg shadow-[#B7F34A]/20 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Registering...' : 'Create Verified Student Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        )}

        <div className="text-center pt-2 border-t border-[#262626]">
          <p className="text-xs text-[#888888]">
            Already registered?{' '}
            <Link to="/login" className="text-[#B7F34A] font-bold hover:underline">
              Sign In to Your Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
