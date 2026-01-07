import { Transaction, SavingsGoal, Badge } from '../types';
import { getCategoryEmoji } from './voiceParser';

const API_BASE = 'http://localhost:5000/api';

export const storage = {
  getUserId: (): string | null => localStorage.getItem('userId'),

  getTransactions: async (): Promise<Transaction[]> => {
    const userId = storage.getUserId();
    if (!userId) return [];
    const res = await fetch(`${API_BASE}/transactions/${userId}`);
    const data = await res.json();
    return data.map((t: any) => ({
      ...t,
      id: t._id,
      date: new Date(t.date),
      emoji: getCategoryEmoji(t.category)
    }));
  },

  saveTransaction: async (transaction: Transaction): Promise<void> => {
    const userId = storage.getUserId();
    if (!userId) return;
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...transaction, userId }),
    });
  },

  getBalance: async (): Promise<number> => {
    const txns = await storage.getTransactions();
    return txns.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  },

  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    const userId = storage.getUserId();
    if (!userId) return [];
    const res = await fetch(`${API_BASE}/goals/${userId}`);
    return await res.json();
  },

  saveSavingsGoals: async (goals: SavingsGoal[]): Promise<void> => {
    const userId = storage.getUserId();
    if (!userId) return;
    await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, goals }),
    });
  },

  getBadges: async (): Promise<Badge[]> => {
    const userId = storage.getUserId();
    if (!userId) return [];
    const res = await fetch(`${API_BASE}/badges/${userId}`);
    const data = await res.json();
    return data.map((b: any) => ({
      ...b,
      earnedDate: b.earnedDate ? new Date(b.earnedDate) : undefined
    }));
  },

  saveBadges: async (badges: Badge[]): Promise<void> => {
    const userId = storage.getUserId();
    if (!userId) return;
    await fetch(`${API_BASE}/badges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, badges }),
    });
  },
};
