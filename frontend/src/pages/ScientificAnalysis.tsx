import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  Activity,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  FileText,
  Sparkles,
  Sliders,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { Experiment, ComparisonResult } from '../types';
import { STATIC_EXPERIMENTS } from '../data/staticData';

const COLORS = ['#22D3EE', '#36D399', '#F5B942', '#FF7139'];

export const ScientificAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exp1Param = searchParams.get('exp1');

  const [availableExperiments, setAvailableExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['FLEX-001', 'FLEX-002', 'CFI-001']);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available parameters to visualize
  const [selectedParam, setSelectedParam] = useState<string>('burning_rate');

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => {
        setAvailableExperiments(res.experiments);
        if (exp1Param && !selectedIds.includes(exp1Param)) {
          setSelectedIds([exp1Param, 'FLEX-001']);
        }
      })
      .catch(err => console.error('Failed to load experiments:', err));
  }, [exp1Param]);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      setError(null);
      api.compareExperiments(selectedIds)
        .then(res => {
          setComparison(res);
          setLoading(false);
        })
        .catch(err => {
          setError(err?.response?.data?.detail || 'Comparison calculation failed.');
          setLoading(false);
        });
    }
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Prepare chart data for quantitative parameters
  const chartData = React.useMemo(() => {
    if (!comparison) return [];
    return comparison.experiments.map(exp => ({
      name: exp.experiment_id,
      burning_rate: exp.burning_rate_constant_k || 0,
      peak_temp: exp.peak_flame_temperature_k || 0,
      standoff: exp.flame_standoff_ratio || 0,
      soot_ppm: exp.soot_volume_fraction_ppm || 0,
      risk_score: exp.risk_score || 0,
      fuel: exp.fuel_type,
      gravity: exp.gravity_level === 0 ? 'μg' : '1-g'
    }));
  }, [comparison]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              SCIENTIFIC ANALYSIS ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              MULTI-RUN PARAMETER COMPARISON & PHYSICAL DELTA AUDIT
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Scientific Analysis & Run Comparison
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-0.5">
            Select between 2 and 4 NASA combustion runs to analyze differences in droplet burning rates, flame standoff ratios, soot accumulation, and extinction limits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/copilot')}
            className="px-3.5 py-2 rounded-lg bg-[#0E1821] hover:bg-[#13212C] border border-[#1E3442] hover:border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center space-x-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consult Copilot</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-3.5 py-2 rounded-lg bg-[#0E1821] hover:bg-[#13212C] border border-[#1E3442] hover:border-cyan-500/40 text-xs font-mono text-slate-300 flex items-center space-x-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* ── Experiment Selector Chips ────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            SELECT 2 TO 4 EXPERIMENTAL RUNS TO COMPARE ({selectedIds.length} SELECTED)
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            FLEX • FLEX-2 • ACME • CFI
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableExperiments.map(exp => {
            const isSelected = selectedIds.includes(exp.experiment_id);
            return (
              <button
                key={exp.experiment_id}
                onClick={() => toggleSelect(exp.experiment_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-[#13212C] border-cyan-400 text-cyan-300 font-bold shadow-glow-cyan'
                    : 'bg-[#0A1118] border-[#1E3442] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{exp.experiment_id}</span>
                <span className="text-[10px] opacity-70">
                  ({exp.fuel_type}, {exp.gravity_level === 0 ? 'μg' : '1-g'})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Visual Comparison Chart Area ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-100">
                Comparative Parameter Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Quantitative measurements across chosen experimental flight runs.
              </p>
            </div>

            {/* Parameter Selector */}
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="bg-[#0A1118] border border-[#1E3442] text-xs font-mono text-cyan-300 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="burning_rate">Burning Rate K (mm²/s)</option>
              <option value="peak_temp">Peak Flame Temp (K)</option>
              <option value="standoff">Flame Standoff Ratio</option>
              <option value="risk_score">Risk Score (0-100)</option>
            </select>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-cyan-400">
                COMPUTING COMPARISON MATRIX...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E3442" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={11}
                    fontFamily="monospace"
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    fontFamily="monospace"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1118',
                      borderColor: '#1E3442',
                      borderRadius: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey={selectedParam} name={selectedParam} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Scientific Conclusions & Key Differences */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-[#1E3442] pb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-sm text-slate-100">
                Key Physical Differences Identified
              </h3>
            </div>

            <div className="space-y-2">
              {comparison?.key_differences.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] text-xs font-mono text-slate-300 flex items-start space-x-2.5"
                >
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{diff}</span>
                </div>
              ))}
            </div>

            {/* Scientific Note */}
            {comparison?.scientific_note && (
              <div className="p-3 rounded-lg bg-[#05090D] border border-[#1E3442] text-[11px] font-mono text-slate-400 space-y-1">
                <span className="text-cyan-400 font-bold block uppercase">SCIENTIFIC NOTE:</span>
                <p className="leading-relaxed">{comparison.scientific_note}</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#1E3442] text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>METHODOLOGY: EMPIRICAL DELTA</span>
            <span>VERIFIED NASA RUNS ONLY</span>
          </div>
        </div>
      </div>

      {/* ── Multi-Variable Comparison Matrix Table ────────────────────────── */}
      {comparison && (
        <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
            <h3 className="font-display font-semibold text-sm text-slate-100">
              Multi-Variable Physical Comparison Matrix
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {comparison.variables.length} PHYSICAL VARIABLES CROSS-REFERENCED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1E3442] text-[10px] text-slate-400">
                  <th className="py-2.5 px-3">VARIABLE</th>
                  <th className="py-2.5 px-3">UNIT</th>
                  {comparison.experiments.map(exp => (
                    <th key={exp.experiment_id} className="py-2.5 px-3 text-cyan-400">
                      {exp.experiment_id}
                      <span className="block text-[9px] text-slate-500">{exp.fuel_type}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3442]/60 text-slate-300">
                {comparison.variables.map(v => (
                  <tr key={v.variable} className="hover:bg-[#13212C]/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">{v.label}</td>
                    <td className="py-2.5 px-3 text-slate-500">{v.unit || '—'}</td>
                    {comparison.experiments.map(exp => (
                      <td key={exp.experiment_id} className="py-2.5 px-3">
                        {v.values[exp.experiment_id] !== undefined && v.values[exp.experiment_id] !== null
                          ? String(v.values[exp.experiment_id])
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
