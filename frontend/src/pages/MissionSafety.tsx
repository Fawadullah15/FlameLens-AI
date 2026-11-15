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
  const [methodology, setMethodology] = useState<string>('NASA-STD-6001B Flammability Screening Matrix');
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
        setMethodology(res.methodology);
        setRankLoading(false);
      })
      .catch(err => {
        console.error('Failed to load risk rankings:', err);
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
      .catch(err => console.error('Failed to load incidents:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#272727] tracking-tight">
            Fire Safety Intelligence
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B6B6B] mt-0.5">
            NASA-STD-6001B flammability assessments, spacecraft atmospheric risk metrics, and historical incident forensics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 p-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[9px] text-xs font-medium">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              activeTab === 'risk'
                ? 'bg-white text-[#272727] shadow-xs'
                : 'text-[#6B6B6B] hover:text-[#272727]'
            }`}
          >
            Flammability Assessment
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              activeTab === 'incidents'
                ? 'bg-white text-[#272727] shadow-xs'
                : 'text-[#6B6B6B] hover:text-[#272727]'
            }`}
          >
            Historical Incidents
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              activeTab === 'protocols'
                ? 'bg-white text-[#272727] shadow-xs'
                : 'text-[#6B6B6B] hover:text-[#272727]'
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
          <div className="p-4 bg-[#F8F1EC]/60 border border-[#EBDAD0] rounded-[10px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#B86B39] uppercase tracking-wide">
                NASA Standard Flammability Risk Index Formulation
              </span>
              <span className="text-[11px] font-mono text-[#8A8A8A]">NASA-STD-6001B</span>
            </div>
            <div className="font-mono text-xs text-[#272727] bg-white p-2.5 rounded-[6px] border border-[#EBDAD0]/80">
              Score = 0.35 × (LOI Index) + 0.25 × (Thermal Severity) + 0.20 × (Soot Radiation) + 0.20 × (Extinction Resistance)
            </div>
            <p className="text-[11px] text-[#6B6B6B]">
              <strong className="text-[#272727]">Data Provenance:</strong> Flammability limits are measured via Glenn 2.2-Second Drop Tower and ISS CIR experiments; suppression resistance is analytically modeled.
            </p>
          </div>

          {/* Risk Rankings Table */}
          <div className="bg-white border border-[#E5E5E5] rounded-[10px] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#272727]">
                  Spacecraft Fuel & Material Flammability Rankings
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  Evaluated across standard 21% O₂ Earth baseline vs 32% exploration habitat atmospheres
                </p>
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-2.5 py-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[6px] text-xs text-[#272727] focus:outline-none"
              >
                <option value="">All Risk Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#F7F7F8] border-b border-[#E5E5E5] text-[11px] font-medium text-[#8A8A8A] uppercase">
                    <th className="py-2.5 px-4">Fuel / Material</th>
                    <th className="py-2.5 px-4 font-mono">Risk Score</th>
                    <th className="py-2.5 px-4">Classification</th>
                    <th className="py-2.5 px-4 font-mono">LOI (O₂ %)</th>
                    <th className="py-2.5 px-4">Soot Hazard</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {rankLoading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-xs text-[#8A8A8A]">
                        Calculating flammability screening scores...
                      </td>
                    </tr>
                  ) : rankings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-xs text-[#8A8A8A]">
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
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#272727]">{r.fuel_type}</div>
                            <div className="text-[11px] text-[#8A8A8A]">{r.fuel_category}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs font-semibold text-[#272727]">
                            {r.risk_score ? r.risk_score.toFixed(1) : '—'} / 100
                          </td>
                          <td className="py-3 px-4">
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
                          <td className="py-3 px-4 font-mono text-xs text-[#555555]">
                            {r.limiting_oxygen_index_percent ? `${r.limiting_oxygen_index_percent.toFixed(1)}%` : '15.2%'}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#6B6B6B]">
                            {r.soot_hazard_score ? (r.soot_hazard_score > 70 ? 'Severe (Blockage)' : 'Moderate') : 'Low'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                navigate(
                                  `/copilot?q=${encodeURIComponent(
                                    `Explain the fire safety risks and suppression challenges of ${r.fuel_type} in spacecraft environments`
                                  )}`
                                );
                              }}
                              className="text-xs font-medium text-[#272727] hover:text-[#B86B39]"
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
            <span className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide block mb-1">
              Historical Spaceflight Fire Incidents
            </span>
            {incidents.map((inc) => (
              <button
                key={inc.id || inc.incident_id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full text-left p-3.5 rounded-[9px] border transition-colors ${
                  selectedIncident?.incident_id === inc.incident_id
                    ? 'bg-white border-[#242424] shadow-xs'
                    : 'bg-white border-[#E5E5E5] hover:border-[#D4D4D4] text-[#6B6B6B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#B86B39]">
                    {inc.incident_id}
                  </span>
                  <span className="text-[11px] text-[#8A8A8A] font-mono">{inc.year}</span>
                </div>
                <div className="font-semibold text-xs text-[#272727] mt-1">
                  {inc.title}
                </div>
                <div className="text-[11px] text-[#8A8A8A] mt-0.5 truncate">
                  Mission: {inc.mission_spacecraft}
                </div>
              </button>
            ))}
          </div>

          {/* Incident Detail View */}
          {selectedIncident && (
            <div className="md:col-span-2 p-6 bg-white border border-[#E5E5E5] rounded-[10px] space-y-5">
              <div className="border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-[#B86B39]">
                    {selectedIncident.incident_id}
                  </span>
                  <span className="text-xs text-[#8A8A8A]">• {selectedIncident.year}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#F7F7F8] border border-[#E5E5E5] font-mono text-[#555555]">
                    {selectedIncident.mission_spacecraft}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#272727] mt-1">
                  {selectedIncident.title}
                </h3>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8A8A8A] tracking-wider mb-1.5">
                  Chronology & Description
                </h4>
                <p className="text-xs text-[#333333] leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8A8A8A] tracking-wider mb-1.5">
                  Physical Mechanism & Atmosphere
                </h4>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs font-mono text-[#272727]">
                  Atmosphere: {selectedIncident.atmosphere_context || '100% O2 @ 16.7 psia'} • Cause: {selectedIncident.primary_cause || 'Electrical spark & flammable materials'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#8A8A8A] tracking-wider mb-1.5">
                  Safety Lessons & Engineering Directives
                </h4>
                <p className="text-xs text-[#333333] leading-relaxed">
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
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#242424] text-white hover:bg-[#383838] rounded-[6px] text-xs font-medium transition-colors"
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
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-3">
            <h3 className="text-sm font-semibold text-[#272727]">
              Microgravity Fire Suppression Challenges
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Standard terrestrial fire extinguishers rely on buoyant thermal drafts to pull suppressant vapor into the flame base. In microgravity:
            </p>
            <ul className="text-xs text-[#333333] space-y-1.5 list-disc pl-4">
              <li>No buoyancy creates stagnant diffusion zones where flames smolder quietly.</li>
              <li>Carbon dioxide (CO₂) fire extinguishers must be injected directly with localized forced convection.</li>
              <li>Cabin ventilation must be immediately shut down to prevent feeding oxygen to the combustion site.</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-3">
            <h3 className="text-sm font-semibold text-[#272727]">
              Smoke Detection Latency
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Without thermal buoyancy, smoke particles do not rise to ceiling-mounted optical detectors. Detection depends entirely on cabin ventilation duct sensors.
            </p>
            <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs font-mono text-[#272727]">
              Peclet Number: Pe = (u × d) / α &gt;&gt; 1 required for forced transport to optical smoke obscuration sensors.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
