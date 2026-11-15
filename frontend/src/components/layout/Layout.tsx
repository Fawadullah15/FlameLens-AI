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
    <div className="min-h-screen bg-[#060A10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Backdrop Overlay */}
        {isMobileNavOpen && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 lg:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar Component */}
        <Sidebar
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          onOpenIngestModal={() => {
            setIsMobileNavOpen(false);
            setIsIngestOpen(true);
          }}
          onOpenSources={() => {
            setIsMobileNavOpen(false);
            setIsSourcesOpen(true);
          }}
        />

        {/* Main Application Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 nasa-grid bg-[#060A10]/95 min-w-0">
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
