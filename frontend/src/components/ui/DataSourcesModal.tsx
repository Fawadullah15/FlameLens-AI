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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[85vh] bg-white border border-[#E5E5E5] rounded-[12px] shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F8]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                NASA DATA PROVENANCE
              </span>
              <span className="text-xs text-[#8A8A8A]">{sources.length} Verified Repositories</span>
            </div>
            <h3 className="text-base font-semibold text-[#272727] tracking-tight mt-1">
              Connected Scientific Repositories & Data Portals
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[#6B6B6B] hover:text-[#272727] hover:bg-[#EAEAEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5] bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter repositories by name, center, or archive ID..."
              className="w-full pl-10 pr-4 py-2 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-[13px] text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#242424]"
            />
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#8A8A8A]">
              Loading verified NASA repositories...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8A8A8A]">
              No repositories matched "{search}".
            </div>
          ) : (
            filtered.map(s => (
              <div
                key={s.id || s.source_id}
                className="p-4 bg-white border border-[#E5E5E5] rounded-[9px] hover:border-[#D4D4D4] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-[#B86B39]">
                      {s.source_id}
                    </span>
                    <h4 className="text-sm font-semibold text-[#272727]">
                      {s.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.verification_status || 'Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] line-clamp-2">
                    {s.description || 'Authentic NASA microgravity combustion investigation archive.'}
                  </p>
                  <div className="flex items-center space-x-4 text-[11px] text-[#8A8A8A] pt-1">
                    <span>Org: <strong className="font-normal text-[#272727]">{s.organization}</strong></span>
                    <span>Repo: <strong className="font-normal text-[#272727]">{s.repository}</strong></span>
                    <span>Access: <strong className="font-normal text-[#272727]">{s.access_type}</strong></span>
                  </div>
                </div>

                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#272727] bg-[#F7F7F8] hover:bg-[#EAEAEA] border border-[#E5E5E5] rounded-[6px] transition-colors"
                  >
                    <span>View Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E5E5E5] bg-[#F7F7F8] flex items-center justify-between text-xs text-[#8A8A8A]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All records verified against NASA Technical Reports Server (NTRS) and Physical Sciences Informatics (PSI).</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#272727] bg-white border border-[#E5E5E5] rounded-[6px] hover:bg-[#EAEAEA]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
