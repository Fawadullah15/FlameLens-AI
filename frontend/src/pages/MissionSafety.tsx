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
  BookOpen
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
        setIncidents(res.incidents);
        if (res.incidents.length > 0 && !selectedIncident) {
          setSelectedIncident(res.incidents[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Fire Safety Intelligence</h1>
          <p className="page-subtitle">
            NASA-STD-6001B flammability assessments, spacecraft atmospheric risk metrics, and historical incident forensics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex items-center p-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[9px] text-xs font-medium">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'risk'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
            }`}
          >
            Flammability Assessment
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'incidents'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
            }`}
          >
            Historical Incidents
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'protocols'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
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
          <div className="p-4 bg-[#F8F1EC]/60 border border-[#EBDAD0] rounded-[10px] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#B86B39] uppercase tracking-wide">
                NASA Standard Flammability Risk Index Formulation
              </span>
              <span className="text-[11px] font-mono text-[#8F8F8F]">NASA-STD-6001B</span>
            </div>
            <div className="font-mono text-xs text-[#0D0D0D] bg-white p-2.5 rounded-[6px] border border-[#EBDAD0]">
              Score = 0.35 × (LOI Index) + 0.25 × (Thermal Severity) + 0.20 × (Soot Radiation) + 0.20 × (Extinction Resistance)
            </div>
            <p className="text-[11px] text-[#6E6E6E]">
              <strong className="text-[#0D0D0D]">Data Provenance:</strong> Flammability limits are derived from Glenn 2.2-Second Drop Tower and ISS CIR experiments; suppression resistance is analytically modeled.
            </p>
          </div>

          {/* Risk Rankings Table */}
          <div className="table-shell shadow-2xs">
            <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">
                  Spacecraft Fuel & Material Flammability Rankings
                </h3>
                <p className="text-xs text-[#6E6E6E]">
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
                <tbody>
                  {rankLoading ? (
                    <tr>
                      <td colSpan={6} className="table-body-cell text-center py-10 text-xs text-[#8F8F8F]">
                        Calculating flammability screening scores...
                      </td>
                    </tr>
                  ) : rankings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="table-body-cell text-center py-10 text-xs text-[#8F8F8F]">
                        No materials match the filter.
                      </td>
                    </tr>
                  ) : (
                    rankings.map((r, idx) => {
                      const isCrit = r.risk_level === 'CRITICAL';
                      const isHigh = r.risk_level === 'HIGH';
                      const isMed = r.risk_level === 'MEDIUM';

                      return (
                        <tr key={idx} className="hover:bg-[#F9F9FA]">
                          <td className="table-body-cell">
                            <div className="font-semibold text-[#0D0D0D]">{r.fuel_type}</div>
                            <div className="text-[11px] text-[#8F8F8F]">{r.fuel_category}</div>
                          </td>
                          <td className="table-body-cell font-mono text-xs font-semibold text-[#0D0D0D]">
                            {r.risk_score ? r.risk_score.toFixed(1) : '—'} / 100
                          </td>
                          <td className="table-body-cell">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                isCrit
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : isHigh
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : isMed
                                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {r.risk_level}
                            </span>
                          </td>
                          <td className="table-body-cell font-mono text-xs text-[#555555]">
                            {r.limiting_oxygen_index_percent ? `${r.limiting_oxygen_index_percent.toFixed(1)}%` : '15.2%'}
                          </td>
                          <td className="table-body-cell text-xs text-[#6E6E6E]">
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
                              className="text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39]"
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
            <span className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide block mb-1">
              Historical Spaceflight Fire Incidents
            </span>
            {incidents.map((inc) => (
              <button
                key={inc.id || inc.incident_id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full text-left p-3.5 rounded-[9px] border transition-colors ${
                  selectedIncident?.incident_id === inc.incident_id
                    ? 'bg-white border-[#0D0D0D] shadow-2xs'
                    : 'bg-white border-[#E5E5E5] hover:border-[#D4D4D4] text-[#6E6E6E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#B86B39]">
                    {inc.incident_id}
                  </span>
                  <span className="text-[11px] text-[#8F8F8F] font-mono">{inc.year}</span>
                </div>
                <div className="font-semibold text-xs text-[#0D0D0D] mt-1">
                  {inc.title}
                </div>
                <div className="text-[11px] text-[#8F8F8F] mt-0.5 truncate">
                  Mission: {inc.mission_spacecraft}
                </div>
              </button>
            ))}
          </div>

          {/* Incident Detail View */}
          {selectedIncident && (
            <div className="md:col-span-2 p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-5 shadow-2xs">
              <div className="border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-[#B86B39]">
                    {selectedIncident.incident_id}
                  </span>
                  <span className="text-xs text-[#8F8F8F]">• {selectedIncident.year}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#F7F7F8] border border-[#E5E5E5] font-mono text-[#555555]">
                    {selectedIncident.mission_spacecraft}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#0D0D0D] mt-1">
                  {selectedIncident.title}
                </h3>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8F8F8F] tracking-wider mb-1.5">
                  Chronology & Description
                </h4>
                <p className="text-xs text-[#2D2D2D] leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8F8F8F] tracking-wider mb-1.5">
                  Physical Mechanism & Atmosphere
                </h4>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs font-mono text-[#0D0D0D]">
                  Atmosphere: {selectedIncident.atmosphere_context || '100% O2 @ 16.7 psia'} • Cause: {selectedIncident.primary_cause || 'Electrical spark & flammable materials'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8F8F8F] tracking-wider mb-1.5">
                  Safety Lessons & Engineering Directives
                </h4>
                <p className="text-xs text-[#2D2D2D] leading-relaxed">
                  {selectedIncident.safety_lessons}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    navigate(
                      `/copilot?q=${encodeURIComponent(
                        `Detailed forensic analysis of the ${selectedIncident.title} (${selectedIncident.year}) and modern spacecraft fire protection standards`
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
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Microgravity Fire Suppression Challenges
            </h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              Standard terrestrial fire extinguishers rely on buoyant thermal drafts to pull suppressant vapor into the flame base. In microgravity:
            </p>
            <ul className="text-xs text-[#2D2D2D] space-y-1.5 list-disc pl-4">
              <li>No buoyancy creates stagnant diffusion zones where flames smolder quietly.</li>
              <li>Carbon dioxide (CO₂) fire extinguishers must be injected directly with localized forced convection.</li>
              <li>Cabin ventilation must be immediately shut down to prevent feeding oxygen to the combustion site.</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-3 shadow-2xs">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Smoke Detection Latency
            </h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              Without thermal buoyancy, smoke particles do not rise to ceiling-mounted optical detectors. Detection depends entirely on cabin ventilation duct sensors.
            </p>
            <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs font-mono text-[#0D0D0D]">
              Peclet Number: Pe = (u × d) / α &gt;&gt; 1 required for forced transport to optical smoke obscuration sensors.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
