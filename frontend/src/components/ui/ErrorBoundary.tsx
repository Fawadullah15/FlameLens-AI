import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FlameLens UI Runtime Encounter:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div>
              <div className="inline-block px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                TELEMETRY FAULT DETECTED
              </div>
              <h2 className="text-lg font-display font-bold text-white">
                Display Engine Recovered
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
                A rendering anomaly occurred while parsing flight parameters. Safe fallback mode has been engaged.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-[#05090D] border border-space-700 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RELOAD MISSION CONTROL</span>
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg bg-space-800 hover:bg-space-750 border border-space-700 text-slate-300 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>OVERVIEW</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
