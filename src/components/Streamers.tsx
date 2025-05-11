import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, User, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface Streamer {
  username: string;
  avatar?: string;
  twitch_url?: string;
  title?: string;
  is_live: boolean;
  viewers?: number;
}

const LiveStreamers: React.FC = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchLiveStreamers = async () => {
      try {
        const response = await axios.get('https://api.chess.com/pub/streamers');
        const liveStreamers = response.data.streamers
          .filter((streamer: any) => streamer.is_live)
          .map((streamer: any) => ({
            username: streamer.username,
            avatar: streamer.avatar,
            twitch_url: streamer.twitch_url,
            title: streamer.title,
            is_live: streamer.is_live,
            viewers: streamer.viewer_count || undefined,
          }));
        
        setStreamers(liveStreamers);
      } catch (error) {
        console.error("Error fetching streamers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStreamers();
  }, []); 

  if (loading) return <div className="p-4 text-center text-gray-400">Loading streamers...</div>;
  
  if (streamers.length === 0) return <div className="p-4 text-center text-gray-400">No streamers live at the moment.</div>;

  const visibleStreamers = showAll ? streamers : streamers.slice(0, 12);

  return (
    <div className="mb-10 px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <Play className="text-green-500 flex-shrink-0" />
        <h2 className="text-xl md:text-2xl font-bold">Live Streamers</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {visibleStreamers.map((streamer) => (
          <a
            key={streamer.username}
            href={streamer.twitch_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600"
          >
            {/* Avatar indicando que está ao vivo */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 relative">
              {streamer.avatar ? (
                <img 
                  src={streamer.avatar} 
                  alt={streamer.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={20} className="m-auto mt-3 text-gray-400" />
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
            </div>

            {/* Streamer Info */}
            <div className="flex-grow min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium group-hover:text-blue-400 transition-colors truncate">
                  {streamer.username}
                </h3>
                {streamer.title && (
                  <span className="hidden sm:inline-block text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full truncate">
                    {streamer.title}
                  </span>
                )}
              </div>
              
              {/* Live status */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  {streamer.viewers 
                    ? `${streamer.viewers.toLocaleString()} viewers` 
                    : 'Live now'}
                </span>
              </div>
              
              {/* Título */}
              {streamer.title && (
                <p className="sm:hidden text-xs text-gray-300 group-hover:text-gray-200 truncate mt-1">
                  {streamer.title}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg group-hover:bg-blue-700 transition-colors flex-shrink-0">
              <ArrowRight size={16} className="text-white" />
            </div>
          </a>
        ))}
      </div>

      {/* View All Button */}
      {streamers.length > 12 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm md:text-base px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp size={18} />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                <span>View all ({streamers.length} streamers)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveStreamers;