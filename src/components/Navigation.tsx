import React from 'react';
import { Home, PieChart, Trophy, Brain, Mic , Users} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'social', label: 'Social', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              currentPage === id
                ? 'text-pastel-purple bg-pastel-purple/20 transform scale-110'
                : 'text-gray-600 hover:text-pastel-purple hover:bg-pastel-purple/10'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}