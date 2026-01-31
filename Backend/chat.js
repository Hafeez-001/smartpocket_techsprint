// import express from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // HARD finance gate
// function isFinanceQuery(q) {
//   const keywords = [
//     "finance", "money", "saving", "budget", "expense",
//     "investment", "stock", "mutual fund", "sip",
//     "loan", "emi", "credit", "debit", "tax", "insurance"
//   ];
//   q = q.toLowerCase();
//   return keywords.some(k => q.includes(k));
// }

// const SYSTEM_PROMPT = `
// You are a FINANCE-ONLY chatbot for our website.

// STRICT RULES:
// - Answer ONLY finance-related questions.
// - If the question is not about finance, reply exactly:
//   "I only answer finance-related questions."
// - If you are unsure or lack information, reply exactly:
//   "I don't have enough finance-related information."
// - Keep answers short and practical.
// - Do NOT hallucinate.
// `;

// router.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ reply: "Message required." });
//   }

//   if (!isFinanceQuery(message)) {
//     return res.json({
//       reply: "I only answer finance-related questions."
//     });
//   }

//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash"
//     });

//     const result = await model.generateContent([
//       {
//         text: SYSTEM_PROMPT + "\nUser Question:\n" + message
//       }
//     ]);

//     res.json({ reply: result.response.text() });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       reply: "Internal error. Try again."
//     });
//   }
// });
import express from "express";
import { GoogleGenAI } from "@google/genai"; // New recommended SDK
import 'dotenv/config';

const router = express.Router();

// Initialize with the new client structure
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function isFinanceQuery(q) {
  const keywords = ["finance", "money", "saving", "budget", "investment", "stock", "tax"];
  return keywords.some(k => q.toLowerCase().includes(k));
}

const SYSTEM_PROMPT = `You are a FINANCE-ONLY chatbot. Answer short and practical. If not finance, say "I only answer finance-related questions." `;

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!isFinanceQuery(message)) {
    return res.json({ reply: "I only answer finance-related questions." });
  }

  try {
    // Use gemini-2.5-flash (the current stable fast model)
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + message }] }]
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ reply: "Internal error. Try again." });
  }
});

export default router;