import React, { useState, useEffect } from 'react';
import { Trophy, Loader2 } from 'lucide-react';

// Interface para representar um jogador conforme retornado pela API Chess.com
interface ChessPlayer {
  username: string;
  score: number;
  rank: number;
  title?: string;
  name?: string;
  country?: string;
  status?: string;
  avatar?: string;
  flair_code?: string;
  url?: string;
  win_count?: number;
  loss_count?: number;
  draw_count?: number;
}

// Interface para a resposta da API Chess.com
interface ChessApiResponse {
  live_rapid: ChessPlayer[];
  live_blitz: ChessPlayer[];
  live_bullet: ChessPlayer[];
  daily: ChessPlayer[];
  daily960: ChessPlayer[];
  live_bughouse: ChessPlayer[];
  live_blitz960: ChessPlayer[];
  live_threecheck: ChessPlayer[];
  live_crazyhouse: ChessPlayer[];
  live_kingofthehill: ChessPlayer[];
  tactics: ChessPlayer[];
  rush: ChessPlayer[];
  battle: ChessPlayer[];
}

type Category = 'blitz' | 'rapid' | 'bullet';

const TopPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Record<Category, ChessPlayer[]>>({
    blitz: [],
    rapid: [],
    bullet: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('blitz');

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        setLoading(true);
        
        // URL da API Chess.com para leaderboards
        const response = await fetch('https://api.chess.com/pub/leaderboards');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do leaderboard');
        }
        
        const data: ChessApiResponse = await response.json();
        
        // Obter os 3 melhores jogadores de cada categoria
        setPlayers({
          blitz: data.live_blitz?.slice(0, 3) || [],
          rapid: data.live_rapid?.slice(0, 3) || [],
          bullet: data.live_bullet?.slice(0, 3) || []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg font-medium">Loading the top players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-medium">Error loading data: {error}</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }

  // Funções para pegar a bandeira e o nome do pais.

  function getFlagUrl(countryUrl: string): string {
    if (!countryUrl) return '';
    const code = countryUrl.split('/').pop()?.toLowerCase();
    return code ? `https://flagcdn.com/w40/${code}.png` : '';
  }

  function getCountryName(countryUrl: string): string {
    if (!countryUrl) return 'N/A';
    const code = countryUrl.split('/').pop(); // pega o "US", "BR", etc.
    if (!code) return 'N/A';
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) || 'Unknown';
  }

  // Mapeia categorias para seus nomes de exibição
  const categoryNames = {
    blitz: 'Blitz',
    rapid: 'Rapid',
    bullet: 'Bullet'
  };

  return (
    <div className="mb-6 w-full">
      {/* Título compacto e centralizado */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 h-6 w-6" />
          <h2 className="text-xl font-bold">Top Rated Players on Chess.com</h2>
        </div>
      </div>

      {/* Abas compactas */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md bg-gray-800 p-0.5 text-sm">
          {Object.keys(players).map((category) => (
            <button
              key={category}
              className={`px-4 py-1 font-medium transition-all duration-150 rounded-sm
                ${activeCategory === category 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}
              onClick={() => setActiveCategory(category as Category)}
            >
              {categoryNames[category as Category]}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de jogadores compactos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {players[activeCategory].map((player, index) => (
            <div 
            key={index} 
            className={`bg-gray-800 rounded-md p-4 flex flex-col items-center 
                ${index === 0 ? 'border border-yellow-500' : 
                index === 1 ? 'border border-gray-400' : 
                index === 2 ? 'border border-amber-700' : ''}
                transition-all duration-200 ease-in-out`}
            >
            <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center overflow-hidden border 
                ${index === 0 ? 'border-yellow-500' : 
                index === 1 ? 'border-gray-400' : 
                'border-amber-700'}`}
            >
                {player.avatar ? (
                <img 
                    src={player.avatar} 
                    alt={`${player.username}'s profile`} 
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-lg font-bold">#{player.rank || index + 1}</span>
                )}
            </div>
            <h3 className="text-lg font-bold mb-1">{player.username}</h3>
            <div className="text-xs mb-1 flex flex-col items-center gap-0.5">
                <span className="text-gray-300">{player.title || 'N/A'}</span>
                {player.country && (
                <div className="flex items-center gap-1">
                    <img 
                    src={getFlagUrl(player.country)} 
                    alt={getCountryName(player.country)} 
                    className="w-4 h-3 object-cover rounded-sm"
                    />
                    <span className="text-gray-200">{getCountryName(player.country)}</span>
                </div>
                )}
            </div>
            <div className="text-xl font-bold text-blue-400">{player.score}</div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default TopPlayers;
