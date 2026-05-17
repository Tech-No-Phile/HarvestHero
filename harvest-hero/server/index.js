import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import harvestRoutes from './routes/harvestroutes.js';
import landRoutes from './routes/landRoutes.js';
import blockchainRoutes from './routes/blockchainRoutes.js';
import { initBlockchain } from './config/blockchain.js';

initBlockchain();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'harvest-hero-server', version: '1.0.0', endpoints: { auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'] } });
});
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, _req, res, next) => {
  console.error('[HarvestHero] Error:', err);
  res.status(500).json({
    message: 'Internal server error(Something went wrong!)',
    error: process.env.NODE_ENV === 'development' ? undefined : err.message
  });
});

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('[HarvestHero] MONGO_URI is not defined. Skipping MongoDB connection.');
    } else {
      await mongoose.connect(MONGO_URI);
      console.log('[HarvestHero] Connected to MongoDB');
    }

    app.listen(PORT, () => {
      console.log(`[HarvestHero] Server listening on http://localhost:${PORT}`);
      console.log(`[HarvestHero] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('[HarvestHero] Failed to start server', err);
    process.exit(1);
  }
}

start();

