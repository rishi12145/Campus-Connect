import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academic', 'Examination', 'Events', 'General', 'Emergency'],
    default: 'General'
  },
  targetSemester: { type: String, default: 'All Semesters' },
  targetBatch: { type: String, default: 'All Batches' },
  isImportant: { type: Boolean, default: false },
  authorName: { type: String, default: 'Academic Section' },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Announcement = mongoose.model('Announcement', announcementSchema);

