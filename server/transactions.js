import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // 'income' or 'expense'
  amount: Number,
  category: String,
  date: Date,
  note: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

router.get('/:userId', async (req, res) => {
  const transactions = await Transaction.find({ userId: req.params.userId });
  res.json(transactions);
});

router.post('/', async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.status(201).json({ message: 'Transaction saved' });
});

export default router;

