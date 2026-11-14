import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  Flame,
  Thermometer
} from 'lucide-react';
import { api } from '../services/api';
import { RiskRankingItem } from '../types';
import { Link } from 'react-router-dom';

const RISK_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800' },
  HIGH: { bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-800' },
  MEDIUM: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800' },
  LOW: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800' },
};

export const FireSafetyIntelligence: React.FC = () => {
  const [rankings, setRankings] = useState<RiskRankingItem[]>([]);
  const [methodology, setMethodology] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [fuelCatFilter, setFuelCatFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getRiskRankings({
      risk_level: riskFilter || undefined,
      fuel_category: fuelCatFilter || undefined,
    })
      .then(res => {
        setRankings(res.rankings);
        setMethodology(res.methodology);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load risk rankings:', err);
        setLoading(false);
      });
  }, [riskFilter, fuelCatFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono tracking-wider font-semibold">
            FIRE SAFETY PROTOCOL
          </span>
          <span className="text-xs font-mono text-slate-400">EVIDENCE-BASED RISK SCORING & SENSOR EVASION AUDIT</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-1">
          Fire Safety Intelligence & Material Ranking
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Rank materials, fuels, and operational atmospheric conditions according to empirical flammability limits, radiant heat output, soot accumulation, and suppression resistance.
        </p>
      </div>

      {/* Mandatory NASA Scientific Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-space-850 border border-cyan-800/60 flex items-start space-x-3 text-xs font-mono text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-cyan-300">
            TRANSPARENT RISK SCORING METHODOLOGY (NON-AI FORMULATION):
          </p>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {methodology || (
              "risk = (0.25 × Flammability + 0.20 × ThermalSeverity + 0.20 × BurningRate + 0.20 × SootHazard + 0.15 × SuppressionResistance) × 100."
            )}
          </p>
          <p className="text-[10px] text-amber-400 font-bold">
            IMPORTANT: All safety scores originate deterministically from peer-reviewed NASA data. AI generative models are NOT used to produce risk scores.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl nasa-card border border-space-700">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400">FILTERS:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL (&gt;75)</option>
            <option value="HIGH">HIGH (55–75)</option>
            <option value="MEDIUM">MEDIUM (35–55)</option>
            <option value="LOW">LOW (&lt;35)</option>
          </select>

          <select
            value={fuelCatFilter}
            onChange={(e) => setFuelCatFilter(e.target.value)}
            className="bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
          >
            <option value="">All Fuel Classes</option>
            <option value="Hydrocarbon Liquid">Hydrocarbon Liquid</option>
            <option value="Alcohol Liquid">Alcohol Liquid</option>
            <option value="Gaseous Hydrocarbon">Gaseous Hydrocarbon</option>
            <option value="Solid Polymer">Solid Polymer</option>
            <option value="Solid Fabric">Solid Fabric</option>
          </select>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-semibold">
          {rankings.length} RANKED RECORDS
        </span>
      </div>

      {/* Rankings Table */}
      <div className="p-5 rounded-xl nasa-card border border-space-700 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-space-700 text-slate-400">
              <th className="py-2.5 px-3">RANK</th>
              <th className="py-2.5 px-3">RUN ID</th>
              <th className="py-2.5 px-3">MATERIAL / FUEL</th>
              <th className="py-2.5 px-3">PLATFORM</th>
              <th className="py-2.5 px-3">O₂ CONC</th>
              <th className="py-2.5 px-3">RISK SCORE</th>
              <th className="py-2.5 px-3">LEVEL</th>
              <th className="py-2.5 px-3">SPECIAL HAZARD</th>
              <th className="py-2.5 px-3">CONFIDENCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-space-800 text-slate-300">
            {rankings.map((item, idx) => {
              const badge = RISK_BADGES[item.risk_level] || RISK_BADGES.MEDIUM;
              return (
                <tr key={item.analysis_id} className="hover:bg-space-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-cyan-400">
                    <Link to={`/analysis?id=${item.experiment_id}`} className="hover:underline">
                      {item.experiment_id}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-100">
                    {item.fuel_type}
                    <span className="block text-[10px] text-slate-500">{item.fuel_category}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {item.gravity_level < 0.1 ? 'ISS CIR (µg)' : 'Ground (1-g)'}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.ambient_o2_percent}% O₂
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-100">
                    {item.risk_score.toFixed(1)} / 100
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {item.cool_flame_observed === 1 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px] font-bold">
                        COOL FLAME (INVISIBLE)
                      </span>
                    ) : item.soot_hazard_score > 0.8 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[10px]">
                        DENSE SOOT SHELL
                      </span>
                    ) : item.flammability_score > 0.8 ? (
                      <span className="px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800 text-orange-300 text-[10px]">
                        LOW LOI (PERSISTENT)
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Standard Hot Flame</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                    {item.confidence_level}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
