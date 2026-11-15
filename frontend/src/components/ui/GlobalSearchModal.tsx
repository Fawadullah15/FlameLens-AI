import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FlaskConical, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border border-[#E5E5E5] rounded-[12px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E5E5E5] bg-white">
          <Search className="w-4 h-4 text-[#8A8A8A] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, experiments, fuels (e.g. Heptane, FLEX, d²-law)..."
            className="flex-1 bg-transparent border-none text-[14px] text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#8A8A8A] animate-spin shrink-0 mx-2" />}
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#8A8A8A] hover:text-[#272727] hover:bg-[#F0F0F0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-[#8A8A8A]">
              Type at least 2 characters to search across NASA documents and experiments.
            </div>
          ) : papers.length === 0 && experiments.length === 0 && !loading ? (
            <div className="py-8 text-center text-xs text-[#8A8A8A]">
              No documents or experiments found for "{query}".
            </div>
          ) : (
            <>
              {/* Experiments */}
              {experiments.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                    <span>Experiments</span>
                    <span className="font-mono text-[10px]">{experiments.length} matches</span>
                  </div>
                  <div className="space-y-1">
                    {experiments.map((exp) => (
                      <button
                        key={exp.id || exp.experiment_id}
                        onClick={() => {
                          onClose();
                          navigate(`/combustion?experimentId=${exp.experiment_id}`);
                        }}
                        className="w-full text-left p-2.5 rounded-[8px] hover:bg-[#F7F7F8] border border-transparent hover:border-[#E5E5E5] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <FlaskConical className="w-4 h-4 text-[#B86B39] shrink-0" />
                          <div className="truncate">
                            <span className="font-mono text-xs font-semibold text-[#272727] mr-2">
                              {exp.experiment_id}
                            </span>
                            <span className="text-xs text-[#6B6B6B]">
                              {exp.title || `${exp.fuel_type} combustion in ${exp.gravity_level === 0 ? 'microgravity' : 'normal gravity'}`}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#CCCCCC] group-hover:text-[#272727] shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Papers */}
              {papers.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                    <span>Research Documents</span>
                    <span className="font-mono text-[10px]">{papers.length} matches</span>
                  </div>
                  <div className="space-y-1">
                    {papers.map((doc) => (
                      <button
                        key={doc.id || doc.doc_id}
                        onClick={() => {
                          onClose();
                          navigate(`/library?doc=${doc.doc_id}`);
                        }}
                        className="w-full text-left p-2.5 rounded-[8px] hover:bg-[#F7F7F8] border border-transparent hover:border-[#E5E5E5] transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <BookOpen className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-medium text-[#272727] truncate">
                              {doc.title}
                            </div>
                            <div className="text-[11px] text-[#8A8A8A] truncate mt-0.5">
                              {doc.publication_venue || doc.institution || 'NASA Glenn Research Center'} • {doc.publication_year}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#CCCCCC] group-hover:text-[#272727] shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#E5E5E5] bg-[#F7F7F8] flex items-center justify-between text-[11px] text-[#8A8A8A]">
          <span>Navigate with <kbd className="px-1 border border-[#E5E5E5] rounded bg-white">↑</kbd> <kbd className="px-1 border border-[#E5E5E5] rounded bg-white">↓</kbd></span>
          <span>Press <kbd className="px-1 border border-[#E5E5E5] rounded bg-white">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
