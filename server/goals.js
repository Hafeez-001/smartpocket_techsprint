import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const goalSchema = new mongoose.Schema({
  userId: String,
  title: String,
  targetAmount: Number,
  savedAmount: Number
});

const Goal = mongoose.model('Goal', goalSchema);

// GET all goals for a user
router.get('/:userId', async (req, res) => {
  const goals = await Goal.find({ userId: req.params.userId });
  res.json(goals);
});

// POST: replace all goals for a user
router.post('/', async (req, res) => {
  const { userId, goals } = req.body;
  await Goal.deleteMany({ userId });
  await Goal.insertMany(goals.map(goal => ({ ...goal, userId })));
  res.status(201).json({ message: 'Goals updated' });
});

// ✅ POST /add – Add a single goal
router.post('/add', async (req, res) => {
  try {
    const { userId, title, targetAmount } = req.body;

    // Prevent duplicate goal titles
    const exists = await Goal.findOne({ userId, title: { $regex: new RegExp(`^${title}$`, 'i') } });
    if (exists) {
      return res.status(409).json({ message: 'Goal already exists' });
    }

    const newGoal = new Goal({
      userId,
      title,
      targetAmount,
      savedAmount: 0
    });

    await newGoal.save();
    res.status(201).json({ message: 'Goal created', goal: newGoal });
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ PUT /:id – Update savedAmount of a goal
router.put('/:id', async (req, res) => {
  try {
    const { savedAmount } = req.body;

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: { savedAmount } },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(updatedGoal);
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
