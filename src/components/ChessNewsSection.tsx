import React, { useEffect, useState } from 'react';

interface RSSArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

const ChessNewsRSS: React.FC = () => {
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const feedUrl = 'https://www.chess.com/rss/news';
        
        const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch RSS feed');
        }
        
        const data = await response.json();

        if (data.contents) {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data.contents, 'application/xml');
          
          const items = Array.from(xml.querySelectorAll('item')).slice(0, 3);

          const parsed = items.map((item) => ({
            title: item.querySelector('title')?.textContent || 'No title',
            link: item.querySelector('link')?.textContent || '#',
            pubDate: item.querySelector('pubDate')?.textContent || '',
            description: item.querySelector('description')?.textContent || '',
          }));

          setArticles(parsed);
        } else {
          throw new Error('No content received');
        }
      } catch (error) {
        console.error('Error loading RSS:', error);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold">♔ Last News</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 h-40 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="mb-10 px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold">♔ Last News</h2>
        </div>
        <div className="text-center py-8 text-gray-400">
          {error || 'No news available at the moment.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl md:text-2xl font-bold">♔ Last News</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors hover:bg-gray-750"
          >
            <div className="space-y-3 h-full flex flex-col">
              {/* Titulo */}
              <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                ♟ {article.title}
              </h3>
              
              {/* Descrição */}
              <div 
                className="text-sm text-gray-400 flex-grow line-clamp-3"
                dangerouslySetInnerHTML={{ __html: article.description }} 
              />
              
              {/* Data de publicação */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(article.pubDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                  Read more
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChessNewsRSS;