import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Database, Search, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#07111F] border border-[rgba(120,165,255,0.3)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(120,165,255,0.18)] bg-[#101B30]/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#1769FF]/20 text-[#69B7FF] border border-[rgba(120,165,255,0.3)]">
                NASA DATA PROVENANCE
              </span>
              <span className="text-xs text-[#AAB6CA]">{sources.length} Verified Repositories</span>
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight mt-1">
              Connected Scientific Repositories & Flight Portals
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-[rgba(120,165,255,0.14)] bg-[#0C182B]/60 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78869C]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by NASA center, repo, program..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#101B30] border border-[rgba(120,165,255,0.22)] rounded-lg text-white placeholder:text-[#78869C] focus:outline-none focus:border-[#2F82FF]"
            />
          </div>
          <div className="flex items-center space-x-2 text-xs text-[#AAB6CA]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>Open Access NASA Archives</span>
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#AAB6CA]">
              Querying data provenance registries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#78869C]">
              No matching repositories found.
            </div>
          ) : (
            filtered.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#07111F] border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_15px_rgba(47,130,255,0.2)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-[#2F82FF] shrink-0" />
                    <span className="font-semibold text-sm text-white">{s.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#AAB6CA]">
                      {s.repository}
                    </span>
                  </div>
                  <p className="text-xs text-[#AAB6CA] max-w-2xl leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-[#78869C] pt-1">
                    <span>Org: <strong className="text-white">{s.organization}</strong></span>
                    <span>Format: <strong className="text-white">{s.format || 'FTS5 / JSON / CSV'}</strong></span>
                  </div>
                </div>

                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#1769FF]/15 hover:bg-[#1769FF]/25 border border-[rgba(120,165,255,0.25)] text-xs font-medium text-[#69B7FF] hover:text-white transition-all shrink-0"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
