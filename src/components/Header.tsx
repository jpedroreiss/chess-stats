import { useState } from "react";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); // Fecha o menu em mobile
    }
  };

  return (
    <header className="px-6 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo e Titulo */}
        <div className="flex items-center gap-3">
          <button
             onClick={() => window.location.reload()}
            className="h-10 w-10 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          > 
            <img
              src="./chess-bg.webp"
              alt="Chess Stats Logo"
              className="h-full w-full object-cover"
            />
          </button>
          <span className="text-xl font-bold text-white">Chess Stats</span>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink label="Leaderboard" id="leaderboard" />
          <NavLink label="News" id="news" />
          <NavLink label="Streamers" id="streamers" />
        </nav>

        {/* Menu Mobile Toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <MobileNavLink label="Leaderboard" id="leaderboard" onClick={scrollToSection} />
          <MobileNavLink label="News" id="news" onClick={scrollToSection} />
          <MobileNavLink label="Streamers" id="streamers" onClick={scrollToSection} />
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  label: string;
  id: string;
}

const NavLink: React.FC<NavLinkProps> = ({ label, id }) => (
  <a
    href={`#${id}`}
    onClick={(e) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }}
    className="text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium"
  >
    {label}
  </a>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: (id: string) => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ label, id, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className="text-gray-400 hover:text-amber-400 text-left px-2 transition-colors text-sm font-medium"
  >
    {label}
  </button>
);

export default Header;