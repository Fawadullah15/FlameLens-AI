import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { IngestModal } from '../ui/IngestModal';
import { DataSourcesModal } from '../ui/DataSourcesModal';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';

export const Layout: React.FC = () => {
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    <div className="min-h-screen bg-[#05090D] text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onOpenIngestModal={() => setIsIngestOpen(true)}
          onOpenSources={() => setIsSourcesOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-5 md:p-6 nasa-grid bg-[#05090D]/80">
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
