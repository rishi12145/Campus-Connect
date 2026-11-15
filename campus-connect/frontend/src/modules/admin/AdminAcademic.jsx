import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  CalendarCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  User,
  Filter,
  GraduationCap,
  Layers,
  BookOpen,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAcademic = () => {
  const [routines, setRoutines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [routineToDelete, setRoutineToDelete] = useState(null);

  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    subject: '',
    code: 'CS401',
    faculty: '',
    room: 'Room 2118',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    type: 'Lecture',
    semester: 'Semester 4',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2023'
  });

  const loadData = () => {
    setRoutines(storageService.getRoutines());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleOpenCreate = () => {
    setEditingRoutine(null);
    setFormData({
      subject: '',
      code: 'CS401',
      faculty: '',
      room: 'Room 2118',
      day: 'Monday',
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      type: 'Lecture',
      semester: selectedSemester !== 'All' ? selectedSemester : 'Semester 4',
      stream: 'B.Tech',
      branch: selectedBranch !== 'All' ? selectedBranch : 'CSE',
      batchYear: '2023'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rt) => {
    setEditingRoutine(rt);
    setFormData({
      ...rt,
      stream: rt.stream || 'B.Tech',
      branch: rt.branch || 'CSE',
      batchYear: rt.batchYear || '2023'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.faculty.trim() || !formData.room.trim()) {
      showToast('Please fill in subject, faculty, and room.', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        batch: `${formData.stream} ${formData.branch} ${formData.batchYear}`
      };

      if (editingRoutine) {
        storageService.updateRoutine(editingRoutine.id, payload);
        showToast('Routine entry updated successfully!', 'success');
      } else {
        storageService.createRoutine(payload);
        showToast('New routine added to timetable!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDelete = () => {
    if (!routineToDelete) return;
    try {
      storageService.deleteRoutine(routineToDelete.id);
      showToast('Routine entry removed.', 'success');
      setRoutineToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const filteredRoutines = routines.filter((r) => {
    const matchesDay = selectedDay === 'All' || r.day.toLowerCase() === selectedDay.toLowerCase();
    const matchesSem = selectedSemester === 'All' || r.semester === selectedSemester;
    const matchesBranch =
      selectedBranch === 'All' ||
      !r.branch ||
      r.branch === 'All' ||
      r.branch === 'Common' ||
      r.branch === selectedBranch;
    const matchesSearch =
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesSem && matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Academic Management
            </span>
            <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-3 py-1 rounded-full border border-[#FF9F43]/30">
              Semesters 1 to 8 • Branch Architecture (CSE, AI, Cyber Security, ECE)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Academic Routines
          </h2>
          <p className="text-xs text-[#AAAAAA] max-w-2xl leading-relaxed">
            Maintain semester lecture allocations, labs, tutorial timings, and faculty schedules. 
            Before 2025: CSE branch only. 2025 onwards: AI, Cyber Security, and ECE branches added.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto shadow-lg shadow-[#B7F34A]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class Routine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, faculty, rooms, codes..."
              className="w-full pl-10 pr-4 py-2 bg-[#202020] border border-[#333333] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Semester Filter (1 to 8) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Semesters (1–8)</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Branches</option>
                <option value="CSE">CSE (Computer Science)</option>
                <option value="AI">AI (Artificial Intelligence)</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="ECE">ECE (Electronics & Comm.)</option>
              </select>
            </div>

            {/* Day Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Day:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Weekdays</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Routines Table */}
      <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
        <div className="p-4 bg-[#1A1A1A] border-b border-[#262626] flex items-center justify-between text-xs text-[#888888]">
          <span>
            Showing <strong className="text-white">{filteredRoutines.length}</strong> routine entry/entries
          </span>
          <span className="text-[10px] text-[#B7F34A] uppercase font-bold tracking-wider">
            Verified Curriculum Schedule
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-white">
            <thead>
              <tr className="bg-[#181818] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Subject & Code</th>
                <th className="p-4">Semester & Branch</th>
                <th className="p-4">Day & Timings</th>
                <th className="p-4">Classroom</th>
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredRoutines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#888888]">
                    No timetable entries found matching your filter criteria. Click "+ Add Class Routine" to create one.
                  </td>
                </tr>
              ) : (
                filteredRoutines.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1E1E1E] transition-colors">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{r.subject}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#B7F34A]">{r.code}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">{r.semester}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-[#FF9F43] bg-[#222222] px-1.5 py-0.2 rounded">
                            {r.branch || 'CSE'}
                          </span>
                          <span className="text-[9px] text-[#777777]">{r.batch || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{r.day}</span>
                        <p className="text-[11px] text-[#AAAAAA] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF9F43]" />
                          {r.startTime} – {r.endTime}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B7F34A]" />
                        {r.room}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#CCCCCC] flex items-center gap-1">
                        <User className="w-3 h-3 text-[#777777]" />
                        {r.faculty}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          r.type === 'Lab'
                            ? 'bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40'
                            : r.type === 'Tutorial'
                            ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                            : 'bg-[#222222] text-white border border-[#333333]'
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] transition-colors"
                          title="Edit Routine"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setRoutineToDelete(r)}
                          className="p-1.5 rounded-lg bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 transition-colors"
                          title="Delete Routine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routine Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoutine ? 'Edit Class Routine' : 'Add Class Routine'}
        subtitle="Manage lecture hall allocations, branch curricula, and timings across Semesters 1 to 8"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Note about branches */}
          <div className="p-3 rounded-xl bg-[#1C2412] border border-[#B7F34A]/30 text-[#B7F34A] text-[11px] flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-[#B7F34A]" />
            <span>
              <strong>Branch Note:</strong> Before 2025: CSE only. 2025 onwards: AI, Cyber Security, and ECE added to campus curriculum.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Operating Systems, Compiler Design, Deep Learning"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS401, IT403"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Faculty Member *
              </label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                placeholder="e.g. Prof. R. Mehta, Dr. Deep Learning Faculty"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Classroom / Lab *
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. Room 2118, Room 2109, PHY LAB - LD1"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Day of Week *
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>
          </div>

          {/* Semester, Branch, Stream, Batch Year (Sem 1 to 8) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Semester (1–8) *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Branch *
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="CSE">CSE</option>
                <option value="AI">AI</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="ECE">ECE</option>
                <option value="Common">Common / All</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Batch Year
              </label>
              <select
                value={formData.batchYear}
                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            {editingRoutine ? 'Update Timetable Entry' : 'Add to Timetable'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!routineToDelete}
        onClose={() => setRoutineToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Timetable Entry?"
        message={`Are you sure you want to remove ${routineToDelete?.subject} (${routineToDelete?.code}) on ${routineToDelete?.day}?`}
      />
    </div>
  );
};
