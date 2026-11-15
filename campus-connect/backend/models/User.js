import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  collegeEmail: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  semester: { type: String, default: 'Semester 4' },
  batch: { type: String, default: 'B.Tech CSE 2023-27' },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  notificationPrefs: {
    email: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    community: { type: Boolean, default: true },
    lostFound: { type: Boolean, default: true }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

