import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Globe,
  FlaskConical,
  BookOpen,
  Flame,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { Experiment, ResearchDocument, HistoricalIncident } from '../types';
import { STATIC_EXPERIMENTS, STATIC_DOCUMENTS, STATIC_INCIDENTS } from '../data/staticData';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const tabParam = searchParams.get('tab') || 'all';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<'all' | 'experiments' | 'papers' | 'fuels' | 'incidents'>(tabParam as any);
  const [loading, setLoading] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [papers, setPapers] = useState<ResearchDocument[]>([]);
  const [incidents, setIncidents] = useState<HistoricalIncident[]>([]);
  const [selectedGravity, setSelectedGravity] = useState<'all' | '0' | '1'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchInput(queryParam);
    fetchResults(queryParam);
  }, [queryParam]);

  const fetchResults = async (q: string) => {
    setLoading(true);
    const lower = q.toLowerCase().trim();

    try {
      // 1. Fetch matching experiments
      const expRes = await api.getExperiments({ search: q, limit: 50 }).catch(() => ({ experiments: [] }));
      let matchedExp = expRes.experiments || [];
      if (!q) {
        matchedExp = STATIC_EXPERIMENTS as Experiment[];
      }
      setExperiments(matchedExp);

      // 2. Fetch matching papers
      const paperRes = await api.getPapers({ search: q, limit: 50 }).catch(() => ({ papers: [] }));
      let matchedPapers = paperRes.papers || [];
      if (!q) {
        matchedPapers = STATIC_DOCUMENTS as ResearchDocument[];
      }
      setPapers(matchedPapers);

      // 3. Fetch matching incidents
      let matchedIncidents = STATIC_INCIDENTS as HistoricalIncident[];
      if (lower) {
        matchedIncidents = matchedIncidents.filter(
          i =>
            (i.mission_name && i.mission_name.toLowerCase().includes(lower)) ||
            (i.summary && i.summary.toLowerCase().includes(lower)) ||
            (i.spacecraft && i.spacecraft.toLowerCase().includes(lower)) ||
            (i.fire_environment && i.fire_environment.toLowerCase().includes(lower)) ||
            (i.incident_id && i.incident_id.toLowerCase().includes(lower))
        );
      }
      setIncidents(matchedIncidents);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), tab: activeTab });
    }
  };

  const handleTabChange = (tab: 'all' | 'experiments' | 'papers' | 'fuels' | 'incidents') => {
    setActiveTab(tab);
    setSearchParams({ q: queryParam, tab });
  };

  const filteredExperiments = experiments.filter(e => {
    if (selectedGravity === '0') return e.gravity_level === 0;
    if (selectedGravity === '1') return e.gravity_level === 1;
    return true;
  });

  const totalResults = experiments.length + papers.length + incidents.length;

  return (
    <div className="min-h-screen bg-[#02050C] text-white">
      {/* ── TOP SEARCH HEADER BAR ────────────────────────────────────────── */}
      <div className="border-b border-[rgba(120,165,255,0.18)] bg-[#07111F]/90 backdrop-blur-xl sticky top-14 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78869C]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search NASA research, fuels, burning rates, flight records..."
              className="w-full pl-11 pr-24 py-2.5 rounded-full bg-[rgba(16,27,48,0.85)] border border-[rgba(120,165,255,0.25)] text-sm text-white placeholder:text-[#78869C] focus:outline-none focus:border-[#2F82FF] focus:shadow-[0_0_15px_rgba(47,130,255,0.4)] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#1769FF] hover:bg-[#2F82FF] text-xs font-medium text-white transition-all shadow-[0_0_10px_rgba(47,130,255,0.5)]"
            >
              Search
            </button>
          </form>

          {/* AI Copilot Ask Button */}
          {queryParam && (
            <Link
              to={`/copilot?q=${encodeURIComponent(queryParam)}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1769FF]/15 hover:bg-[#1769FF]/25 border border-[rgba(120,165,255,0.3)] text-xs font-medium text-[#69B7FF] hover:text-white transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2F82FF]" />
              <span>Ask AI Copilot about this</span>
            </Link>
          )}
        </div>

        {/* Category Tabs */}
        <div className="max-w-6xl mx-auto mt-3 flex items-center space-x-1 sm:space-x-3 overflow-x-auto text-xs font-medium border-t border-[rgba(120,165,255,0.12)] pt-2.5">
          {[
            { id: 'all', label: 'All Results', count: totalResults },
            { id: 'experiments', label: 'Flight Experiments', count: experiments.length },
            { id: 'papers', label: 'Technical Papers', count: papers.length },
            { id: 'incidents', label: 'Safety Incidents', count: incidents.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#1769FF]/20 text-[#69B7FF] font-semibold border border-[rgba(120,165,255,0.3)] shadow-[0_0_10px_rgba(47,130,255,0.25)]'
                  : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] text-[#78869C] bg-white/5 px-1.5 py-0.2 rounded">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN RESULTS CONTAINER ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Results Metadata & Gravity Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#AAB6CA]">
          <div>
            {queryParam ? (
              <span>
                Found <strong className="text-white font-mono">{totalResults}</strong> NASA records for "
                <span className="text-[#69B7FF]">{queryParam}</span>"
              </span>
            ) : (
              <span>Showing all NASA microgravity flight datasets and technical papers</span>
            )}
          </div>

          {/* Quick Gravity Filter Pills */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#78869C] mr-1">Gravity:</span>
            {[
              { id: 'all', label: 'All' },
              { id: '0', label: '0-g Microgravity' },
              { id: '1', label: '1-g Earth' },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGravity(g.id as any)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGravity === g.id
                    ? 'bg-[#1769FF] text-white font-semibold shadow-[0_0_8px_rgba(47,130,255,0.5)]'
                    : 'bg-[#101B30] text-[#AAB6CA] hover:text-white border border-[rgba(120,165,255,0.15)]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#AAB6CA]">
            <Loader2 className="w-8 h-8 text-[#2F82FF] animate-spin" />
            <span className="text-sm">Querying NASA Physical Sciences Informatics (PSI) Engine...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && totalResults === 0 && (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#101B30] border border-[rgba(120,165,255,0.2)] flex items-center justify-center mx-auto text-[#78869C]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No exact matching records found</h3>
            <p className="text-xs text-[#AAB6CA] leading-relaxed">
              Try searching broader combustion terms like "heptane", "methanol", "FLEX", "d2-law", or ask the AI Scientific Copilot.
            </p>
            <div className="pt-2">
              <Link
                to="/copilot"
                className="btn-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ask AI Copilot
              </Link>
            </div>
          </div>
        )}

        {/* ── EXPERIMENTS SECTION ────────────────────────────────────────── */}
        {!loading && (activeTab === 'all' || activeTab === 'experiments') && filteredExperiments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(120,165,255,0.18)] pb-2">
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-[#2F82FF]" />
                <h2 className="text-base font-semibold text-white">Verified Flight Experiments ({filteredExperiments.length})</h2>
              </div>
              <Link to="/experiments" className="text-xs text-[#69B7FF] hover:underline flex items-center space-x-1">
                <span>Repository View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredExperiments.slice(0, activeTab === 'all' ? 6 : 50).map((exp) => (
                <div
                  key={exp.experiment_id}
                  className="p-4 rounded-xl bg-[#07111F]/80 border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_18px_rgba(47,130,255,0.25)] transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-semibold text-[#69B7FF]">
                          {exp.experiment_id}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#AAB6CA]">
                          {exp.series}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${exp.gravity_level === 0 ? 'bg-[#1769FF]/20 text-[#69B7FF] border border-[#2F82FF]/40' : 'bg-slate-800 text-slate-300'}`}>
                          {exp.gravity_level === 0 ? '0-g Microgravity' : '1.0-g Earth'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#69B7FF] transition-colors mt-1">
                        {exp.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#AAB6CA] line-clamp-2 mt-2 leading-relaxed">
                    {exp.key_finding || 'Microgravity droplet combustion test investigating flame standoff and radiative soot behavior.'}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3 font-mono text-[11px]">
                      <span>Fuel: <strong className="text-white">{exp.fuel_type}</strong></span>
                      {exp.burning_rate_constant_k && (
                        <span>K: <strong className="text-[#38BDF8]">{exp.burning_rate_constant_k.toFixed(3)} mm²/s</strong></span>
                      )}
                    </div>
                    <Link
                      to={`/combustion?experimentId=${exp.experiment_id}`}
                      className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF] flex items-center space-x-1"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TECHNICAL PAPERS SECTION ───────────────────────────────────── */}
        {!loading && (activeTab === 'all' || activeTab === 'papers') && papers.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-[rgba(120,165,255,0.18)] pb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#2F82FF]" />
                <h2 className="text-base font-semibold text-white">NASA Technical Literature ({papers.length})</h2>
              </div>
              <Link to="/library" className="text-xs text-[#69B7FF] hover:underline flex items-center space-x-1">
                <span>Library View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {papers.slice(0, activeTab === 'all' ? 4 : 50).map((paper) => (
                <div
                  key={paper.doc_id}
                  className="p-4 rounded-xl bg-[#07111F]/80 border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_18px_rgba(47,130,255,0.25)] transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2 text-[11px] text-[#AAB6CA] mb-1">
                        <span className="font-mono text-[#69B7FF]">{paper.doc_id}</span>
                        <span>•</span>
                        <span>{paper.institution || 'NASA GRC'}</span>
                        <span>•</span>
                        <span>{paper.publication_year || 2024}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#69B7FF] transition-colors">
                        {paper.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#AAB6CA] line-clamp-2 mt-2 leading-relaxed">
                    {paper.abstract}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs text-[#78869C]">
                    <span className="truncate max-w-md">Authors: {paper.authors}</span>
                    <Link
                      to={`/library?doc=${paper.doc_id}`}
                      className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF] flex items-center space-x-1"
                    >
                      <span>Read Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SAFETY INCIDENTS SECTION ───────────────────────────────────── */}
        {!loading && (activeTab === 'all' || activeTab === 'incidents') && incidents.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-[rgba(120,165,255,0.18)] pb-2">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                <h2 className="text-base font-semibold text-white">Historical Spacecraft Fire Incidents ({incidents.length})</h2>
              </div>
              <Link to="/safety?tab=incidents" className="text-xs text-[#69B7FF] hover:underline flex items-center space-x-1">
                <span>All Incident Dossiers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {incidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.incident_id}
                  className="p-4 rounded-xl bg-[#07111F]/80 border border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_18px_rgba(239,68,68,0.25)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-red-400">
                      {inc.mission_name} ({inc.date ? inc.date.slice(0, 4) : ''})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/30 text-red-300 border border-red-700/40">
                      {inc.category || 'Mishap Archive'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1.5">{inc.spacecraft || inc.mission_name}</h3>
                  <p className="text-xs text-[#AAB6CA] mt-2 line-clamp-2 leading-relaxed">
                    {inc.summary}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs">
                    <span className="text-[#78869C]">{inc.location}</span>
                    <Link
                      to="/safety?tab=incidents"
                      className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center space-x-1"
                    >
                      <span>Read Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
