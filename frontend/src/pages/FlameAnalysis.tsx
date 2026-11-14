import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  Wind,
  Layers,
  Thermometer,
  ShieldAlert,
  GitCompare,
  ExternalLink,
  ChevronRight,
  Filter,
  Sliders,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  Legend
} from 'recharts';
import { api } from '../services/api';
import {
  Experiment,
  D2SeriesInfo,
  D2RegressionResult,
  AtmosphereScenario,
  AtmosphereSimulationResult
} from '../types';

export const FlameAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedParamId = searchParams.get('id');

  // Navigation Tabs: 'd2' | 'atmosphere' | 'experiments'
  const [activeTab, setActiveTab] = useState<'d2' | 'atmosphere' | 'experiments'>('d2');

  // Experiments Explorer State
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [extinctionData, setExtinctionData] = useState<any | null>(null);
  const [gravityData, setGravityData] = useState<any | null>(null);
  const [seriesFilter, setSeriesFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // D² Regression State
  const [d2SeriesList, setD2SeriesList] = useState<D2SeriesInfo[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [regressionResult, setRegressionResult] = useState<D2RegressionResult | null>(null);
  const [d2Loading, setD2Loading] = useState(false);

  // Atmospheric Simulator State
  const [o2Pct, setO2Pct] = useState<number>(21.0);
  const [pressureKpa, setPressureKpa] = useState<number>(101.3);
  const [simResult, setSimResult] = useState<AtmosphereSimulationResult | null>(null);
  const [presets, setPresets] = useState<AtmosphereScenario[]>([]);
  const [simLoading, setSimLoading] = useState(false);

  // Load Experiments on Mount
  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => {
        setExperiments(res.experiments);
        if (res.experiments.length > 0) {
          const target = selectedParamId
            ? res.experiments.find(e => e.experiment_id === selectedParamId) || res.experiments[0]
            : res.experiments[0];
          setSelectedExp(target);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load experiments:', err);
        setLoading(false);
      });
  }, [selectedParamId]);

  // Load D² Series List & Presets on Mount
  useEffect(() => {
    api.getD2SeriesList()
      .then(list => {
        setD2SeriesList(list);
        if (list.length > 0) {
          setSelectedSeriesId(list[0].series_id);
        }
      })
      .catch(err => console.error('Failed to load D2 series:', err));

    api.getAtmospherePresets()
      .then(p => setPresets(p))
      .catch(err => console.error('Failed to load atmosphere presets:', err));
  }, []);

  // Fetch D² Regression when series changes
  useEffect(() => {
    if (selectedSeriesId) {
      setD2Loading(true);
      api.getD2Regression(selectedSeriesId)
        .then(res => {
          setRegressionResult(res);
          setD2Loading(false);
        })
        .catch(err => {
          console.error('Failed to run D2 regression:', err);
          setD2Loading(false);
        });
    }
  }, [selectedSeriesId]);

  // Run Atmospheric Simulation when sliders change
  useEffect(() => {
    const timer = setTimeout(() => {
      setSimLoading(true);
      api.simulateAtmosphere({ oxygen_percentage: o2Pct, chamber_pressure_kpa: pressureKpa })
        .then(res => {
          setSimResult(res);
          setSimLoading(false);
        })
        .catch(err => {
          console.error('Failed to run simulation:', err);
          setSimLoading(false);
        });
    }, 150);
    return () => clearTimeout(timer);
  }, [o2Pct, pressureKpa]);

  // Load Extinction & Gravity data for selected experiment
  useEffect(() => {
    if (selectedExp) {
      api.getExtinctionCurve(selectedExp.fuel_type)
        .then(res => setExtinctionData(res))
        .catch(() => setExtinctionData(null));

      api.getGravityEffect(selectedExp.fuel_type)
        .then(res => setGravityData(res))
        .catch(() => setGravityData(null));
    }
  }, [selectedExp]);

  // Prepare combined D² chart data (empirical points + fitted line)
  const d2ChartData = React.useMemo(() => {
    if (!regressionResult) return [];
    const empMap = new Map<number, number>();
    regressionResult.empirical_points.forEach(p => empMap.set(p.time_s, p.d2_mm2));

    return regressionResult.fitted_points.map(fp => ({
      time_s: fp.time_s,
      fitted_d2: fp.fitted_d2_mm2,
      empirical_d2: empMap.has(fp.time_s) ? empMap.get(fp.time_s) : null,
    }));
  }, [regressionResult]);

  const filteredExps = seriesFilter
    ? experiments.filter(e => e.series === seriesFilter)
    : experiments;

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-cyan-400">
        <Activity className="w-8 h-8 animate-spin text-cyan-400" />
        <p>LOADING EXPERIMENTAL FLIGHT METRICS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-space-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              NASA PHYSICS ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">D² COMBUSTION KINETICS & ATMOSPHERIC FLAMMABILITY</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Combustion Physics & Kinetics Analysis
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Perform empirical regression on NASA droplet combustion time-series, simulate exploration cabin atmospheres, and inspect single-run flight telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-space-950 border border-space-700 rounded-xl">
          <button
            onClick={() => setActiveTab('d2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'd2'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            D² Law Droplet Kinetics
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'atmosphere'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Atmosphere Simulator
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'experiments'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flight Telemetry Runs
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: D² DROPLET KINETICS & REGRESSION
         ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'd2' && (
        <div className="space-y-6">
          {/* Controls & Series Selector */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <span className="text-xs font-mono uppercase text-slate-400">SELECT RUN:</span>
              <select
                value={selectedSeriesId}
                onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="bg-space-950 border border-cyan-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
              >
                {d2SeriesList.map((s) => (
                  <option key={s.series_id} value={s.series_id}>
                    {s.series_id} — {s.fuel_type} ({s.gravity_level < 0.1 ? 'µg (0-g)' : '1-g Earth'}) [{s.point_count} pts]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-space-950 text-teal-300 border border-space-800">
                MODEL: D²(t) = D₀² - K·t
              </span>
              <span>•</span>
              <span className="text-emerald-400">ISS CIR FLIGHT TELEMETRY</span>
            </div>
          </div>

          {d2Loading ? (
            <div className="h-64 flex items-center justify-center font-mono text-xs text-cyan-400">
              <Activity className="w-6 h-6 animate-spin mr-2" />
              Computing Linear Regression Parameters...
            </div>
          ) : regressionResult ? (
            <div className="space-y-6">
              {/* Regression Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    BURNING RATE CONSTANT (K)
                  </span>
                  <div className="text-xl font-bold font-mono text-cyan-300">
                    {regressionResult.calculated_burning_rate_k.toFixed(4)}{' '}
                    <span className="text-xs font-normal text-slate-400">mm²/s</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Uncertainty: ±{regressionResult.uncertainty_delta_k.toFixed(4)} mm²/s
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    FIT QUALITY (R²)
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {regressionResult.r_squared.toFixed(4)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    {regressionResult.r_squared > 0.98 ? 'Near-Ideal Diffusion Linearity' : 'High Linearity'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    ROOT MEAN SQ ERROR (RMSE)
                  </span>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {regressionResult.rmse.toFixed(4)}{' '}
                    <span className="text-xs font-normal text-slate-400">mm²</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    D₀² Intercept: {regressionResult.d0_squared.toFixed(3)} mm²
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    ENVIRONMENT VECTOR
                  </span>
                  <div className="text-base font-bold font-mono text-white">
                    {regressionResult.gravity_level < 0.1 ? 'Microgravity (0-g)' : 'Terrestrial (1-g)'}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                    {regressionResult.fuel_type} • {regressionResult.ambient_o2_percent}% O₂
                  </span>
                </div>
              </div>

              {/* Main D² Chart (Scatter + Line) */}
              <div className="p-6 rounded-xl bg-space-900 border border-space-700 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-space-800 pb-3 gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      D² Law Regression: Droplet Diameter Squared vs Time
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Regression Formula: <span className="text-cyan-300 font-semibold">{regressionResult.equation}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Empirical Points
                    </span>
                    <span className="flex items-center gap-1.5 text-teal-300">
                      <span className="w-4 h-0.5 bg-teal-400 inline-block" /> Fitted D² Line
                    </span>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={d2ChartData} margin={{ top: 15, right: 25, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.7} />
                      <XAxis
                        dataKey="time_s"
                        name="Time"
                        unit="s"
                        stroke="#64748B"
                        fontSize={11}
                        label={{ value: 'Combustion Time (seconds)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
                      />
                      <YAxis
                        dataKey="fitted_d2"
                        name="D²"
                        unit="mm²"
                        stroke="#64748B"
                        fontSize={11}
                        label={{ value: 'Diameter Squared D² (mm²)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748B', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1325',
                          borderColor: '#1E293B',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                      />
                      <Line
                        type="linear"
                        dataKey="fitted_d2"
                        stroke="#14B8A6"
                        strokeWidth={2}
                        dot={false}
                        name="Fitted D² Line"
                      />
                      <Scatter
                        dataKey="empirical_d2"
                        fill="#06B6D4"
                        name="Empirical Measurement"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Scientific Context */}
                <div className="p-4 rounded-lg bg-space-950 border border-space-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono font-semibold uppercase">
                    <Info className="w-4 h-4 text-cyan-400" />
                    SCIENTIFIC INTERPRETATION & PHYSICS PROVENANCE
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {regressionResult.scientific_interpretation}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] pt-1 border-t border-space-900">
                    Source: {regressionResult.citation}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: ATMOSPHERIC FLAMMABILITY SIMULATOR
         ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'atmosphere' && (
        <div className="space-y-6">
          {/* Modeled Disclaimer Alert */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-cyan-200/90">
              <span className="font-semibold text-cyan-300 block mb-0.5">
                THEORETICAL PREDICTIVE MODEL (CLEAR SEPARATION OF FLIGHT EVIDENCE):
              </span>
              This simulator models cabin flammability indices based on partial pressure of oxygen ($P_{'{'}O_2{'}'}$) and empirical microgravity burning rate power laws ($K/K_0 \propto (P/P_0)^{'{'}0.12{'}'} \cdot (Y_{'{'}O_2{'}'}/Y_{'{'}O_2,0{'}'})^{'{'}0.72{'}'}$). It is designated as a theoretical engineering tool and does not represent direct flight qualification data.
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-700 space-y-2.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              LOAD NASA MISSION ATMOSPHERE PRESET:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const isActive = Math.abs(p.oxygen_percentage - o2Pct) < 0.1 && Math.abs(p.total_pressure_kpa - pressureKpa) < 0.5;
                return (
                  <button
                    key={p.scenario_id}
                    onClick={() => {
                      setO2Pct(p.oxygen_percentage);
                      setPressureKpa(p.total_pressure_kpa);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-glow-cyan'
                        : 'bg-space-950 text-slate-300 hover:text-white border-space-800 hover:border-space-700'
                    }`}
                  >
                    {p.name.split('(')[0]} ({p.oxygen_percentage}% O₂ @ {p.total_pressure_kpa} kPa)
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-space-900 border border-space-700 space-y-6">
              <div className="flex items-center justify-between border-b border-space-800 pb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Atmospheric Environmental Controls
                </h3>
                <span className="text-xs font-mono text-slate-500">DYNAMIC</span>
              </div>

              {/* O2 Concentration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Oxygen Concentration (O₂)</span>
                  <span className="text-cyan-300 font-bold text-sm">{o2Pct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="0.5"
                  value={o2Pct}
                  onChange={(e) => setO2Pct(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-space-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>10% (Hypoxic)</span>
                  <span>21% (Earth / ISS)</span>
                  <span>34% (Artemis EVA)</span>
                  <span>100% (Apollo 1)</span>
                </div>
              </div>

              {/* Pressure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Chamber Pressure (Total)</span>
                  <span className="text-teal-300 font-bold text-sm">{pressureKpa.toFixed(1)} kPa</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="1.0"
                  value={pressureKpa}
                  onChange={(e) => setPressureKpa(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-2 bg-space-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>20 kPa (Suit)</span>
                  <span>56 kPa (Exploration)</span>
                  <span>101.3 kPa (Standard)</span>
                  <span>150 kPa</span>
                </div>
              </div>

              {/* Rapid Feedback Status */}
              <div className="p-4 rounded-lg bg-space-950 border border-space-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  EXPLORATION HABITAT STATUS
                </span>
                <div className="text-xs font-mono text-slate-300">
                  Equivalent Air Depth:{' '}
                  <span className="text-white font-semibold">
                    {((o2Pct * pressureKpa) / 21.28).toFixed(1)}% Sea-Level Equivalent
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Risk Outputs */}
            {simResult && (
              <div className="lg:col-span-7 space-y-5">
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      OXYGEN PARTIAL PRESSURE (PO₂)
                    </span>
                    <div className="text-xl font-bold font-mono text-cyan-300">
                      {simResult.calculated_metrics.oxygen_partial_pressure_kpa.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-400">kPa</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Ref Standard: 21.28 kPa
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900 border border-space-700">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      FLAMMABILITY INDEX
                    </span>
                    <div className="text-xl font-bold font-mono text-teal-400">
                      {simResult.calculated_metrics.relative_flammability_index.toFixed(3)}x
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Relative to 21% @ 101.3 kPa
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900 border border-space-700 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      BURNING RATE MULTIPLIER
                    </span>
                    <div className="text-xl font-bold font-mono text-amber-300">
                      {simResult.calculated_metrics.predicted_burning_rate_multiplier.toFixed(3)}x
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      K / K_baseline
                    </span>
                  </div>
                </div>

                {/* Risk Category Banner */}
                <div className="p-5 rounded-xl bg-space-900 border border-space-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-space-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-slate-400">CLASSIFICATION:</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-space-800 text-white border border-space-700">
                        {simResult.calculated_metrics.risk_category}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      {simResult.calculated_metrics.display_label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      SCIENTIFIC RATIONALE & COMBUSTION BEHAVIOR
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans bg-space-950 p-4 rounded-lg border border-space-800">
                      {simResult.scientific_rationale}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-space-850">
                    <span>Citation: {simResult.citation}</span>
                    <span className="text-teal-400 font-semibold">{simResult.modeled_status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: FLIGHT EXPERIMENT TELEMETRY RUNS
         ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'experiments' && (
        <div className="space-y-6">
          {/* Experiment Selector Bar */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="bg-space-950 border border-space-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300"
              >
                <option value="">All Series ({experiments.length})</option>
                <option value="FLEX">FLEX</option>
                <option value="FLEX-2">FLEX-2</option>
                <option value="ACME">ACME</option>
                <option value="CFI">CFI</option>
                <option value="BASS">BASS</option>
                <option value="SoFIE">SoFIE</option>
              </select>

              <select
                value={selectedExp?.experiment_id || ''}
                onChange={(e) => {
                  const match = experiments.find(exp => exp.experiment_id === e.target.value);
                  if (match) setSelectedExp(match);
                }}
                className="bg-space-950 border border-cyan-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
              >
                {filteredExps.map((e) => (
                  <option key={e.experiment_id} value={e.experiment_id}>
                    {e.experiment_id} — {e.fuel_type} ({e.gravity_level < 0.1 ? 'µg' : '1-g'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">VERIFIED FLIGHT HARDWARE DATA</span>
            </div>
          </div>

          {selectedExp && (
            <div className="space-y-6">
              {/* Active Experiment Parameter Sheet */}
              <div className="p-6 rounded-xl bg-space-900 border border-cyan-500/30 shadow-glow-cyan space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-space-700 pb-4 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-space-700 font-semibold">
                        {selectedExp.series}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        ID: {selectedExp.experiment_id}
                      </span>
                      <span className="font-mono text-xs text-slate-500">•</span>
                      <span className="font-mono text-xs text-emerald-400">
                        {selectedExp.verification_level}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {selectedExp.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      PLATFORM: {selectedExp.mission_platform}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/comparison?base=${selectedExp.experiment_id}`}
                      className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-600 text-cyan-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>COMPARE RUN</span>
                    </Link>
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono">
                      RISK: <span className="font-bold">{selectedExp.risk_score?.toFixed(1)}/100 [{selectedExp.risk_level}]</span>
                    </div>
                  </div>
                </div>

                {/* Environmental & Physics Parameters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">GRAVITY VECTOR</span>
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {selectedExp.gravity_level < 0.1 ? '0.0 g (µg)' : '1.0 g (Earth)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {selectedExp.gravity_level < 0.1 ? 'Pure Diffusive' : 'Buoyancy Driven'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">AMBIENT O₂ CONC</span>
                    <span className="text-sm font-mono font-bold text-slate-100">
                      {selectedExp.ambient_o2_percent ? `${selectedExp.ambient_o2_percent}%` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Diluent: {selectedExp.diluent_gas || 'N2'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">CHAMBER PRESSURE</span>
                    <span className="text-sm font-mono font-bold text-slate-100">
                      {selectedExp.chamber_pressure_kpa ? `${selectedExp.chamber_pressure_kpa} kPa` : '101.3 kPa'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Total Pressure</span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">BURNING RATE K</span>
                    <span className="text-sm font-mono font-bold text-teal-400">
                      {selectedExp.burning_rate_constant_k ? `${selectedExp.burning_rate_constant_k} mm²/s` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">D² Law Constant</span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">PEAK FLAME TEMP</span>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {selectedExp.peak_flame_temperature_k ? `${selectedExp.peak_flame_temperature_k} K` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Radiometric</span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-950 border border-space-800">
                    <span className="text-[10px] font-mono text-slate-400 block">FLAME SHAPE</span>
                    <span className="text-sm font-mono font-bold text-cyan-300">
                      {selectedExp.flame_shape || 'Spherical'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Standoff: {selectedExp.flame_standoff_ratio || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Findings and Provenance Citation */}
                <div className="p-4 rounded-lg bg-space-950/80 border border-space-800 space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
                    EMPIRICAL NASA FLIGHT FINDING
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedExp.key_finding}
                  </p>
                  <div className="pt-2 border-t border-space-850 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                    <span>CITATION: {selectedExp.citation}</span>
                    <span className="text-cyan-400">PAGE: {selectedExp.page_citation || 'Flight Record'}</span>
                  </div>
                </div>
              </div>

              {/* Extinction and Gravity Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Oxygen Extinction Scatter Chart */}
                <div className="p-5 rounded-xl bg-space-900 border border-space-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-100">
                        O₂ Concentration vs Burning Rate & Extinction Limit
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">
                        Fuel: {selectedExp.fuel_type} (FLEX flight series)
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">
                      LOI: {selectedExp.limiting_oxygen_index_percent || 12.0}% O₂
                    </span>
                  </div>

                  {extinctionData && extinctionData.data ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                          <XAxis dataKey="oxygen_pct" name="Oxygen %" unit="%" stroke="#64748B" fontSize={10} domain={[8, 32]} />
                          <YAxis dataKey="burning_rate_k" name="Burn Rate K" unit="mm²/s" stroke="#64748B" fontSize={10} domain={[0, 1.3]} />
                          <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#0B1325', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                          />
                          <Scatter name={selectedExp.fuel_type} data={extinctionData.data} fill="#06B6D4" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500">
                      No extinction data for fuel: {selectedExp.fuel_type}
                    </div>
                  )}
                </div>

                {/* Microgravity vs 1-g Ground Benchmark */}
                <div className="p-5 rounded-xl bg-space-900 border border-space-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-100">
                        Gravity Effect on {selectedExp.fuel_type} (µg vs 1-g)
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">
                        Absence of buoyancy reduces convective oxygen refresh
                      </p>
                    </div>
                    <span className="text-xs font-mono text-teal-400">
                      CIR vs Ground
                    </span>
                  </div>

                  {gravityData && gravityData.data ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gravityData.data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                          <XAxis dataKey="experiment_id" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0B1325', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                          />
                          <Bar dataKey="burning_rate_k" name="Burning Rate K (mm²/s)" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500">
                      No gravity comparison data for {selectedExp.fuel_type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default FlameAnalysis;
