import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import {
  academicResourceService,
  RESOURCE_CATEGORIES,
  SEMESTERS,
  ACADEMIC_YEARS,
  validateResourceFile,
  formatBytes,
  MAX_FILE_SIZE_BYTES,
  COMPRESSION_TOOLS
} from '../../services/academicResourceService';
import {
  FolderArchive,
  Download,
  Plus,
  Search,
  FileText,
  Trash2,
  Edit2,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Filter,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResourcesPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [filterMyUploads, setFilterMyUploads] = useState(false);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  // Upload Progress & State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileValidationError, setFileValidationError] = useState('');

  // Dynamic Subject Creation State
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Default subject catalog by semester
  const defaultSubjects = [
    // Semester 1
    { semester: 'Semester 1', name: 'Computer Programming (CS101)' },
    { semester: 'Semester 1', name: 'Mathematics 1 (MA101)' },
    { semester: 'Semester 1', name: 'Physics (PH101)' },
    { semester: 'Semester 1', name: 'Digital Electronics (EC101)' },
    // Semester 2
    { semester: 'Semester 2', name: 'Data Structures (CS102)' },
    { semester: 'Semester 2', name: 'Mathematics 2 (MA102)' },
    // Semester 3
    { semester: 'Semester 3', name: 'Data Structures & Algorithms (CS201)' },
    { semester: 'Semester 3', name: 'Computer Organization & Architecture (CS203)' },
    { semester: 'Semester 3', name: 'Signals & Systems (EC201)' },
    { semester: 'Semester 3', name: 'Mathematics 3 (MA201)' },
    // Semester 4
    { semester: 'Semester 4', name: 'Database Management Systems (CS402)' },
    { semester: 'Semester 4', name: 'Operating Systems (CS403)' },
    { semester: 'Semester 4', name: 'Design & Analysis of Algorithms (CS404)' },
    { semester: 'Semester 4', name: 'Computer Networks (CS405)' },
    { semester: 'Semester 4', name: 'Discrete Mathematics (MA401)' },
    // Semester 5
    { semester: 'Semester 5', name: 'Formal Language & Automata Theory (CS301)' },
    { semester: 'Semester 5', name: 'Computer Networks (CS302)' },
    { semester: 'Semester 5', name: 'Cryptography & Network Security (CS303)' },
    { semester: 'Semester 5', name: 'Operating Systems (CS304)' },
    { semester: 'Semester 5', name: 'Artificial Intelligence (CS305)' },
    // Semester 6
    { semester: 'Semester 6', name: 'Compiler Design (CS306)' },
    { semester: 'Semester 6', name: 'Machine Learning (CS308)' },
    // Semester 7
    { semester: 'Semester 7', name: 'Topics in Deep Learning (CS433)' },
    { semester: 'Semester 7', name: 'Software and Cyber Security (CS445)' },
    { semester: 'Semester 7', name: 'Cloud System Management (IT403)' },
    { semester: 'Semester 7', name: 'Introduction to Remote Sensing (CS449)' },
    { semester: 'Semester 7', name: 'Computer Graphics & Multimedia (EC425)' },
    // Semester 8
    { semester: 'Semester 8', name: 'Major Project & Technical Research' }
  ];

  const [customSubjects, setCustomSubjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_custom_subjects_v2') || '[]');
    } catch {
      return [];
    }
  });

  const allSubjects = [...defaultSubjects, ...customSubjects];

  // Upload Form State (Strictly under 1 MB)
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Database Management Systems (CS402)',
    semester: 'Semester 4',
    category: 'Previous Year Question Papers (PYQs)',
    academicYear: '2025',
    description: '',
    selectedFile: null
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    semester: 'Semester 4',
    subject: '',
    category: 'Previous Year Question Papers (PYQs)',
    academicYear: '2025'
  });

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await academicResourceService.getResources();
      setResources(data);
    } catch (err) {
      console.error('Error loading resources:', err);
      showToast('Failed to load academic resources.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
    window.addEventListener('campus_connect_update', loadResources);
    return () => window.removeEventListener('campus_connect_update', loadResources);
  }, []);

  // Handle File Selection with 1 MB & MIME Validation
  const handleFileChange = (e) => {
    setFileValidationError('');
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, selectedFile: null }));
      return;
    }

    const validation = validateResourceFile(file);
    if (!validation.valid) {
      setFileValidationError(validation.error);
      setFormData((prev) => ({ ...prev, selectedFile: null }));
      e.target.value = '';
      showToast(validation.error, 'error');
      return;
    }

    setFormData((prev) => ({ ...prev, selectedFile: file }));
    if (!formData.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData((prev) => ({ ...prev, title: cleanName }));
    }
  };

  const handleCreateNewSubject = () => {
    if (!newSubjectInput.trim()) {
      showToast('Please enter a valid subject name.', 'error');
      return;
    }
    const newSubObj = {
      semester: formData.semester,
      name: newSubjectInput.trim()
    };
    const updated = [...customSubjects, newSubObj];
    setCustomSubjects(updated);
    localStorage.setItem('cc_custom_subjects_v2', JSON.stringify(updated));
    setFormData((prev) => ({ ...prev, subject: newSubObj.name }));
    setIsCreatingNewSubject(false);
    setNewSubjectInput('');
    showToast(`Added new subject: ${newSubObj.name}`, 'success');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please provide a title for the academic resource.', 'error');
      return;
    }
    if (!formData.selectedFile) {
      showToast('Please select a valid PDF or image file (max 1 MB).', 'error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadStage('Initiating upload...');

      await academicResourceService.uploadResource(
        {
          file: formData.selectedFile,
          title: formData.title,
          description: formData.description,
          semester: formData.semester,
          subject: formData.subject,
          academicYear: formData.academicYear,
          category: formData.category
        },
        user,
        (progress, stage) => {
          setUploadProgress(progress);
          setUploadStage(stage);
        }
      );

      showToast('Academic resource published successfully!', 'success');
      setIsUploadModalOpen(false);
      setFormData({
        title: '',
        subject: 'Database Management Systems (CS402)',
        semester: 'Semester 4',
        category: 'Previous Year Question Papers (PYQs)',
        academicYear: '2025',
        description: '',
        selectedFile: null
      });
      setFileValidationError('');
      loadResources();
    } catch (err) {
      showToast(err.message || 'Resource upload failed.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  };

  const handleOpenEdit = (resource, e) => {
    if (e) e.stopPropagation();
    setEditingResource(resource);
    setEditFormData({
      title: resource.title || '',
      description: resource.description || '',
      semester: resource.semester || 'Semester 4',
      subject: resource.subject || '',
      category: resource.category || 'Previous Year Question Papers (PYQs)',
      academicYear: resource.academic_year || resource.examYear || '2025'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      showToast('Resource title is required.', 'error');
      return;
    }

    try {
      await academicResourceService.updateResource(
        editingResource.id,
        editFormData,
        user
      );
      showToast('Resource details updated successfully!', 'success');
      setIsEditModalOpen(false);
      setEditingResource(null);
      loadResources();
    } catch (err) {
      showToast(err.message || 'Failed to update resource.', 'error');
    }
  };

  const handleDeleteResource = async (resource, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Permanently delete "${resource.title}" and its storage file?`)) {
      try {
        await academicResourceService.deleteResource(resource, user);
        showToast('Resource deleted from academic repository.', 'success');
        loadResources();
        if (selectedResource?.id === resource.id) setSelectedResource(null);
      } catch (err) {
        showToast(err.message || 'Delete operation failed.', 'error');
      }
    }
  };

  const handleDownload = async (resource, e) => {
    if (e) e.stopPropagation();
    try {
      await academicResourceService.downloadResource(resource);
      showToast(`Downloading ${resource.fileName || resource.title}...`, 'info');
      loadResources();
    } catch (err) {
      showToast('Failed to download file.', 'error');
    }
  };

  // Filter Logic
  const filteredResources = resources.filter((item) => {
    const matchesSemester = selectedSemester === 'All' || item.semester === selectedSemester;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const itemYear = item.academic_year || item.examYear;
    const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase());

    const uploader = item.uploaded_by || item.uploadedBy;
    const isMine = uploader === user?.id || (user?.user_id && uploader === user.user_id);
    const matchesMyUploads = !filterMyUploads || isMine;

    return matchesSemester && matchesCategory && matchesYear && matchesSubject && matchesSearch && matchesMyUploads;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
              Verified Academic Archive
            </span>
            <span className="text-xs text-[#888888] font-bold">1 MB Max File Limit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Resources
          </h2>
          <p className="text-xs sm:text-sm text-[#AAAAAA]">
            Centralized semester repository for PYQs, lecture notes, lab manuals, and peer-contributed study files.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-lime text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#B7F34A]/25 self-start md:self-auto hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
        {/* Search, Year & My Uploads */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, uploader..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#1F1F1F] border border-[#2E2E2E] text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="All">All Years</option>
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#888888]">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#1F1F1F] border border-[#2E2E2E] text-white outline-none focus:border-[#B7F34A] max-w-[180px] truncate"
              >
                <option value="All">All Subjects</option>
                {allSubjects
                  .filter((s) => selectedSemester === 'All' || s.semester === selectedSemester)
                  .map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name}</option>
                  ))}
              </select>
            </div>

            {/* My Uploads Toggle */}
            <button
              onClick={() => setFilterMyUploads(!filterMyUploads)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterMyUploads
                  ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                  : 'bg-[#1F1F1F] text-[#AAAAAA] hover:text-white border border-[#2E2E2E]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Uploads</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#FF9F43]" />
            <span>Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...RESOURCE_CATEGORIES].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                      : 'bg-[#1F1F1F] text-[#AAAAAA] hover:bg-[#282828] hover:text-white border border-[#2E2E2E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Semester Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Semester:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...SEMESTERS].map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-[#0A0A0A] shadow-md'
                      : 'bg-[#1F1F1F] text-[#888888] hover:text-white border border-[#2E2E2E]'
                  }`}
                >
                  {sem}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
            Loading academic repository...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="p-16 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888] space-y-3">
            <FolderArchive className="w-10 h-10 text-[#444444] mx-auto" />
            <p>No academic resources found matching your active filters.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-lime text-xs font-bold py-2 px-4 rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Be the first to upload</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => {
              const uploader = item.uploaded_by || item.uploadedBy;
              const isMine = uploader === user?.id || (user?.user_id && uploader === user.user_id);
              const canModify = academicResourceService.canModify(item, user);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedResource(item)}
                  className="p-6 rounded-3xl bg-[#161616] border border-[#262626] hover:border-[#B7F34A] shadow-xl transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category & Semester */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1F1F1F] text-[#B7F34A] border border-[#B7F34A]/30">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-[#888888]">
                        {item.semester} • {item.academic_year || item.examYear}
                      </span>
                    </div>

                    {/* Title & Subject */}
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-[#B7F34A] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#AAAAAA] mt-1 line-clamp-1">
                        {item.subject}
                      </p>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Meta tags: File size, type, uploader */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#888888]">
                      <span className="px-2 py-0.5 rounded-md bg-[#1F1F1F] text-[#CCCCCC] font-mono border border-[#2E2E2E]">
                        {item.fileSize || 'PDF'}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF9F43]" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>

                      <span className="ml-auto text-xs font-semibold text-[#AAAAAA]">
                        By {item.uploader_name || item.uploaderName || 'Student'}
                        {isMine && (
                          <span className="ml-1 text-[9px] font-bold bg-[#B7F34A] text-[#0A0A0A] px-1.5 py-0.2 rounded font-mono">
                            YOU
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                    {/* Prominent Download Button */}
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      className="btn-lime flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ({item.downloadCount || item.download_count || 0})</span>
                    </button>

                    {/* Edit & Delete Buttons shown ONLY to Owner and Admin */}
                    {canModify && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleOpenEdit(item, e)}
                          className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#CCCCCC] hover:text-white border border-[#2E2E2E] transition-colors"
                          title="Edit Resource"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => handleDeleteResource(item, e)}
                          className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 border border-[#2E2E2E] transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= UPLOAD RESOURCE MODAL ================= */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          if (!isUploading) {
            setIsUploadModalOpen(false);
            setFileValidationError('');
          }
        }}
        title="Upload Academic Resource"
        subtitle="Contribute study notes, previous year question papers, or lab manuals (Strict 1 MB limit)."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {/* Quick Online File Compression Helpers */}
          <div className="p-3 rounded-2xl bg-[#141414] border border-[#2E2E2E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A]" />
                <span>File Size Must Be Under 1 MB</span>
              </span>
              <span className="text-[10px] text-[#888888]">Direct Compression Tools:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={COMPRESSION_TOOLS.PDF.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] border border-rose-900/40 hover:border-rose-500/60 text-white flex items-center justify-between transition-all group shadow-sm"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-rose-300 block group-hover:text-rose-200">
                    Compress PDF Files
                  </span>
                  <span className="text-[9px] text-[#888888] block">iLovePDF Tool (&lt; 1 MB)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={COMPRESSION_TOOLS.IMAGE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] border border-sky-900/40 hover:border-sky-500/60 text-white flex items-center justify-between transition-all group shadow-sm"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-sky-300 block group-hover:text-sky-200">
                    Compress Images
                  </span>
                  <span className="text-[9px] text-[#888888] block">iLoveIMG Tool (&lt; 1 MB)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* File Picker with 1 MB Limit & Live Size Validation */}
          <div className="p-4 rounded-2xl bg-[#1B1B1B] border-2 border-dashed border-[#333333] hover:border-[#B7F34A] transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Select Document / Image *
              </span>
              <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded-full border border-[#FF9F43]/30">
                Max Size: 1 MB
              </span>
            </div>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full text-xs text-[#AAAAAA] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#B7F34A] file:text-[#0A0A0A] hover:file:bg-[#a5e23c] cursor-pointer"
              required
            />

            <div className="flex items-center justify-between text-[11px] text-[#777777] pt-1">
              <span>Supported: PDF, JPG, JPEG, PNG</span>
              {formData.selectedFile && (
                <span className="font-mono text-white font-bold">
                  Size: {formatBytes(formData.selectedFile.size)}
                </span>
              )}
            </div>

            {fileValidationError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold space-y-2">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{fileValidationError}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-900/40">
                  <span className="text-[11px] text-white font-normal">
                    Don't search Google — compress it directly here:
                  </span>
                  <a
                    href={fileValidationError.includes('PDF') || fileValidationError.toLowerCase().includes('.pdf') ? COMPRESSION_TOOLS.PDF.url : COMPRESSION_TOOLS.IMAGE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lime text-[11px] font-black px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow"
                  >
                    <span>Open {fileValidationError.includes('PDF') || fileValidationError.toLowerCase().includes('.pdf') ? 'iLovePDF' : 'iLoveIMG'} Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operating Systems Mid-Sem PYQ 2024"
              className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          {/* Category & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">
                  Subject *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewSubject(!isCreatingNewSubject)}
                  className="text-[10px] font-bold text-[#B7F34A] hover:underline"
                >
                  {isCreatingNewSubject ? 'Cancel' : '+ New Subject'}
                </button>
              </div>

              {isCreatingNewSubject ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubjectInput}
                    onChange={(e) => setNewSubjectInput(e.target.value)}
                    placeholder="Enter subject name & code"
                    className="flex-1 px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewSubject}
                    className="btn-lime text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                >
                  {allSubjects
                    .filter((s) => s.semester === formData.semester)
                    .map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name}</option>
                    ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of chapters, exam format, or key solutions included..."
              className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          {/* Progress Bar during Upload */}
          {isUploading && (
            <div className="space-y-1.5 p-3 rounded-xl bg-[#1A1A1A] border border-[#333333]">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#AAAAAA]">{uploadStage || 'Uploading...'}</span>
                <span className="text-[#B7F34A]">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#2A2A2A] overflow-hidden">
                <div
                  className="h-full bg-[#B7F34A] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || Boolean(fileValidationError) || !formData.selectedFile}
            className="w-full btn-lime text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading & Optimizing Storage...' : 'Publish Academic Resource'}
          </button>
        </form>
      </Modal>

      {/* ================= EDIT RESOURCE MODAL ================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingResource(null);
        }}
        title="Edit Resource Information"
        subtitle={`Editing metadata for "${editingResource?.title}"`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Semester *
              </label>
              <select
                value={editFormData.semester}
                onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={editFormData.subject}
                onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <select
                value={editFormData.academicYear}
                onChange={(e) => setEditFormData({ ...editFormData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-black py-3 rounded-xl uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* ================= DETAIL MODAL ================= */}
      <Modal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        title={selectedResource?.title || 'Academic Resource'}
        subtitle={`${selectedResource?.category} • ${selectedResource?.semester}`}
      >
        <div className="space-y-4 text-xs text-[#CCCCCC]">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#B7F34A] text-[#0A0A0A]">
              {selectedResource?.category}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1F1F1F] text-white border border-[#333333]">
              {selectedResource?.semester}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1F1F1F] text-[#AAAAAA] border border-[#333333]">
              Year: {selectedResource?.academic_year || selectedResource?.examYear}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block mb-1">
              Subject
            </span>
            <p className="text-sm font-bold text-white">{selectedResource?.subject}</p>
          </div>

          {selectedResource?.description && (
            <div>
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block mb-1">
                Description
              </span>
              <p className="text-xs text-[#AAAAAA] leading-relaxed whitespace-pre-line">
                {selectedResource.description}
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">
              File Information
            </h5>
            <div className="flex justify-between text-[#888888]">
              <span>File Name:</span>
              <span className="text-white font-mono">{selectedResource?.fileName || selectedResource?.file_name}</span>
            </div>
            <div className="flex justify-between text-[#888888]">
              <span>File Size:</span>
              <span className="text-white font-mono">{selectedResource?.fileSize}</span>
            </div>
            <div className="flex justify-between text-[#888888]">
              <span>Contributed By:</span>
              <span className="text-white">{selectedResource?.uploader_name || selectedResource?.uploaderName}</span>
            </div>
            <div className="flex justify-between text-[#888888]">
              <span>Downloads:</span>
              <span className="text-[#B7F34A] font-bold">{selectedResource?.downloadCount || selectedResource?.download_count || 0}</span>
            </div>
          </div>

          <button
            onClick={() => handleDownload(selectedResource)}
            className="w-full btn-lime text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#B7F34A]/25"
          >
            <Download className="w-4 h-4" />
            <span>Download Resource Now</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
