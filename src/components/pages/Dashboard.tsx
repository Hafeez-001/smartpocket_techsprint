import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { storage } from '../../utils/storage';
import { Transaction, SavingsGoal } from '../../types';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF4444'];

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const txns = await storage.getTransactions();
      const bal = await storage.getBalance();
      const gs = await storage.getSavingsGoals();
      setTransactions(txns || []);
      setBalance(bal || 0);
      setGoals(gs || []);
    };
    fetchData();
  }, []);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { [category: string]: number }, curr) => {
      const cat = curr.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">Dashboard</h1>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 text-center">
        <p className="text-slate-500">Total Balance</p>
        <h2 className="text-5xl font-bold text-slate-800 mb-4">₹{balance.toLocaleString()}</h2>
        <div className="flex justify-center gap-6">
          <span className="flex items-center gap-2 text-green-600">
            <TrendingUp /> Income: ₹{totalIncome.toLocaleString()}
          </span>
          <span className="flex items-center gap-2 text-red-600">
            <TrendingDown /> Expenses: ₹{totalExpenses.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">🔵 Expense Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">No expense data available.</p>
          )}
        </div>

        {/* ✅ FIXED SAVINGS GOALS SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span>💡 Savings Goals</span>
            <button
              onClick={() => setShowAddGoal(true)}
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              + Add
            </button>
          </h2>

          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      {goal.emoji} {goal.title}
                    </p>
                    <p className="text-xs text-slate-500">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                  </div>

                  {/* Remove Goal */}
                  <button
                    className="text-red-500 text-sm hover:underline"
                    onClick={async () => {
                      const updated = goals.filter(g => g.id !== goal.id);
                      await storage.saveSavingsGoals(updated);
                      setGoals(updated);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No savings goals added.</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Transactions</h2>

        {recentTransactions.length === 0 ? (
          <p className="text-slate-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentTransactions.map((t) => (
              <li key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border">
                <div>
                  <p className="font-semibold capitalize">{t.category || 'Uncategorized'}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-xl font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ADD GOAL MODAL */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Goal</h3>

            <input
              type="text"
              placeholder="Goal Name"
              className="w-full mb-3 p-2 border rounded"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />

            <input
              type="number"
              placeholder="Target Amount"
              className="w-full mb-4 p-2 border rounded"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseInt(e.target.value) })}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-slate-300 hover:bg-slate-400"
                onClick={() => setShowAddGoal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  if (!newGoal.title || newGoal.targetAmount <= 0) return;

                  const newEntry = {
                    id: crypto.randomUUID(),
                    title: newGoal.title,
                    targetAmount: newGoal.targetAmount,
                    currentAmount: 0,
                    emoji: "🎯",
                    color: "#4F46E5"
                  };

                  const updated = [...goals, newEntry];
                  await storage.saveSavingsGoals(updated);
                  setGoals(updated);
                  setNewGoal({ title: "", targetAmount: 0 });
                  setShowAddGoal(false);
                }}
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
