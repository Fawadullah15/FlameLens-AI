import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FlaskConical, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { ResearchDocument, Experiment } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<ResearchDocument[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setPapers([]);
      setExperiments([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setPapers([]);
      setExperiments([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [papersRes, expRes] = await Promise.all([
          api.searchLibrary(query).catch(() => ({ results: [] })),
          api.getExperiments({ search: query, limit: 6 }).catch(() => ({ experiments: [] }))
        ]);
        setPapers((papersRes.results || []).slice(0, 5));
        setExperiments(expRes.experiments || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#07111F] border border-[rgba(120,165,255,0.3)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[rgba(120,165,255,0.18)] bg-[#101B30]/70">
          <Search className="w-5 h-5 text-[#2F82FF] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, flight experiments, fuels (e.g. Heptane, FLEX, d²-law)..."
            className="flex-1 bg-transparent border-none text-[15px] text-white placeholder:text-[#78869C] focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#2F82FF] animate-spin shrink-0 mx-2" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Empty / Initial State */}
          {!query && (
            <div className="py-8 text-center text-xs text-[#78869C]">
              Type at least 2 characters to search across verified NASA flight datasets.
            </div>
          )}

          {/* Experiments Section */}
          {experiments.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#69B7FF]">
                Verified Experiments ({experiments.length})
              </div>
              {experiments.map((exp) => (
                <div
                  key={exp.experiment_id}
                  onClick={() => {
                    navigate(`/combustion?experimentId=${exp.experiment_id}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#101B30] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <FlaskConical className="w-4 h-4 text-[#2F82FF] shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white group-hover:text-[#69B7FF] truncate">
                        {exp.experiment_id}: {exp.fuel_type} ({exp.gravity_level === 0 ? '0g Microgravity' : '1g'})
                      </div>
                      <div className="text-[11px] text-[#AAB6CA] truncate">{exp.title}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1769FF]/20 text-[#69B7FF] border border-[#2F82FF]/30 shrink-0">
                    {exp.series}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Research Papers Section */}
          {papers.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#69B7FF]">
                NASA Technical Documents ({papers.length})
              </div>
              {papers.map((paper) => (
                <div
                  key={paper.doc_id}
                  onClick={() => {
                    navigate(`/library?doc=${paper.doc_id}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#101B30] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#2F82FF] shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white group-hover:text-[#69B7FF] truncate">
                        {paper.title}
                      </div>
                      <div className="text-[11px] text-[#AAB6CA] truncate">
                        {paper.institution || 'NASA GRC'} • {paper.authors}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#78869C] shrink-0">
                    {paper.publication_year || 2024}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Direct Search Option */}
          {query.trim().length >= 2 && (
            <div
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                onClose();
              }}
              className="p-3 rounded-xl bg-[#101B30]/50 hover:bg-[#1769FF]/20 border border-[rgba(120,165,255,0.2)] hover:border-[#2F82FF] cursor-pointer flex items-center justify-between text-xs text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-[#2F82FF]" />
                <span>Search all results for "<strong>{query}</strong>"</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#69B7FF]" />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[rgba(120,165,255,0.15)] bg-[#0C182B] flex items-center justify-between text-[11px] text-[#78869C]">
          <span>Tip: Press ESC to exit</span>
          <span className="text-[#69B7FF] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#2F82FF]" />
            <span>Search NASA Flight Telemetry</span>
          </span>
        </div>
      </div>
    </div>
  );
};
