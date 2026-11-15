import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  SquarePen,
  LayoutGrid,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Flame,
  GitCompare,
  ShieldAlert,
  FileText,
  PanelLeftClose,
  Database,
  Settings,
  X,
  UploadCloud
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  onOpenSources?: () => void;
  onOpenIngest?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
  onOpenSources,
  onOpenIngest
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

  const handleNewChat = () => {
    navigate('/copilot?new=true');
    if (onClose) onClose();
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-[260px] bg-[#F7F7F8] border-r border-[#E5E5E5] flex flex-col justify-between select-none
        transition-all duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen
        ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
      `}
    >
      {/* ── TOP SECTION ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand & Sidebar Toggle */}
        <div className="h-12 px-3.5 flex items-center justify-between border-b border-[#EBEBEB]">
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="FlameLens Q Insignia"
              className="w-6 h-6 object-contain shrink-0"
            />
            <span className="font-semibold text-[14px] text-[#0D0D0D] tracking-tight">
              FlameLens AI
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Desktop collapse toggle */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-[6px] text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#EAEAEA] transition-colors"
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}

            {/* Mobile close toggle */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-[6px] text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#EAEAEA] transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* New Research Button (ChatGPT Style) */}
        <div className="p-2.5">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#0D0D0D] bg-white hover:bg-[#EAEAEA] border border-[#E5E5E5] rounded-[8px] transition-colors shadow-2xs"
          >
            <div className="flex items-center space-x-2">
              <SquarePen className="w-4 h-4 text-[#0D0D0D]" />
              <span>New research query</span>
            </div>
            <kbd className="text-[10px] font-mono text-[#8F8F8F] bg-[#F7F7F8] px-1 py-0.5 rounded border border-[#E5E5E5]">
              /
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          <div className="px-2 pt-1 pb-1.5 text-[11px] font-medium text-[#8F8F8F] tracking-wide uppercase">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[8px] text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#EAEAEA] text-[#0D0D0D] font-medium'
                      : 'text-[#444444] hover:text-[#0D0D0D] hover:bg-[#EFEFEF]'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#666666] shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM STICKY USER & SYSTEM FOOTER ──────────────────────────── */}
      <div className="p-2 border-t border-[#E5E5E5] bg-[#F7F7F8] space-y-0.5">
        {onOpenSources && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenSources();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[8px] text-[13px] text-[#555555] hover:text-[#0D0D0D] hover:bg-[#EFEFEF] transition-colors"
          >
            <Database className="w-4 h-4 text-[#6E6E6E]" />
            <span>NASA Data Sources</span>
          </button>
        )}

        {onOpenIngest && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenIngest();
            }}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[8px] text-[13px] text-[#555555] hover:text-[#0D0D0D] hover:bg-[#EFEFEF] transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-[#6E6E6E]" />
            <span>Ingest Document</span>
          </button>
        )}

        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[8px] text-[13px] transition-colors ${
              isActive
                ? 'bg-[#EAEAEA] text-[#0D0D0D] font-medium'
                : 'text-[#555555] hover:text-[#0D0D0D] hover:bg-[#EFEFEF]'
            }`
          }
        >
          <Settings className="w-4 h-4 text-[#6E6E6E]" />
          <span>Settings</span>
        </NavLink>

        {/* User / Team Profile Row */}
        <div className="pt-1.5 mt-1 border-t border-[#EBEBEB] px-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="QuantumX Q Emblem"
              className="w-6 h-6 rounded-full object-contain bg-[#0D0D0D] p-0.5 shrink-0"
            />
            <div className="leading-tight">
              <div className="text-[12px] font-medium text-[#0D0D0D]">QuantumX</div>
              <div className="text-[10px] text-[#8F8F8F]">NASA Space Apps</div>
            </div>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" title="NASA DB Active" />
        </div>
      </div>
    </aside>
  );
};
