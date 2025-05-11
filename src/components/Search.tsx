//
// 
// Em ingles
// Em ingles
//
//

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface PlayerStats {
  chess_rapid?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { win: number; loss: number; draw: number };
  };
  chess_blitz?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { win: number; loss: number; draw: number };
  };
  chess_bullet?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { win: number; loss: number; draw: number };
  };
  tactics?: {
    highest?: { rating: number; date: number };
    lowest?: { rating: number; date: number };
  };
}

interface Game {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    username: string;
  };
  black: {
    rating: number;
    result: string;
    username: string;
  };
}

interface PlayerProfile {
  avatar?: string;
  username: string;
  title?: string;
  name?: string;
  followers: number;
  country: string;
  last_online: number;
  joined: number;
  is_streamer: boolean;
  twitch_url?: string;
  url: string;
}

const PlayerSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playerData, setPlayerData] = useState<PlayerProfile | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFlagUrl = (countryUrl: string): string => {
    if (!countryUrl) return '';
    const code = countryUrl.split('/').pop()?.toLowerCase();
    return code ? `https://flagcdn.com/w40/${code}.png` : '';
  };

  const getCountryName = (countryUrl: string): string => {
    if (!countryUrl) return 'N/A';
    const code = countryUrl.split('/').pop();
    if (!code) return 'N/A';
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) || 'Unknown';
  };

  const fetchWithTimeout = async (url: string, options = {}, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const clearPlayerData = () => {
    setPlayerData(null);
    setPlayerStats(null);
    setRecentGames([]);
    setError(null);
  };

  const fetchPlayerData = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setPlayerData(null);
    setPlayerStats(null);
    setRecentGames([]);
    
    try {
      // 1. Fetch player profile
      const profileData = await fetchWithTimeout(
        `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}`
      );
      
      // 2. Fetch player stats
      const statsData = await fetchWithTimeout(
        `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}/stats`
      );
      
      // 3. Fetch recent games
      const archives = await fetchWithTimeout(
        `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}/games/archives`
      );
      
      let games = [];
      if (archives.archives?.length > 0) {
        // Last 5 games
        const lastMonthUrl = archives.archives[archives.archives.length - 1];
        const gamesData = await fetchWithTimeout(lastMonthUrl);
        games = gamesData.games?.slice(-5).reverse() || [];
      }
      
      // 4. Fetch additional info (streamer)
      let additionalInfo = {};
      try {
        const streamerInfo = await fetchWithTimeout(
          `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}/is-streamer`
        );
        
        if (streamerInfo.is_streamer) {
          try {
            const twitchInfo = await fetchWithTimeout(
              `https://api.chess.com/pub/player/${encodeURIComponent(searchQuery.toLowerCase())}/twitch`
            );
            additionalInfo = {
              twitch_url: twitchInfo.twitch_url
            };
          } catch (e) {
            console.log('Could not fetch Twitch info');
          }
        }
      } catch (e) {
        console.log('Could not fetch streamer info');
      }
      
      // Update state
      setPlayerData({
        ...profileData,
        ...additionalInfo
      });
      setPlayerStats(statsData);
      setRecentGames(games);
      
    } catch (error) {
      let errorMessage = 'Error searching player';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Player not found';
        } else if (error.name === 'AbortError') {
          errorMessage = 'Request took too long. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection problem. Check your internet.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlayerData();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRating = (rating?: number) => {
    return rating ? rating.toLocaleString('pt-BR') : 'N/A';
  };

  const getGameResult = (game: Game, username: string) => {
    const playerColor = game.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';
    return game[playerColor].result;
  };

  const getResultColor = (result: string) => {
    return result === 'win' ? 'bg-green-500' :
           ['checkmated', 'resigned', 'timeout', 'abandoned', 'lose'].includes(result) ? 'bg-red-500' :
           'bg-yellow-500';
  };

  const getResultText = (result: string) => {
    return result === 'win' ? 'Win' :
           result === 'checkmated' ? 'Checkmated' :
           result === 'resigned' ? 'Resigned' :
           result === 'timeout' ? 'Timeout' :
           result === 'abandoned' ? 'Game abandoned' :
           result === 'lose' ? 'Loss' :
           'Draw';
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors">
          <div className="bg-gray-800 px-4 flex items-center">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Enter Chess.com username"
            className="flex-grow px-4 py-3 bg-gray-800 text-white outline-none placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 font-medium transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
          <div className="font-medium">{error}</div>
          <div className="text-sm mt-1">
            {error.includes('connection') ? (
              'Check your internet connection and try again.'
            ) : error.includes('try again') ? (
              'The server may be busy. Please try again in a few moments.'
            ) : (
              'Check if the name is correct and try again.'
            )}
          </div>
        </div>
      )}

      {playerData && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg relative">
          {/* Close profile button */}
          <button 
            onClick={clearPlayerData}
            className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white p-2 rounded-full transition-colors"
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
          
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {playerData.avatar && (
              <img 
                src={playerData.avatar} 
                alt={`${playerData.username} avatar`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif';
                }}
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {playerData.title && (
                  <span className="border border-red-600 bg-red-600/20 text-white px-2 py-1 rounded-md text-sm font-bold">
                    {playerData.title}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-white">
                  {playerData.username}
                </h2>
                
                {playerData.country && (
                  <div className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-md">
                    <img 
                      src={getFlagUrl(playerData.country)} 
                      alt="Country flag"
                      className="h-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-gray-300">
                      {getCountryName(playerData.country)}
                    </span>
                  </div>
                )}
                
                {playerData.is_streamer && (
                  <span className="bg-purple-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"/>
                    </svg>
                    STREAMER
                  </span>
                )}
              </div>
              
              {playerData.name && (
                <p className="text-gray-300 mb-1">{playerData.name}</p>
              )}
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
                <p>Followers: {playerData.followers.toLocaleString('pt-BR')}</p>
                <p>Member since: {formatDate(playerData.joined)}</p>
                <p>Last online: {formatDateTime(playerData.last_online)}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <a 
                  href={`https://www.chess.com/member/${playerData.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Chess.com Profile
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                {playerData.is_streamer && playerData.twitch_url && (
                  <a 
                    href={playerData.twitch_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Live on Twitch
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Statistics Section */}
          {playerStats && (
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-8 text-center relative">
                <span className="relative z-10 px-4">
                  Statistics
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {(['rapid', 'blitz', 'bullet'] as const).map((mode) => {
                  const modeKey = `chess_${mode}` as const;
                  const stats = playerStats[modeKey];
                  const modeName = mode === 'rapid' ? 'Rapid' : mode === 'blitz' ? 'Blitz' : 'Bullet';

                  if (!stats?.last?.rating) return (
                    <div key={mode} className="bg-gradient-to-b from-gray-800/50 to-gray-900/70 p-5 rounded-xl border border-gray-700/50 text-center hover:border-amber-500/30 transition-colors">
                      <div className="mb-3">
                        <h4 className="font-semibold text-amber-400/90 mb-1 text-lg">{modeName}</h4>
                        <div className="w-12 h-1 mx-auto bg-gradient-to-r from-amber-500/70 to-transparent rounded-full"></div>
                      </div>
                      <p className="text-gray-400/80 text-sm">No recent games</p>
                    </div>
                  );

                  return (
                    <div key={mode} className="bg-gradient-to-b from-gray-800/50 to-gray-900/70 p-5 rounded-xl border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                      <div className="mb-3">
                        <h4 className="font-semibold text-amber-400/90 mb-1 text-lg">{modeName}</h4>
                        <div className="w-12 h-1 mx-auto bg-gradient-to-r from-amber-500/70 to-transparent rounded-full"></div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400/80">Rating:</span>
                          <span className="font-medium text-amber-300">{formatRating(stats.last?.rating)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400/80">Record:</span>
                          {stats.record ? (
                            <div className="flex flex-col items-end">
                              <span className="text-green-400 font-medium">{stats.record.win}W</span>
                              <span className="text-red-400 font-medium">{stats.record.loss}L</span>
                              <span className="text-gray-300 font-medium">{stats.record.draw}D</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">N/A</span>
                          )}
                        </div>

                        {stats.best?.rating && (
                          <div className="pt-2 mt-2 border-t border-gray-700/50">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">Best:</span>
                              <span className="text-amber-300/90">{formatRating(stats.best.rating)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Puzzles Statistics */}
                <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/70 p-5 rounded-xl border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                  <div className="mb-3">
                    <h4 className="font-semibold text-amber-400/90 mb-1 text-lg">Puzzles</h4>
                    <div className="w-12 h-1 mx-auto bg-gradient-to-r from-amber-500/70 to-transparent rounded-full"></div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400/80">Highest:</span>
                      <span className="font-medium text-amber-300">
                        {formatRating(playerStats.tactics?.highest?.rating)}
                      </span>
                    </div>

                    {playerStats.tactics?.lowest?.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/80">Lowest:</span>
                        <span className="font-medium text-amber-300">
                          {formatRating(playerStats.tactics.lowest.rating)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Last 5 Games</h3>
              
              <div className="space-y-3">
                {recentGames.map((game, index) => {
                  const result = getGameResult(game, playerData.username);
                  const opponent = game.white.username.toLowerCase() === playerData.username.toLowerCase() 
                    ? game.black 
                    : game.white;
                  
                  return (
                    <div key={index} className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${getResultColor(result)}`}></span>
                          <span className="font-medium">
                            vs {opponent.username} ({formatRating(opponent.rating)})
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {game.time_class === 'rapid' ? 'Rapid' : 
                           game.time_class === 'blitz' ? 'Blitz' : 
                           game.time_class === 'bullet' ? 'Bullet' : game.time_class} • {formatDateTime(game.end_time)}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm">
                          <span className="text-gray-400">Result: </span>
                          <span className={`${getResultColor(result).replace('bg', 'text')} font-medium`}>
                            {getResultText(result)}
                          </span>
                        </span>
                        <a 
                          href={`https://www.chess.com/game/live/${game.url.split('/').pop()}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-amber-500 hover:text-amber-400"
                        >
                          View game
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;