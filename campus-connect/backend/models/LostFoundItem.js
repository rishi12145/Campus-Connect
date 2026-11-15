import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: String, default: 'General' },
  location: { type: String, required: true },
  date: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  reportedBy: { type: String, required: true }
}, { timestamps: true });

export const LostFoundItem = mongoose.model('LostFoundItem', lostFoundSchema);

