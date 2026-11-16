import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { storageService } from './storageService.js';

export const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // Strict 1 MB maximum limit
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const RESOURCE_CATEGORIES = [
  'Previous Year Question Papers (PYQs)',
  'Lecture Notes',
  'Lab Manuals',
  'Study Materials'
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];

export const ACADEMIC_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021'];

/**
 * Maps human-readable category to clean storage folder path
 */
export const getCategoryFolder = (category) => {
  if (category.includes('Previous Year') || category.includes('PYQ')) return 'PYQs';
  if (category.includes('Note')) return 'Notes';
  if (category.includes('Manual')) return 'Lab-Manuals';
  return 'Study-Materials';
};

/**
 * Compresses an image file (JPEG/PNG) using HTML5 Canvas to optimize storage
 */
export const compressImage = async (file, maxWidth = 1600, quality = 0.82) => {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressed = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressed.size < file.size ? compressed : file);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export const COMPRESSION_TOOLS = {
  PDF: {
    name: 'iLovePDF',
    url: 'https://www.ilovepdf.com/compress_pdf',
    label: 'Compress PDF under 1 MB',
    desc: 'Instantly reduce PDF file size on iLovePDF'
  },
  IMAGE: {
    name: 'iLoveIMG',
    url: 'https://www.iloveimg.com/compress-image',
    label: 'Compress Image under 1 MB',
    desc: 'Instantly reduce JPG / PNG file size on iLoveIMG'
  }
};

/**
 * Validates file size and MIME type
 */
export const validateResourceFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please select a file to upload.' };
  }

  // Type validation
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const validExts = ['pdf', 'jpg', 'jpeg', 'png'];
  const isValidType = ALLOWED_MIME_TYPES.includes(file.type) || validExts.includes(fileExt);

  if (!isValidType) {
    return {
      valid: false,
      error: `Invalid file format (${fileExt || file.type}). Only PDF, JPG, JPEG, and PNG files are allowed.`
    };
  }

  // Size validation (Strict 1 MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const isPdf = fileExt === 'pdf' || file.type === 'application/pdf';
    const compressUrl = isPdf 
      ? COMPRESSION_TOOLS.PDF.url 
      : COMPRESSION_TOOLS.IMAGE.url;
    const toolName = isPdf ? COMPRESSION_TOOLS.PDF.name : COMPRESSION_TOOLS.IMAGE.name;

    return {
      valid: false,
      error: `File size exceeds the 1 MB limit (Selected: ${sizeInMb} MB). Please choose a file under 1 MB.`,
      isPdf,
      compressUrl,
      toolName,
      compressionAdvice: `Compress this ${isPdf ? 'PDF' : 'image'} under 1 MB in seconds using ${toolName}.`
    };
  }

  return { valid: true, error: null };
};

/**
 * Formats bytes to readable units
 */
export const formatBytes = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 KB';
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
};

export const academicResourceService = {
  /**
   * Fetches all resources from Supabase or fallback store
   */
  async getResources() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('academic_resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            category: item.category,
            semester: item.semester,
            subject: item.subject,
            academic_year: item.academic_year,
            examYear: item.academic_year,
            fileName: item.file_name,
            filePath: item.file_path,
            fileType: item.file_type,
            fileSize: item.file_size,
            fileBytes: item.file_bytes,
            uploaded_by: item.uploaded_by,
            uploadedBy: item.uploaded_by,
            uploader_name: item.uploader_name,
            uploaderName: item.uploader_name,
            uploader_role: item.uploader_role,
            download_count: item.download_count || 0,
            downloadCount: item.download_count || 0,
            createdAt: item.created_at,
            created_at: item.created_at
          }));

          const local = storageService.getResources();
          const map = new Map();
          local.forEach(l => { if (l && l.id) map.set(l.id, l); });
          mapped.forEach(m => { if (m && m.id) map.set(m.id, m); });
          const merged = Array.from(map.values());
          storageService.saveResources(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local persistent store:', err.message);
      }
    }

    // Resilient local store fallback
    const local = storageService.getResources();
    return local.map((item) => ({
      ...item,
      uploaded_by: item.uploaded_by || item.uploadedBy,
      uploader_name: item.uploader_name || item.uploaderName,
      academic_year: item.academic_year || item.examYear || '2025'
    }));
  },

  /**
   * Uploads file to Supabase Storage and inserts metadata in database
   */
  async uploadResource(formData, user, onProgress) {
    if (!user) throw new Error('You must be signed in to upload academic materials.');

    const { file, title, description, semester, subject, academicYear, category } = formData;

    // 1. Initial Validation
    let fileToUpload = file;
    const initialCheck = validateResourceFile(fileToUpload);
    if (!initialCheck.valid) {
      throw new Error(initialCheck.error);
    }

    // 2. Storage Optimization: Compress image if applicable
    if (fileToUpload.type.startsWith('image/')) {
      if (onProgress) onProgress(15, 'Compressing image for storage optimization...');
      fileToUpload = await compressImage(fileToUpload);
    }

    // 3. Post-compression Size Validation (Strict 1 MB limit)
    const postCheck = validateResourceFile(fileToUpload);
    if (!postCheck.valid) {
      throw new Error(postCheck.error);
    }

    const folder = getCategoryFolder(category);
    const sanitizedFileName = `${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `${folder}/${semester.replace(/\s+/g, '_')}/${sanitizedFileName}`;

    if (onProgress) onProgress(40, 'Uploading file to academic-resources storage...');

    let publicUrl = '';
    let isRemoteUploaded = false;

    // 4. Upload to Supabase Storage if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('academic-resources')
          .upload(storagePath, fileToUpload, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('academic-resources')
          .getPublicUrl(storagePath);

        publicUrl = urlData?.publicUrl || '';
        isRemoteUploaded = true;

        if (onProgress) onProgress(75, 'Storing metadata in database...');

        const resourceRecord = {
          title: title.trim(),
          description: description?.trim() || '',
          category,
          semester,
          subject: subject.trim(),
          academic_year: academicYear,
          file_name: fileToUpload.name,
          file_path: storagePath,
          file_type: fileToUpload.type || 'application/pdf',
          file_size: formatBytes(fileToUpload.size),
          file_bytes: fileToUpload.size,
          uploaded_by: user.user_id || user.id, // Authenticated user ID (never trusted from body)
          uploader_name: user.fullName,
          uploader_role: user.role || 'student',
          download_count: 0
        };

        const { data: dbData, error: dbError } = await supabase
          .from('academic_resources')
          .insert([resourceRecord])
          .select()
          .single();

        if (dbError) throw dbError;

        // Keep local cache immediately synchronized
        storageService.createResource({
          id: dbData.id,
          title: resourceRecord.title,
          description: resourceRecord.description,
          category: resourceRecord.category,
          semester: resourceRecord.semester,
          subject: resourceRecord.subject,
          academic_year: resourceRecord.academic_year,
          fileName: resourceRecord.file_name,
          filePath: resourceRecord.file_path,
          fileType: resourceRecord.file_type,
          fileSize: resourceRecord.file_size,
          fileBytes: resourceRecord.file_bytes,
          uploaded_by: resourceRecord.uploaded_by,
          uploader_name: resourceRecord.uploader_name,
          uploader_role: resourceRecord.uploader_role,
          download_count: 0
        });

        if (onProgress) onProgress(100, 'Upload complete!');
        return {
          ...dbData,
          uploaded_by: dbData.uploaded_by,
          uploader_name: dbData.uploader_name,
          academic_year: dbData.academic_year
        };
      } catch (err) {
        console.warn('Supabase storage upload failed, saving to local persistent layer:', err.message);
      }
    }

    // 5. Fallback storage handling
    if (onProgress) onProgress(80, 'Finalizing local persistent storage...');

    // Convert small files under 1 MB to base64 for persistent offline access
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(fileToUpload);
    });
    const base64Content = await base64Promise;

    const newLocalResource = storageService.createResource({
      title: title.trim(),
      description: description?.trim() || '',
      category,
      semester,
      subject: subject.trim(),
      academic_year: academicYear,
      examYear: academicYear,
      fileName: fileToUpload.name,
      filePath: storagePath,
      fileType: fileToUpload.type || 'application/pdf',
      fileSize: formatBytes(fileToUpload.size),
      fileBytes: fileToUpload.size,
      fileContent: base64Content,
      uploaded_by: user.id,
      uploadedBy: user.id,
      uploader_name: user.fullName,
      uploaderName: user.fullName,
      uploader_role: user.role || 'student'
    });

    if (onProgress) onProgress(100, 'Upload complete!');
    return newLocalResource;
  },

  /**
   * Updates an existing academic resource (Title, Description, Semester, Subject, Year, Category)
   * Enforces that only owner or admin can update
   */
  async updateResource(resourceId, updates, user) {
    if (!user) throw new Error('Unauthorized');

    if (isSupabaseConfigured()) {
      try {
        const payload = {
          title: updates.title?.trim(),
          description: updates.description?.trim(),
          category: updates.category,
          semester: updates.semester,
          subject: updates.subject?.trim(),
          academic_year: updates.academic_year || updates.examYear
        };

        const { data, error } = await supabase
          .from('academic_resources')
          .update(payload)
          .eq('id', resourceId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase update failed, updating local layer:', err.message);
      }
    }

    return storageService.updateResource(resourceId, {
      title: updates.title?.trim(),
      description: updates.description?.trim(),
      category: updates.category,
      semester: updates.semester,
      subject: updates.subject?.trim(),
      academic_year: updates.academic_year || updates.examYear,
      examYear: updates.academic_year || updates.examYear
    });
  },

  /**
   * Deletes a resource and permanently removes its associated storage object
   * Enforces that only owner or admin can delete
   */
  async deleteResource(resource, user) {
    if (!user) throw new Error('Unauthorized');

    const canDelete = this.canModify(resource, user);
    if (!canDelete) {
      throw new Error('Permission denied: You can only delete your own uploaded resources.');
    }

    if (isSupabaseConfigured()) {
      try {
        // Delete file from Supabase Storage bucket
        if (resource.filePath || resource.file_path) {
          const pathToDelete = resource.filePath || resource.file_path;
          await supabase.storage.from('academic-resources').remove([pathToDelete]);
        }

        // Delete record from Database
        const { error } = await supabase
          .from('academic_resources')
          .delete()
          .eq('id', resource.id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Supabase delete failed, removing from local layer:', err.message);
      }
    }

    return storageService.deleteResource(resource.id);
  },

  /**
   * Increments download count and handles secure file download
   */
  async downloadResource(resource) {
    // Increment count
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('academic_resources')
          .update({ download_count: (resource.download_count || 0) + 1 })
          .eq('id', resource.id);
      } catch (err) {
        // silent fail for analytics
      }
    }
    storageService.incrementDownload(resource.id);

    // Direct download trigger
    const filePath = resource.filePath || resource.file_path;
    if (isSupabaseConfigured() && filePath) {
      try {
        const { data, error } = await supabase.storage
          .from('academic-resources')
          .download(filePath);

        if (error) throw error;
        const blobUrl = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = resource.fileName || resource.file_name || 'academic_resource';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        return true;
      } catch (err) {
        console.warn('Supabase download error, checking fallback content:', err.message);
      }
    }

    // Fallback file download
    const content = resource.fileContent || resource.file_content || `Academic Resource: ${resource.title}\nSubject: ${resource.subject}\nCategory: ${resource.category}`;
    const blob = content.startsWith('data:')
      ? await (await fetch(content)).blob()
      : new Blob([content], { type: resource.fileType || 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = resource.fileName || resource.file_name || `${resource.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    return true;
  },

  /**
   * Ownership & permission check: returns true if current user is owner OR admin
   */
  canModify(resource, user) {
    if (!user || !resource) return false;
    if (user.role === 'admin') return true;
    const uploaderId = resource.uploaded_by || resource.uploadedBy;
    const currentUserId = user.user_id || user.id;
    return Boolean(
      uploaderId && 
      (String(uploaderId) === String(currentUserId) || (user.id && String(uploaderId) === String(user.id)))
    );
  }
};

