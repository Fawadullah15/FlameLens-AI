import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { IngestModal } from '../ui/IngestModal';

export const Layout: React.FC = () => {
  const [isIngestOpen, setIsIngestOpen] = useState(false);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenIngestModal={() => setIsIngestOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 nasa-grid bg-space-900/60">
          <Outlet />
        </main>
      </div>

      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
      />
    </div>
  );
};
