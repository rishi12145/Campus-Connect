import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  code: { type: String, required: true },
  faculty: { type: String, required: true },
  room: { type: String, required: true },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: {
    type: String,
    enum: ['Lecture', 'Lab', 'Tutorial'],
    default: 'Lecture'
  },
  semester: { type: String, default: 'Semester 4' },
  batch: { type: String, default: 'B.Tech CSE 2023-27' }
}, { timestamps: true });

export const AcademicRoutine = mongoose.model('AcademicRoutine', routineSchema);

