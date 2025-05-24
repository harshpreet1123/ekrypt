"use client";
import { useState } from 'react';

export default function NotFound404() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      // Could show search results or redirect
    }, 2000);
  };

  const suggestions = [
    { title: 'Check the URL', desc: 'Make sure the link is typed correctly' },
    { title: 'Contact the sender', desc: 'Ask for a new link if this one is broken' },
    { title: 'Create a new link', desc: 'Generate a fresh shortened URL' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-600 rounded-full filter blur-3xl opacity-40 animate-float-slow"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-bounce-slow"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-40 animate-bounce-delay"></div>
        <div className="absolute bottom-40 left-1/3 w-10 h-10 bg-pink-500 rounded-full opacity-25 animate-bounce-slow"></div>
        <div className="absolute bottom-60 right-1/3 w-4 h-4 bg-indigo-500 rounded-full opacity-35 animate-bounce"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Create Link
            </a>
            <a href="#" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Main 404 Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Giant 404 with Glitch Effect */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 leading-none select-none relative">
              404
              {/* Glitch overlays */}
              <span className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-red-500 opacity-70 animate-glitch-1 -z-10">
                404
              </span>
              <span className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-blue-500 opacity-70 animate-glitch-2 -z-20">
                404
              </span>
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Link Not Found
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Oops! This link seems to have vanished into the digital void.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The shortened URL you&apos;re looking for doesn&apos;t exist, may have expired, or could have been deleted.
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Search for a Link</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter link ID or URL..."
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isSearching || !searchQuery.trim()
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                  }`}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8 text-purple-400">What can you do?</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:transform hover:scale-105 group"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-purple-600' : 'bg-pink-600'
                  }`}>
                    {index === 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : index === 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{suggestion.title}</h4>
                  <p className="text-gray-400 text-sm">{suggestion.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="#"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity transform hover:scale-105"
            >
              Create New Link
            </a>
            <a
              href="#"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg transition-colors transform hover:scale-105"
            >
              Go to Homepage
            </a>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
              <div className="text-gray-400 text-sm">Lost Links</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">404</div>
              <div className="text-gray-400 text-sm">Error Code</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">0%</div>
              <div className="text-gray-400 text-sm">Found Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-400 text-sm">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-10px) translateX(-10px) rotate(180deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-bounce-delay { animation: bounce-delay 4s ease-in-out infinite 1s; }
        .animate-glitch-1 { animation: glitch-1 0.3s ease-in-out infinite alternate; }
        .animate-glitch-2 { animation: glitch-2 0.3s ease-in-out infinite alternate-reverse; }
      `}</style>
    </div>
  );
}