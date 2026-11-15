import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Info,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Wind,
  Layers,
  Thermometer,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { RiskRankingItem, HistoricalIncident } from '../types';
import { STATIC_INCIDENTS } from '../data/staticData';

const RISK_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-800' },
  HIGH: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-800' },
  MEDIUM: { bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-800' },
  LOW: { bg: 'bg-emerald-950/80', text: 'text-emerald-400', border: 'border-emerald-800' },
};

interface MissionSafetyProps {
  defaultTab?: 'risk' | 'sensors' | 'incidents' | 'protocols';
}

export const MissionSafety: React.FC<MissionSafetyProps> = ({ defaultTab = 'risk' }) => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as any;

  const [activeTab, setActiveTab] = useState<'risk' | 'sensors' | 'incidents' | 'protocols'>(
    tabParam || defaultTab
  );

  // Risk Ranking State
  const [rankings, setRankings] = useState<RiskRankingItem[]>([]);
  const [methodology, setMethodology] = useState<string>('NASA-STD-6001B Flammability Screening Matrix');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [fuelCatFilter, setFuelCatFilter] = useState<string>('');
  const [rankLoading, setRankLoading] = useState(false);

  // Historical Incidents State
  const [incidents, setIncidents] = useState<HistoricalIncident[]>(STATIC_INCIDENTS as HistoricalIncident[]);
  const [selectedIncident, setSelectedIncident] = useState<HistoricalIncident | null>((STATIC_INCIDENTS[0] as HistoricalIncident) || null);
  const [incidentLoading, setIncidentLoading] = useState(false);

  useEffect(() => {
    setRankLoading(true);
    api.getRiskRankings({
      risk_level: riskFilter || undefined,
      fuel_category: fuelCatFilter || undefined,
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
  }, [riskFilter, fuelCatFilter]);

  useEffect(() => {
    setIncidentLoading(true);
    api.getIncidents()
      .then(res => {
        setIncidents(res.incidents);
        if (res.incidents.length > 0 && !selectedIncident) {
          setSelectedIncident(res.incidents[0]);
        }
        setIncidentLoading(false);
      })
      .catch(err => {
        console.error('Failed to load incidents:', err);
        setIncidentLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header & Tab Controls ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono tracking-wider font-semibold">
              FIRE SAFETY PROTOCOL
            </span>
            <span className="text-xs font-mono text-slate-400">
              EVIDENCE-BASED RISK AUDIT • DETECTOR DYNAMICS • FLIGHT LESSONS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Mission Safety Intelligence
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-0.5">
            Empirical flammability rankings, detector latency physics in buoyancy-free cabins, and historical mishap investigations governing modern spaceflight.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#0A1118] border border-[#1E3442] rounded-xl font-mono text-xs">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'risk'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Material Risk Audit
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sensors'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sensor Evasion Physics
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'incidents'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Historical Mishaps (3)
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'protocols'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Suppression Protocols
          </button>
        </div>
      </div>

      {/* ── Mandatory Scientific Disclaimer ────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-[#0E1821] border border-cyan-800/60 flex items-start space-x-3 text-xs font-mono text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-cyan-300 block">
            SCIENTIFIC RESEARCH-SUPPORT DISCLAIMER:
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            FlameLens AI provides research intelligence derived from NASA publications and empirical databases. It is intended for comparative academic and mission planning research, not as a primary certified spacecraft life-safety system.
          </p>
        </div>
      </div>

      {/* ── TAB 1: MATERIAL RISK AUDIT ─────────────────────────────────────── */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-slate-400">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>FILTER RISK:</span>
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#0A1118] border border-[#1E3442] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">All Risk Tiers</option>
                <option value="CRITICAL">CRITICAL (&gt; 80)</option>
                <option value="HIGH">HIGH (65 - 80)</option>
                <option value="MEDIUM">MEDIUM (45 - 65)</option>
                <option value="LOW">LOW (&lt; 45)</option>
              </select>

              <span className="text-[#1E3442]">|</span>

              <span className="text-slate-400">MATERIAL CATEGORY:</span>
              <select
                value={fuelCatFilter}
                onChange={(e) => setFuelCatFilter(e.target.value)}
                className="bg-[#0A1118] border border-[#1E3442] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Alkanes">Alkanes</option>
                <option value="Alcohols">Alcohols</option>
                <option value="Polymers">Polymers</option>
                <option value="Aromatics">Aromatics</option>
              </select>
            </div>

            <div className="text-slate-400">
              Showing <span className="text-cyan-400 font-bold">{rankings.length}</span> ranked materials
            </div>
          </div>

          {/* Risk Rankings Table */}
          <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
              <h3 className="font-display font-semibold text-sm text-slate-100">
                Deterministic Fire Safety Risk Ranking
              </h3>
              <span className="text-xs font-mono text-slate-400">
                FORMULA: 0.35·F + 0.25·T + 0.20·S + 0.20·R
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1E3442] text-[10px] text-slate-400">
                    <th className="py-2.5 px-3">RANK</th>
                    <th className="py-2.5 px-3">EXP ID</th>
                    <th className="py-2.5 px-3">MATERIAL / FUEL</th>
                    <th className="py-2.5 px-3">CATEGORY</th>
                    <th className="py-2.5 px-3">ENVIRONMENT</th>
                    <th className="py-2.5 px-3">RISK SCORE</th>
                    <th className="py-2.5 px-3">TIER</th>
                    <th className="py-2.5 px-3">FLAMMABILITY</th>
                    <th className="py-2.5 px-3">SOOT HAZARD</th>
                    <th className="py-2.5 px-3">CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3442]/60 text-slate-300">
                  {rankings.map((item) => {
                    const badge = RISK_BADGES[item.risk_level] || RISK_BADGES.MEDIUM;
                    return (
                      <tr key={item.experiment_id} className="hover:bg-[#13212C]/40 transition-colors">
                        <td className="py-2.5 px-3 text-cyan-400 font-bold">#{item.rank}</td>
                        <td className="py-2.5 px-3 text-white font-semibold">{item.experiment_id}</td>
                        <td className="py-2.5 px-3">{item.fuel_type}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.fuel_category}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0A1118] border border-[#1E3442]">
                            {item.gravity_level === 0 ? '10⁻⁶ g (μg)' : '1.0 g'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold text-sm">
                          {item.risk_score.toFixed(1)}/100
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {item.risk_level}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{item.flammability_score.toFixed(0)}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.soot_hazard_score.toFixed(0)}</td>
                        <td className="py-2.5 px-3 text-emerald-400 text-[10px]">{item.confidence_level}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SENSOR EVASION PHYSICS ─────────────────────────────────── */}
      {activeTab === 'sensors' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#1E3442] pb-3">
              <Wind className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-semibold text-base text-slate-100">
                Microgravity Smoke Detector Latency & Evasion Dynamics
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard commercial and terrestrial fire detectors rely on buoyant convective plumes that rapidly funnel hot smoke particles to ceiling-mounted ionization or photoelectric sensors within seconds. In microgravity, the Grashof number drops to near zero (<span className="text-cyan-300 font-mono">Gr ≈ 0</span>). Thermal buoyancy ceases to exist.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-[#0A1118] border border-rose-800/50 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-400 block uppercase">
                  THE DETECTION HAZARD (WITHOUT CONVECTION)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                  <li>Flames smolder in spherical pockets with no upward smoke column.</li>
                  <li>Smoke particles diffuse slowly at molecular velocities (~millimeters per minute).</li>
                  <li>Traditional ceiling detectors experience severe delay or complete failure to alarm.</li>
                  <li>Combustion products remain trapped in local dead-air pockets until ventilation carries them.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#0A1118] border border-emerald-800/50 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
                  NASA ENGINEERING COUNTERMEASURES
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                  <li>Sensors must be situated directly in forced ventilation exhaust and return ducts.</li>
                  <li>Continuous optical obscuration and carbon monoxide (CO) laser gas analyzers.</li>
                  <li>Automated cabin ventilation shutdown protocols upon confirmed combustion alarm.</li>
                  <li>Cabin atmosphere decompression as an emergency extinction measure.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: HISTORICAL SPACECRAFT MISHAPS (APOLLO 1, 13, MIR) ──────── */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Methodological Isolation Notice */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-200/90">
              <span className="font-semibold text-amber-300 block mb-0.5">
                METHODOLOGICAL ISOLATION OF HISTORICAL DISASTERS:
              </span>
              In accordance with NASA Glenn and Space Apps standards, historical flight accidents (Apollo 1, Apollo 13, Mir 1997) are cataloged as operational safety dossiers. They are strictly isolated from controlled, microgravity combustion datasets (FLEX, ACME, CFI) to ensure mathematical and empirical integrity in flame kinetics equations.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-2">
              {incidents.map(inc => (
                <div
                  key={inc.incident_id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedIncident?.incident_id === inc.incident_id
                      ? 'bg-[#13212C] border-rose-500/70 shadow-glow-danger'
                      : 'bg-[#0E1821] border-[#1E3442] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800">
                      {inc.incident_id}
                    </span>
                    <span className="text-slate-400">{inc.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inc.mission_name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{inc.spacecraft} • {inc.location}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">{inc.summary}</p>
                </div>
              ))}
            </div>

            {/* Selected Incident Detail */}
            <div className="lg:col-span-7">
              {selectedIncident ? (
                <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
                  <div className="border-b border-[#1E3442] pb-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="text-rose-400 font-bold">{selectedIncident.incident_id}</span>
                      <span>{selectedIncident.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {selectedIncident.mission_name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {selectedIncident.spacecraft} — {selectedIncident.location}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <div>
                      <span className="font-mono text-cyan-400 font-bold block uppercase text-[10px]">
                        FIRE ENVIRONMENT & IGNITION TRIGGER:
                      </span>
                      <p className="mt-0.5 bg-[#0A1118] p-3 rounded-lg border border-[#1E3442]">
                        {selectedIncident.fire_environment} • {selectedIncident.ignition_source}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-amber-400 font-bold block uppercase text-[10px]">
                        MATERIALS INVOLVED & CONSEQUENCES:
                      </span>
                      <p className="mt-0.5 bg-[#0A1118] p-3 rounded-lg border border-[#1E3442]">
                        {selectedIncident.materials_involved} — {selectedIncident.consequences}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-emerald-400 font-bold block uppercase text-[10px]">
                        DOCUMENTED LESSONS LEARNED & MODERN DOCTRINE:
                      </span>
                      <p className="mt-0.5 bg-[#0A1118] p-3 rounded-lg border border-[#1E3442]">
                        {selectedIncident.documented_lessons_learned}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-cyan-300 font-bold block uppercase text-[10px]">
                        RELEVANCE TO MODERN EXPLORATION (ARTEMIS):
                      </span>
                      <p className="mt-0.5 bg-[#0A1118] p-3 rounded-lg border border-[#1E3442]">
                        {selectedIncident.relevance_to_modern_spacecraft}
                      </p>
                    </div>
                  </div>

                  {selectedIncident.nasa_reference_url && (
                    <div className="pt-2 border-t border-[#1E3442] flex justify-end">
                      <a
                        href={selectedIncident.nasa_reference_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <span>Official NASA Safety Archive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SUPPRESSION PROTOCOLS ──────────────────────────────────── */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#1E3442] pb-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-semibold text-base text-slate-100">
                Recommended Spacecraft Fire Suppression Protocols
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">
                  1. VENTILATION SHUTOFF
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon verified smoke or CO detection, forced air circulation must cease immediately. Without airflow, the flame's oxygen supply is limited to slow molecular diffusion, rapidly choking reaction intensity.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-2">
                <span className="text-xs font-mono font-bold text-teal-400 block uppercase">
                  2. FINE WATER MIST (PBW)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Portable Water Mist Extinguishers discharge micro-droplets (&lt; 50 μm). These rapidly flash into steam, absorbing massive latent heat while producing zero toxic chemical residues in closed cabin ECLSS loops.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
                  3. CABIN DEPRESSURIZATION
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For uncontained fires behind avionics racks or cargo bays, crew don emergency breathing masks while venting the affected module to the vacuum of space, extinguishing all flames within seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
