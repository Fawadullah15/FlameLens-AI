import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Layers,
  FileText,
  ChevronRight,
  Building,
  Tag,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchDocument, LibraryTaxonomy } from '../types';

export const ResearchLibrary: React.FC = () => {
  const [papers, setPapers] = useState<ResearchDocument[]>([]);
  const [taxonomy, setTaxonomy] = useState<LibraryTaxonomy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [activeSeries, setActiveSeries] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchDocument | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load taxonomy categories on mount
  useEffect(() => {
    api.getLibraryTaxonomy()
      .then(res => setTaxonomy(res))
      .catch(err => console.error('Failed to load library taxonomy:', err));
  }, []);

  // Fetch papers when filters change
  useEffect(() => {
    setLoading(true);
    api.getPapers({
      category: selectedCategory || undefined,
      institution: selectedInstitution || undefined,
      series: activeSeries || undefined,
      search: searchQuery || undefined,
    })
      .then(res => {
        setPapers(res.papers);
        if (res.papers.length > 0) {
          loadPaperDetail(res.papers[0].doc_id);
        } else {
          setSelectedPaper(null);
          setSelectedDetail(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load library:', err);
        setLoading(false);
      });
  }, [selectedCategory, selectedInstitution, activeSeries, searchQuery]);

  const loadPaperDetail = async (docId: string) => {
    try {
      const res = await api.getPaperDetail(docId);
      setSelectedPaper(res.document);
      setSelectedDetail(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
            NASA SCIENTIFIC LITERATURE REPOSITORY
          </span>
          <span className="text-xs font-mono text-slate-400">PEER-REVIEWED FLIGHT PAPERS, TM REPORTS & ARCHIVES</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          NASA Research Library
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Access indexed publications across NASA Physical Sciences Informatics (PSI), NASA Technical Reports Server (NTRS), NASA Safety Center, and Glenn Research Center.
        </p>
      </div>

      {/* Filter Bar: Categories, Institutions, Search */}
      <div className="p-4 rounded-xl bg-space-900 border border-space-700 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search papers, authors, DOI, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-space-950 border border-space-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['', 'FLEX', 'ACME', 'CFI', 'BASS', 'SoFIE'].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeries(s)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all border ${
                  activeSeries === s
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-glow-cyan'
                    : 'bg-space-950 text-slate-400 hover:text-slate-200 border-space-800'
                }`}
              >
                {s || 'All Missions'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        {taxonomy && taxonomy.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-space-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> CATEGORY:
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border ${
                selectedCategory === ''
                  ? 'bg-teal-950 text-teal-300 border-teal-700'
                  : 'bg-space-950/70 text-slate-400 hover:text-slate-200 border-space-800'
              }`}
            >
              All ({papers.length})
            </button>
            {taxonomy.categories.map((c) => (
              <button
                key={c.category}
                onClick={() => setSelectedCategory(c.category)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border ${
                  selectedCategory === c.category
                    ? 'bg-teal-950 text-teal-300 border-teal-700'
                    : 'bg-space-950/70 text-slate-400 hover:text-slate-200 border-space-800'
                }`}
              >
                {c.category} ({c.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column View: Paper List & Document Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Paper List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>PUBLICATIONS FOUND: {papers.length}</span>
            <span className="text-emerald-400">VERIFIED OFFICIAL</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {papers.map((p) => {
              const isSelected = selectedPaper?.doc_id === p.doc_id;
              return (
                <div
                  key={p.doc_id}
                  onClick={() => loadPaperDetail(p.doc_id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border space-y-2 ${
                    isSelected
                      ? 'bg-space-800/90 border-cyan-500 shadow-glow-cyan'
                      : 'bg-space-900/60 border-space-700 hover:border-space-600 hover:bg-space-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-400 font-bold">{p.doc_id}</span>
                    <span className="text-slate-400">{p.publication_year || 'NASA'}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    {p.authors || 'NASA Research Team'}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-slate-500 pt-1.5 border-t border-space-800">
                    <span className="px-1.5 py-0.5 rounded bg-space-950 text-slate-400 border border-space-800">
                      {p.institution || 'NASA'}
                    </span>
                    <span>{p.page_count} Pages</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Paper Full Preview */}
        <div className="lg:col-span-7">
          {selectedPaper ? (
            <div className="p-6 rounded-xl bg-space-900 border border-space-700 space-y-5">
              <div className="space-y-2 border-b border-space-700 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-space-700 font-semibold">
                    {selectedPaper.series_tags || selectedPaper.category || 'NASA CIR'}
                  </span>
                  <span className="text-slate-400">{selectedPaper.publication_venue}</span>
                  {selectedPaper.institution && (
                    <span className="text-teal-400 font-mono text-[11px]">
                      • {selectedPaper.institution}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {selectedPaper.title}
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  Authors: {selectedPaper.authors || 'NASA Mission Principal Investigators'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                  <span>DOI/Report: {selectedPaper.doi_or_report_num || 'NASA Open Access'}</span>
                  <span>•</span>
                  {(selectedPaper.original_url || selectedPaper.url) && (
                    <a
                      href={selectedPaper.original_url || selectedPaper.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Direct Official Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  PUBLICATION ABSTRACT
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-space-950 p-4 rounded-lg border border-space-800">
                  {selectedPaper.abstract || 'No abstract text available for this technical record.'}
                </p>
              </div>

              {/* Structured Sections if available */}
              {selectedDetail?.document?.structured_sections && selectedDetail.document.structured_sections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                    EXTRACTED STRUCTURED SECTIONS:
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedDetail.document.structured_sections.map((sec: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-space-950 border border-space-800 text-xs">
                        <span className="font-semibold text-indigo-300 block mb-1">{sec.heading}</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Flight Experiments */}
              {selectedDetail?.linked_experiments && selectedDetail.linked_experiments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">
                    LINKED FLIGHT EXPERIMENTS IN DATABASE:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedDetail.linked_experiments.map((exp: any) => (
                      <div key={exp.experiment_id} className="p-3 rounded-lg bg-space-950 border border-space-800 text-xs font-mono space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-300 font-bold">{exp.experiment_id}</span>
                          <span className="text-slate-500">{exp.gravity_level < 0.1 ? '0.0 g' : '1.0 g'}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] truncate">{exp.title}</p>
                        <p className="text-[10px] text-slate-500">Fuel: {exp.fuel_type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Text Snippet */}
              {selectedPaper.full_text && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    INDEXED TEXT CONTENT (FTS5 RETRIEVAL CHUNK)
                  </h4>
                  <pre className="text-[11px] font-mono text-slate-300 bg-space-950 p-4 rounded-lg border border-space-800 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedPaper.full_text}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500">
              Select a research publication from the left panel to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResearchLibrary;
