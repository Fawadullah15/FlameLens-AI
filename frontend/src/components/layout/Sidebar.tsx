import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Activity,
  GitCompare,
  Bot,
  ShieldCheck,
  FileText,
  UploadCloud,
  ChevronRight,
  Flame
} from 'lucide-react';

interface SidebarProps {
  onOpenIngestModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenIngestModal }) => {
  const navItems = [
    { to: '/', label: 'Mission Dashboard', icon: LayoutDashboard, tag: 'CIR' },
    { to: '/analysis', label: 'Flame Physics & D²', icon: Activity, tag: 'MODEL' },
    { to: '/incidents', label: 'Spacecraft Incidents', icon: Flame, tag: 'SAFETY' },
    { to: '/comparison', label: 'Flight Comparison', icon: GitCompare, tag: 'DIFF' },
    { to: '/risk', label: 'Fire Safety Risk', icon: ShieldCheck, tag: 'AUDIT' },
    { to: '/assistant', label: 'AI Flight Assistant', icon: Bot, tag: 'RAG' },
    { to: '/library', label: 'NASA Literature', icon: BookOpen, tag: 'NTRS' },
    { to: '/reports', label: 'Mission Reports', icon: FileText, tag: 'PDF' },
  ];

  return (
    <aside className="w-64 border-r border-space-700 bg-space-900/95 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
            INTELLIGENCE MODULES
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-space-850 text-cyan-300 border border-cyan-800/60 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/70 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-800 text-slate-500 group-hover:text-cyan-400 border border-space-700">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Ingestion Trigger Button */}
        <div className="pt-2">
          <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
            NASA DATA PIPELINE
          </p>
          <button
            onClick={onOpenIngestModal}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-teal-300 bg-teal-950/40 hover:bg-teal-900/50 border border-teal-800/50 transition-all shadow-glow-teal group"
          >
            <div className="flex items-center space-x-2.5">
              <UploadCloud className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Ingest PDF / Data</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
          </button>
        </div>
      </div>

      {/* Hardware Platform Provenance Footer */}
      <div className="pt-3 border-t border-space-800 font-mono text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-space-950 border border-space-800/80">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens Emblem"
            className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
          />
          <div className="text-[10px] leading-tight">
            <span className="text-white font-semibold block">FlameLens AI</span>
            <span className="text-cyan-400 text-[9px]">ISS CIR Telemetry</span>
          </div>
        </div>

        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between items-center text-slate-400">
            <span>PLATFORM:</span>
            <span className="text-cyan-400 font-semibold">ISS CIR / MSG</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>SERIES:</span>
            <span>FLEX, ACME, CFI</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>STANDARDS:</span>
            <span className="text-emerald-400 font-semibold">EMPIRICAL DATA</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
