import { Transaction, Badge } from '../types';

export async function generateBadges(userId: string, transactions: Transaction[]): Promise<Badge[]> {
  const earnedBadges: Badge[] = [];

  const totalTxns = transactions.length;
  const totalIncome = transactions.filter(t => t.type === 'income');
  const totalExpense = transactions.filter(t => t.type === 'expense');
  const balance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

  const uniqueDates = new Set(transactions.map(t => new Date(t.date).toDateString()));

  const now = new Date();

  if (totalTxns >= 1) {
    earnedBadges.push({
      title: 'First Transaction',
      description: 'You made your very first transaction!',
      earnedDate: now,
      emoji: '🎉'
    });
  }

  if (totalTxns >= 10) {
    earnedBadges.push({
      title: 'Transaction Master',
      description: 'You made 10+ transactions!',
      earnedDate: now,
      emoji: '💼'
    });
  }

  if (balance >= 5000) {
    earnedBadges.push({
      title: 'Big Saver',
      description: 'Saved over ₹5000!',
      earnedDate: now,
      emoji: '💰'
    });
  }

  if (totalIncome.length >= 5 && totalExpense.length >= 5) {
    earnedBadges.push({
      title: 'Money Pro',
      description: '5 incomes and 5 expenses recorded!',
      earnedDate: now,
      emoji: '📈'
    });
  }

  if (uniqueDates.size >= 3) {
    earnedBadges.push({
      title: 'Consistent Tracker',
      description: '3+ days of tracking!',
      earnedDate: now,
      emoji: '📅'
    });
  }

  // Send to backend
  await fetch('/api/badges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, badges: earnedBadges })
  });

  return earnedBadges;
}
