interface FooterProps {
  
}

const Footer = ({}: FooterProps) => {
  return (
    <footer className="bg-gray-950 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sobre */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-lg">♔</span>
              <h3 className="font-bold text-gray-300 text-sm">Chess Stats</h3>
            </div>
            <p className="text-gray-500 text-xs">
              Unofficial chess statistics platform, using the public Chess.com API.
            </p>
          </div>

          {/* Recursos do Chess.com */}
          <div>
            <h3 className="font-bold mb-3 text-gray-300 text-sm flex items-center gap-2">
              <span className="text-gray-400">♛</span>
              Official Resources
            </h3>
            <ul className="space-y-1 text-gray-500 text-xs">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <a
                  href="https://www.chess.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Chess.com Official Website
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <a
                  href="https://www.chess.com/play"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Play Chess Online
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <a
                  href="https://www.chess.com/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Learn Chess
                </a>
              </li>
            </ul>
          </div>

          {/* API | Desenvolvedores */}
          <div>
            <h3 className="font-bold mb-3 text-gray-300 text-sm flex items-center gap-2">
              <span className="text-gray-400">⚙</span>
              For Developers
            </h3>
            <ul className="space-y-1 text-gray-500 text-xs">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <a
                  href="https://www.chess.com/news/view/published-data-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Chess.com API Documentation
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <a
                  href="https://github.com/chesscom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Official GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-500 mb-3 md:mb-0 flex items-center gap-1">
            <span>© {new Date().getFullYear()} Chess Stats</span>
            <span className="text-gray-400">♟</span>
            <span>Not affiliated with Chess.com</span>
          </div>
          <div className="flex space-x-3">
            <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors text-base">
              ♞
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
