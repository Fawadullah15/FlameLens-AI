import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  BookOpen,
  LineChart,
  Bot,
  ShieldAlert,
  FileText,
  UploadCloud,
  Layers,
  ChevronRight,
  Activity,
  Sliders,
  Settings
} from 'lucide-react';

interface SidebarProps {
  onOpenIngestModal?: () => void;
  onOpenSources?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenIngestModal, onOpenSources }) => {
  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, tag: '01' },
    { to: '/combustion', label: 'Combustion Intelligence', icon: Flame, tag: '02' },
    { to: '/library', label: 'Research Explorer', icon: BookOpen, tag: '03' },
    { to: '/analysis', label: 'Scientific Analysis', icon: LineChart, tag: '04' },
    { to: '/copilot', label: 'AI Copilot', icon: Bot, tag: '05' },
    { to: '/safety', label: 'Mission Safety', icon: ShieldAlert, tag: '06' },
    { to: '/reports', label: 'Reports & Findings', icon: FileText, tag: '07' },
  ];

  return (
    <aside className="w-64 border-r border-[#1E3442] bg-[#0A1118]/95 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Brand & Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="px-3 pb-3 mb-3 border-b border-[#1E3442]/60">
            <h2 className="font-display font-bold text-sm tracking-wide text-slate-100">
              FLAMELENS AI
            </h2>
            <p className="text-[11px] font-mono text-cyan-400">
              Scientific Intelligence Platform
            </p>
          </div>

          <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase mb-2">
            MISSION MODULES
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all group ${
                      isActive
                        ? 'bg-[#13212C] text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1821] border-l-2 border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E1821] text-slate-400 group-hover:text-cyan-400 border border-[#1E3442]">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Data Tools */}
        <div className="space-y-2 pt-2 border-t border-[#1E3442]/60">
          <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase mb-2">
            RESEARCH DATA PIPELINE
          </p>

          <button
            onClick={onOpenSources}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-300 bg-[#0E1821] hover:bg-[#13212C] border border-[#1E3442] transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>NASA Data Sources</span>
            </div>
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              28
            </span>
          </button>

          <button
            onClick={onOpenIngestModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-teal-300 bg-teal-950/30 hover:bg-teal-950/50 border border-teal-800/40 transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <UploadCloud className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Ingest PDF / Data</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Hardware & Environment Status */}
      <div className="pt-3 border-t border-[#1E3442] font-mono text-[11px] text-slate-500 space-y-2">
        {/* System Status Telemetry Card */}
        <div className="p-2.5 rounded-lg bg-[#0E1821] border border-[#1E3442] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              HARDWARE STATUS
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NOMINAL
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>PLATFORM:</span>
            <span className="text-cyan-400 font-semibold">ISS CIR / MSG</span>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>ENVIRONMENT:</span>
            <span className="text-slate-300">10⁻⁶ g (μg)</span>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>EXPERIMENTS:</span>
            <span className="text-emerald-400 font-semibold">29 VERIFIED</span>
          </div>
        </div>

        {/* Provenance Badge */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#05090D] border border-[#1E3442]/60 text-[10px] text-slate-400">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens Emblem"
            className="w-4 h-4 object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
          />
          <span className="truncate">QuantumX • Challenge 08</span>
        </div>
      </div>
    </aside>
  );
};
