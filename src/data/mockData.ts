import { SavingsGoal, Badge, Quiz } from '../types';

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    title: 'New Phone',
    targetAmount: 15000,
    currentAmount: 5000,
    emoji: '📱',
    color: 'bg-pastel-blue'
  },
  {
    id: '2',
    title: 'College Fund',
    targetAmount: 50000,
    currentAmount: 12000,
    emoji: '🎓',
    color: 'bg-pastel-purple'
  },
  {
    id: '3',
    title: 'Gaming Setup',
    targetAmount: 25000,
    currentAmount: 8000,
    emoji: '🎮',
    color: 'bg-mint-green'
  }
];

export const initialBadges: Badge[] = [
  {
    id: '1',
    title: 'First Saver',
    description: 'Saved your first ₹100!',
    emoji: '💰',
    earned: true,
    earnedDate: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Voice Master',
    description: 'Used voice input 10 times!',
    emoji: '🎤',
    earned: false
  },
  {
    id: '3',
    title: 'Budget Boss',
    description: 'Stayed under budget for a month!',
    emoji: '👑',
    earned: false
  },
  {
    id: '4',
    title: 'Quiz Champion',
    description: 'Scored 100% on 5 quizzes!',
    emoji: '🏆',
    earned: false
  },
  {
    id: '5',
    title: 'Goal Crusher',
    description: 'Completed your first savings goal!',
    emoji: '🎯',
    earned: false
  }
];

export const quizzes: Quiz[] = [
  {
    id: '1',
    question: 'What is the 50/30/20 rule for budgeting?',
    options: [
      '50% needs, 30% wants, 20% savings',
      '50% savings, 30% needs, 20% wants',
      '50% wants, 30% savings, 20% needs',
      '50% entertainment, 30% food, 20% transport'
    ],
    correctAnswer: 0,
    explanation: 'The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and saving 20%!',
    emoji: '💡'
  },
  {
    id: '2',
    question: 'What is compound interest?',
    options: [
      'Interest only on the principal amount',
      'Interest on both principal and previously earned interest',
      'Interest that decreases over time',
      'Interest paid only once'
    ],
    correctAnswer: 1,
    explanation: 'Compound interest is when you earn interest on your interest - it helps your money grow faster!',
    emoji: '📈'
  },
  {
    id: '3',
    question: 'Which is the best strategy for saving money as a teenager?',
    options: [
      'Save whatever is left after spending',
      'Save first, then spend what\'s left',
      'Only save during special occasions',
      'Don\'t save until you have a job'
    ],
    correctAnswer: 1,
    explanation: 'Pay yourself first! Save money as soon as you get it, then spend what\'s left.',
    emoji: '🎯'
  }
];