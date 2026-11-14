import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Cpu,
  Database,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSources: () => void;
}

const ROUTE_TITLES: Record<string, { module: string; page: string }> = {
  '/': { module: 'MISSION CONTROL', page: 'MISSION OVERVIEW' },
  '/combustion': { module: 'RESEARCH LAB', page: 'COMBUSTION INTELLIGENCE' },
  '/library': { module: 'ARCHIVE', page: 'RESEARCH EXPLORER' },
  '/analysis': { module: 'ANALYTICS', page: 'SCIENTIFIC ANALYSIS' },
  '/comparison': { module: 'ANALYTICS', page: 'SCIENTIFIC ANALYSIS' },
  '/copilot': { module: 'INTELLIGENCE', page: 'AI SCIENTIFIC COPILOT' },
  '/assistant': { module: 'INTELLIGENCE', page: 'AI SCIENTIFIC COPILOT' },
  '/safety': { module: 'OPERATIONS', page: 'MISSION SAFETY INTELLIGENCE' },
  '/risk': { module: 'OPERATIONS', page: 'MISSION SAFETY INTELLIGENCE' },
  '/incidents': { module: 'OPERATIONS', page: 'MISSION SAFETY INTELLIGENCE' },
  '/reports': { module: 'DOCUMENTATION', page: 'REPORTS & FINDINGS' },
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenSources }) => {
  const location = useLocation();
  const [healthStatus, setHealthStatus] = useState<{ status: string; count: number } | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then(res => setHealthStatus({ status: res.status, count: res.verified_experiments_count }))
      .catch(() => setHealthStatus(null));
  }, []);

  const routeInfo = ROUTE_TITLES[location.pathname] || { module: 'FLAMELENS AI', page: 'OPERATIONS' };

  return (
    <header className="h-16 border-b border-[#1E3442] bg-[#0A1118]/95 backdrop-blur-md sticky top-0 z-40 px-5 flex items-center justify-between">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens Emblem"
            className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-base tracking-wider text-slate-100">
                FLAME<span className="text-cyan-400">LENS</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                AI 2.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-tight">
              SCIENTIFIC INTELLIGENCE
            </p>
          </div>
        </Link>

        <div className="hidden lg:block h-6 w-[1px] bg-[#1E3442] mx-1" />

        {/* Dynamic Breadcrumbs */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500">{routeInfo.module}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#1E3442]" />
          <span className="text-cyan-400 font-semibold tracking-wide">{routeInfo.page}</span>
        </div>
      </div>

      {/* Center: Global Research Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0E1821] border border-[#1E3442] hover:border-cyan-500/50 text-xs font-mono text-slate-400 transition-all shadow-inner group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-300">Search NASA papers, fuels, D² kinetics...</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-800 text-slate-400 border border-[#1E3442]">
            Ctrl + K
          </span>
        </button>
      </div>

      {/* Right Controls & Telemetry Status */}
      <div className="flex items-center space-x-3">
        {/* Dataset Status */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0E1821] border border-[#1E3442] text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-semibold">
            {healthStatus ? `${healthStatus.count} FLIGHT RUNS` : '29 FLIGHT RUNS'}
          </span>
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYNCED
          </span>
        </div>

        {/* AI System Status */}
        <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0E1821] border border-[#1E3442] text-[11px] font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 font-semibold">GEMINI 2.5 FLASH</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ONLINE
          </span>
        </div>

        {/* Repositories Quick Access */}
        <button
          onClick={onOpenSources}
          className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg bg-[#0E1821] border border-[#1E3442] hover:border-cyan-500/40 transition-colors"
          title="Inspect 28 connected NASA data sources"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>NASA SOURCES</span>
        </button>

        {/* Team / Mission Profile Tag */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1E3442]">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-100 font-display">QuantumX</div>
            <div className="text-[10px] font-mono text-slate-400">NASA SPACE APPS 2026</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-space-800 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-white shadow-glow-cyan">
            QX
          </div>
        </div>
      </div>
    </header>
  );
};
