import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Flame,
  Wind,
  Sliders,
  TrendingDown,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter
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
  const selectedParamId = searchParams.get('experimentId') || searchParams.get('id');

  // Navigation Tabs: 'kinetics' | 'atmosphere' | 'explorer'
  const [activeTab, setActiveTab] = useState<'kinetics' | 'atmosphere' | 'explorer'>('kinetics');

  // Experiments Explorer State
  const [experiments, setExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>((STATIC_EXPERIMENTS[0] as Experiment) || null);
  const [fuelFilter, setFuelFilter] = useState<string>('');
  const [gravityFilter, setGravityFilter] = useState<string>('');

  // D² Kinetics Regression State
  const [d2SeriesList, setD2SeriesList] = useState<D2SeriesInfo[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('D2-FLEX-001');
  const [regressionResult, setRegressionResult] = useState<D2RegressionResult | null>(null);

  // Atmospheric Simulator State
  const [o2Pct, setO2Pct] = useState<number>(21.0);
  const [pressureKpa, setPressureKpa] = useState<number>(101.3);
  const [presets, setPresets] = useState<AtmosphereScenario[]>(STATIC_ATMOSPHERE_SCENARIOS as AtmosphereScenario[]);
  const [simResult, setSimResult] = useState<AtmosphereSimulationResult | null>(null);

  // Load Experiments list
  useEffect(() => {
    api.getExperiments({
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
      })
      .catch(() => {});
  }, [fuelFilter, gravityFilter, selectedParamId]);

  // Load D² Series List
  useEffect(() => {
    api.getD2SeriesList()
      .then(res => {
        setD2SeriesList(res);
        if (res.length > 0 && !selectedSeriesId) {
          setSelectedSeriesId(res[0].series_id);
        }
      })
      .catch(() => {});

    api.getAtmospherePresets()
      .then(res => setPresets(res))
      .catch(() => {});
  }, []);

  // Run D² Regression when series changes
  useEffect(() => {
    if (selectedSeriesId) {
      api.getD2Regression(selectedSeriesId)
        .then(res => setRegressionResult(res))
        .catch(() => {});
    }
  }, [selectedSeriesId]);

  // Run Atmospheric Simulation when sliders change
  useEffect(() => {
    const timer = setTimeout(() => {
      api.simulateAtmosphere({ oxygen_percentage: o2Pct, chamber_pressure_kpa: pressureKpa })
        .then(res => setSimResult(res))
        .catch(() => {});
    }, 120);
    return () => clearTimeout(timer);
  }, [o2Pct, pressureKpa]);

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
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <Flame className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA EXPERIMENTAL COMBUSTION PHYSICS</span>
          </div>
          <h1 className="page-title">Flame & Kinetics Analysis</h1>
          <p className="page-subtitle">
            Empirical regressions for droplet burning kinetics ($d^2$-law), cabin flammability models, and flight chamber telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex items-center p-1 bg-[#101B30]/80 border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('kinetics')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'kinetics'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            d² Droplet Kinetics
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'atmosphere'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            Atmosphere Simulator
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'explorer'
                ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.5)] font-semibold'
                : 'text-[#AAB6CA] hover:text-white'
            }`}
          >
            Telemetry Explorer
          </button>
        </div>
      </div>

      {/* ── TAB 1: D² DROPLET KINETICS & REGRESSION ───────────────────────── */}
      {activeTab === 'kinetics' && (
        <div className="space-y-6">
          {/* Top Series Selector Bar */}
          <div className="p-4 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-medium text-[#AAB6CA]">
                Selected Flight Dataset:
              </label>
              <select
                value={selectedSeriesId}
                onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="select-standard font-mono"
              >
                {d2SeriesList.map(s => (
                  <option key={s.series_id} value={s.series_id}>
                    {s.series_id} • {s.fuel_type} ({s.gravity_level === 0 ? '0g Microgravity' : '1g'})
                  </option>
                ))}
              </select>
            </div>

            {regressionResult && (
              <div className="flex items-center space-x-4 text-xs font-mono">
                <span className="text-[#AAB6CA]">
                  Slope K: <strong className="text-[#38BDF8] font-semibold">{regressionResult.calculated_burning_rate_k.toFixed(4)} mm²/s</strong>
                </span>
                <span className="text-[#AAB6CA]">
                  R² Fit: <strong className="text-white font-semibold">{regressionResult.r_squared.toFixed(4)}</strong>
                </span>
                <span className="text-[#AAB6CA]">
                  Points: <strong className="text-white font-semibold">{regressionResult.empirical_points.length}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Main Chart Card */}
          <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Droplet Diameter Squared ($d^2$) vs Time
                </h3>
                <p className="text-xs text-[#AAB6CA] mt-0.5">
                  Governed by the classical $d^2(t) = d_0^2 - K \cdot t$ linear evaporation & combustion law
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono text-[#AAB6CA]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F82FF] shadow-[0_0_6px_#2F82FF]" />
                  <span>Empirical Measurement</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-0.5 bg-[#38BDF8]" />
                  <span>Fitted Regression Line</span>
                </div>
              </div>
            </div>

            <div className="h-[360px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={d2ChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 165, 255, 0.12)" />
                  <XAxis
                    dataKey="time_s"
                    type="number"
                    stroke="#78869C"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#AAB6CA' }}
                  />
                  <YAxis
                    stroke="#78869C"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Diameter² (mm²)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#AAB6CA' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07111F', borderColor: 'rgba(120, 165, 255, 0.35)', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                    formatter={(val: any, name: string) => [
                      val ? `${Number(val).toFixed(3)} mm²` : '—',
                      name === 'empirical_d2' ? 'Empirical' : 'Linear Fit'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="fitted_d2"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={false}
                    name="fitted_d2"
                  />
                  <Scatter
                    dataKey="empirical_d2"
                    fill="#2F82FF"
                    name="empirical_d2"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Physics Interpretation Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-2">
              <h4 className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide">
                Regression Telemetry
              </h4>
              <div className="space-y-1.5 text-xs text-[#E2E8F0]">
                <div className="flex justify-between py-1.5 border-b border-[rgba(120,165,255,0.12)]">
                  <span className="text-[#AAB6CA]">Initial Diameter ($d_0$):</span>
                  <span className="font-mono font-medium text-white">
                    {regressionResult ? `${Math.sqrt(regressionResult.d0_squared).toFixed(2)} mm` : '2.00 mm'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(120,165,255,0.12)]">
                  <span className="text-[#AAB6CA]">Equation:</span>
                  <span className="font-mono font-medium text-[#38BDF8]">
                    {regressionResult ? regressionResult.equation : 'D²(t) = 4.00 - 0.67·t'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(120,165,255,0.12)]">
                  <span className="text-[#AAB6CA]">Platform:</span>
                  <span className="font-mono font-medium text-white">
                    {regressionResult?.mission_platform || 'ISS CIR (Destiny Lab)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-2">
              <h4 className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide">
                Physical Analysis
              </h4>
              <p className="text-xs text-[#AAB6CA] leading-relaxed">
                In microgravity, absence of buoyant plume stabilizes the flame standoff ratio. Radiative cooling from accumulated soot shell leads to premature radiative extinction before full fuel consumption.
              </p>
              <div className="pt-2">
                <Link
                  to={`/copilot?q=${encodeURIComponent(`Explain the d2 regression kinetics for dataset ${selectedSeriesId}`)}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Copilot to analyze this dataset</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ATMOSPHERIC FLAMMABILITY SIMULATOR ───────────────────────── */}
      {activeTab === 'atmosphere' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="p-5 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide block">
              Mission Cabin Exploration Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setO2Pct(preset.o2_percent);
                    setPressureKpa(preset.pressure_kpa);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    Math.abs(o2Pct - preset.o2_percent) < 0.5 && Math.abs(pressureKpa - preset.pressure_kpa) < 2
                      ? 'bg-[#1769FF] text-white border-[#2F82FF] shadow-[0_0_10px_rgba(47,130,255,0.5)]'
                      : 'bg-[#101B30]/70 text-[#AAB6CA] hover:text-white border-[rgba(120,165,255,0.18)]'
                  }`}
                >
                  {preset.name} ({preset.o2_percent}% O₂ @ {(preset.pressure_kpa / 101.325).toFixed(2)} atm)
                </button>
              ))}
            </div>
          </div>

          {/* Sliders and Simulation Result */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Controls */}
            <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-5">
              <div>
                <div className="flex justify-between text-xs font-medium text-white mb-1.5">
                  <span>Oxygen Concentration</span>
                  <span className="font-mono text-[#38BDF8] font-semibold">{o2Pct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="40"
                  step="0.5"
                  value={o2Pct}
                  onChange={(e) => setO2Pct(parseFloat(e.target.value))}
                  className="w-full accent-[#2F82FF]"
                />
                <div className="flex justify-between text-[11px] text-[#78869C] mt-1 font-mono">
                  <span>14% (Hypoxic)</span>
                  <span>21% (Earth)</span>
                  <span>40% (Enriched)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-white mb-1.5">
                  <span>Chamber Pressure</span>
                  <span className="font-mono text-white font-semibold">
                    {pressureKpa.toFixed(1)} kPa ({(pressureKpa / 101.325).toFixed(2)} atm)
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="1"
                  value={pressureKpa}
                  onChange={(e) => setPressureKpa(parseFloat(e.target.value))}
                  className="w-full accent-[#2F82FF]"
                />
                <div className="flex justify-between text-[11px] text-[#78869C] mt-1 font-mono">
                  <span>30 kPa (Lunar EVA)</span>
                  <span>101.3 kPa (Standard)</span>
                  <span>150 kPa</span>
                </div>
              </div>
            </div>

            {/* Right Output Dashboard */}
            <div className="md:col-span-2 p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Calculated Combustion Hazards & Limits
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#101B30]/70 border border-[rgba(120,165,255,0.18)] rounded-xl">
                  <span className="text-[11px] text-[#78869C] block">Burning Rate Multiplier</span>
                  <span className="text-lg font-semibold text-[#38BDF8] font-mono mt-0.5 block">
                    {simResult?.calculated_metrics?.predicted_burning_rate_multiplier ? `${simResult.calculated_metrics.predicted_burning_rate_multiplier.toFixed(2)}×` : '1.00×'}
                  </span>
                </div>
                <div className="p-3.5 bg-[#101B30]/70 border border-[rgba(120,165,255,0.18)] rounded-xl">
                  <span className="text-[11px] text-[#78869C] block">Oxygen Partial Pressure</span>
                  <span className="text-lg font-semibold text-white font-mono mt-0.5 block">
                    {simResult?.calculated_metrics?.oxygen_partial_pressure_kpa ? `${simResult.calculated_metrics.oxygen_partial_pressure_kpa.toFixed(1)} kPa` : '21.2 kPa'}
                  </span>
                </div>
                <div className="p-3.5 bg-[#101B30]/70 border border-[rgba(120,165,255,0.18)] rounded-xl">
                  <span className="text-[11px] text-[#78869C] block">Hazard Classification</span>
                  <span className={`text-lg font-semibold font-mono mt-0.5 block ${
                    simResult?.calculated_metrics?.risk_level === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {simResult?.calculated_metrics?.risk_category || 'NOMINAL'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#101B30]/50 border border-[rgba(120,165,255,0.18)] rounded-xl text-xs text-[#E2E8F0] leading-relaxed">
                {simResult?.scientific_rationale ||
                  `At ${o2Pct.toFixed(1)}% O₂ and ${pressureKpa.toFixed(1)} kPa, oxygen partial pressure is ${(
                    (o2Pct / 100) *
                    pressureKpa
                  ).toFixed(1)} kPa. Materials exhibit standard flammability index according to NASA STD-6001B.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: FLIGHT TELEMETRY EXPLORER ───────────────────────────────── */}
      {activeTab === 'explorer' && (
        <div className="table-shell">
          <div className="p-4 border-b border-[rgba(120,165,255,0.18)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Microgravity Combustion Flight Records
            </h3>
            <Link to="/experiments" className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF]">
              View Full Scientific Repository →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="table-header-cell font-mono w-28">ID</th>
                  <th className="table-header-cell">Fuel</th>
                  <th className="table-header-cell w-36">Gravity</th>
                  <th className="table-header-cell font-mono w-24">O₂ %</th>
                  <th className="table-header-cell font-mono w-32">Burn Rate K</th>
                  <th className="table-header-cell w-28">Platform</th>
                  <th className="table-header-cell text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(120,165,255,0.1)]">
                {experiments.slice(0, 10).map(exp => (
                  <tr key={exp.experiment_id} className="hover:bg-[#101B30]/70">
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#69B7FF]">
                      {exp.experiment_id}
                    </td>
                    <td className="table-body-cell font-medium text-white">{exp.fuel_type}</td>
                    <td className="table-body-cell text-xs text-[#AAB6CA]">
                      {exp.gravity_level === 0 ? '0g Microgravity' : '1g Terrestrial'}
                    </td>
                    <td className="table-body-cell font-mono text-xs text-[#AAB6CA]">
                      {exp.ambient_o2_percent ?? 21}%
                    </td>
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#38BDF8]">
                      {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                    </td>
                    <td className="table-body-cell text-xs text-[#78869C]">
                      {exp.mission_platform || 'ISS CIR'}
                    </td>
                    <td className="table-body-cell text-right">
                      <Link
                        to={`/analysis?expA=${exp.experiment_id}`}
                        className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF]"
                      >
                        Compare
                      </Link>
                    </td>
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
