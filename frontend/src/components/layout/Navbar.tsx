import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, Cpu, Database, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

export const Navbar: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<{ status: string; count: number } | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(res => setHealthStatus({ status: res.status, count: res.verified_experiments_count }))
      .catch(() => setHealthStatus(null));
  }, []);

  return (
    <header className="h-16 border-b border-space-700 bg-space-900/95 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Brand & Mission Identifier */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Insignia"
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-wider text-slate-100">
                FLAME<span className="text-cyan-400">LENS</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                AI 1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-tight">
              NASA SPACE APPS 2026 • FLAME IN FREEFALL
            </p>
          </div>
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-space-700 mx-2" />

        {/* Flight Verification Badge */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CIR FLIGHT HARDWARE ARCHIVE</span>
        </div>
      </div>

      {/* Right Controls & Telemetry Status */}
      <div className="flex items-center space-x-4">
        {/* Real-time System Telemetry Pill */}
        <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-md bg-space-850 border border-space-700 font-mono text-xs">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Database className="w-3.5 h-3.5" />
            <span>{healthStatus ? `${healthStatus.count} EXPERIMENTS` : 'SYNCING'}</span>
          </div>
          <span className="text-space-600">|</span>
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px]">FTS5 ACTIVE</span>
          </div>
        </div>

        {/* Official NASA PSI Link */}
        <a
          href="https://psi.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-md hover:bg-space-800 border border-transparent hover:border-space-700"
        >
          <span>NASA PSI</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
};
