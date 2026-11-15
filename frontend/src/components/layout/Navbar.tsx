import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSources: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

const ROUTE_LABELS: Record<string, { section: string; title: string }> = {
  '/': { section: 'Workspace', title: 'Mission Overview' },
  '/copilot': { section: 'Intelligence', title: 'AI Research Chat' },
  '/assistant': { section: 'Intelligence', title: 'AI Research Chat' },
  '/library': { section: 'Literature', title: 'NASA Research Library' },
  '/experiments': { section: 'Data', title: 'Experiments Repository' },
  '/combustion': { section: 'Analysis', title: 'Flame Analysis' },
  '/analysis': { section: 'Analysis', title: 'Compare Experiments' },
  '/comparison': { section: 'Analysis', title: 'Compare Experiments' },
  '/safety': { section: 'Safety', title: 'Fire Safety Intelligence' },
  '/risk': { section: 'Safety', title: 'Fire Safety Intelligence' },
  '/incidents': { section: 'Safety', title: 'Historical Spacecraft Incidents' },
  '/reports': { section: 'Findings', title: 'Research Reports' },
  '/settings': { section: 'Configuration', title: 'System Settings' }
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

  const routeInfo = ROUTE_LABELS[location.pathname] || { section: 'Workspace', title: 'FlameLens' };

  return (
    <header className="h-[52px] border-b border-[#E5E5E5] bg-white sticky top-0 z-30 px-4 flex items-center justify-between">
      {/* Left: Mobile Toggle, Logo, Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-1.5 rounded-md text-[#6B6B6B] hover:text-[#272727] hover:bg-[#F0F0F0] transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        <div className="flex items-center space-x-2 text-[13px]">
          <span className="text-[#8A8A8A] hidden sm:inline">{routeInfo.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#CCCCCC] hidden sm:inline" />
          <span className="font-semibold text-[#272727] tracking-tight">{routeInfo.title}</span>
        </div>
      </div>

      {/* Center: Minimal Quick Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-[#8A8A8A] bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] hover:bg-[#EFEFEF] hover:border-[#D4D4D4] transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#8A8A8A]" />
            <span>Search research papers, fuels, or experiments...</span>
          </div>
          <kbd className="text-[10px] font-mono text-[#8A8A8A] border border-[#E5E5E5] px-1 py-0.2 rounded bg-white">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Status Pill & QuantumX profile badge */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenSearch}
          className="md:hidden p-1.5 rounded-md text-[#6B6B6B] hover:text-[#272727] hover:bg-[#F0F0F0]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSources}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium text-[#6B6B6B] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#E5E5E5] rounded-[6px] transition-colors"
        >
          <Database className="w-3 h-3 text-[#6B6B6B]" />
          <span>{healthStatus?.count ? `${healthStatus.count} Experiments` : 'NASA Datasets'}</span>
        </button>

        {/* Team QuantumX profile tag */}
        <div className="flex items-center space-x-2 pl-1 border-l border-[#E5E5E5]/80">
          <div className="w-7 h-7 rounded-full bg-[#F0F0F0] border border-[#E5E5E5] flex items-center justify-center text-[11px] font-semibold text-[#272727]">
            QX
          </div>
        </div>
      </div>
    </header>
  );
};
