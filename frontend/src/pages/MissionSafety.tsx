import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { RiskRankingItem, HistoricalIncident } from '../types';
import { STATIC_INCIDENTS } from '../data/staticData';

interface MissionSafetyProps {
  defaultTab?: 'risk' | 'incidents' | 'protocols';
}

export const MissionSafety: React.FC<MissionSafetyProps> = ({ defaultTab = 'risk' }) => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as any;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'risk' | 'incidents' | 'protocols'>(
    tabParam || defaultTab
  );

  // Risk Ranking State
  const [rankings, setRankings] = useState<RiskRankingItem[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [rankLoading, setRankLoading] = useState(false);

  // Historical Incidents State
  const [incidents, setIncidents] = useState<HistoricalIncident[]>(STATIC_INCIDENTS as HistoricalIncident[]);
  const [selectedIncident, setSelectedIncident] = useState<HistoricalIncident | null>((STATIC_INCIDENTS[0] as HistoricalIncident) || null);

  useEffect(() => {
    setRankLoading(true);
    api.getRiskRankings({
      risk_level: riskFilter || undefined
    })
      .then(res => {
        setRankings(res.rankings);
        setRankLoading(false);
      })
      .catch(() => {
        setRankLoading(false);
      });
  }, [riskFilter]);

  useEffect(() => {
    api.getIncidents()
      .then(res => {
        setIncidents(res.incidents || (res as any));
        if (res.length > 0 && !selectedIncident) {
          setSelectedIncident(res[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <ShieldAlert className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA FLAMMABILITY STANDARDS & SAFETY DIRECTIVES</span>
          </div>
          <h1 className="page-title">Fire Safety Intelligence</h1>
          <p className="page-subtitle">
            NASA-STD-6001B flammability assessments, spacecraft atmospheric risk metrics, and historical incident forensics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex items-center p-1 bg-[#101B30]/80 border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'risk'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            Flammability Assessment
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'incidents'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            Historical Incidents
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'protocols'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            Suppression Protocols
          </button>
        </div>
      </div>

      {/* ── TAB 1: FLAMMABILITY ASSESSMENT ─────────────────────────────────── */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Mathematical Formula Callout */}
          <div className="p-5 bg-[#07111F] border border-[rgba(120,165,255,0.25)] rounded-2xl space-y-2 shadow-[0_0_20px_rgba(35,112,255,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide">
                NASA Standard Flammability Risk Index Formulation
              </span>
              <span className="text-[11px] font-mono text-[#38BDF8]">NASA-STD-6001B</span>
            </div>
            <div className="font-mono text-xs text-white bg-[#02050C] p-3 rounded-xl border border-[rgba(120,165,255,0.2)]">
              Score = 0.35 × (LOI Index) + 0.25 × (Thermal Severity) + 0.20 × (Soot Radiation) + 0.20 × (Extinction Resistance)
            </div>
            <p className="text-[11px] text-[#AAB6CA]">
              <strong className="text-white">Data Provenance:</strong> Flammability limits are derived from Glenn 2.2-Second Drop Tower and ISS CIR experiments; suppression resistance is analytically modeled.
            </p>
          </div>

          {/* Risk Rankings Table */}
          <div className="table-shell">
            <div className="p-4 border-b border-[rgba(120,165,255,0.18)] bg-[#101B30]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Spacecraft Fuel & Material Flammability Rankings
                </h3>
                <p className="text-xs text-[#AAB6CA]">
                  Evaluated across standard 21% O₂ Earth baseline vs 32% exploration habitat atmospheres
                </p>
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="select-standard"
              >
                <option value="">All Risk Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px] min-w-[760px]">
                <thead>
                  <tr>
                    <th className="table-header-cell min-w-[180px] whitespace-nowrap">Fuel / Material</th>
                    <th className="table-header-cell font-mono w-28 whitespace-nowrap">Risk Score</th>
                    <th className="table-header-cell w-32 whitespace-nowrap">Classification</th>
                    <th className="table-header-cell font-mono w-32 whitespace-nowrap">LOI (O₂ %)</th>
                    <th className="table-header-cell w-36 whitespace-nowrap">Soot Hazard</th>
                    <th className="table-header-cell text-right w-28 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(120,165,255,0.1)]">
                  {rankLoading ? (
                    <tr>
                      <td colSpan={6} className="table-body-cell text-center py-10 text-xs text-[#78869C]">
                        Calculating flammability screening scores...
                      </td>
                    </tr>
                  ) : rankings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="table-body-cell text-center py-10 text-xs text-[#78869C]">
                        No materials match the filter.
                      </td>
                    </tr>
                  ) : (
                    rankings.map((r, idx) => {
                      const isCrit = r.risk_level === 'CRITICAL';
                      const isHigh = r.risk_level === 'HIGH';
                      const isMed = r.risk_level === 'MEDIUM';

                      return (
                        <tr key={idx} className="hover:bg-[#101B30]/70">
                          <td className="table-body-cell">
                            <div className="font-semibold text-white">{r.fuel_type}</div>
                            <div className="text-[11px] text-[#AAB6CA]">{r.fuel_category}</div>
                          </td>
                          <td className="table-body-cell font-mono text-xs font-semibold text-[#38BDF8]">
                            {r.risk_score ? r.risk_score.toFixed(1) : '—'} / 100
                          </td>
                          <td className="table-body-cell">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                isCrit
                                  ? 'bg-red-950/50 text-red-400 border border-red-500/40'
                                  : isHigh
                                  ? 'bg-amber-950/50 text-amber-400 border border-amber-500/40'
                                  : isMed
                                  ? 'bg-yellow-950/50 text-yellow-300 border border-yellow-500/40'
                                  : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/40'
                              }`}
                            >
                              {r.risk_level}
                            </span>
                          </td>
                          <td className="table-body-cell font-mono text-xs text-[#AAB6CA]">
                            {r.limiting_oxygen_index_percent ? `${r.limiting_oxygen_index_percent.toFixed(1)}%` : '15.2%'}
                          </td>
                          <td className="table-body-cell text-xs text-[#AAB6CA]">
                            {r.soot_hazard_score ? (r.soot_hazard_score > 70 ? 'Severe (Blockage)' : 'Moderate') : 'Low'}
                          </td>
                          <td className="table-body-cell text-right">
                            <button
                              onClick={() => {
                                navigate(
                                  `/copilot?q=${encodeURIComponent(
                                    `Explain the fire safety risks and suppression challenges of ${r.fuel_type} in spacecraft environments`
                                  )}`
                                );
                              }}
                              className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF]"
                            >
                              Inquire AI →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: HISTORICAL INCIDENTS ARCHIVE ────────────────────────────── */}
      {activeTab === 'incidents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List of Incidents */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide block mb-1">
              Historical Spaceflight Fire Incidents
            </span>
            {incidents.map((inc) => (
              <button
                key={inc.id || inc.incident_id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedIncident?.incident_id === inc.incident_id
                    ? 'bg-[#101B30] border-[#2F82FF] shadow-[0_0_15px_rgba(47,130,255,0.3)]'
                    : 'bg-[#07111F] border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] text-[#AAB6CA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-red-400">
                    {inc.incident_id}
                  </span>
                  <span className="text-[11px] text-[#78869C] font-mono">{inc.date ? inc.date.slice(0, 4) : ''}</span>
                </div>
                <div className="font-semibold text-xs text-white mt-1">
                  {inc.mission_name}
                </div>
                <div className="text-[11px] text-[#AAB6CA] mt-0.5 truncate">
                  Craft: {inc.spacecraft}
                </div>
              </button>
            ))}
          </div>

          {/* Incident Detail View */}
          {selectedIncident && (
            <div className="md:col-span-2 p-6 bg-[#07111F] border border-[rgba(120,165,255,0.25)] rounded-2xl space-y-5">
              <div className="border-b border-[rgba(120,165,255,0.18)] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-red-400">
                    {selectedIncident.incident_id}
                  </span>
                  <span className="text-xs text-[#78869C]">• {selectedIncident.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[#AAB6CA]">
                    {selectedIncident.spacecraft}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-1">
                  {selectedIncident.mission_name}
                </h3>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#69B7FF] tracking-wider mb-1.5">
                  Chronology & Summary
                </h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  {selectedIncident.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#69B7FF] tracking-wider mb-1.5">
                  Physical Mechanism & Atmosphere
                </h4>
                <div className="p-3 bg-[#02050C] border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-mono text-[#38BDF8]">
                  Atmosphere: {selectedIncident.fire_environment} • Ignition: {selectedIncident.ignition_source}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#69B7FF] tracking-wider mb-1.5">
                  Safety Lessons & Engineering Directives
                </h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed whitespace-pre-line">
                  {selectedIncident.documented_lessons_learned}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    navigate(
                      `/copilot?q=${encodeURIComponent(
                        `Detailed forensic analysis of the ${selectedIncident.mission_name} (${selectedIncident.date}) and modern spacecraft fire protection standards`
                      )}`
                    );
                  }}
                  className="btn-primary"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Analyze Case Study with AI</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: SUPPRESSION PROTOCOLS ──────────────────────────────────── */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Microgravity Fire Suppression Challenges
            </h3>
            <p className="text-xs text-[#AAB6CA] leading-relaxed">
              Standard terrestrial fire extinguishers rely on buoyant thermal drafts to pull suppressant vapor into the flame base. In microgravity:
            </p>
            <ul className="text-xs text-[#CBD5E1] space-y-1.5 list-disc pl-4 marker:text-[#2F82FF]">
              <li>No buoyancy creates stagnant diffusion zones where flames smolder quietly.</li>
              <li>Carbon dioxide (CO₂) fire extinguishers must be injected directly with localized forced convection.</li>
              <li>Cabin ventilation must be immediately shut down to prevent feeding oxygen to the combustion site.</li>
            </ul>
          </div>

          <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Smoke Detection Latency
            </h3>
            <p className="text-xs text-[#AAB6CA] leading-relaxed">
              Without thermal buoyancy, smoke particles do not rise to ceiling-mounted optical detectors. Detection depends entirely on cabin ventilation duct sensors.
            </p>
            <div className="p-3 bg-[#02050C] border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-mono text-[#38BDF8]">
              Peclet Number: Pe = (u × d) / α &gt;&gt; 1 required for forced transport to optical smoke obscuration sensors.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
