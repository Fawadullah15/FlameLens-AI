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
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart2
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
  Legend,
  Cell
} from 'recharts';
import { api } from '../services/api';
import {
  Experiment,
  D2SeriesInfo,
  D2RegressionResult,
  AtmosphereScenario,
  AtmosphereSimulationResult
} from '../types';
import { STATIC_EXPERIMENTS, STATIC_ATMOSPHERE_SCENARIOS } from '../data/staticData';

export const CombustionIntelligence: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedParamId = searchParams.get('id');

  // Navigation Tabs: 'kinetics' | 'atmosphere' | 'explorer'
  const [activeTab, setActiveTab] = useState<'kinetics' | 'atmosphere' | 'explorer'>('kinetics');

  // Experiments Explorer State
  const [experiments, setExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>((STATIC_EXPERIMENTS[0] as Experiment) || null);
  const [seriesFilter, setSeriesFilter] = useState<string>('');
  const [fuelFilter, setFuelFilter] = useState<string>('');
  const [gravityFilter, setGravityFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // D² Kinetics Regression State
  const [d2SeriesList, setD2SeriesList] = useState<D2SeriesInfo[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('D2-FLEX-001');
  const [regressionResult, setRegressionResult] = useState<D2RegressionResult | null>(null);
  const [regressionLoading, setRegressionLoading] = useState(false);

  // Atmospheric Simulator State
  const [o2Pct, setO2Pct] = useState<number>(21.0);
  const [pressureKpa, setPressureKpa] = useState<number>(101.3);
  const [presets, setPresets] = useState<AtmosphereScenario[]>(STATIC_ATMOSPHERE_SCENARIOS as AtmosphereScenario[]);
  const [simResult, setSimResult] = useState<AtmosphereSimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  // Curves & Effects State
  const [extinctionData, setExtinctionData] = useState<any | null>(null);
  const [gravityData, setGravityData] = useState<any | null>(null);

  // Load Experiments list
  useEffect(() => {
    setLoading(true);
    api.getExperiments({
      series: seriesFilter || undefined,
      fuel: fuelFilter || undefined,
      gravity: gravityFilter !== '' ? Number(gravityFilter) : undefined,
    })
      .then(res => {
        setExperiments(res.experiments);
        if (res.experiments.length > 0) {
          if (selectedParamId) {
            const match = res.experiments.find(e => e.experiment_id === selectedParamId);
            setSelectedExp(match || res.experiments[0]);
          } else if (!selectedExp) {
            setSelectedExp(res.experiments[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load experiments:', err);
        setLoading(false);
      });
  }, [seriesFilter, fuelFilter, gravityFilter, selectedParamId]);

  // Load D² Series List
  useEffect(() => {
    api.getD2SeriesList()
      .then(res => {
        setD2SeriesList(res);
        if (res.length > 0 && !selectedSeriesId) {
          setSelectedSeriesId(res[0].series_id);
        }
      })
      .catch(err => console.error('Failed to load D² series:', err));

    api.getAtmospherePresets()
      .then(res => setPresets(res))
      .catch(err => console.error('Failed to load presets:', err));
  }, []);

  // Run D² Regression when series changes
  useEffect(() => {
    if (selectedSeriesId) {
      setRegressionLoading(true);
      api.getD2Regression(selectedSeriesId)
        .then(res => {
          setRegressionResult(res);
          setRegressionLoading(false);
        })
        .catch(err => {
          console.error('Failed to run regression:', err);
          setRegressionLoading(false);
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
    }, 120);
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
      empirical_d2: empMap.get(fp.time_s) !== undefined ? empMap.get(fp.time_s) : null,
    }));
  }, [regressionResult]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header & Tab Controls ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              NASA PHYSICS ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              D² KINETICS • ATMOSPHERIC FLAMMABILITY • DROPLET MORPHOLOGY
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Combustion Intelligence Workspace
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-0.5">
            Empirical regressions on NASA microgravity droplet combustion time-series, exploration cabin flammability models, and flight chamber telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#0A1118] border border-[#1E3442] rounded-xl font-mono text-xs">
          <button
            onClick={() => setActiveTab('kinetics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'kinetics'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            D² Droplet Kinetics
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'atmosphere'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Atmosphere Simulator
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'explorer'
                ? 'bg-[#13212C] text-cyan-300 font-bold border border-cyan-500/60 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flight Run Explorer
          </button>
        </div>
      </div>

      {/* ── TAB 1: D² DROPLET KINETICS & REGRESSION ───────────────────────── */}
      {activeTab === 'kinetics' && (
        <div className="space-y-6">
          {/* Top Series Selector Bar */}
          <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  ACTIVE EXPERIMENTAL TIME-SERIES
                </span>
                <span className="text-sm font-semibold text-white">
                  {regressionResult ? regressionResult.title : 'Loading time-series...'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-xs font-mono text-slate-400">SELECT RUN:</label>
              <select
                value={selectedSeriesId}
                onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="bg-[#05090D] border border-[#1E3442] text-xs font-mono text-cyan-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                {d2SeriesList.map(s => (
                  <option key={s.series_id} value={s.series_id}>
                    {s.series_id} — {s.fuel_type} ({s.mission_platform}, {s.gravity_level === 0 ? 'μg' : '1-g'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main D² Kinetics Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-8 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
                <div>
                  <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
                    <span>Empirical Droplet Diameter Decay [d²(t) vs t]</span>
                    <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                      CLASSICAL D² LAW
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Individual markers represent digitized optical measurement frames; continuous line indicates linear regression fit.
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  <span className="text-cyan-400 font-bold">{regressionResult?.point_count || 0}</span> data points
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 w-full">
                {regressionLoading ? (
                  <div className="h-full flex items-center justify-center font-mono text-xs text-cyan-400">
                    CALCULATING LEAST-SQUARES FIT...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={d2ChartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3442" opacity={0.6} />
                      <XAxis
                        dataKey="time_s"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        stroke="#94A3B8"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `${v.toFixed(1)}s`}
                      />
                      <YAxis
                        dataKey="fitted_d2"
                        stroke="#94A3B8"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `${v.toFixed(2)}`}
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
                      <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="fitted_d2"
                        stroke="#22D3EE"
                        strokeWidth={2}
                        dot={false}
                        name="Theoretical Fit: d²(t)"
                      />
                      <Scatter
                        dataKey="empirical_d2"
                        fill="#36D399"
                        name="Empirical NASA Measurement"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Mathematical Equation & Goodness of Fit */}
              {regressionResult && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1E3442]">
                  <div className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block">BURNING RATE (K)</span>
                    <span className="text-base font-mono font-bold text-cyan-400">
                      {regressionResult.calculated_burning_rate_k} mm²/s
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      ±{regressionResult.uncertainty_delta_k} mm²/s
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block">GOODNESS FIT (R²)</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {regressionResult.r_squared.toFixed(4)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      RMSE: {regressionResult.rmse.toFixed(4)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block">INITIAL DIAMETER (d₀)</span>
                    <span className="text-base font-mono font-bold text-slate-200">
                      {Math.sqrt(regressionResult.d0_squared).toFixed(2)} mm
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      d₀² = {regressionResult.d0_squared.toFixed(2)} mm²
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block">NOMINAL FLIGHT K</span>
                    <span className="text-base font-mono font-bold text-amber-400">
                      {regressionResult.nominal_flight_k || regressionResult.calculated_burning_rate_k} mm²/s
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">NASA Reference</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Scientific Interpretation Panel */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-display font-semibold text-sm text-slate-100">
                    Scientific Interpretation
                  </h4>
                </div>

                <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] font-mono text-xs text-cyan-300">
                  {regressionResult?.equation || 'd²(t) = d₀² - K·t'}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {regressionResult?.scientific_interpretation ||
                    'In microgravity droplet combustion, quasi-steady state diffusion kinetics govern the rate of fuel evaporation, resulting in linear d² decay.'}
                </p>

                <div className="pt-2 border-t border-[#1E3442] space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>FUEL TYPE:</span>
                    <span className="text-slate-200">{regressionResult?.fuel_type}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>G-LEVEL:</span>
                    <span className="text-cyan-400">
                      {regressionResult?.gravity_level === 0 ? '10⁻⁶ g (μg)' : '1.0 g'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>AMBIENT O₂:</span>
                    <span className="text-slate-200">{regressionResult?.ambient_o2_percent}%</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>DILUENT:</span>
                    <span className="text-slate-200">{regressionResult?.diluent_gas}</span>
                  </div>
                </div>
              </div>

              {/* Provenance Citation Box */}
              <div className="p-3 rounded-lg bg-[#05090D] border border-[#1E3442] text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CITATION PROVENANCE:</span>
                </div>
                <p className="line-clamp-2 text-slate-400">{regressionResult?.citation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: EXPLORATION CABIN ATMOSPHERE SIMULATOR ─────────────────── */}
      {activeTab === 'atmosphere' && (
        <div className="space-y-6">
          {/* Preset Buttons Bar */}
          <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              STANDARD EXPLORATION ATMOSPHERE PRESETS (NASA SP-2008-565)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {presets.map(p => (
                <button
                  key={p.scenario_id}
                  onClick={() => {
                    setO2Pct(p.oxygen_percentage);
                    setPressureKpa(p.total_pressure_kpa);
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-mono border transition-all ${
                    Math.abs(o2Pct - p.oxygen_percentage) < 0.2 && Math.abs(pressureKpa - p.total_pressure_kpa) < 0.5
                      ? 'bg-[#13212C] border-cyan-400 text-cyan-300 shadow-glow-cyan'
                      : 'bg-[#0A1118] border-[#1E3442] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-[11px] text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {p.oxygen_percentage}% O₂ • {p.total_pressure_kpa} kPa
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders & Live Physics Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders Input Column */}
            <div className="lg:col-span-6 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
                <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Cabin Environment Controls</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">REAL-TIME FLUID MODEL</span>
              </div>

              {/* Oxygen Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">OXYGEN CONCENTRATION (O₂):</span>
                  <span className="text-cyan-400 font-bold text-sm">{o2Pct.toFixed(1)} %</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="40"
                  step="0.5"
                  value={o2Pct}
                  onChange={(e) => setO2Pct(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-[#05090D] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>14% (Hypoxic Extinction)</span>
                  <span>21% (Earth Sea Level)</span>
                  <span>34% (Exploration EVA)</span>
                  <span>40% (Severe Risk)</span>
                </div>
              </div>

              {/* Pressure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">TOTAL CABIN PRESSURE (P_tot):</span>
                  <span className="text-cyan-400 font-bold text-sm">{pressureKpa.toFixed(1)} kPa</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="0.5"
                  value={pressureKpa}
                  onChange={(e) => setPressureKpa(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-[#05090D] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>40 kPa</span>
                  <span>56.5 kPa (NASA Exploration)</span>
                  <span>101.3 kPa (Standard 1 atm)</span>
                  <span>120 kPa</span>
                </div>
              </div>

              {/* Calculated Partial Pressure Box */}
              <div className="p-3.5 rounded-lg bg-[#0A1118] border border-[#1E3442] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    OXYGEN PARTIAL PRESSURE (PO₂)
                  </span>
                  <span className="text-lg font-bold text-cyan-400">
                    {simResult ? `${simResult.calculated_metrics.oxygen_partial_pressure_kpa.toFixed(2)} kPa` : 'Calculating...'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">EQUIVALENT ATM</span>
                  <span className="text-slate-300">
                    {simResult ? `${(simResult.calculated_metrics.oxygen_partial_pressure_kpa / 21.2).toFixed(2)}x Earth Sea Level` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Results Gauge Column */}
            <div className="lg:col-span-6 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E3442] pb-3 mb-4">
                  <h3 className="font-display font-semibold text-sm text-slate-100">
                    Flammability & Hazard Assessment
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                    style={{
                      color: simResult?.calculated_metrics.safety_color || '#36D399',
                      borderColor: `${simResult?.calculated_metrics.safety_color || '#36D399'}60`,
                      backgroundColor: `${simResult?.calculated_metrics.safety_color || '#36D399'}20`,
                    }}
                  >
                    {simResult?.calculated_metrics.display_label || 'COMPUTING'}
                  </span>
                </div>

                {/* Quantitative Metric Displays */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      RELATIVE FLAMMABILITY INDEX
                    </span>
                    <span className="text-xl font-mono font-bold text-cyan-400">
                      {simResult?.calculated_metrics.relative_flammability_index.toFixed(2)}x
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">Relative to 1 atm air</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      BURNING RATE MULTIPLIER
                    </span>
                    <span className="text-xl font-mono font-bold text-amber-400">
                      {simResult?.calculated_metrics.predicted_burning_rate_multiplier.toFixed(2)}x
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">Predicted K enhancement</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    SCIENTIFIC RATIONALE
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0A1118] p-3 rounded-lg border border-[#1E3442]">
                    {simResult?.scientific_rationale}
                  </p>
                </div>
              </div>

              {/* Official NASA Standard Disclaimer */}
              <div className="p-3 rounded-lg bg-[#05090D] border border-[#1E3442] text-[10px] font-mono text-slate-400 flex items-start space-x-2">
                <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p>{simResult?.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: FLIGHT RUN EXPLORER & SINGLE RUN DRILL-DOWN ────────────── */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#0E1821] border border-[#1E3442] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300">FILTERS:</span>
              </div>

              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="bg-[#05090D] border border-[#1E3442] text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">All Mission Series</option>
                <option value="FLEX">FLEX</option>
                <option value="FLEX-2">FLEX-2</option>
                <option value="ACME">ACME</option>
                <option value="CFI">CFI</option>
              </select>

              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="bg-[#05090D] border border-[#1E3442] text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">All Fuels</option>
                <option value="n-heptane">n-heptane</option>
                <option value="methanol">methanol</option>
                <option value="decane">decane</option>
                <option value="PMMA">PMMA</option>
                <option value="silicone">silicone</option>
              </select>

              <select
                value={gravityFilter}
                onChange={(e) => setGravityFilter(e.target.value)}
                className="bg-[#05090D] border border-[#1E3442] text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">All Environments</option>
                <option value="0">Microgravity (10⁻⁶ g)</option>
                <option value="1">Earth Normal (1-g)</option>
              </select>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Showing <span className="text-cyan-400 font-bold">{experiments.length}</span> verified experiments
            </div>
          </div>

          {/* Master Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {experiments.map(exp => (
                <div
                  key={exp.experiment_id}
                  onClick={() => setSelectedExp(exp)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    selectedExp?.experiment_id === exp.experiment_id
                      ? 'bg-[#13212C] border-cyan-400 shadow-glow-cyan'
                      : 'bg-[#0E1821] border-[#1E3442] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">{exp.experiment_id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A1118] text-slate-400 border border-[#1E3442]">
                      {exp.gravity_level === 0 ? '10⁻⁶ g (μg)' : '1-g'}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{exp.title}</h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                    <span>{exp.fuel_type} • {exp.series}</span>
                    <span className="text-cyan-300 font-semibold">
                      {exp.burning_rate_constant_k ? `K: ${exp.burning_rate_constant_k} mm²/s` : 'K: N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Run Inspection Card */}
            <div className="lg:col-span-7">
              {selectedExp ? (
                <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-5">
                  <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                          {selectedExp.experiment_id}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {selectedExp.mission_platform}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {selectedExp.title}
                      </h3>
                    </div>

                    <Link
                      to={`/analysis?exp1=${selectedExp.experiment_id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#13212C] hover:bg-space-750 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center space-x-1 transition-colors"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare Run</span>
                    </Link>
                  </div>

                  {/* Physical Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">BURNING RATE (K)</span>
                      <span className="text-base font-bold text-cyan-400">
                        {selectedExp.burning_rate_constant_k ? `${selectedExp.burning_rate_constant_k} mm²/s` : 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">PEAK FLAME TEMP</span>
                      <span className="text-base font-bold text-amber-400">
                        {selectedExp.peak_flame_temperature_k ? `${selectedExp.peak_flame_temperature_k} K` : 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">FLAME STANDOFF</span>
                      <span className="text-base font-bold text-slate-200">
                        {selectedExp.flame_standoff_ratio ? `${selectedExp.flame_standoff_ratio} r_f/r_s` : 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">FLAME SHAPE</span>
                      <span className="text-base font-bold text-emerald-400">
                        {selectedExp.flame_shape || 'Spherical'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">SOOT YIELD</span>
                      <span className="text-base font-bold text-rose-400">
                        {selectedExp.soot_yield_category || 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442]">
                      <span className="text-[10px] text-slate-400 block uppercase">RISK SCORE</span>
                      <span className="text-base font-bold text-cyan-400">
                        {selectedExp.risk_score ? `${selectedExp.risk_score}/100` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Key Observation Note */}
                  <div className="p-3.5 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                      EMPIRICAL SCIENTIFIC OBSERVATION
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedExp.key_finding || 'Stable symmetric spherical flame envelope maintained throughout droplet regression.'}
                    </p>
                  </div>

                  {/* Citation */}
                  <div className="pt-2 border-t border-[#1E3442] text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>SOURCE: {selectedExp.source_id}</span>
                    <span className="text-slate-500">{selectedExp.citation}</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 border border-[#1E3442] rounded-xl bg-[#0E1821]">
                  Select an experiment from the list to view empirical telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
