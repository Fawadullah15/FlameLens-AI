import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Flame,
  GitCompare,
  ShieldAlert,
  FileText,
  Plus,
  Database,
  Settings,
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSources?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  onOpenSources
}) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutGrid, exact: true },
    { to: '/copilot', label: 'AI Research Chat', icon: MessageSquare },
    { to: '/library', label: 'NASA Research', icon: BookOpen },
    { to: '/experiments', label: 'Experiments', icon: FlaskConical },
    { to: '/combustion', label: 'Flame Analysis', icon: Flame },
    { to: '/analysis', label: 'Compare Experiments', icon: GitCompare },
    { to: '/safety', label: 'Fire Safety Intelligence', icon: ShieldAlert },
    { to: '/reports', label: 'Research Reports', icon: FileText },
  ];

  const handleNewResearch = () => {
    navigate('/copilot?new=true');
    if (onClose) onClose();
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-[260px] bg-[#F7F7F8] border-r border-[#E5E5E5] flex flex-col justify-between select-none
        transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen
        ${isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}
      `}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header / Brand */}
        <div className="p-4 flex items-center justify-between border-b border-[#E5E5E5]/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-[#242424] flex items-center justify-center text-white font-bold text-xs">
              <span className="text-[#FF7139]">F</span>L
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-semibold text-sm tracking-tight text-[#272727]">
                  FlameLens
                </span>
                <span className="text-[10px] font-mono font-medium text-[#6B6B6B] bg-[#EAEAEA] px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#8A8A8A] mt-0.5 leading-tight">
                Microgravity Combustion
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-[#6B6B6B] hover:text-[#272727] hover:bg-[#EAEAEA] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Research Button (ChatGPT style) */}
        <div className="p-3">
          <button
            onClick={handleNewResearch}
            className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#272727] bg-white border border-[#E5E5E5] rounded-[9px] hover:bg-[#EFEFEF] hover:border-[#D4D4D4] transition-colors shadow-xs"
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#272727]" />
              <span>New Research Query</span>
            </div>
            <span className="text-[11px] font-mono text-[#8A8A8A] border border-[#E5E5E5] px-1 py-0.2 rounded bg-[#F7F7F8]">
              /
            </span>
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-5">
          <div>
            <p className="px-2 text-[11px] font-semibold text-[#8A8A8A] tracking-wider uppercase mb-1">
              Scientific Workspace
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[7px] text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#ECECEC] text-[#272727]'
                          : 'text-[#555555] hover:text-[#272727] hover:bg-[#EAEAEA]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* NASA Space Apps Challenge Note */}
          <div className="px-2 pt-2 border-t border-[#E5E5E5]/60">
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-2.5">
              <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#B86B39]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B39]"></span>
                <span>NASA Space Apps 2026</span>
              </div>
              <p className="text-[11px] text-[#6B6B6B] mt-1 leading-snug">
                Challenge 08: Flame in Freefall. Powered by verified Glenn & Marshall research.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Section */}
      <div className="p-3 border-t border-[#E5E5E5] bg-[#F7F7F8] space-y-1">
        {onOpenSources && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenSources();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[7px] text-[13px] text-[#555555] hover:text-[#272727] hover:bg-[#EAEAEA] transition-colors"
          >
            <Database className="w-4 h-4 text-[#6B6B6B]" />
            <span>NASA Data Sources</span>
          </button>
        )}

        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[7px] text-[13px] font-medium transition-colors ${
              isActive
                ? 'bg-[#ECECEC] text-[#272727]'
                : 'text-[#555555] hover:text-[#272727] hover:bg-[#EAEAEA]'
            }`
          }
        >
          <Settings className="w-4 h-4 text-[#6B6B6B]" />
          <span>Settings</span>
        </NavLink>

        {/* Database Connected Status */}
        <div className="pt-2 px-2 flex items-center justify-between text-[11px] text-[#8A8A8A]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10A37F]"></span>
            <span>NASA Database Active</span>
          </div>
          <span className="font-mono text-[10px]">v1.4.2</span>
        </div>
      </div>
    </aside>
  );
};
