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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line
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
          <h1 className="page-title">Flame & Kinetics Analysis</h1>
          <p className="page-subtitle">
            Empirical regressions for droplet burning kinetics ($d^2$-law), cabin flammability models, and flight chamber telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex items-center p-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[9px] text-xs font-medium">
          <button
            onClick={() => setActiveTab('kinetics')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'kinetics'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
            }`}
          >
            d² Droplet Kinetics
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'atmosphere'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
            }`}
          >
            Atmosphere Simulator
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1 rounded-[6px] transition-colors ${
              activeTab === 'explorer'
                ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold'
                : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
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
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-medium text-[#0D0D0D]">
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
                <span className="text-[#6E6E6E]">
                  Slope K: <strong className="text-[#B86B39] font-semibold">{regressionResult.burning_rate_constant_k.toFixed(4)} mm²/s</strong>
                </span>
                <span className="text-[#6E6E6E]">
                  R² Fit: <strong className="text-[#0D0D0D] font-semibold">{regressionResult.r_squared.toFixed(4)}</strong>
                </span>
                <span className="text-[#6E6E6E]">
                  Points: <strong className="text-[#0D0D0D] font-semibold">{regressionResult.empirical_points.length}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Main Chart Card */}
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">
                  Droplet Diameter Squared ($d^2$) vs Time
                </h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">
                  Governed by the classical $d^2(t) = d_0^2 - K \cdot t$ linear evaporation & combustion law
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono text-[#6E6E6E]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B86B39]" />
                  <span>Empirical Measurement</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-0.5 bg-[#0D0D0D]" />
                  <span>Fitted Regression Line</span>
                </div>
              </div>
            </div>

            <div className="h-[360px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={d2ChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
                  <XAxis
                    dataKey="time_s"
                    type="number"
                    stroke="#8F8F8F"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#6E6E6E' }}
                  />
                  <YAxis
                    stroke="#8F8F8F"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Diameter² (mm²)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#6E6E6E' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any, name: string) => [
                      val ? `${Number(val).toFixed(3)} mm²` : '—',
                      name === 'empirical_d2' ? 'Empirical' : 'Linear Fit'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="fitted_d2"
                    stroke="#0D0D0D"
                    strokeWidth={1.5}
                    dot={false}
                    name="fitted_d2"
                  />
                  <Scatter
                    dataKey="empirical_d2"
                    fill="#B86B39"
                    name="empirical_d2"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Physics Interpretation Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 shadow-2xs">
              <h4 className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide">
                Regression Telemetry
              </h4>
              <div className="space-y-1.5 text-xs text-[#2D2D2D]">
                <div className="flex justify-between py-1 border-b border-[#EBEBEB]">
                  <span className="text-[#6E6E6E]">Initial Diameter ($d_0$):</span>
                  <span className="font-mono font-medium text-[#0D0D0D]">
                    {regressionResult ? `${Math.sqrt(regressionResult.initial_diameter_squared_mm2).toFixed(2)} mm` : '1.50 mm'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EBEBEB]">
                  <span className="text-[#6E6E6E]">Extinction Diameter ($d_e$):</span>
                  <span className="font-mono font-medium text-[#0D0D0D]">
                    {regressionResult ? `${Math.sqrt(regressionResult.extinction_diameter_squared_mm2).toFixed(2)} mm` : '0.42 mm'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EBEBEB]">
                  <span className="text-[#6E6E6E]">Total Burn Duration:</span>
                  <span className="font-mono font-medium text-[#0D0D0D]">
                    {regressionResult ? `${regressionResult.burn_duration_s.toFixed(2)} s` : '3.40 s'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 shadow-2xs">
              <h4 className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide">
                Physical Analysis
              </h4>
              <p className="text-xs text-[#6E6E6E] leading-relaxed">
                In microgravity, absence of buoyant plume stabilizes the flame standoff ratio. Radiative cooling from accumulated soot shell leads to premature radiative extinction before full fuel consumption.
              </p>
              <div className="pt-2">
                <Link
                  to={`/copilot?q=${encodeURIComponent(`Explain the d2 regression kinetics for dataset ${selectedSeriesId}`)}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#B86B39] hover:underline"
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
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-3 shadow-2xs">
            <span className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide block">
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
                  className={`px-3 py-1.5 rounded-[7px] text-xs font-medium border transition-colors ${
                    Math.abs(o2Pct - preset.o2_percent) < 0.5 && Math.abs(pressureKpa - preset.pressure_kpa) < 2
                      ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                      : 'bg-[#F7F7F8] text-[#555555] hover:bg-[#EAEAEA] border-[#E5E5E5]'
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
            <div className="p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-5 shadow-2xs">
              <div>
                <div className="flex justify-between text-xs font-medium text-[#0D0D0D] mb-1.5">
                  <span>Oxygen Concentration</span>
                  <span className="font-mono text-[#B86B39] font-semibold">{o2Pct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="40"
                  step="0.5"
                  value={o2Pct}
                  onChange={(e) => setO2Pct(parseFloat(e.target.value))}
                  className="w-full accent-[#0D0D0D]"
                />
                <div className="flex justify-between text-[11px] text-[#8F8F8F] mt-1 font-mono">
                  <span>14% (Hypoxic)</span>
                  <span>21% (Earth)</span>
                  <span>40% (Enriched)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-[#0D0D0D] mb-1.5">
                  <span>Chamber Pressure</span>
                  <span className="font-mono text-[#0D0D0D] font-semibold">
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
                  className="w-full accent-[#0D0D0D]"
                />
                <div className="flex justify-between text-[11px] text-[#8F8F8F] mt-1 font-mono">
                  <span>30 kPa (Lunar EVA)</span>
                  <span>101.3 kPa (Standard)</span>
                  <span>150 kPa</span>
                </div>
              </div>
            </div>

            {/* Right Output Dashboard */}
            <div className="md:col-span-2 p-5 bg-white border border-[#E5E5E5] rounded-[10px] space-y-4 shadow-2xs">
              <h3 className="text-sm font-semibold text-[#0D0D0D]">
                Calculated Combustion Hazards & Limits
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[11px] text-[#8F8F8F] block">Burning Rate Multiplier</span>
                  <span className="text-lg font-semibold text-[#0D0D0D] font-mono mt-0.5 block">
                    {simResult?.burning_rate_multiplier ? `${simResult.burning_rate_multiplier.toFixed(2)}×` : '1.00×'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[11px] text-[#8F8F8F] block">Adiabatic Flame Temp</span>
                  <span className="text-lg font-semibold text-[#0D0D0D] font-mono mt-0.5 block">
                    {simResult?.adiabatic_flame_temp_k ? `${simResult.adiabatic_flame_temp_k.toFixed(0)} K` : '2100 K'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[11px] text-[#8F8F8F] block">Extinction Risk</span>
                  <span className={`text-lg font-semibold font-mono mt-0.5 block ${
                    simResult?.hazard_level === 'HIGH' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {simResult?.hazard_level || 'NOMINAL'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs text-[#2D2D2D] leading-relaxed">
                {simResult?.safety_recommendation ||
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
        <div className="table-shell shadow-2xs">
          <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Microgravity Combustion Flight Records
            </h3>
            <Link to="/experiments" className="text-xs font-medium text-[#B86B39] hover:underline">
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
              <tbody>
                {experiments.slice(0, 10).map(exp => (
                  <tr key={exp.experiment_id} className="hover:bg-[#F9F9FA]">
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#B86B39]">
                      {exp.experiment_id}
                    </td>
                    <td className="table-body-cell font-medium text-[#0D0D0D]">{exp.fuel_type}</td>
                    <td className="table-body-cell text-xs text-[#555555]">
                      {exp.gravity_level === 0 ? '0g Microgravity' : '1g Terrestrial'}
                    </td>
                    <td className="table-body-cell font-mono text-xs text-[#555555]">
                      {exp.ambient_o2_percent ?? 21}%
                    </td>
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#0D0D0D]">
                      {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                    </td>
                    <td className="table-body-cell text-xs text-[#8F8F8F]">
                      {exp.mission_platform || 'ISS CIR'}
                    </td>
                    <td className="table-body-cell text-right">
                      <Link
                        to={`/analysis?expA=${exp.experiment_id}`}
                        className="text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39]"
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
