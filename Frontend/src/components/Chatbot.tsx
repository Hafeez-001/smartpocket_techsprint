import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../utils/chatApi";

/**
 * Minimal markdown renderer
 * Supports:
 *  - **bold**
 *  - line breaks
 */
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

/** Typing dots animation */
function TypingDots() {
  return (
    <div className="flex gap-1 px-3 py-2 bg-white border rounded-xl text-sm w-fit">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:0.15s]">.</span>
      <span className="animate-bounce [animation-delay:0.3s]">.</span>
    </div>
  );
}

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user?: string; bot?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /** Greeting on first open */
  useEffect(() => {
    setMessages([
      {
        bot: "Hi 👋 I’m your **Finance Assistant**.\nAsk me about saving money, budgeting, expenses, or investments."
      }
    ]);
  }, []);

  /** Auto-scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { user: userMsg }]);

    const reply = await sendChatMessage(userMsg);

    setMessages(prev => [...prev, { bot: reply }]);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Messages */}
      <div
        className="
          flex-1
          px-3 py-2 sm:px-4 sm:py-3
          space-y-3
          overflow-y-auto
          bg-gray-50
          max-h-[35vh] sm:max-h-[45vh]
        "
      >
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
          className="
            flex-1 px-3 py-2 text-xs sm:text-sm
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a finance question…"
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="
            px-3 sm:px-4 py-2 rounded-lg
            bg-indigo-600 text-white text-xs sm:text-sm
            hover:bg-indigo-700
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}
