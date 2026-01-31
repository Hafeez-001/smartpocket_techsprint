import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { FloatingAssistant } from './components/FloatingAssistant';
import { HomePage } from './components/pages/HomePage';
import { Dashboard } from './components/pages/Dashboard';
import { VoicePage } from './components/pages/VoicePage';
import { RewardsPage } from './components/pages/RewardsPage';
import { QuizPage } from './components/pages/QuizPage';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { storage } from './utils/storage';
import { initialSavingsGoals, initialBadges } from './data/mockData';
import SocialPage from './components/pages/SocialPage';
import Chatbot from "./components/Chatbot";
import FloatingChatbot from "./components/FloatingChatbot";






function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const existingGoals = await storage.getSavingsGoals();
      if (existingGoals.length === 0) {
        await storage.saveSavingsGoals(initialSavingsGoals);
      }

      const existingBadges = await storage.getBadges();
      if (existingBadges.length === 0) {
        await storage.saveBadges(initialBadges);
      }
    };

    initializeData();
  }, []);

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUsername(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!username) {
      switch (currentPage) {
        case 'login':
          return <Login onLoginSuccess={handleLoginSuccess} onPageChange={setCurrentPage} />;
        case 'register':
          return <Register onPageChange={setCurrentPage} />;
        default:
          return <Login onLoginSuccess={handleLoginSuccess} onPageChange={setCurrentPage} />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'voice':
        return <VoicePage />;
      case 'rewards':
        return <RewardsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'social':
        return <SocialPage />;
      case 'home':
        return (
          <HomePage
            onPageChange={setCurrentPage}
            onLogout={handleLogout}
            username={username}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}

      {/* {username && (
        <>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          <FloatingAssistant />
        </>
      )} */}
      {username && (
        <>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          <FloatingChatbot />
        </>
      )}
    </div>
  );
}

export default App;
