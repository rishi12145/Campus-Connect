import React, { useState, useEffect } from 'react';
import {
  academicResourceService,
  RESOURCE_CATEGORIES,
  SEMESTERS,
  ACADEMIC_YEARS,
  validateResourceFile,
  formatBytes,
  COMPRESSION_TOOLS
} from '../../services/academicResourceService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  FolderArchive,
  Search,
  Filter,
  Trash2,
  Download,
  User,
  Calendar,
  Layers,
  Plus,
  FileText,
  Upload,
  BookOpen,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminResources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Modals state
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const { showToast } = useNotification();

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: RESOURCE_CATEGORIES[0],
    semester: 'Semester 4',
    academicYear: '2025',
    subject: 'Computer Networks'
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    semester: '',
    academicYear: '',
    subject: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await academicResourceService.getResources();
      setResources(data);
    } catch (err) {
      showToast('Failed to load academic resources.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const check = validateResourceFile(file);
    if (!check.valid) {
      setFileError(check.error);
      setSelectedFile(null);
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a file to upload (PDF, JPG, JPEG, PNG under 1 MB).');
      return;
    }
    if (!uploadForm.title.trim()) {
      showToast('Please provide a resource title.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(10);
      setUploadStatus('Validating 1 MB size limit and preparing upload...');

      await academicResourceService.uploadResource(
        {
          file: selectedFile,
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          semester: uploadForm.semester,
          subject: uploadForm.subject,
          academicYear: uploadForm.academicYear
        },
        user,
        (progress, status) => {
          setUploadProgress(progress);
          setUploadStatus(status);
        }
      );

      showToast('Academic resource published successfully!', 'success');
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadStatus('');
      setUploadForm({
        title: '',
        description: '',
        category: RESOURCE_CATEGORIES[0],
        semester: 'Semester 4',
        academicYear: '2025',
        subject: 'Computer Networks'
      });
      await loadData();
    } catch (err) {
      showToast(err.message || 'Upload failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (resItem) => {
    setResourceToEdit(resItem);
    setEditForm({
      title: resItem.title,
      description: resItem.description || '',
      category: resItem.category,
      semester: resItem.semester,
      academicYear: resItem.academic_year || resItem.examYear || '2025',
      subject: resItem.subject
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!resourceToEdit) return;
    if (!editForm.title.trim()) {
      showToast('Title cannot be empty.', 'error');
      return;
    }

    try {
      await academicResourceService.updateResource(
        resourceToEdit.id,
        {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          category: editForm.category,
          semester: editForm.semester,
          academic_year: editForm.academicYear,
          academicYear: editForm.academicYear,
          examYear: editForm.academicYear,
          subject: editForm.subject.trim()
        },
        user
      );
      showToast('Resource metadata updated successfully!', 'success');
      setResourceToEdit(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Update failed.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await academicResourceService.deleteResource(resourceToDelete.id, user);
      showToast('Resource and associated storage permanently removed.', 'success');
      setResourceToDelete(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  const handleDownload = async (resItem) => {
    try {
      await academicResourceService.downloadResource(resItem);
      showToast(`Downloading: ${resItem.fileName || resItem.title}`, 'success');
    } catch (err) {
      showToast('Download failed.', 'error');
    }
  };

  // Filtered list
  const filteredResources = resources.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSem = selectedSemester === 'All' || r.semester === selectedSemester;
    const itemYear = r.academic_year || r.examYear || '';
    const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.uploader_name || r.uploaderName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.fileName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSem && matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <FolderArchive className="w-3.5 h-3.5" />
              Academic Materials & Repository
            </span>
            <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-3 py-1 rounded-full border border-[#FF9F43]/30 flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              1 MB Strict Limit • Supabase Storage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Resources Moderation
          </h2>
          <p className="text-xs text-[#AAAAAA] max-w-2xl leading-relaxed">
            Manage student-uploaded previous year question papers (PYQs), lecture notes, lab manuals, and study materials.
            As administrator, you have full permissions to review, edit, and delete any resource across semesters 1 to 8.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto shadow-lg shadow-[#B7F34A]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Resource (Admin)</span>
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
              placeholder="Search title, subject, contributor..."
              className="w-full pl-10 pr-4 py-2 bg-[#202020] border border-[#333333] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All 4 Categories</option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Semesters</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#202020] border border-[#333333] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Years</option>
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-white">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Resource Title & File</th>
                <th className="p-4">Subject & Semester</th>
                <th className="p-4">Category & Year</th>
                <th className="p-4">Uploaded By</th>
                <th className="p-4 text-center">Downloads</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777777]">
                    Loading academic resources...
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777777]">
                    No academic materials found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredResources.map((r) => {
                  const uploader = r.uploader_name || r.uploaderName || 'Student';
                  const role = r.uploader_role || 'student';
                  const yr = r.academic_year || r.examYear || '2025';

                  return (
                    <tr key={r.id} className="hover:bg-[#1E1E1E] transition-colors">
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{r.title}</h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#888888] font-mono">
                            <FileText className="w-3 h-3 text-[#B7F34A]" />
                            <span className="truncate max-w-[150px]">{r.fileName}</span>
                            <span className="text-[#666666]">•</span>
                            <span className="text-[#FF9F43]">{r.fileSize}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="text-xs font-semibold text-white">{r.subject}</p>
                        <p className="text-[11px] text-[#AAAAAA]">{r.semester}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#242424] text-[#B7F34A] border border-[#333333] inline-block">
                            {r.category}
                          </span>
                          <span className="block text-[10px] font-mono text-[#FF9F43]">
                            Academic Year: {yr}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-[#CCCCCC]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#262626] border border-[#3A3A3A] flex items-center justify-center text-[9px] font-bold text-[#B7F34A]">
                            {uploader.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <span className="text-white block">{uploader}</span>
                            <span className="text-[9px] uppercase font-bold text-[#888888]">{role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-xs font-bold text-[#B7F34A]">
                        {r.download_count || r.downloadCount || 0}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleDownload(r)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          title="Download Resource"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] hover:text-white border border-[#333333] transition-colors inline-block"
                          title="Edit Resource Metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setResourceToDelete(r)}
                          className="p-1.5 rounded-xl bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#333333] transition-colors inline-block"
                          title="Permanently Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Resource Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => !isSubmitting && setIsUploadModalOpen(false)}
        title="Upload Academic Resource (Admin)"
        subtitle="Publish official question papers, lecture notes, lab manuals or study materials under 1 MB."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. End-Semester 2024 Question Paper with Solution Guide"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Semester *
              </label>
              <select
                value={uploadForm.semester}
                onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                placeholder="e.g. Computer Networks"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <select
                value={uploadForm.academicYear}
                onChange={(e) => setUploadForm({ ...uploadForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Summary of topics, syllabus coverage, or instructions..."
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          {/* Online Compression Tools for Admins & Students */}
          <div className="p-3 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A]" />
                <span>Strict 1 MB File Limit Online Reducers</span>
              </span>
              <span className="text-[10px] text-[#888888]">1-Click Compression:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={COMPRESSION_TOOLS.PDF.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] border border-rose-900/40 hover:border-rose-500/60 text-white flex items-center justify-between transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-rose-300 block group-hover:text-rose-200">
                    Compress PDF
                  </span>
                  <span className="text-[9px] text-[#888888] block">iLovePDF Tool</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={COMPRESSION_TOOLS.IMAGE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] border border-sky-900/40 hover:border-sky-500/60 text-white flex items-center justify-between transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-sky-300 block group-hover:text-sky-200">
                    Compress Image
                  </span>
                  <span className="text-[9px] text-[#888888] block">iLoveIMG Tool</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Select File (PDF, JPG, JPEG, PNG) *
              </label>
              <span className="text-[10px] text-[#FF9F43] font-bold">Max: 1 MB</span>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#B7F34A] file:text-[#0A0A0A] hover:file:bg-[#cbfd6b]"
              required
            />
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-[#222222] border border-[#333333]">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#B7F34A]" />
                  <span className="text-xs text-white font-medium truncate max-w-xs">{selectedFile.name}</span>
                </div>
                <span className="text-xs font-bold text-[#FF9F43]">{formatBytes(selectedFile.size)}</span>
              </div>
            )}
            {fileError && (
              <div className="mt-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold space-y-2">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-900/40">
                  <span className="text-[11px] text-white font-normal">
                    Compress your file under 1 MB directly:
                  </span>
                  <a
                    href={fileError.includes('PDF') || fileError.toLowerCase().includes('.pdf') ? COMPRESSION_TOOLS.PDF.url : COMPRESSION_TOOLS.IMAGE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lime text-[11px] font-black px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow"
                  >
                    <span>Open {fileError.includes('PDF') || fileError.toLowerCase().includes('.pdf') ? 'iLovePDF' : 'iLoveIMG'} Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isSubmitting && (
            <div className="space-y-1.5 p-3 rounded-xl bg-[#1C1C1C] border border-[#333333]">
              <div className="flex justify-between text-[11px] font-bold text-white">
                <span>{uploadStatus}</span>
                <span className="text-[#B7F34A]">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#2A2A2A] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B7F34A] to-[#FF9F43] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Uploading to Storage ({uploadProgress}%)...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Publish Study Resource (≤ 1 MB)</span>
              </>
            )}
          </button>
        </form>
      </Modal>

      {/* Edit Metadata Modal */}
      <Modal
        isOpen={!!resourceToEdit}
        onClose={() => setResourceToEdit(null)}
        title="Edit Academic Resource Metadata"
        subtitle="Update title, category, semester, subject, or academic year."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Semester *
              </label>
              <select
                value={editForm.semester}
                onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <select
                value={editForm.academicYear}
                onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Academic Resource"
        message={`Are you sure you want to permanently remove "${resourceToDelete?.title}"? Its file in Supabase Storage will also be deleted.`}
        isDestructive
        confirmText="Delete Resource"
      />
    </div>
  );
};
