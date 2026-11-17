import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ExternalLink,
  ChevronRight,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchDocument, LibraryTaxonomy } from '../types';
import { STATIC_DOCUMENTS } from '../data/staticData';

export const ResearchExplorer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialDocId = searchParams.get('doc');

  const [papers, setPapers] = useState<ResearchDocument[]>(STATIC_DOCUMENTS as ResearchDocument[]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchDocument | null>(null);
  const [taxonomy, setTaxonomy] = useState<LibraryTaxonomy | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
      series: activeSeries || undefined,
      search: searchQuery || undefined,
    })
      .then(res => {
        setPapers(res.papers);
        if (initialDocId) {
          const match = res.papers.find(p => p.doc_id === initialDocId);
          if (match) setSelectedPaper(match);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load library:', err);
        setLoading(false);
      });
  }, [selectedCategory, activeSeries, searchQuery, initialDocId]);

  const seriesOptions = ['All', 'FLEX', 'ACME', 'BASS', 'CIR-MDCA'];

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <BookOpen className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA TECHNICAL REPORTS SERVER (NTRS) ARCHIVE</span>
          </div>
          <h1 className="page-title">NASA Research Literature</h1>
          <p className="page-subtitle">
            Peer-reviewed papers and technical reports from NASA NTRS and Physical Sciences Informatics (PSI).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#AAB6CA]">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
          <span>{papers.length} Documents Indexed</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78869C] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, authors, report numbers..."
            className="input-standard input-with-icon w-full pl-10"
          />
        </div>

        {/* Series Filter Pills */}
        <div className="inline-flex items-center p-1 bg-[#101B30]/80 border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-medium overflow-x-auto">
          {seriesOptions.map((series) => {
            const isSelected = (series === 'All' && !activeSeries) || activeSeries === series;
            return (
              <button
                key={series}
                onClick={() => setActiveSeries(series === 'All' ? '' : series)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1769FF] text-white shadow-[0_0_8px_rgba(47,130,255,0.5)] font-semibold'
                    : 'text-[#AAB6CA] hover:text-white'
                }`}
              >
                {series}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STANDARDIZED DATA TABLE ──────────────────────────────────────── */}
      <div className="table-shell">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr>
                <th className="table-header-cell font-mono w-32 whitespace-nowrap">Doc ID</th>
                <th className="table-header-cell min-w-[280px]">Title & Authors</th>
                <th className="table-header-cell w-28 whitespace-nowrap">Series</th>
                <th className="table-header-cell w-40 whitespace-nowrap">Category</th>
                <th className="table-header-cell font-mono w-16 text-center whitespace-nowrap">Year</th>
                <th className="table-header-cell w-36 whitespace-nowrap">Source</th>
                <th className="table-header-cell text-right w-24 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(120,165,255,0.1)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="table-body-cell text-center py-12 text-xs text-[#78869C]">
                    Loading research documents...
                  </td>
                </tr>
              ) : papers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-body-cell text-center py-12 text-xs text-[#78869C]">
                    No research papers matched your search criteria.
                  </td>
                </tr>
              ) : (
                papers.map((doc) => (
                  <tr
                    key={doc.id || doc.doc_id}
                    onClick={() => setSelectedPaper(doc)}
                    className={`hover:bg-[#101B30]/70 cursor-pointer transition-colors ${
                      selectedPaper?.doc_id === doc.doc_id ? 'bg-[#1769FF]/15' : ''
                    }`}
                  >
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#69B7FF] whitespace-nowrap">
                      {doc.doc_id}
                    </td>
                    <td className="table-body-cell">
                      <div className="font-medium text-white leading-snug line-clamp-2">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#AAB6CA] mt-0.5 truncate max-w-lg">
                        {doc.authors || 'NASA Glenn Research Center'} • {doc.publication_venue || 'Technical Memorandum'}
                      </div>
                    </td>
                    <td className="table-body-cell text-xs font-mono text-[#AAB6CA] whitespace-nowrap">
                      {doc.series_tags || 'CIR'}
                    </td>
                    <td className="table-body-cell text-xs text-[#AAB6CA] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] whitespace-nowrap inline-block text-[#38BDF8]">
                        {doc.category || 'Combustion'}
                      </span>
                    </td>
                    <td className="table-body-cell font-mono text-xs text-[#AAB6CA] text-center whitespace-nowrap">
                      {doc.publication_year}
                    </td>
                    <td className="table-body-cell text-xs text-[#78869C] whitespace-nowrap">
                      <span
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 inline-block truncate max-w-[140px] align-middle"
                        title={doc.source_id}
                      >
                        {doc.source_id ? doc.source_id.replace(/^SRC-/, '') : 'NASA NTRS'}
                      </span>
                    </td>
                    <td className="table-body-cell text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPaper(doc);
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF] transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DETAIL MODAL ─────────────────────────────────────────────────── */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] bg-[#07111F] border border-[rgba(120,165,255,0.35)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[rgba(120,165,255,0.18)] bg-[#101B30]/60 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-[#69B7FF]">
                    {selectedPaper.doc_id}
                  </span>
                  <span className="text-xs text-[#78869C]">• {selectedPaper.publication_year}</span>
                  {selectedPaper.doi_or_report_num && (
                    <span className="font-mono text-[11px] text-[#AAB6CA]">
                      {selectedPaper.doi_or_report_num}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-white leading-snug">
                  {selectedPaper.title}
                </h2>
                <p className="text-xs text-[#AAB6CA]">
                  {selectedPaper.authors || 'NASA Research Group'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1.5 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide mb-1.5">
                  Abstract
                </h3>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  {selectedPaper.abstract || 'Document abstract extracted from NASA NTRS full-text repository.'}
                </p>
              </div>

              {selectedPaper.key_findings && selectedPaper.key_findings.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide mb-1.5">
                    Key Scientific Findings
                  </h3>
                  <ul className="text-xs text-[#CBD5E1] space-y-1 list-disc pl-4 marker:text-[#2F82FF]">
                    {selectedPaper.key_findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[rgba(120,165,255,0.18)] bg-[#0C182B] flex items-center justify-between">
              <button
                onClick={() => {
                  const title = selectedPaper.title;
                  setSelectedPaper(null);
                  navigate(`/copilot?q=${encodeURIComponent(`Summarize and analyze the research findings of "${title}"`)}`);
                }}
                className="btn-primary"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discuss Paper with Copilot</span>
              </button>

              <div className="flex items-center space-x-2">
                {selectedPaper.url && (
                  <a
                    href={selectedPaper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <span>Open in NTRS</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-3 py-1.5 text-xs text-[#AAB6CA] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
