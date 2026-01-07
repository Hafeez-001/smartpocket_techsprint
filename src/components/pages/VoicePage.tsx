import React, { useState } from 'react';
import { Mic, MicOff, Plus, Check, X } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { parseVoiceInput, getCategoryEmoji } from '../../utils/voiceParser';
import { storage } from '../../utils/storage';
import { Transaction, VoiceParseResult } from '../../types';

export function VoicePage() {
  const [transcript, setTranscript] = useState('');
  const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    amount: '',
    category: 'other',
    description: '',
    type: 'expense' as 'income' | 'expense'
  });
  const [pendingGoalSave, setPendingGoalSave] = useState<{ title: string, amount: number } | null>(null);

  const handleVoiceResult = React.useCallback(async (result: string) => {
    setTranscript(result);
    setIsProcessing(true);

    const saveMatch = result.match(/(?:save|saved|put|add)\s+(\d+)\s+(?:to|for)?\s*(.+)?/i);

    if (saveMatch) {
      const amount = parseInt(saveMatch[1]);
      const goalTitle = saveMatch[2]?.trim().toLowerCase();
      const goals = await storage.getSavingsGoals();
      const matchedIndex = goals.findIndex((g) => g.title.toLowerCase() === goalTitle);

      if (matchedIndex !== -1) {
        setPendingGoalSave({ title: goals[matchedIndex].title, amount });
        setIsProcessing(false);
        return;
      } else {
        setIsProcessing(false);
        setTranscript('');
        alert(`No goal found with title "${goalTitle}" 😕`);
        return;
      }
    }

    setTimeout(() => {
      const parsed = parseVoiceInput(result);
      setParseResult(parsed);
      setIsProcessing(false);
    }, 1000);
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition({
    onResult: handleVoiceResult,
    onError: (error) => console.error('Voice error:', error)
  });



  const confirmTransaction = async () => {
    if (!parseResult) return;

    const transaction = {
      userId: localStorage.getItem("userId"),
      amount: parseResult.amount,
      category: parseResult.category,
      type: parseResult.type,
      date: new Date()
    };

    await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    setTranscript('');
    setParseResult(null);

    setTimeout(() => {
      alert('Transaction added successfully! 🎉');
    }, 100);
  };

  const confirmGoalSave = async () => {
    if (!pendingGoalSave) return;

    const goals = await storage.getSavingsGoals();
    const matchedIndex = goals.findIndex((g) => g.title.toLowerCase() === pendingGoalSave.title.toLowerCase());

    if (matchedIndex !== -1) {
      goals[matchedIndex].savedAmount = (goals[matchedIndex].savedAmount ?? 0) + pendingGoalSave.amount;
      await storage.saveSavingsGoals(goals);
      setTranscript('');
      setPendingGoalSave(null);
      alert(`₹${pendingGoalSave.amount} saved to "${goals[matchedIndex].title}" 🎯`);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transaction = {
      userId: localStorage.getItem("userId"),
      amount: parseFloat(manualTransaction.amount),
      category: manualTransaction.category,
      type: manualTransaction.type,
      date: new Date()
    };

    await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    setManualTransaction({
      amount: '',
      category: 'other',
      description: '',
      type: 'expense'
    });
    setShowManualForm(false);

    alert('Transaction added successfully! 🎉');
  };



  const categories = ['food', 'entertainment', 'transport', 'shopping', 'education', 'health', 'other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 pt-8">
      <div className="px-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Voice Transaction</h1>
          <p className="text-slate-600 text-lg">Speak naturally about your expenses and income</p>
        </div>

        {/* Voice Input Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!isSupported || isProcessing}
                className={`w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg ${isListening
                  ? 'bg-red-500 shadow-red-200'
                  : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-200'
                  } ${(!isSupported || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
              >
                {isListening ? <MicOff size={36} /> : <Mic size={36} />}
              </button>

              {isListening && (
                <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-lg font-medium text-slate-700 mb-2">
                {!isSupported
                  ? 'Voice recognition not supported'
                  : isListening
                    ? 'Listening...'
                    : isProcessing
                      ? 'Processing your input...'
                      : 'Tap to start recording'
                }
              </p>
              <p className="text-sm text-slate-500">
                {isListening && 'Speak clearly about your transaction'}
              </p>
            </div>
          </div>

          {/* Example phrases */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Example phrases
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-green-600">💰</span>
                <span>"I received ₹500 as allowance"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-red-600">🍕</span>
                <span>"I spent ₹100 on lunch"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-red-600">💸</span>
                <span>"Saved ₹100 for goals"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="text-blue-600">🚌</span>
                <span>"Paid ₹50 for bus fare"</span>
              </div>
            </div>
          </div>
          
          
          

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Transcript
              </h3>
              <p className="text-slate-700 italic bg-white p-4 rounded-lg border">"{transcript}"</p>
            </div>
          )}

          {/* Parse Result */}
          {parseResult && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Parsed Transaction
              </h3>
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Type:</span>
                    <span className={`font-semibold ${parseResult.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {parseResult.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-semibold text-slate-800">₹{parseResult.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Category:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {getCategoryEmoji(parseResult.category)} {parseResult.category}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Confidence:</span>
                    <span className="font-semibold text-slate-800">{(parseResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmTransaction}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={18} /> Confirm Transaction
                </button>
                <button
                  onClick={() => {
                    setTranscript('');
                    setParseResult(null);
                  }}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          )}
          {pendingGoalSave && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Confirm Goal Save
              </h3>
              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-slate-700 text-sm">Save <strong className="text-yellow-700">₹{pendingGoalSave.amount}</strong> to goal <strong className="text-yellow-700">"{pendingGoalSave.title}"</strong>?</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmGoalSave}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check size={18} /> Confirm Save
                </button>
                <button
                  onClick={() => {
                    setTranscript('');
                    setPendingGoalSave(null);
                  }}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Manual Entry Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="bg-white hover:bg-slate-50 text-slate-700 py-4 px-8 rounded-2xl font-medium border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg"
          >
            <Plus size={20} />
            Manual Entry
          </button>
        </div>

        {/* Manual Entry Form */}
        {showManualForm && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Manual Transaction Entry
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Transaction Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setManualTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 border-2 ${manualTransaction.type === 'expense'
                      ? 'bg-red-500 text-white border-red-500 shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 border-2 ${manualTransaction.type === 'income'
                      ? 'bg-green-500 text-white border-green-500 shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                  >
                    💰 Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Amount (₹)</label>
                <input
                  type="number"
                  value={manualTransaction.amount}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <select
                  value={manualTransaction.category}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
                <input
                  type="text"
                  value={manualTransaction.description}
                  onChange={(e) => setManualTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="What was this transaction for?"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add Transaction
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
// import React, { useState, useCallback } from 'react';
// import { Mic, MicOff, Plus, Check, X } from 'lucide-react';
// import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
// import { parseVoiceInput, getCategoryEmoji } from '../../utils/voiceParser';
// import { storage } from '../../utils/storage';
// import { Transaction, VoiceParseResult } from '../../types';

// export function VoicePage() {
//   const [transcript, setTranscript] = useState('');
//   const [parseResult, setParseResult] = useState<VoiceParseResult | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showManualForm, setShowManualForm] = useState(false);
//   const [manualTransaction, setManualTransaction] = useState({
//     amount: '',
//     category: 'other',
//     description: '',
//     type: 'expense' as 'income' | 'expense',
//   });

//   // ✅ useCallback prevents re-creating function on every render (avoids infinite loop)
//   const handleVoiceResult = useCallback(async (result: string) => {
//     setTranscript(result);
//     setIsProcessing(true);

//     // 🎯 Goal-saving voice logic
//     const saveMatch = result.match(/(?:save|saved|put|add)\s+(\d+)\s+(?:to|for)?\s*(.+)?/i);

//     if (saveMatch) {
//       const amount = parseInt(saveMatch[1]);
//       const goalTitle = saveMatch[2]?.trim().toLowerCase();
//       const goals = await storage.getSavingsGoals();
//       const matchedIndex = goals.findIndex((g) => g.title.toLowerCase() === goalTitle);

//       if (matchedIndex !== -1) {
//         goals[matchedIndex].savedAmount = (goals[matchedIndex].savedAmount ?? 0) + amount;
//         await storage.saveSavingsGoals(goals);
//         setIsProcessing(false);
//         setTranscript('');
//         alert(`₹${amount} saved to "${goals[matchedIndex].title}" 🎯`);
//         return;
//       } else {
//         setIsProcessing(false);
//         setTranscript('');
//         alert(`No goal found with title "${goalTitle}" 😕`);
//         return;
//       }
//     }

//     // ✨ Fallback: regular transaction
//     setTimeout(() => {
//       const parsed = parseVoiceInput(result);
//       setParseResult(parsed);
//       setIsProcessing(false);
//     }, 500);
//   }, []);

//   const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition({
//     onResult: handleVoiceResult,
//     onError: (error) => console.error('Voice error:', error),
//   });

//   const confirmTransaction = async () => {
//     if (!parseResult) return;

//     const transaction = {
//       userId: localStorage.getItem('userId'),
//       amount: parseResult.amount,
//       category: parseResult.category,
//       type: parseResult.type,
//       date: new Date(),
//     };

//     await fetch('http://localhost:5000/api/transactions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(transaction),
//     });

//     setTranscript('');
//     setParseResult(null);
//     alert('Transaction added successfully! 🎉');
//   };

//   const handleManualSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const transaction = {
//       userId: localStorage.getItem('userId'),
//       amount: parseFloat(manualTransaction.amount),
//       category: manualTransaction.category,
//       type: manualTransaction.type,
//       date: new Date(),
//     };

//     await fetch('http://localhost:5000/api/transactions', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(transaction),
//     });

//     setManualTransaction({ amount: '', category: 'other', description: '', type: 'expense' });
//     setShowManualForm(false);
//     alert('Transaction added successfully! 🎉');
//   };

//   const categories = ['food', 'entertainment', 'transport', 'shopping', 'education', 'health', 'other'];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 pt-8">
//       <div className="px-6 max-w-lg mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-slate-800 mb-3">Voice Transaction</h1>
//           <p className="text-slate-600 text-lg">Speak naturally about your expenses or goals</p>
//         </div>

//         {/* Voice Input */}
//         <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-slate-100">
//           <div className="text-center mb-8">
//             <div className="relative inline-block">
//               <button
//                 onClick={isListening ? stopListening : startListening}
//                 disabled={!isSupported || isProcessing}
//                 className={`w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg ${
//                   isListening
//                     ? 'bg-red-500 shadow-red-200'
//                     : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-200'
//                 } ${(!isSupported || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
//               >
//                 {isListening ? <MicOff size={36} /> : <Mic size={36} />}
//               </button>
//               {isListening && <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping"></div>}
//             </div>
//             <p className="mt-4 text-slate-700">
//               {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to start recording'}
//             </p>
//           </div>

//           {/* Transcript Display */}
//           {transcript && (
//             <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
//               <strong>Transcript:</strong> {transcript}
//             </div>
//           )}

//           {/* Parsed Transaction */}
//           {parseResult && (
//             <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
//               <p className="mb-2 font-semibold text-slate-700">Parsed Result:</p>
//               <ul className="text-sm text-slate-600 space-y-1">
//                 <li>Type: {parseResult.type}</li>
//                 <li>Amount: ₹{parseResult.amount}</li>
//                 <li>Category: {parseResult.category}</li>
//                 <li>Confidence: {(parseResult.confidence * 100).toFixed(1)}%</li>
//               </ul>
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={confirmTransaction}
//                   className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium"
//                 >
//                   <Check size={18} /> Confirm
//                 </button>
//                 <button
//                   onClick={() => {
//                     setTranscript('');
//                     setParseResult(null);
//                   }}
//                   className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-xl font-medium"
//                 >
//                   <X size={18} /> Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Manual Entry */}
//         <div className="text-center">
//           <button
//             onClick={() => setShowManualForm(!showManualForm)}
//             className="bg-white border border-slate-300 text-slate-800 py-3 px-6 rounded-xl shadow hover:bg-slate-50"
//           >
//             <Plus size={16} className="inline-block mr-1" /> Manual Entry
//           </button>
//         </div>

//         {showManualForm && (
//           <div className="bg-white mt-6 p-6 rounded-2xl shadow-lg">
//             <form onSubmit={handleManualSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
//                 <input
//                   type="number"
//                   value={manualTransaction.amount}
//                   onChange={(e) => setManualTransaction((prev) => ({ ...prev, amount: e.target.value }))}
//                   className="w-full p-3 border rounded-xl"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
//                 <select
//                   value={manualTransaction.category}
//                   onChange={(e) => setManualTransaction((prev) => ({ ...prev, category: e.target.value }))}
//                   className="w-full p-3 border rounded-xl"
//                 >
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {getCategoryEmoji(cat)} {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
//                 Add Transaction
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
