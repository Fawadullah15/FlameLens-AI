import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AppLauncherDrawer } from './AppLauncherDrawer';
import { IngestModal } from '../ui/IngestModal';
import { DataSourcesModal } from '../ui/DataSourcesModal';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { SignInModal } from '../ui/SignInModal';

export const Layout: React.FC = () => {
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAppDeckOpen, setIsAppDeckOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const location = useLocation();

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

  // Close drawers/modals on route change
  useEffect(() => {
    setIsAppDeckOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#02050C] text-white flex flex-col font-sans selection:bg-[#1769FF]/35 selection:text-white">
      {/* ── SLIM TOP NAVIGATION BAR (FAITHFUL TO REFERENCE) ──────────────── */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenAppDeck={() => setIsAppDeckOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* ── MAIN WORKSPACE CONTENT ───────────────────────────────────────── */}
      <main className="flex-1 w-full min-w-0 bg-[#02050C]">
        <Outlet />
      </main>

      {/* ── 9-DOTS AEROSPACE APPLICATION LAUNCHER DECK ───────────────────── */}
      <AppLauncherDrawer
        isOpen={isAppDeckOpen}
        onClose={() => setIsAppDeckOpen(false)}
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenIngest={() => setIsIngestOpen(true)}
      />

      {/* ── GLOBAL MODALS ─────────────────────────────────────────────────── */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
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
