import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Database, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Source } from '../../types';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getSources()
        .then(data => {
          setSources(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load sources:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = sources.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.organization.toLowerCase().includes(search.toLowerCase()) ||
    s.repository.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#0E1821] border border-[#1E3442] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3442] bg-[#0A1118]">
          <div className="flex items-center space-x-3">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Emblem"
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  NASA DATA PROVENANCE
                </span>
                <span className="text-xs font-mono text-slate-400">28 VERIFIED REPOSITORIES</span>
              </div>
              <h3 className="text-base font-semibold text-white tracking-wide mt-0.5">
                Connected Scientific Repositories & Data Portals
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-[#1E3442] bg-[#0A1118]/60 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter repositories by NASA center, acronym, or collection..."
            className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-cyan-400">
              RETRIEVING NASA SOURCE METADATA...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center font-mono text-xs text-slate-500">
              No repositories matched your search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(src => (
                <div
                  key={src.source_id}
                  className="p-4 rounded-lg bg-[#0A1118] border border-[#1E3442] hover:border-cyan-500/50 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                        {src.source_id}
                      </span>
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VERIFIED NASA</span>
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-100">{src.name}</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{src.organization}</p>
                    {src.description && (
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {src.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#1E3442]/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{src.repository}</span>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                      >
                        <span>Access Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Internal Archive</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1E3442] bg-[#0A1118] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>ALL REPOSITORIES DIRECTLY LINKED & VERIFIED BY NASA</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
