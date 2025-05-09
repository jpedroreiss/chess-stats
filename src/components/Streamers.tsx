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
        // Faz a requisição para a API do Chess.com que lista os streamers
        const response = await axios.get('https://api.chess.com/pub/streamers');
        
        // Filtra apenas os streamers que estão ao vivo
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

  if (loading) return <p className="p-4 text-gray-400">Loading streamers...</p>;
  
  if (streamers.length === 0) return <p className="p-4 text-gray-400">No streamers live at the moment.</p>;

  const visibleStreamers = showAll ? streamers : streamers.slice(0, 9);

  return (
    <div className="mb-10">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-2 mb-4">
        <Play className="text-green-500" />
        <h2 className="text-xl font-bold">Live Streamers</h2>
      </div>

      {/* Grid responsivo para os streamers (1 coluna em mobile, 3 em desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleStreamers.map((streamer) => (
          <a
            key={streamer.username}
            href={streamer.twitch_url || '#'} // Fallback para '#' se não tiver URL
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-750 transition-colors cursor-pointer group"
          >
            {/* Container do avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
              {streamer.avatar ? (
                <img 
                  src={streamer.avatar} 
                  alt={streamer.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                // Fallback com ícone de usuário se não tiver avatar
                <User size={20} className="m-auto mt-3 text-gray-400" />
              )}
            </div>

            {/* Informações do streamer */}
            <div className="flex-grow">
              {/* Nome de usuário */}
              <h3 className="font-medium group-hover:text-blue-400 transition-colors">
                {streamer.username}
              </h3>
              
              {/* Status "ao vivo" e contagem de espectadores */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {streamer.viewers 
                    ? `${streamer.viewers} viewers` 
                    : 'Live'}
                </span>
              </div>
              
              {/* Título da transmissão */}
              <p className="text-sm text-gray-300 group-hover:text-gray-200 truncate transition-colors">
                {streamer.title}
              </p>
            </div>

            {/* Botão de ação (seta para direita) */}
            <div className="bg-blue-600 p-2 rounded group-hover:bg-blue-700 transition-colors">
              <ArrowRight size={16} className="text-white" />
            </div>
          </a>
        ))}
      </div>

      {/* Botão "Ver todos" ou "Mostrar menos" (só aparece se houver mais de 9 streamers) */}
      {streamers.length > 9 && (
        <button
          onClick={() => setShowAll(!showAll)} // Alterna entre mostrar todos/alguns
          className="mt-4 flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          {showAll ? (
            <>
              <ChevronUp size={16} />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>See all ({streamers.length})</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LiveStreamers;
