// ✅ server/index.js (Final)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import authRoutes from './auth.js';
import transactionRoutes from './transactions.js';
import goalsRoutes from './goals.js';
import badgesRoutes from './badges.js';
import socialRoutes from './social.js'; 

dotenv.config();
console.log('🔐 Mongo URI:', process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/social', socialRoutes);

// MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartpocket';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// Default route
app.get('/', (req, res) => {
  res.send('SmartPocket backend is running');
});

// --- Social Page: YouTube Finance Podcasts ---
app.get('/api/social/youtube', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: 'Finance podcast OR Teen savings OR Money management',
          type: 'video',
          maxResults: 6,
          order: 'date',
          key: process.env.YT_API_KEY,
        },
      }
    );

    const videos = response.data.items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
    }));

    res.json(videos);
  } catch (err) {
    console.error('YouTube API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch YouTube podcasts' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
