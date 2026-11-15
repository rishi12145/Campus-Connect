import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  BookOpen,
  Bus,
  Search,
  MessageSquare,
  Users,
  Settings,
  AlertTriangle,
  Edit3,
  BadgeCheck,
  Building2,
  Image as ImageIcon,
  Quote,
  Hash,
  Phone
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

export const AboutPage = () => {
  const { user } = useAuth();
  const [aboutContent, setAboutContent] = useState(storageService.getAboutContent());
  const [developers, setDevelopers] = useState(storageService.getDevelopers());

  const loadContent = () => {
    setAboutContent(storageService.getAboutContent());
    setDevelopers(storageService.getDevelopers());
  };

  useEffect(() => {
    loadContent();
    window.addEventListener('campus_connect_update', loadContent);
    return () => window.removeEventListener('campus_connect_update', loadContent);
  }, []);

  const controller = aboutContent.controller || {
    name: 'Rishikesh Gopal',
    title: 'Website Controller & Platform Administrator',
    year: '4th Year (B.Tech CSE)',
    email: '202311072@iiitvadodara.ac.in',
    whatsappNumber: '8340574363',
    whatsappLink: 'https://wa.me/918340574363?text=Hi%20Rishikesh,%20regarding%20Campus%20Connect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    badge: 'Website Controller & Lead Administrator',
    message: 'Notice any outdated bus timing, incorrect classroom room number, missing subject syllabus, or need to add/remove misinformation? Reach out directly via WhatsApp chat or email anytime.'
  };

  const hero = aboutContent.hero || {};
  const vision = aboutContent.vision || {};
  const scope = aboutContent.scope || {};
  const showcaseImages = aboutContent.showcaseImages || [];
  const benefits = aboutContent.benefits || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-white">
      {/* ========================================================================= */}
      {/* 1. AT THE VERY STARTING: WEBSITE CONTROLLER & LEAD ADMINISTRATOR (RISHIKESH GOPAL) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2612] via-[#141414] to-[#111111] border-2 border-[#B7F34A]/60 p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#B7F34A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-[#FF9F43]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          {/* Controller Identity Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src={controller.avatar}
                alt={controller.name}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-[#B7F34A] shadow-2xl shadow-[#B7F34A]/25"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:-right-2 px-3 py-1 rounded-full bg-[#B7F34A] text-[#0A0A0A] text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 shrink-0 whitespace-nowrap">
                <BadgeCheck className="w-3 h-3 text-[#0A0A0A]" />
                <span>Admin / Controller</span>
              </span>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {controller.badge || 'Website Controller & Lead Administrator'}
                </span>
                <span className="text-[11px] text-[#AAAAAA] font-bold">
                  {controller.year || '4th Year (B.Tech CSE)'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {controller.name}
              </h1>

              <p className="text-xs sm:text-sm font-semibold text-[#B7F34A]">
                {controller.title}
              </p>

              <p className="text-xs text-[#DDDDDD] leading-relaxed pt-1">
                {controller.message}
              </p>
            </div>
          </div>

          {/* Action CTAs (WhatsApp, Email & Admin Edit) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <a
              href={controller.whatsappLink || `https://wa.me/918340574363?text=Hi%20${encodeURIComponent(controller.name)},%20regarding%20Campus%20Connect`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime text-xs font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#B7F34A]/25 hover:scale-105 transition-all text-[#0A0A0A]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat with Controller on WhatsApp</span>
            </a>

            <a
              href={`mailto:${controller.email}`}
              className="px-6 py-3 rounded-2xl bg-[#1E1E1E] border border-[#333333] hover:border-[#B7F34A] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <Mail className="w-4 h-4 text-[#B7F34A]" />
              <span className="group-hover:text-[#B7F34A] transition-colors">{controller.email}</span>
            </a>

            {user?.role === 'admin' && (
              <Link
                to="/admin/about"
                className="mt-1 px-4 py-2.5 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-xs font-extrabold text-[#B7F34A] hover:bg-[#B7F34A] hover:text-[#0A0A0A] flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Controller & About Content (Admin)</span>
              </Link>
            )}
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 2. HERO TITLE & PLATFORM INTRO */}
      {/* ========================================================================= */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#2E2E2E] shadow-xl text-xs font-semibold text-white">
          <GraduationCap className="w-3.5 h-3.5 text-[#B7F34A]" />
          <span>{hero.badge || 'IIITV-ICD Student Digital Ecosystem'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {hero.title || 'About Campus Connect'}
        </h2>
        <p className="text-base sm:text-lg text-[#AAAAAA] leading-relaxed">
          {hero.subtitle || 'Integrated Digital Campus Ecosystem for Student Information, Academic Coordination and Community Engagement at Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD).'}
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM VISION & STUDENT SCOPE */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
          <h3 className="text-xl font-black text-white">
            {vision.title || 'Platform Vision & Purpose'}
          </h3>
          <p className="text-sm text-[#AAAAAA] leading-relaxed">
            {vision.description1}
          </p>
          <p className="text-sm text-[#AAAAAA] leading-relaxed">
            {vision.description2}
          </p>
          <div className="pt-2">
            <span className="text-xs font-bold text-[#0A0A0A] bg-[#B7F34A] px-3.5 py-1.5 rounded-lg inline-block shadow">
              {vision.tagline || 'Tagline: "Your Campus. Everything Connected."'}
            </span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
          <h3 className="text-xl font-black text-white">
            {scope.title || 'Student-Centric Scope'}
          </h3>
          <p className="text-sm text-[#AAAAAA] leading-relaxed">
            {scope.description1}
          </p>
          <p className="text-sm text-[#AAAAAA] leading-relaxed">
            {scope.description2}
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{scope.campusNote || 'Dedicated exclusively to IIITV-ICD Education Hub, Kevdi'}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CAMPUS & ACADEMIC SHOWCASE (100% Editable via Admin Panel) */}
      {/* ========================================================================= */}
      {showcaseImages.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
                Campus Gallery
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-2">
                Education Hub, Kevdi Infrastructure
              </h3>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/admin/about"
                className="text-xs font-bold text-[#B7F34A] hover:underline inline-flex items-center gap-1"
              >
                <span>Edit Photos (Admin)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {showcaseImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-xl aspect-[4/3] bg-[#141414]"
              >
                <img
                  src={img.url}
                  alt={img.caption || 'Campus View'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/images/campus/campus-main.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-bold text-white drop-shadow">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. CORE ENGINEERING & DEVELOPER TEAM (B.Tech CSE 2023-2027) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
              IIITV-ICD Platform Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Core Engineering & Developer Team
            </h2>
            <p className="text-xs text-[#888888] mt-1 max-w-2xl leading-relaxed">
              Designed, built, and maintained by student developers of the B.Tech CSE (2023–2027) cohort for the student body of IIIT Vadodara – International Campus Diu.
            </p>
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/admin/developers"
              className="px-4 py-2 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-xs font-extrabold text-[#B7F34A] hover:bg-[#B7F34A] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors shadow self-start sm:self-auto shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Developers (Admin)</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className={`p-6 rounded-3xl bg-[#141414] border shadow-2xl flex flex-col justify-between space-y-5 transition-all hover:border-[#B7F34A]/80 ${
                dev.isLead
                  ? 'border-2 border-[#B7F34A]/60 bg-gradient-to-b from-[#1C2612] via-[#141414] to-[#111111]'
                  : 'border border-[#262626]'
              }`}
            >
              <div className="space-y-4">
                {/* Photo & Identity Header */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#B7F34A] shadow-xl shadow-[#B7F34A]/15"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    {dev.isLead && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#B7F34A] text-[#0A0A0A] text-[9px] font-black uppercase tracking-wider shrink-0 whitespace-nowrap shadow-md">
                        Lead
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-lg font-black text-white truncate">{dev.name}</h3>
                    <p className="text-xs text-[#B7F34A] font-semibold leading-tight">{dev.role}</p>

                    {/* Batch & Roll Number Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#202020] text-[#DDDDDD] border border-[#333333]">
                        {dev.batch || 'B.Tech CSE 2023-2027'}
                      </span>
                      {dev.rollNumber && (
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#B7F34A]/15 text-[#B7F34A] border border-[#B7F34A]/30">
                          Roll: {dev.rollNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Short Quote */}
                {dev.quote && (
                  <div className="p-3.5 rounded-2xl bg-[#1B1B1B] border border-[#2E2E2E] text-xs italic text-[#DDDDDD] flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">"{dev.quote}"</span>
                  </div>
                )}

                {/* Bio */}
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  {dev.bio}
                </p>
              </div>

              {/* Direct Contact Links */}
              <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-2">
                <a
                  href={`mailto:${dev.email}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[11px] font-bold text-white border border-[#333333] flex items-center justify-center gap-1.5 transition-colors truncate"
                  title={`Email ${dev.name}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span className="truncate">{dev.email}</span>
                </a>

                {dev.contactPhone && (
                  <a
                    href={`https://wa.me/91${dev.contactPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(dev.name)},%20regarding%20Campus%20Connect`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#B7F34A] text-[#B7F34A] hover:text-[#0A0A0A] border border-[#333333] transition-colors"
                    title={`WhatsApp chat with ${dev.name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. KEY BENEFITS (8 Core Pillars) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
            Why Campus Connect
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Key Platform Benefits
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Engineered to solve real student challenges at the Kevdi Diu campus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-3 hover:border-[#B7F34A] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1F1F1F] border border-[#2E2E2E] flex items-center justify-center text-[#B7F34A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CONTACT REMINDER */}
      {/* ========================================================================= */}
      <div className="p-8 rounded-3xl bg-[#151515] border border-[#262626] text-center space-y-4">
        <h4 className="text-lg font-bold text-white">Have a Suggestion or Found Inaccurate Data?</h4>
        <p className="text-xs text-[#AAAAAA] max-w-xl mx-auto">
          Campus Connect is maintained by students, for students. If any classroom routine changes, or a new bus timing is introduced, contact Website Controller {controller.name} directly.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <a
            href={controller.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Message on WhatsApp</span>
          </a>
          <a
            href={`mailto:${controller.email}`}
            className="px-5 py-2.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#B7F34A] text-xs font-bold text-white inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-[#B7F34A]" />
            <span>Send Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};
