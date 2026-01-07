import { VoiceParseResult } from '../types';

const expenseKeywords = ['spent', 'bought', 'paid', 'cost', 'expense', 'bill'];
const incomeKeywords = ['earned', 'got', 'received', 'income', 'allowance', 'gift'];

const categories = {
  food: ['food', 'snacks', 'lunch', 'dinner', 'restaurant', 'cafe', 'pizza', 'burger'],
  entertainment: ['movie', 'game', 'cinema', 'music', 'concert', 'entertainment'],
  transport: ['bus', 'train', 'taxi', 'uber', 'transport', 'fuel', 'parking'],
  shopping: ['clothes', 'shoes', 'shopping', 'mall', 'store', 'purchase'],
  education: ['books', 'school', 'course', 'education', 'tuition', 'supplies'],
  health: ['medicine', 'doctor', 'hospital', 'health', 'pharmacy'],
  other: []
};

export function parseVoiceInput(text: string): VoiceParseResult {
  const lowerText = text.toLowerCase();
  
  // Extract amount (supports ₹ and numbers)
  const amountMatch = lowerText.match(/(?:₹|rs\.?|rupees?)\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:₹|rs\.?|rupees?)|(\d+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2] || amountMatch[3]) : 0;
  
  // Determine transaction type
  const isExpense = expenseKeywords.some(keyword => lowerText.includes(keyword));
  const isIncome = incomeKeywords.some(keyword => lowerText.includes(keyword));
  const type = isIncome ? 'income' : 'expense';
  
  // Determine category
  let category = 'other';
  let maxMatches = 0;
  
  for (const [cat, keywords] of Object.entries(categories)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      category = cat;
    }
  }
  
  // Calculate confidence based on matches
  const confidence = Math.min(
    (amount > 0 ? 0.4 : 0) +
    ((isExpense || isIncome) ? 0.3 : 0) +
    (maxMatches > 0 ? 0.3 : 0.1),
    1.0
  );
  
  return {
    amount,
    category,
    type,
    description: text,
    confidence
  };
}

export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    food: '🍕',
    entertainment: '🎮',
    transport: '🚌',
    shopping: '🛍️',
    education: '📚',
    health: '🏥',
    other: '💰'
  };
  return emojiMap[category] || '💰';
}