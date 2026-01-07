import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const badgeSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  emoji: String,
  earnedDate: Date,
  earned: Boolean, // optional: for badge filtering
});

const Badge = mongoose.model('Badge', badgeSchema);

// Get all badges for a user
router.get('/:userId', async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.params.userId });
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Save/update badges for a user
router.post('/', async (req, res) => {
  try {
    const { userId, badges } = req.body;

    await Badge.deleteMany({ userId });

    await Badge.insertMany(
      badges.map((b) => ({
        userId,
        title: b.title,
        description: b.description,
        emoji: b.emoji || '',
        earnedDate: b.earnedDate || null,
        earned: b.earned || false,
      }))
    );

    res.status(201).json({ message: 'Badges saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save badges' });
  }
});

export default router;
