import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GitCompare, Flame, Check, AlertCircle, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Experiment, ComparisonResult } from '../types';

export const ExperimentComparison: React.FC = () => {
  const [searchParams] = useSearchParams();
  const baseParam = searchParams.get('base');

  const [allExperiments, setAllExperiments] = useState<Experiment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['FLEX-001', 'REF-1G-HEPTANE']);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => {
        setAllExperiments(res.experiments);
        if (baseParam && res.experiments.some(e => e.experiment_id === baseParam)) {
          setSelectedIds([baseParam, 'REF-1G-HEPTANE']);
        }
      });
  }, [baseParam]);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
            COMPARATIVE COMBUSTION ENGINE
          </span>
          <span className="text-xs font-mono text-slate-400">SIDE-BY-SIDE PHYSICAL DIFFERENCE MATRIX</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-1">
          NASA Experiment Comparison
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Select between 2 and 4 experimental runs to evaluate physical variances in droplet regression, flame standoff, soot accumulation, and extinction mechanisms between microgravity and 1-g.
        </p>
      </div>

      {/* Experiment Selector Bar */}
      <div className="p-4 rounded-xl nasa-card border border-space-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">
            SELECT EXPERIMENTS TO COMPARE (MIN 2, MAX 4):
          </span>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            {selectedIds.length} SELECTED
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allExperiments.slice(0, 16).map((exp) => {
            const isSelected = selectedIds.includes(exp.experiment_id);
            return (
              <button
                key={exp.experiment_id}
                onClick={() => toggleSelect(exp.experiment_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border ${
                  isSelected
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600 shadow-glow-cyan'
                    : 'bg-space-950 text-slate-400 hover:text-slate-200 border-space-800'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                <span>{exp.experiment_id}</span>
                <span className="text-[10px] opacity-70">({exp.fuel_type}, {exp.gravity_level < 0.1 ? 'µg' : '1-g'})</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="h-64 flex flex-col items-center justify-center space-y-2 font-mono text-xs text-cyan-400">
          <GitCompare className="w-6 h-6 animate-spin text-cyan-400" />
          <p>CALCULATING EXPERIMENTAL DIFFERENTIALS...</p>
        </div>
      )}

      {comparison && !loading && (
        <div className="space-y-6">
          {/* Key Differences Alert Box */}
          {comparison.key_differences.length > 0 && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60 text-cyan-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>SIGNIFICANT SCIENTIFIC DIFFERENTIALS IDENTIFIED:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-300">
                {comparison.key_differences.map((diff, idx) => (
                  <li key={idx}>{diff}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Experiments Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparison.experiments.map((exp) => (
              <div key={exp.experiment_id} className="p-4 rounded-xl nasa-card border border-space-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {exp.experiment_id}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                    {exp.series}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
                  {exp.title}
                </h4>
                <p className="text-[11px] font-mono text-slate-400">
                  {exp.fuel_type} • {exp.gravity_level < 0.1 ? '0.0 g (µg)' : '1.0 g (Earth)'}
                </p>
                <div className="text-[10px] font-mono text-cyan-400 pt-1 border-t border-space-800">
                  RISK: {exp.risk_score?.toFixed(1)}/100 [{exp.risk_level}]
                </div>
              </div>
            ))}
          </div>

          {/* Multi-Variable Side-by-Side Comparison Table */}
          <div className="p-5 rounded-xl nasa-card border border-space-700 overflow-x-auto space-y-4">
            <h3 className="font-display font-semibold text-sm text-slate-100">
              Cross-Experiment Physical Variables Matrix
            </h3>

            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-space-700 text-slate-400">
                  <th className="py-2.5 px-3">MEASURED VARIABLE</th>
                  <th className="py-2.5 px-3">UNIT</th>
                  {comparison.experiments.map(e => (
                    <th key={e.experiment_id} className="py-2.5 px-3 text-cyan-400 font-bold">
                      {e.experiment_id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800 text-slate-300">
                {comparison.variables.map((v) => (
                  <tr key={v.variable} className="hover:bg-space-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {v.label}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {v.unit}
                    </td>
                    {comparison.experiments.map(e => {
                      const val = v.values[e.experiment_id];
                      return (
                        <td key={e.experiment_id} className="py-2.5 px-3">
                          {val !== null && val !== undefined ? String(val) : <span className="text-slate-600">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-[11px] font-mono text-slate-500 border-t border-space-800 pt-3">
              {comparison.scientific_note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
