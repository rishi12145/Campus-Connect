import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [{ type: String }],
  departureTime: { type: String, required: true },
  frequency: { type: String, default: 'Regular Schedule' },
  busNumber: { type: String, default: 'DD-02-Campus' },
  driverName: { type: String, default: 'Staff Driver' },
  driverContact: { type: String, default: '+91 2875 252000' },
  daysOfOperation: { type: String, default: 'Monday – Saturday' },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

export const TransportRoute = mongoose.model('TransportRoute', transportSchema);

