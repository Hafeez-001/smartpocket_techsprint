import React from 'react';
import { Sparkles, TrendingUp, Shield, Zap, User } from 'lucide-react';

interface HomePageProps {
  onPageChange: (page: string) => void;
  onLogout: () => void;
  username: string;
}

export function HomePage({ onPageChange, onLogout, username }: HomePageProps) {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      title: 'Voice-Powered',
      description: 'Natural language transaction input with advanced speech recognition',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: 'Smart Analytics',
      description: 'Intelligent categorization and comprehensive spending insights',
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: 'Secure & Private',
      description: 'Bank-level security with local data storage and privacy protection',
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: 'Gamified Learning',
      description: 'Achievement system and educational content for financial literacy',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      {/* 🔝 Header with Logo + Username + Logout */}
      <div className="w-full flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/30 border-b border-slate-200 shadow-md rounded-b-2xl sticky top-0 z-50">
        {/* Left: Logo and Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-2xl">
            💰
          </div>
          {/* <div>
            <h1 className="text-xl font-bold text-slate-800">SmartPocket</h1>
            <p className="text-sm text-slate-600 -mt-1">Save money smartly!</p>
          </div> */}
        </div>

        {/* Right: Username + Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-800 font-medium">
            <User className="w-5 h-5" />
            <span>{username}</span>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md"
          >
             Logout
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 pt-6 pb-12 relative">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg blur-sm opacity-70"></div>
        </div>

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl mb-8">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Smart
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Pocket
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-4">
            Speak. Save. Succeed.
          </p>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advanced voice-powered money management platform designed for the next generation of
            smart savers. Transform how you track, understand, and optimize your finances.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => onPageChange('voice')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            🎤 Start Voice Input
          </button>
          <button
            onClick={() => onPageChange('dashboard')}
            className="bg-white hover:bg-slate-50 text-slate-700 py-4 px-8 rounded-2xl font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-lg"
          >
            📊 View Dashboard
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="px-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Young person managing finances on smartphone with calculator and notebook"
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Take Control of Your Financial Future
              </h3>
              <p className="text-lg opacity-90">
                Join thousands of young people building better money habits with SmartPocket
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
            Why Choose SmartPocket
          </h2>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Built with cutting-edge technology and designed specifically for modern financial
            management needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-slate-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl mb-6 ring-2 ring-blue-300/40">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
