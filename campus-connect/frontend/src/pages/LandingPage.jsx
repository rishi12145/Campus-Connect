import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  MapPin,
  Clock,
  Car,
  Cake,
  Utensils
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const features = [
    {
      title: 'Academic Routines',
      description: 'Daily and weekly timetables, classroom allocations, subject codes, and faculty schedules without WhatsApp clutter.',
      icon: CalendarDays,
      link: '/academic',
      tag: 'Core',
      color: '#B7F34A'
    },
    {
      title: 'Notices & Announcements',
      description: 'Verified circulars for exams, syllabus revisions, guest lectures, and emergency alerts with target batch filtering.',
      icon: Bell,
      link: '/notifications',
      tag: 'Official',
      color: '#FF9F43'
    },
    {
      title: 'Lost & Found Network',
      description: 'Quickly report lost valuables, browse found items with genuine photos, and coordinate recovery across campus.',
      icon: SearchCode,
      link: '/lost-found',
      tag: 'Community',
      color: '#B7F34A'
    },
    {
      title: 'Diu Bus & Transport Hub',
      description: 'Official ₹10 Municipal Bus timetable (±10 min Kevdi midpoint rule), student auto numbers, and Somnath vans.',
      icon: Bus,
      link: '/transport',
      tag: '₹10 Bus',
      color: '#FF9F43'
    },
    {
      title: 'Shared Study Resources',
      description: 'Crowdsourced previous-year question papers (PYQs), lecture notes, lab manuals, and revision cheatsheets with 1-click download.',
      icon: FolderArchive,
      link: '/resources',
      tag: 'Academic',
      color: '#B7F34A'
    },
    {
      title: 'Community Forum',
      description: 'Ask peer questions, initiate project collaborations, discuss coding topics, and stay connected with campus life.',
      icon: MessagesSquare,
      link: '/community',
      tag: 'Discussions',
      color: '#FF9F43'
    },
    {
      title: 'Explore Diu (20 Spots)',
      description: '20 curated Portuguese forts, Blue Flag beaches, and shrines with Google Maps directions and distances from Kevdi.',
      icon: Compass,
      link: '/explore',
      tag: '20 Places',
      color: '#B7F34A'
    },
    {
      title: 'Student Profile & Settings',
      description: 'Unified identity with roll number, semester, batch details, and customizable notification preferences.',
      icon: UserCheck,
      link: '/profile',
      tag: 'Personal',
      color: '#FF9F43'
    }
  ];

  const galleryImages = [
    {
      title: 'Education Hub Main Complex',
      caption: 'The landmark IIITV-ICD academic building in Kevdi, Diu',
      src: '/images/campus/campus-main.jpg',
      category: 'Campus Architecture'
    },
    {
      title: 'Modern Academic Lecture Blocks',
      caption: 'Smart classrooms equipped for interactive engineering education',
      src: '/images/campus/campus-building.jpg',
      category: 'Classrooms'
    },
    {
      title: 'Advanced Computing Laboratories',
      caption: 'High-speed Linux development environments and compute clusters',
      src: '/images/campus/campus-lab.jpg',
      category: 'Laboratories'
    },
    {
      title: 'Central Library & Reading Halls',
      caption: 'Extensive digital library terminals and quiet study cubicles',
      src: '/images/campus/campus-library.jpg',
      category: 'Library'
    },
    {
      title: 'Student Residential Hostels',
      caption: 'Peaceful coastal accommodation situated in Kevdi',
      src: '/images/campus/campus-hostel.jpg',
      category: 'Hostels'
    },
    {
      title: 'Campus Life & Activities',
      caption: 'Annual sports, hackathons and cultural student gatherings',
      src: '/images/campus/campus-events.jpg',
      category: 'Student Life'
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden text-white bg-[#0A0A0A]">
      {/* ================= HERO SECTION WITH CAMPUS SKY BACKDROP ================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle Background Sky Ambient Overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity pointer-events-none rounded-3xl"
          style={{ backgroundImage: `url('/images/campus/campus-sky.jpg')` }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#FF9F43]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#2E2E2E] shadow-xl text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A] shadow-[0_0_8px_#B7F34A] animate-pulse" />
              <span>IIITV-ICD Student Digital Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Your Campus.
              <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#B7F34A] via-white to-[#FF9F43]">
                Everything Connected.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#AAAAAA] max-w-2xl leading-relaxed">
              One centralized platform for academic timetables, campus notices, PYQ study files, lost & found claims,
              <strong className="text-white"> flat ₹10 municipal buses</strong> with ±10 min Kevdi midpoint arrival,
              and <strong className="text-[#FF9F43]">20 curated Diu explorations</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-lime text-xs uppercase tracking-wider font-extrabold px-6 py-3.5 shadow-xl shadow-[#B7F34A]/25 flex items-center gap-2">
                    <span>Go to Overview (Dashboard)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/about" className="btn-secondary text-xs uppercase tracking-wider font-extrabold px-6 py-3.5">
                    <span>About Us & Support</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-lime text-xs uppercase tracking-wider font-extrabold px-6 py-3.5 shadow-xl shadow-[#B7F34A]/25 flex items-center gap-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-xs uppercase tracking-wider font-extrabold px-6 py-3.5">
                    <span>Student Login</span>
                  </Link>
                </>
              )}
            </div>

            {/* Verified Campus Access Badges */}
            <div className="mt-8 pt-6 border-t border-[#222222] flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#CCCCCC] bg-[#161616] px-3 py-1.5 rounded-full border border-[#2E2E2E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>Verified @diu.iiitvadodara.ac.in Portal</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#CCCCCC] bg-[#161616] px-3 py-1.5 rounded-full border border-[#2E2E2E]">
                <Bus className="w-3.5 h-3.5 text-[#FF9F43]" />
                <span>Flat ₹10 Municipal Bus Timetable</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#CCCCCC] bg-[#161616] px-3 py-1.5 rounded-full border border-[#2E2E2E]">
                <Compass className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>20 Curated Diu Island Attractions</span>
              </span>
            </div>
          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-[#141414] p-2.5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <img
                  src="/images/campus/campus-main.jpg"
                  alt="IIIT Vadodara International Campus Diu Main Building"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#B7F34A] text-[#111111] rounded-full inline-block mb-1 shadow">
                    Authentic Campus View
                  </span>
                  <h3 className="text-sm font-bold text-white">Education Hub, Kevdi</h3>
                  <p className="text-[11px] text-[#AAAAAA]">Indian Institute of Information Technology Vadodara — ICD</p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#181818] text-white p-3.5 rounded-2xl border border-[#333333] shadow-2xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#242424] flex items-center justify-center text-[#B7F34A] border border-[#383838]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">8 Integrated Modules</span>
                  <span className="text-[10px] text-[#FF9F43]">100% Student-Centric</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= THE PROBLEM & SOLUTION ================= */}
      <section className="bg-[#121212] py-20 border-y border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold text-[#FF9F43] uppercase tracking-wider">
              Centralizing Campus Life in Diu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything on campus, in one place.
            </h2>
            <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed">
              Students at IIITV-ICD often juggle scattered WhatsApp groups, misplaced items on unmonitored notice boards, missing bus contacts, and fragmented notes. Campus Connect brings clarity through a unified, elegant platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#181818] border border-[#2A2A2A] hover:border-[#B7F34A] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#242424] text-[#B7F34A] flex items-center justify-center font-bold mb-4 border border-[#333333]">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">No More Lost Circulars</h3>
              <p className="text-xs text-[#999999] leading-relaxed">
                Filter announcements by semester and batch. Never miss an exam timetable or emergency bus schedule update buried in WhatsApp threads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181818] border border-[#2A2A2A] hover:border-[#FF9F43] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#242424] text-[#FF9F43] flex items-center justify-center font-bold mb-4 border border-[#333333]">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Collaborative Notes & PYQs</h3>
              <p className="text-xs text-[#999999] leading-relaxed">
                Upload and download previous year question papers, lab notes, and revision cheatsheets with real file downloads and direct peer discussions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181818] border border-[#2A2A2A] hover:border-[#B7F34A] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#242424] text-[#B7F34A] flex items-center justify-center font-bold mb-4 border border-[#333333]">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real Local Transport & Services</h3>
              <p className="text-xs text-[#999999] leading-relaxed">
                Official ₹10 Government bus timings, ±10 min Kevdi college arrival rule, local Chagdas, Jadega outstation van for Somnath, and Saddam delivery boy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8 FEATURES GRID ================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
              Comprehensive Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Eight Essential Campus Modules
            </h2>
          </div>
          <p className="text-xs text-[#888888] max-w-md">
            Purpose-built tools designed to eliminate communication fragmentation across the IIITV-ICD campus ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#B7F34A] shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#222222] text-[#B7F34A] flex items-center justify-center group-hover:bg-[#B7F34A] group-hover:text-[#111111] transition-colors border border-[#333333]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#242424] text-[#CCCCCC] border border-[#333333]">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  to={feat.link}
                  className="text-xs font-bold text-[#B7F34A] inline-flex items-center gap-1 group-hover:text-white transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= CAMPUS PHOTOGRAPHY GALLERY ================= */}
      <section id="campus" className="bg-[#121212] text-white py-24 border-y border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-[#FF9F43] uppercase tracking-wider">
              Institute Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              Authentic Diu Campus Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#888888] mt-2">
              Photographs of the actual IIIT Vadodara – International Campus Diu infrastructure at Education Hub, Kevdi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <motion.div
                key={img.title}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl overflow-hidden bg-[#181818] border border-[#2E2E2E] shadow-2xl"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-[#181818] border-t border-[#262626]">
                  <span className="text-[10px] font-bold text-[#B7F34A] uppercase tracking-wider">
                    {img.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{img.title}</h4>
                  <p className="text-xs text-[#888888] mt-0.5">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
            Workflow Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Campus Connect Works
          </h2>
          <p className="text-xs sm:text-sm text-[#888888]">
            Getting started takes less than a minute. Everything is designed around intuitive student coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Register Account', desc: 'Sign up with your roll number and batch details for verified access.' },
            { step: '02', title: 'Access Dashboard', desc: 'See today’s classes, latest announcements and quick module links.' },
            { step: '03', title: 'Coordinate & Share', desc: 'Download notes, report lost items, check shuttle timings, and ask questions.' },
            { step: '04', title: 'Stay Connected', desc: 'Get timely alerts for schedule changes and important institute circulars.' }
          ].map((item) => (
            <div key={item.step} className="relative p-6 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl">
              <span className="text-3xl font-extrabold text-[#2A2A2A] block mb-2 font-mono">{item.step}</span>
              <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-[#888888] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#181818] via-[#121212] to-[#181818] text-white p-8 sm:p-14 relative overflow-hidden border border-[#2E2E2E] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
              Empowering IIITV-ICD Students Daily
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Experience the centralized campus ecosystem now.
            </h2>
            <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
              Sign in with your verified institute credentials to access personalized class routines, municipal transport schedules, study vaults, and lively student forums.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'} className="btn-lime text-xs font-bold px-6 py-3 shadow-lg shadow-[#B7F34A]/25">
                {isAuthenticated ? 'Open Overview (Dashboard)' : 'Sign In to Student Portal'}
              </Link>
              <Link to="/about" className="btn-secondary text-xs px-6 py-3">
                About Us & Support
              </Link>
            </div>
          </div>

          {/* Decorative Background Glows */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#B7F34A]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-60 h-60 rounded-full bg-[#FF9F43]/10 blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};
