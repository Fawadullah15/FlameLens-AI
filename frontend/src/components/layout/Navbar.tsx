import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  PanelLeft,
  Database,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSources: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Mission Overview',
  '/copilot': 'AI Research Chat',
  '/assistant': 'AI Research Chat',
  '/library': 'NASA Research Library',
  '/experiments': 'Experiments Repository',
  '/combustion': 'Flame & Kinetics Analysis',
  '/analysis': 'Compare Experiments',
  '/comparison': 'Compare Experiments',
  '/safety': 'Fire Safety Intelligence',
  '/risk': 'Fire Safety Intelligence',
  '/incidents': 'Historical Incidents',
  '/reports': 'Research Reports',
  '/settings': 'Settings'
};

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSources,
  isMobileNavOpen = false,
  onToggleMobileNav,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse
}) => {
  const location = useLocation();
  const [experimentCount, setExperimentCount] = useState<number>(42);

  useEffect(() => {
    api.getHealth()
      .then(res => {
        if (res?.verified_experiments_count) setExperimentCount(res.verified_experiments_count);
      })
      .catch(() => {});
  }, []);

  const pageTitle = ROUTE_TITLES[location.pathname] || 'FlameLens';

  return (
    <header className="h-12 border-b border-[#E5E5E5] bg-white sticky top-0 z-30 px-3 sm:px-4 flex items-center justify-between select-none">
      {/* Left: Sidebar Toggle, Mobile Menu, Breadcrumb */}
      <div className="flex items-center space-x-2">
        {/* Mobile menu hamburger */}
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-1.5 rounded-[6px] text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F0F0F0] transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        {/* Desktop open sidebar icon when collapsed */}
        {isSidebarCollapsed && onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex p-1.5 rounded-[6px] text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F0F0F0] transition-colors mr-1"
            title="Open sidebar"
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-[13px] font-medium text-[#0D0D0D] flex items-center space-x-2">
          <span>{pageTitle}</span>
        </div>
      </div>

      {/* Center: Search Button (ChatGPT style) */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-2.5 py-1 text-[13px] text-[#8F8F8F] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#E5E5E5] rounded-[6px] transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#8F8F8F]" />
            <span>Search research, fuels, papers...</span>
          </div>
          <kbd className="text-[10px] font-mono text-[#8F8F8F] bg-white px-1 py-0.2 rounded border border-[#E5E5E5]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Datasets indicator & Search on mobile */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSearch}
          className="md:hidden p-1.5 rounded-[6px] text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F0F0F0]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSources}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium text-[#555555] hover:text-[#0D0D0D] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#E5E5E5] rounded-[6px] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" />
          <span>{experimentCount} NASA Experiments</span>
        </button>
      </div>
    </header>
  );
};
