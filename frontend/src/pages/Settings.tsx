import React, { useState } from 'react';
import {
  ShieldCheck,
  Moon,
  Check,
  RotateCcw,
  Key,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  Sliders,
  Database,
  Info
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'data' | 'about'>('general');
  const [temperature, setTemperature] = useState(0.2);
  const [docRetrievalK, setDocRetrievalK] = useState(5);
  const [cacheCleared, setCacheCleared] = useState(false);

  const [geminiKey, setGeminiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flamelens_gemini_api_key') || '';
    }
    return '';
  });
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [keyMessage, setKeyMessage] = useState<string>('');

  const handleTestKey = async () => {
    if (!geminiKey.trim()) return;
    setKeyStatus('testing');
    setKeyMessage('');
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
        }
      );
      if (res.ok) {
        setKeyStatus('valid');
        setKeyMessage('Gemini 2.5 Flash API connection verified successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('flamelens_gemini_api_key', geminiKey.trim());
        }
      } else {
        setKeyStatus('invalid');
        const errData = await res.json().catch(() => ({}));
        setKeyMessage(errData.error?.message || `HTTP ${res.status}: Invalid API Key`);
      }
    } catch (err: any) {
      setKeyStatus('invalid');
      setKeyMessage(err.message || 'Network connection failed');
    }
  };

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flamelens_gemini_api_key', geminiKey.trim());
      setKeyStatus('valid');
      setKeyMessage('API Key saved to browser local storage.');
      setTimeout(() => setKeyMessage(''), 3000);
    }
  };

  const handleClearKey = () => {
    setGeminiKey('');
    setKeyStatus('idle');
    setKeyMessage('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flamelens_gemini_api_key');
    }
  };

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
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <Sliders className="w-4 h-4 text-[#2F82FF]" />
            <span>PLATFORM CONFIGURATION & PREFERENCES</span>
          </div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">
            Configure AI reasoning parameters, Gemini API keys, data caching, and visual modes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          {[
            { id: 'general', label: 'General & Appearance', icon: Moon },
            { id: 'ai', label: 'AI Engine & Gemini API', icon: Sparkles },
            { id: 'data', label: 'Data Provenance & Cache', icon: Database },
            { id: 'about', label: 'About FlameLens', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2.5 ${
                  isSelected
                    ? 'bg-[#1769FF] text-white font-semibold shadow-[0_0_12px_rgba(47,130,255,0.5)]'
                    : 'text-[#AAB6CA] hover:text-white hover:bg-white/5 bg-[#07111F]/60 border border-[rgba(120,165,255,0.12)]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#69B7FF]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Appearance & Visual System</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  FlameLens uses the cinematic deep-space NASA Search aesthetic.
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="p-3 bg-[#101B30] border-2 border-[#2F82FF] rounded-xl text-xs font-medium text-white flex items-center space-x-2 shadow-[0_0_15px_rgba(47,130,255,0.3)]">
                    <Moon className="w-4 h-4 text-[#69B7FF]" />
                    <span>NASA Deep Space Experience (Active)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(120,165,255,0.14)]">
                <h3 className="text-sm font-semibold text-white">Research Team</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  QuantumX — NASA Space Apps Challenge 2026, Challenge 08: Flame in Freefall.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-6">
              {/* Gemini API Key Section */}
              <div>
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-[#2F82FF]" />
                  <h3 className="text-sm font-semibold text-white">Google Gemini API Key (Direct Browser Inference)</h3>
                </div>
                <p className="text-xs text-[#AAB6CA] mt-1">
                  Connect your Google Gemini API key to enable live, real-time Gemini 2.5 Flash research reasoning directly from your browser.
                  Stored strictly in your local browser sandbox—never committed, logged, or sent to third-party servers.
                </p>

                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => {
                        setGeminiKey(e.target.value);
                        setKeyStatus('idle');
                      }}
                      placeholder="AIzaSy..."
                      className="input-standard w-full pr-20 font-mono text-xs"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="p-1 text-[#78869C] hover:text-white transition-colors"
                        title={showKey ? 'Hide key' : 'Show key'}
                      >
                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestKey}
                      disabled={keyStatus === 'testing' || !geminiKey.trim()}
                      className="btn-primary text-xs"
                    >
                      {keyStatus === 'testing' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing Connection...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Test & Save</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveKey}
                      disabled={!geminiKey.trim()}
                      className="btn-secondary text-xs"
                    >
                      <span>Save Key</span>
                    </button>

                    {geminiKey && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="btn-secondary text-xs text-red-400 hover:text-red-300"
                      >
                        <span>Remove Key</span>
                      </button>
                    )}
                  </div>

                  {keyStatus === 'valid' && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{keyMessage || 'Gemini 2.5 Flash connected and active.'}</span>
                    </div>
                  )}

                  {keyStatus === 'invalid' && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{keyMessage || 'Validation failed. Check your API key.'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(120,165,255,0.14)]">
                <h3 className="text-sm font-semibold text-white">Temperature / Determinism</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  Lower temperature enforces strict scientific fidelity and factual adherence to NASA flight records.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#78869C]">Factual (0.0)</span>
                    <span className="text-[#38BDF8] font-semibold">{temperature.toFixed(2)}</span>
                    <span className="text-[#78869C]">Creative (1.0)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#2F82FF]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(120,165,255,0.14)]">
                <h3 className="text-sm font-semibold text-white">RAG Retrieval Chunk Count (K)</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  Number of verified research documents retrieved per query.
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  {[3, 5, 8].map(k => (
                    <button
                      key={k}
                      onClick={() => setDocRetrievalK(k)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${
                        docRetrievalK === k
                          ? 'bg-[#1769FF] text-white border-[#2F82FF] shadow-[0_0_8px_rgba(47,130,255,0.5)]'
                          : 'bg-[#101B30]/70 text-[#AAB6CA] border-[rgba(120,165,255,0.18)]'
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
            <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Offline Dataset Resilience</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  Static NASA flight data fallbacks are active to ensure complete operation even during network interruptions.
                </p>
                <div className="mt-3 p-3.5 bg-[#101B30] border border-[rgba(120,165,255,0.2)] rounded-xl text-xs text-[#38BDF8] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span>42 Verified Experiments & 28 NASA Technical Documents cached in local bundle.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(120,165,255,0.14)]">
                <h3 className="text-sm font-semibold text-white">Local Cache</h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  Clear stored query sessions and UI preference cache.
                </p>
                <div className="mt-3">
                  <button
                    onClick={handleClearCache}
                    className="btn-secondary"
                  >
                    {cacheCleared ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Cache Cleared</span>
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
            <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.png"
                  alt="FlameLens Emblem"
                  className="w-10 h-10 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(47,130,255,0.7)]"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">FlameLens AI</h3>
                  <p className="text-[11px] text-[#AAB6CA]">Version 2.0 • NASA Search Experience</p>
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                FlameLens AI was developed for the NASA Space Apps Challenge 2026, addressing Challenge 08: Flame in Freefall. The system bridges NASA microgravity combustion physics, empirical droplet kinetic regression ($d^2$-law), and spacecraft habitat fire safety intelligence.
              </p>

              <div className="pt-3 text-xs space-y-2 border-t border-[rgba(120,165,255,0.14)]">
                <div className="text-[#69B7FF] font-semibold">Primary Scientific Data Sources:</div>
                <ul className="list-disc pl-4 space-y-1 text-[#AAB6CA] marker:text-[#2F82FF]">
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
