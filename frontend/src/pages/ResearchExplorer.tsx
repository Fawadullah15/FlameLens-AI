import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ExternalLink,
  ChevronRight,
  X,
  MessageSquare
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
          <h1 className="page-title">NASA Research Literature</h1>
          <p className="page-subtitle">
            Peer-reviewed papers and technical reports from NASA NTRS and Physical Sciences Informatics (PSI).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8F8F8F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" />
          <span>{papers.length} Documents Indexed</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F8F] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, authors, report numbers..."
            className="input-standard input-with-icon w-full pl-9"
          />
        </div>

        {/* Series Filter Pills */}
        <div className="inline-flex items-center p-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[9px] text-xs font-medium overflow-x-auto">
          {seriesOptions.map((series) => {
            const isSelected = (series === 'All' && !activeSeries) || activeSeries === series;
            return (
              <button
                key={series}
                onClick={() => setActiveSeries(series === 'All' ? '' : series)}
                className={`px-3 py-1 rounded-[6px] transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                    : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
                }`}
              >
                {series}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STANDARDIZED DATA TABLE ──────────────────────────────────────── */}
      <div className="table-shell shadow-2xs">
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
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="table-body-cell text-center py-12 text-xs text-[#8F8F8F]">
                    Loading research documents...
                  </td>
                </tr>
              ) : papers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-body-cell text-center py-12 text-xs text-[#8F8F8F]">
                    No research papers matched your search criteria.
                  </td>
                </tr>
              ) : (
                papers.map((doc) => (
                  <tr
                    key={doc.id || doc.doc_id}
                    onClick={() => setSelectedPaper(doc)}
                    className={`hover:bg-[#F9F9FA] cursor-pointer transition-colors ${
                      selectedPaper?.doc_id === doc.doc_id ? 'bg-[#F8F1EC]/40' : ''
                    }`}
                  >
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#B86B39] whitespace-nowrap">
                      {doc.doc_id}
                    </td>
                    <td className="table-body-cell">
                      <div className="font-medium text-[#0D0D0D] leading-snug line-clamp-2">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#8F8F8F] mt-0.5 truncate max-w-lg">
                        {doc.authors || 'NASA Glenn Research Center'} • {doc.publication_venue || 'Technical Memorandum'}
                      </div>
                    </td>
                    <td className="table-body-cell text-xs font-mono text-[#555555] whitespace-nowrap">
                      {doc.series_tags || 'CIR'}
                    </td>
                    <td className="table-body-cell text-xs text-[#6E6E6E] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#F7F7F8] border border-[#E5E5E5] text-[11px] whitespace-nowrap inline-block">
                        {doc.category || 'Combustion'}
                      </span>
                    </td>
                    <td className="table-body-cell font-mono text-xs text-[#555555] text-center whitespace-nowrap">
                      {doc.publication_year}
                    </td>
                    <td className="table-body-cell text-xs text-[#6E6E6E] whitespace-nowrap">
                      <span
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#F7F7F8] border border-[#E5E5E5] inline-block truncate max-w-[140px] align-middle"
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
                        className="inline-flex items-center space-x-1 text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white border border-[#E5E5E5] rounded-[12px] shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E5E5E5] bg-[#F7F7F8] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-[#B86B39]">
                    {selectedPaper.doc_id}
                  </span>
                  <span className="text-xs text-[#8F8F8F]">• {selectedPaper.publication_year}</span>
                  {selectedPaper.doi_or_report_num && (
                    <span className="font-mono text-[11px] text-[#6E6E6E]">
                      {selectedPaper.doi_or_report_num}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-[#0D0D0D] leading-snug">
                  {selectedPaper.title}
                </h2>
                <p className="text-xs text-[#6E6E6E]">
                  {selectedPaper.authors || 'NASA Research Group'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1 rounded text-[#8F8F8F] hover:text-[#0D0D0D] hover:bg-[#EAEAEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8F8F8F] tracking-wider mb-2">
                  Abstract & Key Findings
                </h4>
                <div className="p-4 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs leading-relaxed text-[#2D2D2D]">
                  {selectedPaper.abstract || 'Verified NASA technical investigation into droplet burning kinetics and flame extinction under microgravity conditions.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Institution</span>
                  <span className="font-medium text-[#0D0D0D] mt-0.5 block">
                    {selectedPaper.institution || 'NASA Glenn Research Center'}
                  </span>
                </div>
                <div className="p-3 border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Venue</span>
                  <span className="font-medium text-[#0D0D0D] mt-0.5 block">
                    {selectedPaper.publication_venue || 'Combustion and Flame / NASA TM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#E5E5E5] bg-[#F7F7F8] flex items-center justify-between">
              <button
                onClick={() => {
                  const title = selectedPaper.title;
                  setSelectedPaper(null);
                  navigate(`/copilot?q=${encodeURIComponent(`Explain key findings of the paper "${title}"`)}`);
                }}
                className="btn-primary"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Copilot About This Paper</span>
              </button>

              <div className="flex items-center space-x-2">
                {selectedPaper.url && (
                  <a
                    href={selectedPaper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <span>Open Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-3 py-1.5 text-xs text-[#6E6E6E] hover:text-[#0D0D0D]"
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
