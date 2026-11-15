import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Campus Connect — IIITV-ICD',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root message
app.get('/', (req, res) => {
  res.json({
    message: 'Campus Connect API is operating normally for IIIT Vadodara — ICD',
    endpoints: ['/api/health', '/api/announcements', '/api/academic', '/api/lost-found', '/api/resources', '/api/transport', '/api/discussions', '/api/places']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Campus Connect] Server running on port ${PORT}`);
    console.log(`[Campus Connect] Health check at http://localhost:${PORT}/api/health`);
  });
};

startServer();

