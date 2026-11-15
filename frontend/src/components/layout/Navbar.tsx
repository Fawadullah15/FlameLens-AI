import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Cpu,
  Database,
  ChevronRight,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSources: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

const ROUTE_TITLES: Record<string, { module: string; page: string }> = {
  '/': { module: 'MISSION CONTROL', page: 'OVERVIEW' },
  '/combustion': { module: 'RESEARCH LAB', page: 'COMBUSTION INTELLIGENCE' },
  '/library': { module: 'ARCHIVE', page: 'RESEARCH EXPLORER' },
  '/analysis': { module: 'ANALYTICS', page: 'SCIENTIFIC ANALYSIS' },
  '/comparison': { module: 'ANALYTICS', page: 'SCIENTIFIC ANALYSIS' },
  '/copilot': { module: 'INTELLIGENCE', page: 'AI SCIENTIFIC COPILOT' },
  '/assistant': { module: 'INTELLIGENCE', page: 'AI SCIENTIFIC COPILOT' },
  '/safety': { module: 'OPERATIONS', page: 'MISSION SAFETY' },
  '/risk': { module: 'OPERATIONS', page: 'MISSION SAFETY' },
  '/incidents': { module: 'OPERATIONS', page: 'MISSION SAFETY' },
  '/reports': { module: 'DOCUMENTATION', page: 'REPORTS & FINDINGS' },
};

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSources,
  isMobileNavOpen = false,
  onToggleMobileNav
}) => {
  const location = useLocation();
  const [healthStatus, setHealthStatus] = useState<{ status: string; count: number } | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(res => setHealthStatus({ status: res.status, count: res.verified_experiments_count }))
      .catch(() => setHealthStatus(null));
  }, []);

  const routeInfo = ROUTE_TITLES[location.pathname] || { module: 'FLAMELENS', page: 'OPERATIONS' };

  return (
    <header className="h-14 sm:h-16 border-b border-[#1B2B3C] bg-[#090F16]/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-5 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle, Brand & Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Hamburger Toggle */}
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#0D1622] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <Link to="/" className="flex items-center space-x-2.5 group">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens Emblem"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <div className="hidden xs:block">
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-display font-bold text-sm sm:text-base tracking-wider text-white">
                FLAME<span className="text-cyan-400">LENS</span>
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                AI
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 tracking-tight hidden sm:block mt-0.5">
              NASA Microgravity Intelligence
            </p>
          </div>
        </Link>

        <div className="hidden md:block h-5 w-[1px] bg-[#1B2B3C] mx-1" />

        {/* Dynamic Breadcrumbs */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-slate-500">{routeInfo.module}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#1B2B3C]" />
          <span className="text-cyan-400 font-semibold tracking-wide">{routeInfo.page}</span>
        </div>
      </div>

      {/* Center: Global Research Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] hover:border-cyan-500/40 text-xs font-mono text-slate-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">Search experiments, D² laws, fuels...</span>
          </div>
          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#121D2C] text-slate-400 border border-[#1B2B3C] ml-2 flex-shrink-0">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Right Controls & Telemetry Status */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        {/* Dataset Status Badge */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-semibold">
            {healthStatus ? `${healthStatus.count} FLIGHT RUNS` : '29 FLIGHT RUNS'}
          </span>
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-nominal" />
            SYNCED
          </span>
        </div>

        {/* AI System Status */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] text-[11px] font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 font-semibold">GEMINI AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
        </div>

        {/* Repositories Quick Access Button */}
        <button
          onClick={onOpenSources}
          className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 px-2.5 py-1.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] hover:border-cyan-500/30 transition-colors cursor-pointer"
          title="Inspect 28 connected NASA data sources"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">28 SOURCES</span>
        </button>

        {/* QuantumX Profile Tag */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1B2B3C]">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white font-display leading-tight">QuantumX</div>
            <div className="text-[9px] font-mono text-slate-500">Space Apps '26</div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#121D2C] border border-cyan-500/40 flex items-center justify-center text-[11px] font-bold text-cyan-300">
            QX
          </div>
        </div>
      </div>
    </header>
  );
};
