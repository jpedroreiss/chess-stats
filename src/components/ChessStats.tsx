import { useState } from 'react';
import { Users } from 'lucide-react';
import TopPlayers from "./TopPlayers";
import LiveStreamers from './Streamers';
import ChessNewsSection from './ChessNewsSection';
import PlayerSearch from './Search';
import Footer from './Footer';
import Header from './Header';

export default function ChessStats() {

  const [] = useState('');

  return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        
        {/* Header */}
        <Header />

      {/* Main Content */}
      <main className="flex-grow px-6 py-8">
        {/* Hero section */}
        <div className="flex items-center justify-center gap-x-6 mb-10">
        <img 
            src="./7433-brilliant-move-chess.webp" 
            alt="Chess Brilliant" 
            className="w-20 h-20 object-contain"
        />
        <div>
            <h1 className="text-4xl font-bold mb-2">CHESS STATS</h1>
            <p className="text-gray-400">Check Detailed Chess Stats and Leaderboards</p>
        </div>
        </div>
             {/* Player Search */}
            <div id="search" className="mb-10">
                <PlayerSearch />
                <div className="mt-4 flex justify-center">
              <div className="bg-gray-800 rounded-full px-5 py-2 flex items-center gap-2 border border-gray-700">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-gray-400">Players Tracked <span className="font-bold text-white">210,000,000+</span></span>
              </div>
              </div>
            </div>

        {/* Top Players Section */}
        <div id="leaderboard" className="mb-10">
            <TopPlayers />
        </div>

        {/* Chess News Section */}
        <div id="news" className="mb-10">
            <ChessNewsSection />
        </div>

        {/* Streamers Section */}
        <div id="streamers" className="mb-10">
          <LiveStreamers />
        </div>
      </main>

      {/* Footer */}
        <Footer />
    
    </div>
  );
}