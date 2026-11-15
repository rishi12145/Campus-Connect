import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, default: 'Semester 4' },
  academicYear: { type: String, default: '2025' },
  category: {
    type: String,
    enum: [
      'Previous Year Question Papers (PYQs)',
      'Lecture Notes',
      'Lab Manuals',
      'Study Materials'
    ],
    required: true
  },
  description: { type: String, default: '' },
  fileName: { type: String, required: true },
  filePath: { type: String, default: '' },
  fileType: { type: String, default: 'application/pdf' },
  fileSize: { type: String, default: '500 KB' },
  fileBytes: {
    type: Number,
    max: [1048576, 'File size exceeds strict 1 MB limit (1048576 bytes)']
  },
  uploadedBy: { type: String, required: true }, // Tied to authenticated user ID
  uploaderName: { type: String, required: true },
  uploaderRole: { type: String, default: 'student' },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Resource = mongoose.model('Resource', resourceSchema);
