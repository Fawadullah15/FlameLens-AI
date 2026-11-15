import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ExternalLink,
  ChevronRight,
  X,
  MessageSquare,
  FileText,
  Filter,
  CheckCircle2
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
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [taxonomy, setTaxonomy] = useState<LibraryTaxonomy | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

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
          if (match) loadPaperDetail(match.doc_id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load library:', err);
        setLoading(false);
      });
  }, [selectedCategory, activeSeries, searchQuery, initialDocId]);

  const loadPaperDetail = async (docId: string) => {
    const paper = papers.find(p => p.doc_id === docId) || (STATIC_DOCUMENTS.find(p => p.doc_id === docId) as ResearchDocument);
    if (paper) setSelectedPaper(paper);

    setDetailLoading(true);
    try {
      const detail = await api.getPaperDetail(docId);
      setSelectedDetail(detail);
    } catch {
      setSelectedDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const seriesOptions = ['All', 'FLEX', 'ACME', 'BASS', 'CIR-MDCA'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#272727] tracking-tight">
            NASA Research Literature
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B6B6B] mt-0.5">
            Peer-reviewed papers and technical reports from NASA NTRS and Physical Sciences Informatics (PSI).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8A8A]">
          <span className="w-2 h-2 rounded-full bg-[#10A37F]" />
          <span>{papers.length} Documents Indexed</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by title, author, keyword, or report number..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-[8px] text-[13px] text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#242424]"
          />
        </div>

        {/* Series Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {seriesOptions.map((series) => {
            const isSelected = (series === 'All' && !activeSeries) || activeSeries === series;
            return (
              <button
                key={series}
                onClick={() => setActiveSeries(series === 'All' ? '' : series)}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#242424] text-white'
                    : 'bg-[#F7F7F8] text-[#555555] hover:bg-[#EAEAEA] hover:text-[#272727] border border-[#E5E5E5]'
                }`}
              >
                {series}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PAPERS TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E5E5] rounded-[10px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#E5E5E5] text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-mono">Doc ID</th>
                <th className="py-2.5 px-4">Title & Publication</th>
                <th className="py-2.5 px-4">Investigation</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 font-mono">Year</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8A8A8A]">
                    Loading research documents...
                  </td>
                </tr>
              ) : papers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8A8A8A]">
                    No research papers matched your search criteria.
                  </td>
                </tr>
              ) : (
                papers.map((doc) => (
                  <tr
                    key={doc.id || doc.doc_id}
                    onClick={() => loadPaperDetail(doc.doc_id)}
                    className={`hover:bg-[#F9F9FA] cursor-pointer transition-colors ${
                      selectedPaper?.doc_id === doc.doc_id ? 'bg-[#F8F1EC]/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-[#B86B39]">
                      {doc.doc_id}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-medium text-[#272727] leading-snug">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#8A8A8A] mt-0.5 truncate">
                        {doc.authors || 'NASA Glenn Research Center'} • {doc.publication_venue || 'Technical Memorandum'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-[#555555]">
                      {doc.series_tags || 'CIR'}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B6B6B]">
                      <span className="px-2 py-0.5 rounded bg-[#F7F7F8] border border-[#E5E5E5] text-[11px]">
                        {doc.category || 'Combustion'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#555555]">
                      {doc.publication_year}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8A8A8A]">
                      {doc.source_id || 'NTRS'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPaperDetail(doc.doc_id);
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-medium text-[#272727] hover:text-[#B86B39]"
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

      {/* ── DETAIL SLIDE-OVER MODAL / SHEET ──────────────────────────────── */}
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
                  <span className="text-xs text-[#8A8A8A]">• {selectedPaper.publication_year}</span>
                  {selectedPaper.doi_or_report_num && (
                    <span className="font-mono text-[11px] text-[#6B6B6B]">
                      {selectedPaper.doi_or_report_num}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-[#272727] leading-snug">
                  {selectedPaper.title}
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  {selectedPaper.authors || 'NASA Research Group'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1 rounded text-[#8A8A8A] hover:text-[#272727] hover:bg-[#EAEAEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8A8A8A] tracking-wider mb-2">
                  Abstract & Key Findings
                </h4>
                <div className="p-4 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs leading-relaxed text-[#333333]">
                  {selectedPaper.abstract || 'Verified NASA technical investigation into droplet burning kinetics and flame extinction under microgravity conditions.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Institution</span>
                  <span className="font-medium text-[#272727] mt-0.5 block">
                    {selectedPaper.institution || 'NASA Glenn Research Center'}
                  </span>
                </div>
                <div className="p-3 border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Venue</span>
                  <span className="font-medium text-[#272727] mt-0.5 block">
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
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#242424] text-white hover:bg-[#383838] rounded-[6px] text-xs font-medium transition-colors"
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
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#E5E5E5] hover:bg-[#EAEAEA] text-[#272727] rounded-[6px] text-xs font-medium transition-colors"
                  >
                    <span>Open NASA Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-3 py-1.5 text-xs text-[#6B6B6B] hover:text-[#272727]"
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
