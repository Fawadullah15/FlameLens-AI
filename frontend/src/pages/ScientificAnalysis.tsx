import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  ArrowRight,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { Experiment, ComparisonResult } from '../types';
import { STATIC_EXPERIMENTS } from '../data/staticData';

export const ScientificAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const expAParam = searchParams.get('expA') || searchParams.get('exp1') || 'FLEX-001';
  const expBParam = searchParams.get('expB') || searchParams.get('exp2') || 'FLEX-002';

  const [availableExperiments, setAvailableExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [expAId, setExpAId] = useState<string>(expAParam);
  const [expBId, setExpBId] = useState<string>(expBParam);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => {
        setAvailableExperiments(res.experiments);
      })
      .catch(err => console.error('Failed to load experiments:', err));
  }, []);

  useEffect(() => {
    if (expAId && expBId) {
      setLoading(true);
      api.compareExperiments([expAId, expBId])
        .then(res => {
          setComparison(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [expAId, expBId]);

  const expA = availableExperiments.find(e => e.experiment_id === expAId) || (STATIC_EXPERIMENTS.find(e => e.experiment_id === expAId) as Experiment);
  const expB = availableExperiments.find(e => e.experiment_id === expBId) || (STATIC_EXPERIMENTS.find(e => e.experiment_id === expBId) as Experiment);

  const chartData = [
    {
      parameter: 'Burn Rate K (mm²/s × 10)',
      [expAId]: expA?.burning_rate_constant_k ? expA.burning_rate_constant_k * 10 : 0,
      [expBId]: expB?.burning_rate_constant_k ? expB.burning_rate_constant_k * 10 : 0,
    },
    {
      parameter: 'Oxygen Concentration (O₂ %)',
      [expAId]: expA?.ambient_o2_percent ?? 21,
      [expBId]: expB?.ambient_o2_percent ?? 21,
    },
    {
      parameter: 'Flame Temp (K ÷ 100)',
      [expAId]: expA?.peak_flame_temperature_k ? expA.peak_flame_temperature_k / 100 : 18,
      [expBId]: expB?.peak_flame_temperature_k ? expB.peak_flame_temperature_k / 100 : 18,
    }
  ];

  const parameters = [
    { label: 'Experiment ID', valA: expA?.experiment_id, valB: expB?.experiment_id, isMono: true },
    { label: 'Fuel Type', valA: expA?.fuel_type, valB: expB?.fuel_type },
    {
      label: 'Gravity Level',
      valA: expA?.gravity_level === 0 ? '0g Microgravity' : '1g Terrestrial',
      valB: expB?.gravity_level === 0 ? '0g Microgravity' : '1g Terrestrial'
    },
    {
      label: 'Oxygen Concentration (O₂)',
      valA: `${expA?.ambient_o2_percent ?? 21}%`,
      valB: `${expB?.ambient_o2_percent ?? 21}%`,
      isMono: true
    },
    {
      label: 'Chamber Pressure',
      valA: expA?.chamber_pressure_kpa ? `${(expA.chamber_pressure_kpa / 101.325).toFixed(2)} atm` : '1.00 atm',
      valB: expB?.chamber_pressure_kpa ? `${(expB.chamber_pressure_kpa / 101.325).toFixed(2)} atm` : '1.00 atm',
      isMono: true
    },
    {
      label: 'Burning Rate Constant (K)',
      valA: expA?.burning_rate_constant_k ? `${expA.burning_rate_constant_k.toFixed(3)} mm²/s` : '—',
      valB: expB?.burning_rate_constant_k ? `${expB.burning_rate_constant_k.toFixed(3)} mm²/s` : '—',
      isMono: true,
      highlight: true
    },
    {
      label: 'Peak Flame Temperature',
      valA: expA?.peak_flame_temperature_k ? `${expA.peak_flame_temperature_k} K` : '—',
      valB: expB?.peak_flame_temperature_k ? `${expB.peak_flame_temperature_k} K` : '—',
      isMono: true
    },
    {
      label: 'Extinction Mode',
      valA: expA?.extinction_mode || 'Radiative',
      valB: expB?.extinction_mode || 'Radiative'
    },
    {
      label: 'Investigation Series',
      valA: expA?.series || 'ISS CIR',
      valB: expB?.series || 'ISS CIR'
    }
  ];

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Compare Flight Experiments</h1>
          <p className="page-subtitle">
            Differential scientific analysis of droplet combustion kinetics, gravity effects, and extinction modes.
          </p>
        </div>

        <button
          onClick={() => {
            navigate(
              `/copilot?q=${encodeURIComponent(
                `Compare the combustion parameters and physics between experiment ${expAId} (${expA?.fuel_type}, ${expA?.gravity_level}g) and ${expBId} (${expB?.fuel_type}, ${expB?.gravity_level}g)`
              )}`
            );
          }}
          className="btn-primary"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Copilot to Compare</span>
        </button>
      </div>

      {/* ── SELECTOR PANELS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Experiment A */}
        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 shadow-2xs">
          <label className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide block">
            Experiment A (Primary)
          </label>
          <select
            value={expAId}
            onChange={(e) => setExpAId(e.target.value)}
            className="select-standard w-full"
          >
            {availableExperiments.map((e) => (
              <option key={e.experiment_id} value={e.experiment_id}>
                {e.experiment_id} — {e.fuel_type} ({e.gravity_level === 0 ? '0g Microgravity' : '1g'})
              </option>
            ))}
          </select>
        </div>

        {/* Experiment B */}
        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 shadow-2xs">
          <label className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide block">
            Experiment B (Comparative Baseline)
          </label>
          <select
            value={expBId}
            onChange={(e) => setExpBId(e.target.value)}
            className="select-standard w-full"
          >
            {availableExperiments.map((e) => (
              <option key={e.experiment_id} value={e.experiment_id}>
                {e.experiment_id} — {e.fuel_type} ({e.gravity_level === 0 ? '0g Microgravity' : '1g'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE PARAMETER COMPARISON TABLE ───────────────────────── */}
      <div className="table-shell shadow-2xs">
        <div className="p-4 border-b border-[#E5E5E5] bg-[#F7F7F8]">
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Side-by-Side Parameter Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="table-header-cell">Parameter</th>
                <th className="table-header-cell font-mono font-semibold text-[#0D0D0D]">{expAId}</th>
                <th className="table-header-cell font-mono font-semibold text-[#0D0D0D]">{expBId}</th>
                <th className="table-header-cell text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F9F9FA]">
                  <td className="table-body-cell font-medium text-[#0D0D0D]">{p.label}</td>
                  <td className={`table-body-cell ${p.isMono ? 'font-mono text-xs' : ''} ${p.highlight ? 'text-[#B86B39] font-semibold' : 'text-[#555555]'}`}>
                    {p.valA || '—'}
                  </td>
                  <td className={`table-body-cell ${p.isMono ? 'font-mono text-xs' : ''} ${p.highlight ? 'text-[#B86B39] font-semibold' : 'text-[#555555]'}`}>
                    {p.valB || '—'}
                  </td>
                  <td className="table-body-cell text-right text-xs font-mono text-[#8F8F8F]">
                    {p.valA === p.valB ? (
                      <span className="text-emerald-600">Identical</span>
                    ) : (
                      <span>Varied</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── VISUAL BAR COMPARISON ────────────────────────────────────────── */}
      <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-4 shadow-2xs">
        <h3 className="text-sm font-semibold text-[#0D0D0D]">
          Normalized Parameter Comparison
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="parameter" stroke="#8F8F8F" fontSize={11} tickLine={false} />
              <YAxis stroke="#8F8F8F" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey={expAId} fill="#0D0D0D" radius={[4, 4, 0, 0]} />
              <Bar dataKey={expBId} fill="#B86B39" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 text-xs font-mono text-[#6E6E6E]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#0D0D0D]" />
            <span>{expAId}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#B86B39]" />
            <span>{expBId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
