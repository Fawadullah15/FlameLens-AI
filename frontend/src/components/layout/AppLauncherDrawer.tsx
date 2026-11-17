import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  Compass,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Flame,
  GitCompare,
  ShieldAlert,
  FileText,
  Database,
  UploadCloud,
  Settings,
  ExternalLink,
  Sparkles,
  Globe,
  Radio,
  Image as ImageIcon,
  Video,
  Newspaper,
  Layers
} from 'lucide-react';

interface AppLauncherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSources: () => void;
  onOpenIngest: () => void;
  experimentCount?: number;
}

export const AppLauncherDrawer: React.FC<AppLauncherDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSources,
  onOpenIngest,
  experimentCount = 42
}) => {
  if (!isOpen) return null;

  const coreModules = [
    { to: '/', label: 'FlameLens Search', desc: 'Central NASA search experience', icon: Compass, exact: true },
    { to: '/copilot', label: 'AI Scientific Copilot', desc: 'Grounded microgravity assistant', icon: Sparkles },
    { to: '/experiments', label: 'Flight Experiments', desc: '42+ verified CIR & drop tower runs', icon: FlaskConical },
    { to: '/combustion', label: 'Combustion Kinetics', desc: 'D²-law droplet regression & atmosphere', icon: Flame },
    { to: '/analysis', label: 'Scientific Analysis', desc: 'Side-by-side 0g vs 1g comparison', icon: GitCompare },
    { to: '/safety', label: 'Mission Fire Safety', desc: 'Spacecraft flammability risk matrix', icon: ShieldAlert },
    { to: '/reports', label: 'Mission Briefings', desc: 'NASA-STD-6001B automated reports', icon: FileText },
    { to: '/library', label: 'Research Library', desc: 'NTRS papers and technical docs', icon: BookOpen },
  ];

  const searchCategories = [
    { to: '/search', label: 'Search Results', icon: Globe },
    { to: '/images', label: 'Images Gallery', icon: ImageIcon },
    { to: '/videos', label: 'Flight Videos', icon: Video },
    { to: '/news', label: 'Science News', icon: Newspaper },
    { to: '/science', label: 'Science Portal', icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity">
      <div 
        className="w-full max-w-md bg-[#07111F]/95 border border-[rgba(120,165,255,0.25)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.35)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[rgba(120,165,255,0.18)] flex items-center justify-between bg-[#101B30]/60">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="FlameLens Emblem" className="w-6 h-6 object-contain" />
            <div>
              <div className="text-sm font-semibold text-white tracking-wide">FlameLens Aerospace Deck</div>
              <div className="text-[11px] text-[#AAB6CA]">NASA Space Apps Challenge 2026</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close deck"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Quick Search Sections */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#78869C] px-1 mb-2">
              Search Channels
            </div>
            <div className="grid grid-cols-2 gap-2">
              {searchCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <NavLink
                    key={cat.to}
                    to={cat.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all border ${
                        isActive
                          ? 'bg-[#1769FF]/20 border-[#2F82FF] text-white shadow-[0_0_12px_rgba(47,130,255,0.35)] font-semibold'
                          : 'bg-[#101B30]/40 border-[rgba(120,165,255,0.12)] text-[#AAB6CA] hover:text-white hover:border-[rgba(120,165,255,0.3)] hover:bg-[#101B30]/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#2F82FF] shrink-0" />
                    <span>{cat.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Core Scientific Intelligence Modules */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#78869C] px-1 mb-2">
              Scientific Modules
            </div>
            <div className="space-y-1.5">
              {coreModules.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-2.5 rounded-xl transition-all border ${
                        isActive
                          ? 'bg-[#1769FF]/20 border-[#2F82FF] text-white shadow-[0_0_14px_rgba(47,130,255,0.35)]'
                          : 'bg-[#101B30]/35 border-transparent hover:border-[rgba(120,165,255,0.2)] hover:bg-[#101B30]/70 text-[#AAB6CA] hover:text-white'
                      }`
                    }
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1769FF]/15 border border-[rgba(120,165,255,0.25)] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#2F82FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white tracking-tight truncate">{item.label}</div>
                      <div className="text-[11px] text-[#78869C] truncate">{item.desc}</div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Quick Utility Tools */}
          <div className="pt-2 border-t border-[rgba(120,165,255,0.12)] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSources();
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs bg-[#101B30]/40 border border-[rgba(120,165,255,0.15)] text-[#AAB6CA] hover:text-white hover:bg-[#101B30] transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#2F82FF]" />
              <span className="truncate">NASA Sources ({experimentCount})</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenIngest();
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs bg-[#101B30]/40 border border-[rgba(120,165,255,0.15)] text-[#AAB6CA] hover:text-white hover:bg-[#101B30] transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#2F82FF]" />
              <span className="truncate">Ingest Document</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[rgba(120,165,255,0.15)] bg-[#0C182B]/80 flex items-center justify-between text-[11px] text-[#78869C]">
          <NavLink to="/settings" onClick={onClose} className="hover:text-white flex items-center space-x-1.5 transition-colors">
            <Settings className="w-3.5 h-3.5 text-[#AAB6CA]" />
            <span>Settings</span>
          </NavLink>
          <a
            href="https://www.spaceappschallenge.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2F82FF] flex items-center space-x-1 transition-colors"
          >
            <span>Team QuantumX</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
