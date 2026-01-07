import React, { useState, useEffect } from 'react';
import { Volume2, X } from 'lucide-react';
import { storage } from '../utils/storage';

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  // 🔄 Fetch balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const value = await storage.getBalance();
        const numericValue = Number(value);
        setBalance(isNaN(numericValue) ? 0 : numericValue);
      } catch (error) {
        console.error("❌ Failed to fetch balance:", error);
        setBalance(0);
      }
    };
    fetchBalance();
  }, []);

  // 🎤 Speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const tips = [
    "Set aside 20% of your income for savings to build a strong financial foundation.",
    "Track your spending patterns to identify areas where you can optimize your budget.",
    "Consider the 24-hour rule before making non-essential purchases to avoid impulse buying.",
    "Diversify your savings goals between short-term and long-term objectives.",
    "Review your financial progress weekly to stay motivated and on track."
  ];

  const getRandomTip = () => tips[Math.floor(Math.random() * tips.length)];

  const quickActions = [
    {
      label: "💰 Check my balance",
      action: () => speak(`Your current balance is ${balance} rupees. ${balance > 1000 ? "Excellent progress on your savings!" : "Keep building your savings consistently!"}`)
    },
    {
      label: "💡 Financial tip",
      action: () => speak(getRandomTip())
    },
    {
      label: "🎯 Goal update",
      action: () => speak("You're making steady progress toward your financial goals. Consistency is key to building wealth!")
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
      >
        <div className="relative">
          <span className="text-2xl">🐷</span>
          {isSpeaking && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 w-80 max-w-[calc(100vw-3rem)] z-40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐷</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Penny Assistant</h3>
                <p className="text-sm text-slate-600">Your financial advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isSpeaking}
                className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-blue-600" />
                  <span className="font-medium text-slate-700">{action.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              🎙️ Click any option to hear Penny speak
            </p>
          </div>
        </div>
      )}
    </>
  );
}
