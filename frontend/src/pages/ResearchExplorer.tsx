import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Database,
  Building,
  Tag,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchDocument, LibraryTaxonomy } from '../types';
import { STATIC_DOCUMENTS } from '../data/staticData';

export const ResearchExplorer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('doc');

  const [papers, setPapers] = useState<ResearchDocument[]>(STATIC_DOCUMENTS as ResearchDocument[]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchDocument | null>((STATIC_DOCUMENTS[0] as ResearchDocument) || null);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [taxonomy, setTaxonomy] = useState<LibraryTaxonomy | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [activeSeries, setActiveSeries] = useState<string>('');

  useEffect(() => {
    api.getLibraryTaxonomy()
      .then(res => setTaxonomy(res))
      .catch(err => console.error('Failed to load taxonomy:', err));
  }, []);

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
          if (initialDocId) {
            const match = res.papers.find(p => p.doc_id === initialDocId);
            if (match) {
              loadPaperDetail(match.doc_id);
            } else {
              loadPaperDetail(res.papers[0].doc_id);
            }
          } else if (!selectedPaper) {
            loadPaperDetail(res.papers[0].doc_id);
          }
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
  }, [selectedCategory, selectedInstitution, activeSeries, searchQuery, initialDocId]);

  const loadPaperDetail = async (docId: string) => {
    setDetailLoading(true);
    try {
      const res = await api.getPaperDetail(docId);
      setSelectedPaper(res.document);
      setSelectedDetail(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              NASA REPOSITORY EXPLORER
            </span>
            <span className="text-xs font-mono text-slate-400">
              NTRS • PSI • GLENN RESEARCH CENTER • PEER-REVIEWED ARCHIVES
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Research Literature & Dataset Explorer
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-0.5">
            Full-text searchable scientific corpus indexed via SQLite FTS5 BM25 with verified source URLs, DOI metadata, and experimental run links.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-[#0E1821] border border-[#1E3442]">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{papers.length} DOCUMENTS INDEXED</span>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-3">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#0A1118] border border-[#1E3442]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by keyword (e.g. 'cool flames', 'soot radiation', 'droplet extinction', 'oxygen limits')..."
            className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>TOPIC:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0A1118] border border-[#1E3442] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Research Topics</option>
            {taxonomy?.categories.map(c => (
              <option key={c.category} value={c.category}>{c.category} ({c.count})</option>
            ))}
          </select>

          <span className="text-[#1E3442]">|</span>

          <span className="text-slate-400">INSTITUTION:</span>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="bg-[#0A1118] border border-[#1E3442] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Institutions</option>
            {taxonomy?.institutions.map(i => (
              <option key={i.institution} value={i.institution}>{i.institution} ({i.count})</option>
            ))}
          </select>

          <span className="text-[#1E3442]">|</span>

          <span className="text-slate-400">SERIES:</span>
          <select
            value={activeSeries}
            onChange={(e) => setActiveSeries(e.target.value)}
            className="bg-[#0A1118] border border-[#1E3442] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Mission Series</option>
            <option value="FLEX">FLEX</option>
            <option value="FLEX-2">FLEX-2</option>
            <option value="ACME">ACME</option>
            <option value="CFI">CFI</option>
          </select>
        </div>
      </div>

      {/* ── Main Split View ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Papers List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-cyan-400">
              SEARCHING NASA RESEARCH INDEX...
            </div>
          ) : papers.length === 0 ? (
            <div className="py-20 text-center font-mono text-xs text-slate-500">
              No scientific papers matched your query.
            </div>
          ) : (
            papers.map(p => (
              <div
                key={p.doc_id}
                onClick={() => loadPaperDetail(p.doc_id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedPaper?.doc_id === p.doc_id
                    ? 'bg-[#13212C] border-cyan-400 shadow-glow-cyan'
                    : 'bg-[#0E1821] border-[#1E3442] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                    {p.doc_id}
                  </span>
                  <span className="text-slate-400">{p.publication_year || 'NASA Archive'}</span>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                  {p.title}
                </h4>

                {p.abstract && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.abstract}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1E3442]/50">
                  <span className="truncate max-w-[200px]">{p.authors || p.institution}</span>
                  <span className="text-cyan-400 flex items-center space-x-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Selected Paper Detail Card */}
        <div className="lg:col-span-7">
          {detailLoading ? (
            <div className="h-96 flex items-center justify-center font-mono text-xs text-cyan-400 bg-[#0E1821] border border-[#1E3442] rounded-xl">
              RETRIEVING COMPLETE PAPER RECORD...
            </div>
          ) : selectedPaper ? (
            <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-5">
              {/* Paper Header */}
              <div className="space-y-2 border-b border-[#1E3442] pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {selectedPaper.doc_id}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PEER-REVIEWED
                    </span>
                  </div>

                  {selectedPaper.url && (
                    <a
                      href={selectedPaper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#13212C] hover:bg-space-750 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Original NASA Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <h2 className="text-lg font-display font-bold text-white tracking-tight leading-snug">
                  {selectedPaper.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
                  <span>AUTHORS: {selectedPaper.authors || 'NASA Research Team'}</span>
                  <span>•</span>
                  <span>YEAR: {selectedPaper.publication_year}</span>
                  {selectedPaper.doi_or_report_num && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-300 font-semibold">REPORT: {selectedPaper.doi_or_report_num}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  SCIENTIFIC ABSTRACT
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0A1118] p-4 rounded-lg border border-[#1E3442]">
                  {selectedPaper.abstract || 'Scientific abstract pending digitization from primary NASA archive.'}
                </p>
              </div>

              {/* Structured Sections (Methodology, Observations, Conclusions) */}
              {selectedPaper.structured_sections && selectedPaper.structured_sections.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    STRUCTURED SCIENTIFIC SECTIONS
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedPaper.structured_sections.map((sec, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-1">
                        <h5 className="text-xs font-bold text-cyan-300 font-mono uppercase">{sec.heading}</h5>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Experimental Flight Runs */}
              {selectedDetail?.linked_experiments && selectedDetail.linked_experiments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#1E3442]">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    LINKED FLIGHT EXPERIMENTAL RUNS ({selectedDetail.linked_experiments.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDetail.linked_experiments.map((exp: any) => (
                      <div key={exp.experiment_id} className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442] font-mono text-xs flex justify-between items-center">
                        <div>
                          <span className="text-cyan-400 font-bold block">{exp.experiment_id}</span>
                          <span className="text-[10px] text-slate-400">{exp.fuel_type}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{exp.mission_platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOI References */}
              {selectedPaper.doi_references && selectedPaper.doi_references.length > 0 && (
                <div className="pt-2 border-t border-[#1E3442] text-[10px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">CITED DOI REFERENCES:</span>
                  <div className="space-y-0.5">
                    {selectedPaper.doi_references.map((doi, idx) => (
                      <div key={idx} className="truncate text-slate-400">{doi}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 border border-[#1E3442] rounded-xl bg-[#0E1821]">
              Select a research paper from the index to view complete scientific metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
