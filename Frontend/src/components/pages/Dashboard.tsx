import React, { useEffect, useState } from 'react';
// import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { storage } from '../../utils/storage';
import { Transaction, SavingsGoal } from '../../types';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF4444'];

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: 0 });
  const INSIGHTS_PER_PAGE = 3;
const [insightPage, setInsightPage] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      const txns = await storage.getTransactions();
      const bal = await storage.getBalance();
      const gs = await storage.getSavingsGoals();
      setTransactions(txns || []);
      setBalance(bal || 0);
      setGoals(gs || []);
      setInsightPage(0);
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

  /* ================= INSIGHTS LOGIC ================= */

  const insights: string[] = [];

  // 1️⃣ Top spending category with exact amount + action
  if (pieData.length > 0 && totalExpenses > 0) {
    const topCategory = pieData.reduce((a, b) => (b.value > a.value ? b : a));
    const percent = ((topCategory.value / totalExpenses) * 100).toFixed(1);

    insights.push(
      `You spent ₹${topCategory.value.toLocaleString()} on ${topCategory.name}, which is ${percent}% of your total expenses. Tip: try reducing this by even 10% next month to save ₹${Math.round(topCategory.value * 0.1)}.`
    );
  }

  // 2️⃣ Income vs expense gap (exact gap shown)
  if (totalIncome > 0) {
    const gap = totalIncome - totalExpenses;

    if (gap < 0) {
      insights.push(
        `Your expenses exceed income by ₹${Math.abs(gap).toLocaleString()}. Tip: focus on cutting discretionary spending like food or entertainment.`
      );
    } else {
      insights.push(
        `You saved ₹${gap.toLocaleString()} this period. Tip: allocating this to a savings goal can accelerate goal completion.`
      );
    }
  }

  // 3️⃣ Consistency insight (exact days)
  const uniqueDays = new Set(
    transactions.map(t => new Date(t.date).toDateString())
  ).size;

  if (uniqueDays > 0) {
    insights.push(
      `You tracked transactions on ${uniqueDays} different days. Tip: daily tracking improves awareness and reduces impulsive spending.`
    );
  }

  // 4️⃣ Behaviour intensity (transaction frequency)
  if (transactions.length >= 5) {
    insights.push(
      `You’ve recorded ${transactions.length} transactions so far. Tip: higher tracking frequency improves the accuracy of insights and budgeting.`
    );
  }

  // 5️⃣ Category imbalance insight (optional but strong)
  if (totalExpenses > 0 && pieData.length >= 2) {
    const sorted = [...pieData].sort((a, b) => b.value - a.value);
    const diff = sorted[0].value - sorted[1].value;

    if (diff > 0) {
      insights.push(
        `Your top expense category exceeds the second highest by ₹${diff.toLocaleString()}. Tip: balancing spending across categories can stabilize monthly expenses.`
      );
    }
  }

  /* ================================================== */
const pagedInsights = insights.slice(
  insightPage * INSIGHTS_PER_PAGE,
  insightPage * INSIGHTS_PER_PAGE + INSIGHTS_PER_PAGE
);


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
            <span>🎯 Savings Goals</span>
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

      {/* 🧠 Smart Insights */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          💡 Personalised Insights
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Based on your spending behaviour
        </p>


        {insights.length === 0 ? (
  <p className="text-slate-500">Add transactions to unlock insights.</p>
) : (
  <>
    <ul className="space-y-4">
      {pagedInsights.map((insight, index) => (
        <li
          key={index}
          className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border"
        >
          <span className="text-indigo-600 text-lg">💡</span>
          <p className="text-slate-700 text-sm leading-relaxed">
            {insight}
          </p>
        </li>
      ))}
    </ul>

    {/* Pagination */}
    {insights.length > INSIGHTS_PER_PAGE && (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() =>
            setInsightPage(p =>
              p === 0
                ? Math.floor((insights.length - 1) / INSIGHTS_PER_PAGE)
                : p - 1
            )
          }
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Previous
        </button>

        <span className="text-xs text-slate-500">
          {insightPage + 1} / {Math.ceil(insights.length / INSIGHTS_PER_PAGE)}
        </span>

        <button
          onClick={() =>
            setInsightPage(p =>
              p + 1 >= Math.ceil(insights.length / INSIGHTS_PER_PAGE)
                ? 0
                : p + 1
            )
          }
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Next →
        </button>
      </div>
    )}
  </>
)}

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
