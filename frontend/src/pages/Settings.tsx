import React, { useState } from 'react';
import {
  ShieldCheck,
  Sun,
  Check,
  RotateCcw
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'data' | 'about'>('general');
  const [temperature, setTemperature] = useState(0.2);
  const [docRetrievalK, setDocRetrievalK] = useState(5);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    localStorage.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings & Preferences</h1>
          <p className="page-subtitle">
            Configure AI reasoning parameters, data caching, and platform options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
              activeTab === 'general'
                ? 'bg-[#EAEAEA] text-[#0D0D0D] font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F7F7F8]'
            }`}
          >
            General & Appearance
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full text-left px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-[#EAEAEA] text-[#0D0D0D] font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F7F7F8]'
            }`}
          >
            AI Engine & RAG
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full text-left px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
              activeTab === 'data'
                ? 'bg-[#EAEAEA] text-[#0D0D0D] font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F7F7F8]'
            }`}
          >
            Data Provenance
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full text-left px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-[#EAEAEA] text-[#0D0D0D] font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F7F7F8]'
            }`}
          >
            About FlameLens
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <div className="p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-6 shadow-2xs">
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Appearance</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  FlameLens uses the ChatGPT-inspired minimal scientific research theme.
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="p-3 bg-[#F7F7F8] border-2 border-[#0D0D0D] rounded-[8px] text-xs font-medium text-[#0D0D0D] flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-[#B86B39]" />
                    <span>Scientific Light (Active)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Research Team</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  QuantumX — NASA Space Apps Challenge 2026, Challenge 08: Flame in Freefall.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-6 shadow-2xs">
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Temperature / Determinism</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  Lower temperature enforces strict scientific fidelity and factual adherence to NASA flight records.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#6E6E6E]">Factual (0.0)</span>
                    <span className="text-[#0D0D0D] font-semibold">{temperature.toFixed(2)}</span>
                    <span className="text-[#6E6E6E]">Creative (1.0)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#0D0D0D]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#0D0D0D]">RAG Retrieval Chunk Count (K)</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  Number of verified research documents retrieved per query.
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  {[3, 5, 8].map(k => (
                    <button
                      key={k}
                      onClick={() => setDocRetrievalK(k)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium border ${
                        docRetrievalK === k
                          ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                          : 'bg-[#F7F7F8] text-[#555555] border-[#E5E5E5]'
                      }`}
                    >
                      K = {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-6 shadow-2xs">
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Offline Dataset Resilience</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  Static NASA flight data fallbacks are active to ensure complete operation even during network interruptions.
                </p>
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-[8px] text-xs text-emerald-800 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>42 Verified Experiments & 28 NASA Technical Documents cached in local bundle.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Local Cache</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  Clear stored query sessions and UI preference cache.
                </p>
                <div className="mt-3">
                  <button
                    onClick={handleClearCache}
                    className="btn-secondary"
                  >
                    {cacheCleared ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Cache Cleared</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear Local Storage Cache</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-4 shadow-2xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-[6px] bg-[#0D0D0D] flex items-center justify-center text-white font-bold text-xs">
                  <span className="text-[#B86B39]">F</span>L
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0D0D0D]">FlameLens AI</h3>
                  <p className="text-[11px] text-[#8F8F8F]">Version 1.4.2 • Scientific Intelligence</p>
                </div>
              </div>

              <p className="text-xs text-[#2D2D2D] leading-relaxed">
                FlameLens AI was developed for the NASA Space Apps Challenge 2026, addressing Challenge 08: Flame in Freefall. The system bridges NASA microgravity combustion physics, empirical droplet kinetic regression ($d^2$-law), and spacecraft habitat fire safety intelligence.
              </p>

              <div className="pt-2 text-xs space-y-2 border-t border-[#E5E5E5]">
                <div className="text-[#8F8F8F]">Primary Scientific Data Sources:</div>
                <ul className="list-disc pl-4 space-y-1 text-[#2D2D2D]">
                  <li>NASA Glenn Research Center (GRC) Combustion Science Branch</li>
                  <li>NASA Physical Sciences Informatics (PSI) System</li>
                  <li>NASA Technical Reports Server (NTRS)</li>
                  <li>Flame Extinction Experiment (FLEX & FLEX-2, ISS CIR)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
