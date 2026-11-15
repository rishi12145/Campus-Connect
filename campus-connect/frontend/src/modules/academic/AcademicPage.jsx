import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { storageService } from '../../services/storageService';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Filter,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AcademicPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [routines, setRoutines] = useState([]);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSemester, setSelectedSemester] = useState(user?.semester || 'Semester 4');
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || 'All');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const branchesList = ['All', 'CSE', 'AI', 'Cyber Security', 'ECE'];

  const semestersList = [
    { id: 'All', label: 'All Semesters', badge: 'All Batches' },
    { id: 'Semester 1', label: 'Semester 1', badge: '1st Year' },
    { id: 'Semester 2', label: 'Semester 2', badge: '1st Year (Even)' },
    { id: 'Semester 3', label: 'Semester 3', badge: '2nd Year' },
    { id: 'Semester 4', label: 'Semester 4', badge: '2nd Year (Even)' },
    { id: 'Semester 5', label: 'Semester 5', badge: '3rd Year' },
    { id: 'Semester 6', label: 'Semester 6', badge: '3rd Year (Even)' },
    { id: 'Semester 7', label: 'Semester 7', badge: '4th Year' },
    { id: 'Semester 8', label: 'Semester 8', badge: '4th Year (Even)' }
  ];

  useEffect(() => {
    // Auto-select current day if weekday
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    if (daysOfWeek.includes(today)) {
      setSelectedDay(today);
    }

    const loadData = () => {
      setRoutines(storageService.getRoutines());
    };
    loadData();

    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleDeleteRoutine = (id) => {
    if (window.confirm('Delete this class routine entry?')) {
      storageService.deleteRoutine(id);
      showToast('Class routine entry deleted.', 'success');
      loadData();
    }
  };

  const filteredRoutines = routines.filter((r) => {
    const matchesSem = selectedSemester === 'All' || r.semester === selectedSemester;
    const matchesBranch =
      selectedBranch === 'All' ||
      !r.branch ||
      r.branch === 'All' ||
      r.branch === 'Common' ||
      r.branch === selectedBranch;
    const matchesDay = viewMode === 'weekly' || r.day.toLowerCase() === selectedDay.toLowerCase();
    return matchesSem && matchesBranch && matchesDay;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Controls with Campus Sky Backdrop */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-8 text-white shadow-2xl">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/images/campus/campus-sky.jpg')` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                IIITV-ICD Academic Affairs
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
                Semesters 1 to 8 Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Schedules & Timetables
            </h2>
            <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
              Verified daily schedules and weekly matrices across all academic years at Education Hub, Kevdi.
              Includes verified lecture halls, computing labs, and tutorial hours.
            </p>
          </div>

          {/* View Toggle & Admin Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {user?.role === 'admin' && (
              <Link
                to="/admin/academic"
                className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Manage Timetables</span>
              </Link>
            )}

            <div className="flex items-center gap-2 bg-[#1C1C1C] p-1.5 rounded-2xl border border-[#333333]">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'daily'
                    ? 'bg-[#B7F34A] text-[#111111] shadow-lg shadow-[#B7F34A]/25'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-[#252525]'
                }`}
              >
                Daily Routine
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-[#FF9F43] text-[#111111] shadow-lg shadow-[#FF9F43]/25'
                    : 'text-[#AAAAAA] hover:text-white hover:bg-[#252525]'
                }`}
              >
                Weekly Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Switcher Navigation Tabs */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl">
        <div className="flex items-center gap-2 px-2 pb-2 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-[#B7F34A]" />
          <span>Select Academic Semester:</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {semestersList.map((sem) => {
            const isSelected = selectedSemester === sem.id;
            return (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem.id)}
                className={`p-2.5 sm:p-3 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#222222] border border-[#B7F34A] shadow-md'
                    : 'bg-[#1A1A1A] border border-[#282828] hover:border-[#3A3A3A] hover:bg-[#202020]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-bl-lg bg-[#B7F34A]" />
                )}
                <span className={`text-xs font-black block ${isSelected ? 'text-[#B7F34A]' : 'text-white'}`}>
                  {sem.label}
                </span>
                <span className="text-[10px] text-[#888888] font-medium block truncate mt-0.5">
                  {sem.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Day Selector Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Branch Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#888888] mr-1">
              <Layers className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Select Branch:</span>
            </div>

            {branchesList.map((branch) => {
              const isSelected = selectedBranch === branch;
              return (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                      : 'bg-[#222222] text-[#AAAAAA] hover:text-white border border-[#333333]'
                  }`}
                >
                  {branch}
                </button>
              );
            })}

            <span className="text-[10px] text-[#777777] italic ml-2 hidden sm:inline">
              (2025 onwards: AI, Cyber Security & ECE added)
            </span>
          </div>

          <div className="text-xs text-[#888888]">
            Showing <strong className="text-white">{filteredRoutines.length}</strong> routine(s) •{' '}
            <span className="text-[#B7F34A] font-bold">{selectedSemester}</span> •{' '}
            <span className="text-[#FF9F43] font-bold">{selectedBranch}</span>
          </div>
        </div>

        {/* Day Selectors (Active in Daily View) */}
        {viewMode === 'daily' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262626]">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#B7F34A] text-[#111111] shadow'
                      : 'bg-[#222222] text-[#AAAAAA] hover:bg-[#2A2A2A] hover:text-white border border-[#2E2E2E]'
                  }`}
                >
                  <span>{day}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Routine Displays */}
      {viewMode === 'daily' ? (
        /* Daily View List */
        <div className="space-y-4">
          {filteredRoutines.length === 0 ? (
            <div className="p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
              No classes scheduled for <strong>{selectedDay}</strong> in <strong>{selectedSemester}</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutines.map((routine) => (
                <motion.div
                  key={routine.id}
                  whileHover={{ y: -3 }}
                  className="p-5 rounded-2xl bg-[#181818] border border-[#2A2A2A] hover:border-[#B7F34A] shadow-xl transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-[#B7F34A] text-[#111111] px-2.5 py-0.5 rounded-md">
                        {routine.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-[#FF9F43] bg-[#222222] px-2 py-0.5 rounded border border-[#333333]">
                          {routine.branch || 'CSE'}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#242424] text-[#AAAAAA] border border-[#333333]">
                          {routine.semester}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            routine.type === 'Lab'
                              ? 'bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40'
                              : routine.type === 'Tutorial'
                              ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                              : 'bg-[#242424] text-white border border-[#3A3A3A]'
                          }`}
                        >
                          {routine.type}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight group-hover:text-[#B7F34A] transition-colors">
                      {routine.subject}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#2A2A2A] text-xs">
                    <div className="flex items-center gap-2 text-[#AAAAAA]">
                      <Clock className="w-3.5 h-3.5 text-[#FF9F43]" />
                      <span className="font-semibold text-white">{routine.startTime} – {routine.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#AAAAAA]">
                      <MapPin className="w-3.5 h-3.5 text-[#B7F34A]" />
                      <span className="font-semibold text-white">{routine.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#888888]">
                      <User className="w-3.5 h-3.5" />
                      <span>Faculty: {routine.faculty}</span>
                    </div>

                    {user?.role === 'admin' && (
                      <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-xs">
                        <span className="text-[10px] text-[#B7F34A] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Admin Controls
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to="/admin/academic"
                            className="px-2 py-1 rounded bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Edit in Admin Console"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteRoutine(routine.id)}
                            className="p-1 rounded bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#333333] transition-colors"
                            title="Delete class routine"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Weekly View Grid Table */
        <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
          <div className="p-6 border-b border-[#262626] bg-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">
                Full Weekly Timetable Matrix • {selectedSemester}
              </h3>
              <p className="text-xs text-[#888888]">
                Consolidated view across all 5 weekdays (Monday through Friday)
              </p>
            </div>
            <span className="text-xs font-bold text-[#B7F34A] bg-[#B7F34A]/10 border border-[#B7F34A]/30 px-3 py-1 rounded-xl">
              {filteredRoutines.length} Sessions Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-white">
              <thead>
                <tr className="bg-[#181818] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 w-32">Day</th>
                  <th className="p-4">Morning Sessions (8:00 AM – 1:00 PM)</th>
                  <th className="p-4">Afternoon Sessions & Labs (1:00 PM – 6:15 PM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {daysOfWeek.map((day) => {
                  const dayClasses = routines.filter((r) => {
                    const matchesSem = selectedSemester === 'All' || r.semester === selectedSemester;
                    const matchesBatch = selectedBatch === 'All' || r.batch === selectedBatch;
                    const matchesDay = r.day.toLowerCase() === day.toLowerCase();
                    return matchesSem && matchesBatch && matchesDay;
                  });

                  // Split into Morning and Afternoon based on startTime
                  const morning = dayClasses.filter((r) => {
                    return r.startTime.includes('AM') || r.startTime.startsWith('11') || r.startTime.startsWith('12:00');
                  });
                  const afternoon = dayClasses.filter((r) => {
                    return !morning.includes(r);
                  });

                  return (
                    <tr key={day} className="hover:bg-[#1C1C1C] transition-colors">
                      <td className="p-4 font-bold text-white bg-[#1A1A1A] align-top">
                        <span className="text-sm block">{day}</span>
                        <span className="text-[10px] text-[#888888] font-normal">
                          {dayClasses.length} session(s)
                        </span>
                      </td>
                      <td className="p-4 space-y-2 align-top">
                        {morning.length === 0 ? (
                          <span className="text-[#666666] italic">No morning lectures scheduled</span>
                        ) : (
                          morning.map((m) => (
                            <div key={m.id} className="p-3 rounded-xl bg-[#202020] border border-[#2E2E2E] max-w-md space-y-1">
                              <div className="font-bold text-white flex items-center justify-between gap-2">
                                <span className="text-xs truncate">{m.code}: {m.subject}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                                  m.type === 'Lab' ? 'bg-[#FF9F43]/20 text-[#FF9F43]' : 'bg-[#B7F34A]/20 text-[#B7F34A]'
                                }`}>
                                  {m.type}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#AAAAAA] flex items-center justify-between">
                                <span className="flex items-center gap-1 font-mono text-white">
                                  <Clock className="w-3 h-3 text-[#FF9F43]" />
                                  {m.startTime}–{m.endTime}
                                </span>
                                <span className="flex items-center gap-1 text-[#CCCCCC]">
                                  <MapPin className="w-3 h-3 text-[#B7F34A]" />
                                  {m.room}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#777777]">
                                Faculty: {m.faculty} {selectedSemester === 'All' && `• ${m.semester}`}
                              </div>
                            </div>
                          ))
                        )}
                      </td>
                      <td className="p-4 space-y-2 align-top">
                        {afternoon.length === 0 ? (
                          <span className="text-[#666666] italic">Self Study / Lab Prep</span>
                        ) : (
                          afternoon.map((a) => (
                            <div key={a.id} className="p-3 rounded-xl bg-[#202020] border border-[#2E2E2E] max-w-md space-y-1">
                              <div className="font-bold text-white flex items-center justify-between gap-2">
                                <span className="text-xs truncate">{a.code}: {a.subject}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                                  a.type === 'Lab' ? 'bg-[#FF9F43]/20 text-[#FF9F43]' : 'bg-[#B7F34A]/20 text-[#B7F34A]'
                                }`}>
                                  {a.type}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#AAAAAA] flex items-center justify-between">
                                <span className="flex items-center gap-1 font-mono text-white">
                                  <Clock className="w-3 h-3 text-[#FF9F43]" />
                                  {a.startTime}–{a.endTime}
                                </span>
                                <span className="flex items-center gap-1 text-[#CCCCCC]">
                                  <MapPin className="w-3 h-3 text-[#B7F34A]" />
                                  {a.room}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#777777]">
                                Faculty: {a.faculty} {selectedSemester === 'All' && `• ${a.semester}`}
                              </div>
                            </div>
                          ))
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
