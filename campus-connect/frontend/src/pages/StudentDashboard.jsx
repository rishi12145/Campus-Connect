import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { fileService } from '../services/fileService';
import { useNotification } from '../context/NotificationContext';
import {
  CalendarDays,
  Bell,
  SearchCode,
  Bus,
  FolderArchive,
  MessagesSquare,
  Compass,
  UserCheck,
  ArrowRight,
  Clock,
  MapPin,
  Download,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Phone,
  Copy,
  Volume2,
  VolumeX,
  Waves,
  Utensils,
  Cake,
  Car,
  Film,
  Coffee,
  Sun,
  X,
  ExternalLink,
  Flame,
  Radio,
  Palmtree,
  PartyPopper,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  // Mode: auto-detect weekend or let user switch days
  const daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayRealDayIndex = new Date().getDay();
  const todayRealDayName = daysList[todayRealDayIndex];
  const isRealWeekend = todayRealDayIndex === 0 || todayRealDayIndex === 6;

  const [selectedDay, setSelectedDay] = useState(todayRealDayName);
  const isWeekendActive = selectedDay === 'Saturday' || selectedDay === 'Sunday';

  // Data states
  const [announcements, setAnnouncements] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [resources, setResources] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  // Modals & Drawers
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [isStudyVaultOpen, setIsStudyVaultOpen] = useState(false);

  // Audio ocean ambiance state
  const [isPlayingOcean, setIsPlayingOcean] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Student mood selector
  const [activeMood, setActiveMood] = useState('chill');
  const moods = [
    { id: 'chill', label: '🏖️ Beach Chill', quote: 'Catch the Arabian Sea sunset at Nagoa Beach after classes!' },
    { id: 'code', label: '💻 Hackathon Rush', quote: 'Building the next big project in the Linux Computing Lab!' },
    { id: 'food', label: '🍕 Food Crawl', quote: 'Shankar Cake delivery or Ambica thali with friends tonight?' },
    { id: 'ride', label: '🛵 Vanakbara Cruise', quote: 'Cruising through the coastal palms on the ₹10 municipal bus!' }
  ];

  // Greeting by hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Load campus data
  const loadData = () => {
    const rawAnnouncements = storageService.getAnnouncements();
    const userBranch = user?.branch || 'CSE';
    const userSem = user?.semester || 'Semester 4';

    // Prioritize announcements matching student's branch and semester
    const branchAnnouncements = rawAnnouncements.filter(a => {
      const matchBranch = !a.targetBranch || a.targetBranch === 'All' || a.targetBranch === 'All Branches' || a.targetBranch === userBranch;
      const matchSem = !a.targetSemester || a.targetSemester === 'All' || a.targetSemester === 'All Semesters' || a.targetSemester === userSem;
      return matchBranch && matchSem;
    });
    setAnnouncements(branchAnnouncements.length > 0 ? branchAnnouncements : rawAnnouncements);

    const allRoutines = storageService.getRoutines();
    const semRoutines = allRoutines.filter(r => 
      r.semester === userSem && (!r.branch || r.branch === 'All' || r.branch === 'Common' || r.branch === userBranch)
    );
    setRoutines(semRoutines.length > 0 ? semRoutines : allRoutines.filter(r => r.semester === userSem));
    setResources(storageService.getResources());
    setDiscussions(storageService.getDiscussions());
    setLostFoundItems(storageService.getLostFound().filter(item => item.status === 'open'));
    setFeaturedPlaces(storageService.getPlaces().slice(0, 4));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('campus_connect_update', handleUpdate);
    return () => window.removeEventListener('campus_connect_update', handleUpdate);
  }, [user]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#B7F34A', '#FF9F43', '#00D2D3', '#54A0FF', '#FF6B6B']
    });
  };

  // Ocean wave sound synthesizer using Web Audio API
  const toggleOceanSound = () => {
    if (isPlayingOcean) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingOcean(false);
      showToast('Diu coastal ambiance paused', 'info');
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // White noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter to sound like soft rolling ocean waves
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);

        // LFO for wave rhythmic volume swelling
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime); // ~7 sec wave cycle

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.05, ctx.currentTime);

        lfo.connect(mainGain.gain);
        whiteNoise.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);

        whiteNoise.start();
        lfo.start();
        setIsPlayingOcean(true);
        showToast('Playing Arabian Sea coastal waves 🌊', 'success');
      } catch (err) {
        console.error('Audio error:', err);
        showToast('Audio not supported on this browser', 'error');
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}: ${text}`, 'success');
  };

  const handleDownload = (resItem) => {
    storageService.incrementDownload(resItem.id);
    fileService.downloadTextFile(resItem.fileName, resItem.fileContent, 'text/plain');
    showToast(`Downloaded: ${resItem.fileName}`, 'success');
  };

  // Routines for the currently selected day
  const currentDayClasses = routines.filter(r => r.day.toLowerCase() === selectedDay.toLowerCase());

  // Next class calculation for weekday
  const nextClass = currentDayClasses.length > 0 ? currentDayClasses[0] : null;

  const moduleShortcuts = [
    { title: 'Academic Schedule', desc: 'Timetables & rooms', icon: CalendarDays, path: '/academic', badge: 'Active', color: '#B7F34A' },
    { title: 'Campus Notices', desc: 'Official circulars', icon: Bell, path: '/notifications', badge: `${announcements.length} New`, color: '#FF9F43' },
    { title: 'Lost & Found', desc: 'Lost items & claims', icon: SearchCode, path: '/lost-found', badge: `${lostFoundItems.length} Live`, color: '#B7F34A' },
    { title: 'Bus & Transport', desc: '₹10 Bus & Hotlines', icon: Bus, path: '/transport', badge: '₹10 Fare', color: '#FF9F43' },
    { title: 'Shared Resources', desc: 'PYQs & notes vault', icon: FolderArchive, path: '/resources', badge: `${resources.length} Files`, color: '#B7F34A' },
    { title: 'Community Forum', desc: 'Peer Q&A & discussions', icon: MessagesSquare, path: '/community', badge: `${discussions.length} Posts`, color: '#FF9F43' },
    { title: 'Explore Diu', desc: '20 Curated Spots', icon: Compass, path: '/explore', badge: '20 Spots', color: '#B7F34A' },
    { title: 'Student Profile', desc: 'Roll & credentials', icon: UserCheck, path: '/profile', badge: 'You', color: '#FF9F43' }
  ];

  const speedDialContacts = [
    { name: 'Saddam Delivery Boy', desc: 'Diu market to campus gate', number: '8200106584', icon: Car, tag: 'Delivery' },
    { name: 'Shankar Cake Making', desc: '100% college gate delivery', number: '9426601832', icon: Cake, tag: 'Bakery' },
    { name: 'Asvinbhai Bus Incharge', desc: 'Diu ⇄ Vanakbara ₹10 bus', number: '9426402875', icon: Bus, tag: 'Govt Bus' },
    { name: 'Ikbal Bhai Chagda', desc: 'Local Diu auto transport', number: '9016270139', icon: Car, tag: 'Auto' },
    { name: 'Ambica Restaurant', desc: 'Student favorite dining', number: '9523020304', icon: Utensils, tag: 'Food' },
    { name: 'Salim Biryani Diu', desc: 'Biryani & hostel orders', number: '8140045611', icon: Utensils, tag: 'Food' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. ANIMATED LIVE TICKER MARQUEE */}
      <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-[#262626] p-2.5 shadow-md flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-xl bg-[#B7F34A] text-[#0A0A0A] font-extrabold text-[11px] tracking-wider uppercase">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Campus Pulse</span>
        </div>
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-xs text-[#CCCCCC] font-medium whitespace-nowrap flex items-center gap-8">
            <span className="inline-flex items-center gap-1.5 text-[#B7F34A]">
              <Bus className="w-3.5 h-3.5" /> Diu ⇄ Vanakbara Govt Bus: ₹10 municipal fare anywhere in Diu • Kevdi Midpoint ±10 min
            </span>
            <span className="text-[#555555]">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#FF9F43]">
              <Cake className="w-3.5 h-3.5" /> Shankar Cake: 100% hostel delivery available at 9426601832
            </span>
            <span className="text-[#555555]">•</span>
            <span className="inline-flex items-center gap-1.5 text-white">
              <Car className="w-3.5 h-3.5 text-[#B7F34A]" /> Campus Delivery Boy Saddam: Call 8200106584 for market pickups
            </span>
            <span className="text-[#555555]">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#B7F34A]">
              <Compass className="w-3.5 h-3.5" /> Weekend Alert: 20 Diu spots mapped with Google directions & travel times
            </span>
            <span className="text-[#555555]">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#FF9F43]">
              <Utensils className="w-3.5 h-3.5" /> Ambica Restaurant: 9523020304 • Shardha: 9016746390
            </span>
          </div>
        </div>
      </div>

      {/* 2. CREATIVE CAMPUS POV HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121212] via-[#161616] to-[#0D0D0D] border border-[#262626] p-6 sm:p-8 text-white shadow-2xl">
        {/* Ambient background glow and animated floating particles */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/images/campus/campus-sky.jpg')` }}
        />
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#B7F34A]/10 filter blur-[80px] pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#FF9F43]/10 filter blur-[90px] pointer-events-none animate-pulse-subtle" />

        <div className="relative z-10 space-y-6">
          {/* Top row: Status indicators & Interactive Ocean sound toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-ping" />
                {user?.batch || 'B.Tech CSE'} • {user?.semester || 'Semester 4'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#222222] text-[#CCCCCC] border border-[#333333]">
                <MapPin className="w-3.5 h-3.5 text-[#FF9F43]" />
                Kevdi Education Hub, Diu Island
              </span>
            </div>

            {/* Ocean Waves Sound Ambiance Toggle */}
            <button
              onClick={toggleOceanSound}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                isPlayingOcean
                  ? 'bg-[#B7F34A] text-[#0A0A0A] border-[#B7F34A] shadow-lg shadow-[#B7F34A]/20'
                  : 'bg-[#1C1C1C] text-[#AAAAAA] border-[#333333] hover:text-white hover:border-[#555555]'
              }`}
              title="Toggle Arabian Sea Wave Ambiance"
            >
              {isPlayingOcean ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>Sea Waves Playing</span>
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 bg-[#0A0A0A] h-2 animate-pulse" />
                    <span className="w-1 bg-[#0A0A0A] h-3 animate-pulse delay-75" />
                    <span className="w-1 bg-[#0A0A0A] h-1.5 animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <>
                  <Waves className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>Diu Wave Sound</span>
                </>
              )}
            </button>
          </div>

          {/* Center Greeting & Campus Energy */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{getGreeting()},</span>
                <span className="shimmer-text">{user?.fullName?.split(' ')[0] || 'Scholar'}!</span>
                <motion.span
                  animate={{ rotate: [0, 15, -10, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="inline-block origin-bottom-right"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-sm sm:text-base text-[#AAAAAA] max-w-2xl leading-relaxed">
                Welcome to your interactive campus ecosystem. High-speed academic coordination, verified Diu bus timings, 
                instant hostel delivery speed-dials, and student community connection — all in one creative space.
              </p>

              {/* Campus Mood Interactive Selector */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#777777] mr-1">Your Vibe Today:</span>
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMood(m.id);
                      triggerConfetti();
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeMood === m.id
                        ? 'bg-[#B7F34A] text-[#0A0A0A] scale-105 shadow-md shadow-[#B7F34A]/25'
                        : 'bg-[#202020] text-[#CCCCCC] hover:bg-[#2A2A2A] hover:text-white border border-[#333333]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#B7F34A] italic pt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                "{moods.find(m => m.id === activeMood)?.quote}"
              </p>
            </div>

            {/* Quick Action Dock */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => setIsScheduleDrawerOpen(true)}
                className="btn-lime text-xs font-black px-5 py-3 shadow-xl flex items-center justify-center gap-2 group"
              >
                <CalendarDays className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Open Timetable Drawer</span>
              </button>

              <button
                onClick={() => setIsStudyVaultOpen(true)}
                className="btn-orange text-xs font-black px-5 py-3 shadow-xl flex items-center justify-center gap-2 group"
              >
                <FolderArchive className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Quick Study Vault</span>
              </button>
            </div>
          </div>

          {/* Interactive Day Switcher Pill Bar */}
          <div className="pt-4 border-t border-[#262626] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-bold text-[#888888] shrink-0 mr-1">Select Day:</span>
              {daysList.map((day) => {
                const isDayWeekend = day === 'Saturday' || day === 'Sunday';
                const isSelected = selectedDay === day;
                const isRealToday = todayRealDayName === day;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      if (isDayWeekend) triggerConfetti();
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? isDayWeekend
                          ? 'bg-[#FF9F43] text-[#0A0A0A] shadow-lg shadow-[#FF9F43]/30 scale-105'
                          : 'bg-[#B7F34A] text-[#0A0A0A] shadow-lg shadow-[#B7F34A]/30 scale-105'
                        : 'bg-[#1C1C1C] text-[#AAAAAA] hover:text-white border border-[#2E2E2E]'
                    }`}
                  >
                    <span>{day.slice(0, 3)}</span>
                    {isDayWeekend && <span>🏖️</span>}
                    {isRealToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Weekend preview pill shortcut */}
            <button
              onClick={() => {
                setSelectedDay(isWeekendActive ? todayRealDayName : 'Saturday');
                triggerConfetti();
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-[#FF9F43] border border-[#FF9F43]/40 flex items-center gap-1.5 transition-all"
            >
              <Palmtree className="w-3.5 h-3.5" />
              <span>{isWeekendActive ? 'Switch to Weekday View' : 'Preview Weekend Mode 🎉'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CONDITIONAL EXPERIENCE: WEEKEND MODE vs WEEKDAY PULSE */}
      <AnimatePresence mode="wait">
        {isWeekendActive ? (
          <motion.div
            key="weekend-experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Giant Weekend Banner with Waves & Confetti */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181D14] via-[#1E1912] to-[#171A15] border-2 border-[#B7F34A]/40 p-8 text-center space-y-6 shadow-2xl">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#B7F34A]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF9F43]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-center items-center gap-4 text-4xl sm:text-5xl">
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🏖️
                </motion.span>
                <motion.span
                  animate={{ y: [0, -14, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }}
                >
                  🌴
                </motion.span>
                <motion.span
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, delay: 0.4 }}
                >
                  🌊
                </motion.span>
                <motion.span
                  animate={{ y: [0, -16, 0] }}
                  transition={{ repeat: Infinity, duration: 2.6, delay: 0.6 }}
                >
                  ☀️
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, delay: 0.8 }}
                >
                  🎉
                </motion.span>
              </div>

              <div className="space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full bg-[#B7F34A] text-[#0A0A0A]">
                  {selectedDay.toUpperCase()} VIBE • NO CLASSES TODAY!
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight pt-2">
                  Weekend Mode Activated! Time to Relax & Explore Diu!
                </h2>
                <p className="text-sm text-[#CCCCCC] leading-relaxed">
                  No early morning lectures, no lab records due today! Grab your friends, hop on the ₹10 municipal bus 
                  from the college gate, hit Nagoa Beach, explore the historic Diu Fort, and recharge.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={triggerConfetti}
                  className="btn-lime text-xs font-black px-5 py-3 shadow-xl flex items-center gap-2"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Throw Confetti!</span>
                </button>
                <Link
                  to="/explore"
                  className="btn-orange text-xs font-black px-5 py-3 shadow-xl flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore 20 Diu Attractions</span>
                </Link>
                <Link
                  to="/transport"
                  className="btn-secondary text-xs font-bold px-5 py-3 flex items-center gap-2"
                >
                  <Bus className="w-4 h-4 text-[#B7F34A]" />
                  <span>Weekend Bus & Auto Numbers</span>
                </Link>
              </div>
            </div>

            {/* Weekend Curated Diu Itinerary Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Palmtree className="w-5 h-5 text-[#B7F34A]" />
                    <span>Top Weekend Escapes for IIITV-ICD Students</span>
                  </h3>
                  <p className="text-xs text-[#888888]">
                    Authentic spots close to Kevdi campus with student-friendly travel options
                  </p>
                </div>
                <Link to="/explore" className="text-xs font-bold text-[#B7F34A] hover:underline flex items-center gap-1">
                  <span>View All 20 Spots</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#161616] border border-[#262626] hover:border-[#B7F34A] transition-all hover:-translate-y-1 group space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#222222] text-[#B7F34A] flex items-center justify-center font-bold text-xl">
                    🏖️
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                    Nagoa Beach Sunset & Water Sports
                  </h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Famous horseshoe beach with water scooters and unique Hoka trees. The ₹10 municipal bus stops directly at the beach entrance!
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#B7F34A] bg-[#B7F34A]/10 px-2 py-0.5 rounded">
                    5.2 km from Kevdi • ₹10 Bus
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#161616] border border-[#262626] hover:border-[#FF9F43] transition-all hover:-translate-y-1 group space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#222222] text-[#FF9F43] flex items-center justify-center font-bold text-xl">
                    🏰
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF9F43] transition-colors">
                    Diu Fort & Lighthouse
                  </h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Massive 1535 Portuguese sea fortress. Walk along the ramparts, spot historical bronze cannons, and enjoy panoramic sea views.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded">
                    6.8 km from Kevdi • Free Entry
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#161616] border border-[#262626] hover:border-[#B7F34A] transition-all hover:-translate-y-1 group space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#222222] text-[#B7F34A] flex items-center justify-center font-bold text-xl">
                    🕳️
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                    Naida Caves Exploration
                  </h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Interconnected geological rock chasms carved during Portuguese quarrying. Perfect photogenic sunbeams through open rock ceilings.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#B7F34A] bg-[#B7F34A]/10 px-2 py-0.5 rounded">
                    6.2 km from Kevdi • Photography Spot
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#161616] border border-[#262626] hover:border-[#FF9F43] transition-all hover:-translate-y-1 group space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#222222] text-[#FF9F43] flex items-center justify-center font-bold text-xl">
                    🍕
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF9F43] transition-colors">
                    Student Food Hangout
                  </h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Order a custom cake from Shankar Cake (9426601832) delivered to campus, or visit Ambica Restaurant (9523020304) with classmates.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded">
                    Hostel Gate Delivery
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="weekday-experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Campus Live Radar Widget: Class Pulse + Weather + Bus Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Today's Class Radar (Compact & Creative, not overwhelming) */}
              <div className="p-6 rounded-3xl bg-[#161616] border border-[#262626] flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-ping" />
                      {selectedDay} Schedule
                    </span>
                    <span className="text-xs text-[#888888]">
                      {currentDayClasses.length} {currentDayClasses.length === 1 ? 'Class' : 'Classes'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">Academic Day Status</h3>

                  {nextClass ? (
                    <div className="p-3.5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#B7F34A]">{nextClass.code}</span>
                        <span className="text-[#AAAAAA] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF9F43]" />
                          {nextClass.startTime} – {nextClass.endTime}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{nextClass.subject}</h4>
                      <p className="text-[11px] text-[#888888] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B7F34A]" />
                        {nextClass.room} • Faculty: {nextClass.faculty}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#888888] py-2">
                      No more classes on schedule for this slot. Free time for research!
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setIsScheduleDrawerOpen(true)}
                  className="w-full btn-secondary text-xs font-bold py-2.5 justify-center flex items-center gap-2 group-hover:border-[#B7F34A] transition-all"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>View All {selectedDay} Classes ({currentDayClasses.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Live Diu Transport Radar */}
              <div className="p-6 rounded-3xl bg-[#161616] border border-[#262626] flex flex-col justify-between space-y-4 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
                      Transport Radar
                    </span>
                    <span className="text-xs font-bold text-[#B7F34A]">₹10 Flat Fare</span>
                  </div>

                  <h3 className="text-lg font-black text-white">Govt Bus & Auto Route</h3>

                  <div className="p-3.5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs text-[#CCCCCC]">
                      <span className="font-bold text-[#FF9F43]">Diu Town</span>
                      <span className="text-[10px] text-[#888888]">⇄ 10 min ⇄</span>
                      <span className="font-bold text-[#B7F34A]">Kevdi (Campus)</span>
                      <span className="text-[10px] text-[#888888]">⇄ 10 min ⇄</span>
                      <span className="font-bold text-[#FF9F43]">Vanakbara</span>
                    </div>
                    <p className="text-[11px] text-[#AAAAAA] leading-relaxed">
                      College gate is at the Kevdi midpoint. Every bus reaches Kevdi in ±10 mins of origin departure.
                    </p>
                  </div>
                </div>

                <Link
                  to="/transport"
                  className="w-full btn-secondary text-xs font-bold py-2.5 justify-center flex items-center gap-2 hover:border-[#FF9F43] transition-all"
                >
                  <Bus className="w-3.5 h-3.5 text-[#FF9F43]" />
                  <span>Check Bus Timetable & Autos</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Card 3: Diu Island Weather & Coastal Breeze */}
              <div className="p-6 rounded-3xl bg-[#161616] border border-[#262626] flex flex-col justify-between space-y-4 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#00D2D3]/20 text-[#00D2D3] border border-[#00D2D3]/40">
                      Island Atmosphere
                    </span>
                    <span className="text-xs text-[#888888]">Arabian Sea</span>
                  </div>

                  <h3 className="text-lg font-black text-white">Diu Coastal Weather</h3>

                  <div className="p-3.5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-[#FF9F43]" />
                        <span className="text-base font-black text-white">29°C</span>
                      </div>
                      <span className="text-xs text-[#00D2D3] font-semibold">16 km/h Breeze</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">
                      Ideal weather for cycling to Vanakbara or an evening beach walk after 5 PM.
                    </p>
                  </div>
                </div>

                <Link
                  to="/explore"
                  className="w-full btn-secondary text-xs font-bold py-2.5 justify-center flex items-center gap-2 hover:border-[#00D2D3] transition-all"
                >
                  <Compass className="w-3.5 h-3.5 text-[#00D2D3]" />
                  <span>Discover Island Places</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SPEED DIAL CONTACTS DIRECTORY (Saddam, Shankar Cake, Chagda Auto, etc.) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#B7F34A]" />
              <span>Campus Essential Speed-Dial</span>
            </h3>
            <p className="text-xs text-[#888888]">1-click call or copy for verified local services & deliveries</p>
          </div>
          <Link to="/transport" className="text-xs font-bold text-[#FF9F43] hover:underline flex items-center gap-1">
            <span>All Contacts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {speedDialContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div
                key={contact.name}
                className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#B7F34A] transition-all flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#222222] text-[#B7F34A]">
                      {contact.tag}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-[#888888] group-hover:text-[#B7F34A] transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{contact.name}</h4>
                  <p className="text-[10px] text-[#777777] truncate mt-0.5">{contact.desc}</p>
                </div>

                <div className="pt-2 border-t border-[#222222] flex items-center justify-between gap-1.5">
                  <a
                    href={`tel:${contact.number.replace(/\s+/g, '')}`}
                    className="flex-1 btn-lime text-[11px] font-bold py-1 px-2 flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => handleCopy(contact.number, contact.name)}
                    className="p-1 rounded-lg bg-[#252525] hover:bg-[#333333] text-[#CCCCCC] transition-colors"
                    title="Copy Number"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK CAMPUS SERVICES (8 MODULES LAUNCHPAD) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9F43]" />
            <span>Campus Portals & Services</span>
          </h3>
          <p className="text-xs text-[#888888]">Direct access to all 8 core campus modules</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {moduleShortcuts.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className="bg-[#161616] border border-[#262626] hover:border-[#B7F34A] rounded-2xl p-4 flex flex-col justify-between items-start transition-all hover:-translate-y-1 group shadow-lg"
              >
                <div className="w-full flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#222222] flex items-center justify-center text-white border border-[#333333] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-[#B7F34A]" />
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#252525] text-[#AAAAAA]">
                    {mod.badge}
                  </span>
                </div>
                <div className="w-full">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#B7F34A] transition-colors truncate">
                    {mod.title}
                  </h4>
                  <p className="text-[10px] text-[#777777] truncate mt-0.5">{mod.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 6. CAMPUS BUZZ: CIRCULARS & COMMUNITY SPOTLIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Latest Circulars (6 Cols) */}
        <div className="lg:col-span-6 bg-[#161616] rounded-3xl border border-[#262626] shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#222222] text-[#FF9F43] flex items-center justify-center font-bold border border-[#333333]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Campus Circulars</h3>
                <p className="text-xs text-[#888888]">Official administrative notices</p>
              </div>
            </div>
            <Link to="/notifications" className="text-xs font-bold text-[#FF9F43] hover:underline flex items-center gap-1">
              <span>All Notices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-2xl bg-[#1D1D1D] border border-[#2A2A2A] hover:border-[#383838] transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#262626] border border-[#333333] text-[#CCCCCC]">
                    {ann.category}
                  </span>
                  {ann.isImportant && (
                    <span className="text-[10px] font-bold text-[#111111] bg-[#FF9F43] px-2 py-0.5 rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-[#999999] line-clamp-2 leading-relaxed">
                  {ann.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Discussions & Lost and Found (6 Cols) */}
        <div className="lg:col-span-6 bg-[#161616] rounded-3xl border border-[#262626] shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#222222] text-[#B7F34A] flex items-center justify-center font-bold border border-[#333333]">
                <MessagesSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Student Peer Discussions</h3>
                <p className="text-xs text-[#888888]">Collaborations & campus questions</p>
              </div>
            </div>
            <Link to="/community" className="text-xs font-bold text-[#B7F34A] hover:underline flex items-center gap-1">
              <span>Open Forum</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {discussions.slice(0, 3).map((disc) => (
              <Link
                key={disc.id}
                to="/community"
                className="p-3.5 rounded-2xl bg-[#1D1D1D] border border-[#2A2A2A] hover:border-[#B7F34A] block space-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-[#888888]">
                  <span className="font-bold text-[#B7F34A]">{disc.category}</span>
                  <span>By {disc.authorName}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{disc.title}</h4>
                <div className="flex items-center gap-4 text-[10px] text-[#888888] pt-1">
                  <span>{disc.likes?.length || 0} Likes</span>
                  <span>{disc.commentsCount || 0} Replies</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isScheduleDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#141414] border-l border-[#262626] h-full overflow-y-auto p-6 space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#222222] text-[#B7F34A] flex items-center justify-center font-bold">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {selectedDay} Academic Schedule
                    </h3>
                    <p className="text-xs text-[#888888]">{user?.semester || 'Semester 4'} • Verified rooms</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsScheduleDrawerOpen(false)}
                  className="p-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Day filter pills inside drawer */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {daysList.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                      selectedDay === d
                        ? 'bg-[#B7F34A] text-[#0A0A0A]'
                        : 'bg-[#222222] text-[#888888] hover:text-white'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Class list */}
              <div className="space-y-3">
                {currentDayClasses.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#1A1A1A] border border-[#262626] space-y-2">
                    <span className="text-2xl">🏖️</span>
                    <h4 className="text-sm font-bold text-white">No classes on {selectedDay}!</h4>
                    <p className="text-xs text-[#888888]">
                      Free time for project work, study revision, or exploring Diu Island.
                    </p>
                  </div>
                ) : (
                  currentDayClasses.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#B7F34A] transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold bg-[#B7F34A] text-[#111111] px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-xs font-bold text-[#FF9F43]">{item.type}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                      <p className="text-xs text-[#999999]">Faculty: {item.faculty}</p>
                      <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs text-[#CCCCCC]">
                        <span className="flex items-center gap-1 text-[#FF9F43]">
                          <Clock className="w-3.5 h-3.5" />
                          {item.startTime} – {item.endTime}
                        </span>
                        <span className="flex items-center gap-1 text-[#B7F34A]">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.room}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-[#262626]">
                <Link
                  to="/academic"
                  onClick={() => setIsScheduleDrawerOpen(false)}
                  className="w-full btn-lime text-xs font-bold py-2.5 justify-center flex items-center gap-2"
                >
                  <span>Open Full Weekly Timetable Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStudyVaultOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStudyVaultOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#141414] border-l border-[#262626] h-full overflow-y-auto p-6 space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#222222] text-[#FF9F43] flex items-center justify-center font-bold">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Study Resources Vault</h3>
                    <p className="text-xs text-[#888888]">1-click download PYQs & lecture notes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStudyVaultOpen(false)}
                  className="p-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF9F43] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-[#888888]">{res.fileSize}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{res.title}</h4>
                    <p className="text-[11px] text-[#888888]">Subject: {res.subject}</p>
                    <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                      <span className="text-[10px] text-[#777777]">{res.downloadCount || 0} downloads</span>
                      <button
                        onClick={() => handleDownload(res)}
                        className="btn-lime text-[11px] px-3 py-1 font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#262626]">
                <Link
                  to="/resources"
                  onClick={() => setIsStudyVaultOpen(false)}
                  className="w-full btn-orange text-xs font-bold py-2.5 justify-center flex items-center gap-2"
                >
                  <span>Open Full Resources Library</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
