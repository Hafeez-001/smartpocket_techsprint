import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { quizzes } from '../../data/mockData';
import { Quiz } from '../../types';

export function QuizPage() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);

  const currentQuiz = quizzes[currentQuizIndex];
  const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    if (answerIndex === currentQuiz.correctAnswer) {
      setScore(score + 1);
    }
    setCompletedQuizzes(completedQuizzes + 1);
  };

  const nextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompletedQuizzes(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / completedQuizzes) * 100;
    if (percentage >= 80) return "🎉 Amazing! You're a money master!";
    if (percentage >= 60) return "👍 Great job! Keep learning!";
    if (percentage >= 40) return "🤔 Not bad! Room for improvement!";
    return "📚 Keep studying! You'll get there!";
  };

  const isQuizComplete = currentQuizIndex === quizzes.length - 1 && showResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple/20 via-white to-mint-green/20 pb-20 pt-6">
      <div className="px-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Money Quiz 🧠</h1>
          <p className="text-gray-600">Test your financial knowledge!</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {completedQuizzes}/{quizzes.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pastel-purple to-pastel-blue h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedQuizzes / quizzes.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Score Display */}
        {completedQuizzes > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-gray-800">Score: {score}/{completedQuizzes}</span>
              </div>
              <div className="text-sm text-gray-600">
                {((score / completedQuizzes) * 100).toFixed(0)}% correct
              </div>
            </div>
          </div>
        )}

        {/* Quiz Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {!isQuizComplete ? (
            <>
              {/* Question */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-4 animate-bounce-slow">{currentQuiz.emoji}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Question {currentQuizIndex + 1}
                </h2>
                <p className="text-gray-700 leading-relaxed">{currentQuiz.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      showResult
                        ? index === currentQuiz.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : index === selectedAnswer && selectedAnswer !== currentQuiz.correctAnswer
                            ? 'bg-red-100 border-2 border-red-500 text-red-800'
                            : 'bg-gray-100 text-gray-600'
                        : 'bg-gray-50 hover:bg-pastel-blue/20 hover:border-pastel-blue border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showResult && index === currentQuiz.correctAnswer
                          ? 'bg-green-500 border-green-500'
                          : showResult && index === selectedAnswer && selectedAnswer !== currentQuiz.correctAnswer
                            ? 'bg-red-500 border-red-500'
                            : 'border-gray-300'
                      }`}>
                        {showResult && index === currentQuiz.correctAnswer && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                        {showResult && index === selectedAnswer && selectedAnswer !== currentQuiz.correctAnswer && (
                          <XCircle size={16} className="text-white" />
                        )}
                        {!showResult && (
                          <span className="text-sm font-medium text-gray-600">
                            {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className={`p-4 rounded-xl mb-6 ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? 'Correct! 🎉' : 'Incorrect 😔'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{currentQuiz.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {showResult && (
                <button
                  onClick={nextQuiz}
                  className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white py-3 px-6 rounded-lg font-medium hover:scale-105 transition-all duration-300"
                >
                  {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </>
          ) : (
            /* Quiz Complete */
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-slow">🎊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
              <div className="bg-gradient-to-r from-pastel-purple to-pastel-blue text-white p-6 rounded-xl mb-6">
                <div className="text-3xl font-bold mb-2">
                  {score}/{quizzes.length}
                </div>
                <div className="text-lg opacity-90">
                  {((score / quizzes.length) * 100).toFixed(0)}% Score
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">{getScoreMessage()}</p>
              <button
                onClick={resetQuiz}
                className="bg-white text-pastel-purple py-3 px-6 rounded-lg font-medium border-2 border-pastel-purple hover:bg-pastel-purple hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-mint-green/20 to-pastel-blue/20 rounded-2xl p-6 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-pastel-purple" />
            <h3 className="font-bold text-gray-800">💡 Money Tips</h3>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• Start saving early - even small amounts make a big difference!</p>
            <p>• Learn about compound interest - it's your money's best friend!</p>
            <p>• Always think twice before making big purchases!</p>
            <p>• Keep track of your spending to understand your habits!</p>
          </div>
        </div>
      </div>
    </div>
  );
}