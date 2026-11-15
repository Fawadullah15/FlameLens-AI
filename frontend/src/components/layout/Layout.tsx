import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { IngestModal } from '../ui/IngestModal';
import { DataSourcesModal } from '../ui/DataSourcesModal';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';

export const Layout: React.FC = () => {
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const location = useLocation();

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D] flex font-sans selection:bg-[#B86B39]/15 selection:text-[#B86B39]">
      {/* Mobile Backdrop Overlay */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Fixed on desktop, drawer on mobile */}
      <Sidebar
        isOpen={isMobileNavOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSources={() => {
          setIsMobileNavOpen(false);
          setIsSourcesOpen(true);
        }}
        onOpenIngest={() => {
          setIsMobileNavOpen(false);
          setIsIngestOpen(true);
        }}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSources={() => setIsSourcesOpen(true)}
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto bg-white min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
      />
      <DataSourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
