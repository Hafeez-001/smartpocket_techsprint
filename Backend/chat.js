
// import express from "express";
// import { GoogleGenAI } from "@google/genai"; // New recommended SDK
// import 'dotenv/config';

// const router = express.Router();

// // Initialize with the new client structure
// const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// function isFinanceQuery(q) {
//   const keywords = ["finance", "money", "saving", "budget", "investment", "stock", "tax"];
//   return keywords.some(k => q.toLowerCase().includes(k));
// }

// const SYSTEM_PROMPT = `You are a FINANCE-ONLY chatbot. Answer short and practical. If not finance, say "I only answer finance-related questions." `;

// router.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   if (!isFinanceQuery(message)) {
//     return res.json({ reply: "I only answer finance-related questions." });
//   }

//   try {
//     // Use gemini-2.5-flash (the current stable fast model)
//     const response = await client.models.generateContent({
//       model: "gemini-2.5-flash", 
//       contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + message }] }]
//     });

//     res.json({ reply: response.text });
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     res.status(500).json({ reply: "Internal error. Try again." });
//   }
// });

// export default router;


import express from "express";
import { GoogleGenAI } from "@google/genai"; // New recommended SDK
import 'dotenv/config';

const router = express.Router();

// Initialize with the new client structure
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function isFinanceQuery(q) {
  const keywords = [
    "finance", "money", "saving", "save", "budget",
    "expense", "spend", "spent", "income", "balance",
    "investment", "invest", "sip", "mutual fund",
    "stock", "equity", "tax", "loan", "emi",
    "salary", "goal", "goals", "category",
    "interest", "return", "inflation"
  ];


  const text = q.toLowerCase();
  return keywords.some(k => text.includes(k));
}


// const SYSTEM_PROMPT = `You are a FINANCE-ONLY chatbot. Answer short and practical. If not finance, say "I only answer finance-related questions." `;
// const SYSTEM_PROMPT = `
// You are SmartPocket AI, a finance-only assistant.

// RULES:
// 1. You ONLY answer finance-related questions.
// 2. If the question is NOT about finance, reply exactly:
//    "I only answer finance-related questions."

// BEHAVIOR:
// - If the user asks about THEIR money, spending, savings, balance, habits, goals, or trends:
//   → Use the provided USER DATA.
//   → Give personalized, numeric, concrete insights.
//   → Mention exact amounts, categories, differences, or patterns.
//   → If required data is missing, say clearly what is missing.

// - If the user asks a GENERAL finance question (rules, concepts, tips, definitions):
//   → Answer normally like a finance expert.
//   → Do NOT invent personal numbers.
//   → Do NOT reference USER DATA.

// STYLE:
// - Be concise.
// - Be practical.
// - No motivational fluff.
// - No generic life advice.
// - No hallucinated data.
// - No emojis.
// `;

const SYSTEM_PROMPT = `You are SmartBuddy, a finance assistant for teens and students.

CORE RULES:
1. You ONLY answer finance-related questions.
2. If the question is NOT about finance, reply exactly:
   "I only answer finance-related questions."

RESPONSE LENGTH (STRICT):
- Default: 3–5 lines MAX.
- Definitions: 2–3 lines MAX.
- Personal insights: 4–5 lines MAX.
- NEVER write long paragraphs.
- NEVER explain more unless the user asks "explain more".

HOW TO ANSWER:
- If the user asks about THEIR money:
  • Use USER DATA.
  • Mention exact numbers and categories.
  • Speak casually, like a smart senior.
  • Get to the point fast.

- If the user asks a GENERAL finance question:
  • Give a short, clear explanation.
  • One simple example at most.
  • No stories, no rambling.

TONE:
- Friendly and natural.
- Not robotic.
- Not teacher-like.
- Not corporate.

STYLE RULES:
- Short sentences.
- Small paragraphs (1–2 lines).
- No jargon unless explained in one line.
- No fake motivation.
- No emojis.


`;

router.post("/chat", async (req, res) => {
  const { message, context = {} } = req.body;

  if (!isFinanceQuery(message)) {
    return res.json({ reply: "I only answer finance-related questions." });
  }

  try {
    // Use gemini-2.5-flash (the current stable fast model)
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{
  role: "user",
  parts: [{
    text: `
${SYSTEM_PROMPT}

USER DATA:
${JSON.stringify(context, null, 2)}

USER QUESTION:
${message}
`
  }]
}]

    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ reply: "Internal error. Try again." });
  }
});

export default router;