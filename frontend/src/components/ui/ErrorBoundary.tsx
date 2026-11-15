import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

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
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white">
          <div className="max-w-md w-full p-6 rounded-[12px] bg-white border border-[#E5E5E5] shadow-sm text-center space-y-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-medium tracking-wide uppercase mb-1.5">
                Rendering Anomaly
              </span>
              <h2 className="text-base font-semibold text-[#272727]">
                Scientific Display Recovered
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                A non-critical rendering anomaly occurred. You can reload the view or return to the overview workspace.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-[8px] bg-[#F7F7F8] border border-[#E5E5E5] text-left font-mono text-[11px] text-[#6B6B6B] max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#242424] text-white hover:bg-[#383838] rounded-[6px] text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white text-[#272727] hover:bg-[#F7F7F8] border border-[#E5E5E5] rounded-[6px] text-xs font-medium transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
