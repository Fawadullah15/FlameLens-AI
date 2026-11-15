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
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenIngestModal?: () => void;
  onOpenSources?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  onOpenIngestModal,
  onOpenSources
}) => {
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
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#090F16] border-r border-[#1B2B3C] flex flex-col justify-between p-4 select-none
        transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:min-h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}
    >
      {/* Brand & Navigation Links */}
      <div className="space-y-5">
        {/* Header Branding */}
        <div className="px-2 pb-3 border-b border-[#1B2B3C] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Emblem"
              className="w-7 h-7 object-contain"
            />
            <div>
              <h2 className="font-display font-bold text-sm tracking-wide text-white leading-tight">
                FLAMELENS AI
              </h2>
              <p className="text-[10px] font-mono text-cyan-400">
                Scientific Intelligence
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#121D2C] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modules Navigation */}
        <div>
          <p className="px-2 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
            MISSION MODULES
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors group ${
                      isActive
                        ? 'bg-[#0E1A27] text-cyan-300 font-semibold border-l-2 border-cyan-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0D1622] border-l-2 border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0D1622] text-slate-500 group-hover:text-cyan-400 border border-[#1B2B3C] ml-2 flex-shrink-0">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Research Data Pipeline */}
        <div className="space-y-1.5 pt-3 border-t border-[#1B2B3C]">
          <p className="px-2 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-1">
            RESEARCH PIPELINE
          </p>

          <button
            onClick={onOpenSources}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono text-slate-300 bg-[#0D1622] hover:bg-[#121D2C] border border-[#1B2B3C] hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>NASA Repositories</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              28
            </span>
          </button>

          <button
            onClick={onOpenIngestModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono text-emerald-300 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-800/40 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ingest PDF / Data</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>
      </div>

      {/* Bottom Hardware & Platform Status */}
      <div className="pt-3 border-t border-[#1B2B3C] font-mono text-[10px] text-slate-500 space-y-2">
        <div className="p-2.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase">ISS CIR TELEMETRY</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-nominal" />
              NOMINAL
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>PLATFORM:</span>
            <span className="text-cyan-400">Destiny Lab</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>EXPERIMENTS:</span>
            <span className="text-slate-200">29 Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-1 text-[10px] text-slate-500">
          <span>NASA Space Apps 2026</span>
          <span className="text-cyan-400 font-semibold">QuantumX</span>
        </div>
      </div>
    </aside>
  );
};
