import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Flame, ArrowRight, Loader2, Database } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0E1821] border border-[#1E3442] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1E3442] bg-[#0A1118]">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NASA research, fuels (heptane, methanol), D² kinetics, or flight runs..."
            className="w-full bg-transparent text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-2" />}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center space-y-2">
              <Database className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-mono text-slate-400">
                Type keywords like <span className="text-cyan-400">"spherical flame"</span>, <span className="text-cyan-400">"heptane"</span>, <span className="text-cyan-400">"soot"</span>, or <span className="text-cyan-400">"FLEX-001"</span>
              </p>
            </div>
          )}

          {query && !loading && papers.length === 0 && experiments.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No matching NASA research papers or flight runs found for "{query}".
            </div>
          )}

          {/* Experiments Section */}
          {experiments.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-cyan-400" />
                <span>FLIGHT EXPERIMENT RUNS ({experiments.length})</span>
              </p>
              <div className="space-y-1.5">
                {experiments.map(exp => (
                  <button
                    key={exp.experiment_id}
                    onClick={() => {
                      onClose();
                      navigate(`/combustion?id=${exp.experiment_id}`);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0A1118] hover:bg-space-800 border border-[#1E3442] hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                          {exp.experiment_id}
                        </span>
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300">
                          {exp.title}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-3">
                        <span>FUEL: {exp.fuel_type}</span>
                        <span>•</span>
                        <span>PLATFORM: {exp.mission_platform}</span>
                        <span>•</span>
                        <span>G-LEVEL: {exp.gravity_level === 0 ? '10⁻⁶ g (µg)' : '1-g'}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Research Papers Section */}
          {papers.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-teal-400" />
                <span>RESEARCH PAPERS & NASA DOCUMENTS ({papers.length})</span>
              </p>
              <div className="space-y-1.5">
                {papers.map(doc => (
                  <button
                    key={doc.doc_id}
                    onClick={() => {
                      onClose();
                      navigate(`/library?doc=${doc.doc_id}`);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0A1118] hover:bg-space-800 border border-[#1E3442] hover:border-teal-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-teal-400 px-1.5 py-0.2 rounded bg-teal-950 border border-teal-800">
                          {doc.doc_id}
                        </span>
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-teal-300 line-clamp-1">
                          {doc.title}
                        </span>
                      </div>
                      {doc.abstract && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {doc.abstract}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#1E3442] bg-[#0A1118] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>PRESS ESC TO CLOSE</span>
          <span>POWERED BY NASA FTS5 RETRIEVAL ENGINE</span>
        </div>
      </div>
    </div>
  );
};
