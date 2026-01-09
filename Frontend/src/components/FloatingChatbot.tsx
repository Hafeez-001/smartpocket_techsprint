import { useState } from "react";
import Chatbot from "./Chatbot";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-20 right-4 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-600 to-purple-600
          text-white text-xl
          flex items-center justify-center
          shadow-xl
          hover:scale-105 active:scale-95
          transition
        "
        aria-label="Open Finance Assistant"
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="
            fixed z-50 bg-white shadow-2xl rounded-2xl
            flex flex-col overflow-hidden

            /* Mobile */
            w-[95%]
            left-1/2 -translate-x-1/2
            bottom-20
            max-h-[70vh]

            /* Desktop */
            sm:w-96
            sm:right-6
            sm:left-auto
            sm:translate-x-0
            sm:bottom-32

            animate-fadeIn
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div>
              <p className="font-semibold text-sm">Smart Buddy</p>
              <p className="text-xs opacity-80">
                Ask money & savings questions
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Chatbot body */}
          <Chatbot />
        </div>
      )}
    </>
  );
}
