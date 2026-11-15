import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Academic Buildings',
      'Library',
      'Cafeteria',
      'Sports Facilities',
      'Hostels',
      'Medical Facilities',
      'Nearby Places'
    ],
    required: true
  },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  openingHours: { type: String, default: '08:00 AM – 08:00 PM' },
  imageUrl: { type: String, default: '' },
  mapUrl: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  features: [{ type: String }]
}, { timestamps: true });

export const Place = mongoose.model('Place', placeSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'system' },
  link: { type: String, default: '/dashboard' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, default: 'student' },
  details: { type: String, default: '' },
  targetModule: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

