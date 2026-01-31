// import { useEffect, useRef, useState } from "react";
// import { sendChatMessage } from "../utils/chatApi";
// import { storage } from "../utils/storage";

// /* ---------- Helpers ---------- */

// function renderFormattedText(text: string) {
//   const parts = text.split(/(\*\*[^*]+\*\*)/g);

//   return parts.map((part, i) => {
//     if (part.startsWith("**") && part.endsWith("**")) {
//       return (
//         <strong key={i} className="font-semibold">
//           {part.slice(2, -2)}
//         </strong>
//       );
//     }
//     return <span key={i}>{part}</span>;
//   });
// }

// function speak(text: string) {
//   if (!("speechSynthesis" in window)) return;
//   speechSynthesis.cancel();
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.rate = 0.9;
//   utterance.pitch = 1.1;
//   speechSynthesis.speak(utterance);
// }

// function TypingDots() {
//   return (
//     <div className="flex gap-1 px-3 py-2 bg-white border rounded-xl text-sm w-fit">
//       <span className="animate-bounce">.</span>
//       <span className="animate-bounce [animation-delay:0.15s]">.</span>
//       <span className="animate-bounce [animation-delay:0.3s]">.</span>
//     </div>
//   );
// }

// /* ---------- Component ---------- */

// export default function Chatbot() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<
//     { user?: string; bot?: string }[]
//   >([]);
//   const [loading, setLoading] = useState(false);
//   const [balance, setBalance] = useState<number>(0);

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   /* Fetch balance */
//   useEffect(() => {
//     storage.getBalance().then(v => {
//       const n = Number(v);
//       setBalance(isNaN(n) ? 0 : n);
//     });
//   }, []);

//   /* Greeting */
//   useEffect(() => {
//     setMessages([
//       {
//         bot:
//           "Hi 👋 I’m your **Finance Assistant**.\n\n" +
//           "Before we chat, you can tap one of the options below to hear me speak."
//       }
//     ]);
//   }, []);

//   /* Auto-scroll */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   /* Quick actions */
//   const quickActions = [
//     {
//       label: "💰 Check my balance",
//       text: `Your current balance is ${balance} rupees. ${
//         balance > 1000
//           ? "Great job saving consistently!"
//           : "Keep going. Every small saving counts."
//       }`
//     },
//     {
//       label: "💡 Financial tip",
//       text:
//         "Try the 50-30-20 rule. Use 50 percent of your income for needs, 30 percent for wants, and save at least 20 percent."
//     },
//     {
//       label: "🎯 Goal update",
//       text:
//         "Consistency matters more than amount. Saving a little regularly builds strong financial habits."
//     }
//   ];

//   function handleQuickAction(text: string) {
//     speak(text);
//     setMessages(prev => [...prev, { bot: text }]);
//   }

//   async function handleSend() {
//     if (!input.trim()) return;

//     const userMsg = input;
//     setInput("");
//     setLoading(true);

//     setMessages(prev => [...prev, { user: userMsg }]);

//     const reply = await sendChatMessage(userMsg);

//     setMessages(prev => [...prev, { bot: reply }]);
//     setLoading(false);
//   }

//   return (
//     <div className="w-full h-full flex flex-col">
//       {/* Messages */}
//       <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto bg-gray-50 max-h-[35vh] sm:max-h-[45vh]">
//         {messages.map((m, i) => (
//           <div key={i} className="space-y-2">
//             {m.user && (
//               <div className="flex justify-end">
//                 <div className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm max-w-[80%]">
//                   {m.user}
//                 </div>
//               </div>
//             )}

//             {m.bot && (
//               <div className="flex justify-start">
//                 <div className="bg-white border px-3 py-2 rounded-xl text-xs sm:text-sm max-w-[80%] whitespace-pre-line">
//                   {renderFormattedText(m.bot)}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Quick actions shown only at start */}
//         {messages.length === 1 && (
//           <div className="space-y-2">
//             {quickActions.map((a, i) => (
//               <button
//                 key={i}
//                 onClick={() => handleQuickAction(a.text)}
//                 className="w-full text-left px-3 py-2 rounded-xl bg-white border hover:bg-gray-100 text-sm"
//               >
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-start">
//             <TypingDots />
//           </div>
//         )}

//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="flex items-center gap-2 px-2 py-2 sm:p-3 border-t bg-white">
//         <input
//           className="flex-1 px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Ask a finance question…"
//           onKeyDown={e => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm hover:bg-indigo-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../utils/chatApi";
import { storage } from "../utils/storage";
import { Mic, MicOff } from "lucide-react";

/* ---------- Helpers ---------- */

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  speechSynthesis.speak(utterance);
}

function TypingDots() {
  return (
    <div className="flex gap-1 px-3 py-2 bg-white border rounded-xl text-sm w-fit">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:0.15s]">.</span>
      <span className="animate-bounce [animation-delay:0.3s]">.</span>
    </div>
  );
}

/* ---------- Component ---------- */

async function buildUserContext() {
  const transactions = await storage.getTransactions();
  const balance = Number(await storage.getBalance()) || 0;
  const goals = await storage.getSavingsGoals();

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categoryMap[t.category || "other"] =
        (categoryMap[t.category || "other"] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const activeDays = new Set(
    transactions.map(t => new Date(t.date).toDateString())
  ).size;

  return {
    balance,
    totalIncome,
    totalExpenses,
    savingsRate:
      totalIncome > 0
        ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
        : 0,

    transactionCount: transactions.length,
    activeDays,

    topExpenseCategory: sortedCategories[0]?.[0] || null,
    topExpenseAmount: sortedCategories[0]?.[1] || 0,

    goalsCount: goals.length,

    flags: {
      overspending: totalExpenses > totalIncome,
      lowSavings: totalIncome > 0 && (totalIncome - totalExpenses) / totalIncome < 0.2,
      inactiveUser: activeDays < 3
    }
  };
}


export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user?: string; bot?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [listening, setListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  /* Fetch balance */
  useEffect(() => {
    storage.getBalance().then(v => {
      const n = Number(v);
      setBalance(isNaN(n) ? 0 : n);
    });
  }, []);

  /* Greeting */
  useEffect(() => {
    setMessages([
      {
        bot:
          "Hi 👋 I’m your **Finance Assistant**.\n" +
          "You can type or just tap the mic and speak 🎤."
      }
    ]);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Init Speech Recognition */
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      await handleVoiceSend(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  /* Quick actions */
  const quickActions = [
    {
      label: "💰 Check my balance",
      text: `Your current balance is ${balance} rupees. ${
        balance > 1000
          ? "Great job saving consistently!"
          : "Keep going. Every small saving counts."
      }`
    },
    {
      label: "💡 Financial tip",
      text:
        "Try the 50-30-20 rule. Use 50 percent for needs, 30 percent for wants, and save at least 20 percent."
    },
    {
      label: "🎯 Goal update",
      text:
        "Consistency matters more than amount. Saving a little regularly builds strong financial habits."
    }
  ];

  function handleQuickAction(text: string) {
    speak(text);
    setMessages(prev => [...prev, { bot: text }]);
  }

  function startListening() {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  }

  async function handleVoiceSend(transcript: string) {
    if (!transcript.trim()) return;

    setLoading(true);
    setMessages(prev => [...prev, { user: transcript }]);

    const reply = await sendChatMessage(transcript);

    setMessages(prev => [...prev, { bot: reply }]);
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { user: userMsg }]);

    const context = await buildUserContext();
const reply = await sendChatMessage(userMsg, context);


    setMessages(prev => [...prev, { bot: reply }]);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto bg-gray-50 max-h-[35vh] sm:max-h-[45vh]">
        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            {m.user && (
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm max-w-[80%]">
                  {m.user}
                </div>
              </div>
            )}

            {m.bot && (
              <div className="flex justify-start">
                <div className="bg-white border px-3 py-2 rounded-xl text-xs sm:text-sm max-w-[80%] whitespace-pre-line">
                  {renderFormattedText(m.bot)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Quick actions at start */}
        {messages.length === 1 && (
          <div className="space-y-2">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(a.text)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white border hover:bg-gray-100 text-sm"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <TypingDots />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-2 py-2 sm:p-3 border-t bg-white">
        <input
          className="flex-1 px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a finance question…"
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />

        {/* Mic Button */}
        <button
          onClick={startListening}
          className={`p-2 rounded-lg border ${
            listening
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Speak your question"
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          onClick={handleSend}
          className="px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}