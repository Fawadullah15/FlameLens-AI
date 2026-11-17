import React, { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  Image as ImageIcon,
  Video,
  Newspaper,
  FlaskConical,
  ChevronDown,
  LayoutGrid,
  Moon,
  Sun,
  Search,
  Sparkles,
  GitCompare,
  Flame,
  ShieldAlert,
  FileText,
  BookOpen,
  Settings,
  Database,
  ExternalLink,
  User
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSources: () => void;
  onOpenAppDeck?: () => void;
  onOpenSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSources,
  onOpenAppDeck,
  onOpenSignIn
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [experimentCount, setExperimentCount] = useState<number>(42);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCelestialMode, setIsCelestialMode] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getHealth()
      .then(res => {
        if (res?.verified_experiments_count) setExperimentCount(res.verified_experiments_count);
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Search', icon: Search, exact: true },
    { to: '/images', label: 'Images', icon: ImageIcon },
    { to: '/videos', label: 'Videos', icon: Video },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/science', label: 'Science', icon: FlaskConical },
  ];

  const moreLinks = [
    { to: '/copilot', label: 'AI Scientific Copilot', desc: 'Gemini-powered microgravity assistant', icon: Sparkles },
    { to: '/experiments', label: 'Experiments Repository', desc: '42+ verified CIR & drop tower runs', icon: FlaskConical },
    { to: '/combustion', label: 'Combustion Kinetics', desc: 'D²-law droplet regression analysis', icon: Flame },
    { to: '/analysis', label: 'Compare Experiments', desc: '0-g vs 1-g physical parameter contrast', icon: GitCompare },
    { to: '/safety', label: 'Mission Fire Safety', desc: 'Spacecraft flammability & risk ranking', icon: ShieldAlert },
    { to: '/reports', label: 'Research Reports', desc: 'Automated NASA-STD-6001B briefs', icon: FileText },
    { to: '/library', label: 'NASA Research Library', desc: 'Technical documents & papers', icon: BookOpen },
    { to: '/settings', label: 'Settings', desc: 'API keys & preferences', icon: Settings },
  ];

  const isMoreActive = moreLinks.some(l => location.pathname === l.to);

  return (
    <header className="h-14 bg-[#02050C]/85 backdrop-blur-md border-b border-[rgba(120,165,255,0.14)] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* ── LEFT SECTION: BRAND IDENTITY ─────────────────────────────────── */}
      <div className="flex items-center space-x-3 shrink-0">
        <Link to="/" className="flex items-center space-x-2.5 group" title="FlameLens NASA Search">
          <img
            src="/nasa-logo.svg"
            alt="NASA Meatball Emblem"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_12px_rgba(47,130,255,0.7)] group-hover:scale-105 transition-transform"
          />
          <span className="text-[17px] font-semibold tracking-tight text-white group-hover:text-[#69B7FF] transition-colors">
            FlameLens
          </span>
        </Link>
      </div>

      {/* ── CENTER NAVIGATION: 6 PRIMARY ITEMS WITH GLOWING ACTIVE BAR ────── */}
      <nav className="flex items-center space-x-0.5 sm:space-x-1.5 md:space-x-2.5 lg:space-x-4">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to || location.pathname === '/search'
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[13px] sm:text-[14px] font-medium transition-all group ${
                isActive
                  ? 'text-white font-semibold bg-white/[0.07] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? 'text-[#2F82FF] drop-shadow-[0_0_8px_rgba(47,130,255,0.85)]'
                    : 'text-[#78869C] group-hover:text-[#69B7FF]'
                }`}
              />
              <span className="hidden sm:inline">{item.label}</span>

              {/* Glowing Blue Underline with Central Lens Flare for Active Item */}
              {isActive && (
                <div className="absolute -bottom-2.5 left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#2F82FF] to-transparent rounded-full shadow-[0_0_10px_#2F82FF]">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white blur-[1px] shadow-[0_0_8px_#ffffff]" />
                </div>
              )}
            </NavLink>
          );
        })}

        {/* 'More' Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsMoreOpen(prev => !prev)}
            className={`relative flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg text-[14px] sm:text-[15px] font-medium transition-all ${
              isMoreActive || isMoreOpen
                ? 'text-white font-semibold'
                : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden sm:inline">More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180 text-[#2F82FF]' : 'text-[#78869C]'}`} />

            {/* Glowing underline if an inner sub-module is active */}
            {isMoreActive && (
              <div className="absolute -bottom-2 left-1.5 right-1.5 h-[2px] bg-[#2F82FF] rounded-full shadow-[0_0_10px_#2F82FF]" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMoreOpen && (
            <div className="absolute top-full mt-2.5 right-0 sm:left-1/2 sm:-translate-x-1/2 w-72 sm:w-80 bg-[#07111F]/95 backdrop-blur-xl border border-[rgba(120,165,255,0.25)] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(35,112,255,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#78869C] border-b border-[rgba(120,165,255,0.12)] mb-1">
                Aerospace Intelligence Tools
              </div>
              <div className="space-y-0.5">
                {moreLinks.map((sub) => {
                  const SubIcon = sub.icon;
                  const isCurrent = location.pathname === sub.to;
                  return (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-start space-x-2.5 p-2 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#1769FF]/20 text-white font-medium border border-[rgba(120,165,255,0.3)] shadow-[0_0_10px_rgba(47,130,255,0.25)]'
                          : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <SubIcon className="w-4 h-4 text-[#2F82FF] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">{sub.label}</div>
                        <div className="text-[10px] text-[#78869C] truncate">{sub.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── RIGHT SECTION: APPLICATION MENU, THEME TOGGLE & SIGN IN ─────── */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Quick Search Shortcut - Visible on inner pages */}
        {location.pathname !== '/' && (
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-[#AAB6CA] hover:text-white hover:bg-white/10 transition-colors"
            title="Search NASA (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* 3x3 Application Grid (Deck) - Visible on inner pages */}
        {location.pathname !== '/' && (
          <button
            onClick={onOpenAppDeck}
            className="p-2 rounded-lg text-[#AAB6CA] hover:text-white hover:bg-white/10 transition-colors"
            title="FlameLens App Launcher"
            aria-label="Applications Menu"
          >
            <LayoutGrid className="w-4.5 h-4.5 text-white/90 hover:text-white" />
          </button>
        )}

        {/* Sun & Moon Celestial Mode Switcher */}
        <div className="flex items-center space-x-1.5 px-1 py-1 text-white/80">
          <button
            onClick={() => setIsCelestialMode(false)}
            className={`p-1 rounded-full transition-colors ${!isCelestialMode ? 'text-amber-300 drop-shadow-[0_0_6px_#fcd34d]' : 'text-white/60 hover:text-amber-200'}`}
            title="Day Solar Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCelestialMode(true)}
            className={`p-1 rounded-full transition-colors ${isCelestialMode ? 'text-[#69B7FF] drop-shadow-[0_0_8px_rgba(105,183,255,0.85)]' : 'text-white/60 hover:text-white'}`}
            title="Midnight Deep Space Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Sign In Pill Button (matching reference) */}
        <button
          onClick={onOpenSignIn}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(16,28,52,0.6)] hover:bg-[#1769FF]/20 border border-[rgba(120,165,255,0.25)] hover:border-[#2F82FF] text-[13px] font-medium text-white transition-all shadow-[0_0_12px_rgba(35,112,255,0.15)] hover:shadow-[0_0_18px_rgba(47,130,255,0.4)]"
          title="Sign in to NASA Launchpad"
        >
          <User className="w-3.5 h-3.5 text-white/80" />
          <span>Sign In</span>
        </button>
      </div>
    </header>
  );
};
