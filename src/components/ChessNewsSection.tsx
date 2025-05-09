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

  useEffect(() => {
    // Função assíncrona para buscar o feed RSS
    const fetchRSS = async () => {
      try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        // URL do feed RSS do Chess.com
        const feedUrl = 'https://www.chess.com/rss/news';
        
        
        const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
        const data = await response.json();

       
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'application/xml');
        
        
        const items = Array.from(xml.querySelectorAll('item')).slice(0, 3);

       
        const parsed = items.map((item) => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
        }));

        setArticles(parsed);
      } catch (error) {
        console.error('Erro ao carregar RSS:', error);
      } finally {
        setLoading(false);
      }
    };

    // Chama a função de busca
    fetchRSS();
  }, []); 


  if (loading) return <p className="text-center py-8">Carregando notícias...</p>;

  return (
    <div className="mb-8">
      {/* Título da seção */}
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">♔ Last News</h2>

      {/* Grid responsivo para os artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-colors duration-200 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="space-y-3">
              {/* Título do artigo com limite de 2 linhas */}
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-blue-400">
                ♟ {article.title}
              </h3>
              
              {/* Descrição do artigo (HTML) com limite de 3 linhas */}
              <p 
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3" 
                dangerouslySetInnerHTML={{ __html: article.description }} 
              />
              
              {/* Data de publicação formatada */}
              <span className="text-xs text-gray-500">
                {new Date(article.pubDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChessNewsRSS;