import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Activity,
  Layers,
  Database,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Clock,
  Compass,
  Cpu,
  BarChart2,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { STATIC_DASHBOARD_DATA } from '../data/staticData';

const SHAPE_COLORS = ['#38BDF8', '#0EA5E9', '#FBBF24', '#34D399'];
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#F43F5E',
  HIGH: '#FB923C',
  MEDIUM: '#FBBF24',
  LOW: '#34D399',
};

export const MissionOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData>(STATIC_DASHBOARD_DATA as unknown as DashboardData);

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        if (res && res.telemetry && typeof res !== 'string') {
          setData(res);
        }
      })
      .catch(err => {
        console.warn('Live telemetry stream unavailable, showing verified flight dataset:', err);
      });
  }, []);

  const safeData = data || (STATIC_DASHBOARD_DATA as unknown as DashboardData);
  const telemetry = safeData.telemetry || STATIC_DASHBOARD_DATA.telemetry;
  const flame_shapes = safeData.flame_shapes || STATIC_DASHBOARD_DATA.flame_shapes || [];
  const recent_experiments = safeData.recent_experiments || STATIC_DASHBOARD_DATA.recent_experiments || [];
  const key_insights = safeData.key_insights || STATIC_DASHBOARD_DATA.key_insights || [];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-8">
      {/* ── 1. MISSION HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1B2B3C]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              NASA SPACE APPS 2026
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
              CHALLENGE 08: FLAME IN FREEFALL
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-cyan-300 font-semibold">
              QUANTUMX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Mission Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Understanding combustion behavior in microgravity through scientific intelligence.
          </p>
        </div>

        {/* Top Mission Control Status HUD */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="px-3 py-1.5 sm:py-2 rounded-md bg-[#090F16] border border-[#1B2B3C] font-mono text-right">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-nominal" />
              <span>ISS CIR TELEMETRY</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-cyan-400 tracking-wider">
              ALT: 408 KM • 10⁻⁶ g
            </div>
          </div>

          <Link
            to="/copilot"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-mono font-medium tracking-wider flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">LAUNCH</span>
            <span>COPILOT</span>
          </Link>
        </div>
      </div>

      {/* ── 2. MAIN SCIENTIFIC HERO SECTION ──────────────────────────────── */}
      <div className="rounded-lg overflow-hidden border border-[#1B2B3C] bg-[#090F16] shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Flame Visualizer Panel */}
          <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] bg-black flex flex-col justify-between p-3 sm:p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1B2B3C]">
            <img
              src="/spherical-flame.jpg"
              alt="NASA Microgravity Spherical Flame"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
            />
            {/* Visual HUD Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
            
            {/* Top Left Tag */}
            <div className="relative z-10 font-mono space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-[10px] tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                EMPIRICAL NASA FLIGHT OBSERVATION
              </span>
              <div className="text-[10px] text-slate-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-[#1B2B3C] inline-block ml-1">
                FLEX &amp; ACME CIR FLIGHT RACK
              </div>
            </div>

            {/* Bottom HUD Specs */}
            <div className="relative z-10 font-mono text-[10px] sm:text-[11px] bg-[#060A10]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-md border border-[#1B2B3C] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div>
                  <span className="text-slate-500 block text-[9px]">ENVIRONMENT</span>
                  <span className="text-cyan-400 font-semibold">ISS CIR • 10⁻⁶ g</span>
                </div>
                <div className="h-4 w-[1px] bg-[#1B2B3C] hidden sm:block" />
                <div>
                  <span className="text-slate-500 block text-[9px]">GEOMETRY</span>
                  <span className="text-slate-200">Spherical Ring</span>
                </div>
                <div className="h-4 w-[1px] bg-[#1B2B3C] hidden sm:block" />
                <div>
                  <span className="text-slate-500 block text-[9px]">TRANSPORT</span>
                  <span className="text-emerald-400">Pure Diffusion</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[9px]">STATUS</span>
                <span className="text-cyan-300 font-semibold">VERIFIED DATA</span>
              </div>
            </div>
          </div>

          {/* Right Hero Overview & Scientific Context */}
          <div className="lg:col-span-5 p-4 sm:p-5 lg:p-6 flex flex-col justify-between space-y-4 bg-[#090F16]">
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  RESEARCH PHENOMENOLOGY
                </span>
              </div>

              <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-white tracking-tight leading-snug">
                Symmetric Spherical Combustion in Buoyancy-Free Space
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                On Earth, hot combustion gases rise due to natural thermal buoyancy, elongating flames into vertical teardrops. In microgravity, buoyancy is eliminated (<span className="text-cyan-300 font-mono">10⁻⁶ g</span>). Oxygen is transported exclusively by slow molecular diffusion, creating stable, spherical reaction zones with cooler boundaries and extended residence times.
              </p>

              <div className="p-3 rounded-md bg-[#0D1622] border border-[#1B2B3C] space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-400">
                  <span>D² Burning Rate Law:</span>
                  <span className="text-cyan-400 font-bold">d²(t) = d₀² - K·t</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Soot Shell Formation:</span>
                  <span className="text-amber-400 font-semibold">Spherical Standoff Layer</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Extinction Behavior:</span>
                  <span className="text-emerald-400 font-semibold">Radiative &amp; Cool Flame</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1B2B3C]">
              <Link
                to="/combustion"
                className="p-2 sm:p-2.5 rounded-md bg-[#0D1622] hover:bg-[#121D2C] border border-[#1B2B3C] hover:border-cyan-500/40 text-xs font-mono text-slate-200 flex items-center justify-between transition-colors group"
              >
                <span>D² Kinetics</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
              <Link
                to="/reports"
                className="p-2 sm:p-2.5 rounded-md bg-[#0D1622] hover:bg-[#121D2C] border border-[#1B2B3C] hover:border-cyan-500/40 text-xs font-mono text-slate-200 flex items-center justify-between transition-colors group"
              >
                <span>Briefings</span>
                <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. RESEARCH METRICS GRID (100% RESPONSIVE) ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">DATASETS</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white">{telemetry?.total_experiments ?? 29}</p>
          <div className="mt-1 text-[10px] font-mono text-cyan-400 truncate">
            {telemetry?.microgravity_experiments ?? 24} in μg • {telemetry?.ground_reference_experiments ?? 5} in 1-g
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">PAPERS</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white">{telemetry?.total_documents ?? 30}</p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            {telemetry?.total_sources ?? 28} NASA Portals
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">PORTALS</span>
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white">{telemetry?.total_sources ?? 28}</p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            PSI • NTRS • GRC
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">D² TIMESERIES</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white">{telemetry?.d2_timeseries_datasets ?? 4}</p>
          <div className="mt-1 text-[10px] font-mono text-amber-400 truncate">
            R² ≥ 0.99 Linear Fit
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">ACCIDENTS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white">{telemetry?.historical_incidents ?? 3}</p>
          <div className="mt-1 text-[10px] font-mono text-rose-400 truncate">
            Apollo 1, 13, Mir
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-md mission-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">AVG RISK</span>
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">{telemetry?.average_risk_score ?? 61.2}</p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            Deterministic Score
          </div>
        </div>
      </div>

      {/* ── 4. EARTH VS MICROGRAVITY COMPARISON MATRIX ────────────────────── */}
      <div className="p-4 sm:p-5 rounded-md mission-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#1B2B3C] pb-2.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                SCIENTIFIC COMPARISON
              </span>
              <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                Combustion Physics: Earth Normal Gravity (1-g) vs Microgravity (10⁻⁶ g)
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            NAVIER-STOKES &amp; FICKIAN DIFFUSION
          </span>
        </div>

        {/* Scrollable on small devices */}
        <div className="scientific-table-container">
          <table className="w-full text-left font-mono text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-[#1B2B3C] text-[10px] text-slate-400">
                <th className="py-2 px-3">PHENOMENON</th>
                <th className="py-2 px-3 text-slate-300">EARTH GRAVITY (1-g)</th>
                <th className="py-2 px-3 text-cyan-300">MICROGRAVITY (10⁻⁶ g)</th>
                <th className="py-2 px-3 text-emerald-400">SPACE SAFETY IMPACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2B3C]/50 text-slate-300">
              <tr className="hover:bg-[#0D1622] transition-colors">
                <td className="py-2.5 px-3 font-semibold text-white">Buoyancy Flow</td>
                <td className="py-2.5 px-3">Strong natural convection (Gr &gt;&gt; 1)</td>
                <td className="py-2.5 px-3 text-cyan-300">Buoyancy suppressed (Gr ≈ 0)</td>
                <td className="py-2.5 px-3 text-slate-400">Transport becomes pure molecular diffusion</td>
              </tr>
              <tr className="hover:bg-[#0D1622] transition-colors">
                <td className="py-2.5 px-3 font-semibold text-white">Flame Geometry</td>
                <td className="py-2.5 px-3">Elongated flickering teardrop</td>
                <td className="py-2.5 px-3 text-cyan-300">Stable, symmetric spherical envelope</td>
                <td className="py-2.5 px-3 text-slate-400">Enables exact 1D spherical mathematical modeling</td>
              </tr>
              <tr className="hover:bg-[#0D1622] transition-colors">
                <td className="py-2.5 px-3 font-semibold text-white">Burn Rate Constant (K)</td>
                <td className="py-2.5 px-3">Elevated (~0.95 mm²/s for heptane)</td>
                <td className="py-2.5 px-3 text-cyan-300">Reduced (~0.76 mm²/s for heptane)</td>
                <td className="py-2.5 px-3 text-slate-400">Longer droplet lifetime, slower oxidizer intake</td>
              </tr>
              <tr className="hover:bg-[#0D1622] transition-colors">
                <td className="py-2.5 px-3 font-semibold text-white">Soot Accumulation</td>
                <td className="py-2.5 px-3">Carried upward into buoyant plume</td>
                <td className="py-2.5 px-3 text-cyan-300">Trapped in concentric spherical shell</td>
                <td className="py-2.5 px-3 text-slate-400">High radiative heat loss; triggers cool flame transition</td>
              </tr>
              <tr className="hover:bg-[#0D1622] transition-colors">
                <td className="py-2.5 px-3 font-semibold text-white">Smoke Detector Alarm</td>
                <td className="py-2.5 px-3">Rapid ceiling plume collection</td>
                <td className="py-2.5 px-3 text-rose-300 font-bold">No ceiling plume; relies on air ventilation</td>
                <td className="py-2.5 px-3 text-rose-400">Severe detection latency unless sensors sit in duct returns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. SECTIONS A & B: FINDINGS & COMBUSTION MORPHOLOGY ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section A: Latest Research Findings */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-md mission-card space-y-3">
          <div className="flex items-center justify-between border-b border-[#1B2B3C] pb-2.5">
            <div>
              <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                Key NASA Research Findings
              </h3>
              <p className="text-xs text-slate-400">
                Empirical conclusions from FLEX, ACME, and CFI flight missions.
              </p>
            </div>
            <Link
              to="/library"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View All 30 Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {key_insights.slice(0, 4).map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-md bg-[#0D1622] border border-[#1B2B3C] hover:border-cyan-500/30 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800">
                    {insight.series}
                  </span>
                  <span className="text-slate-500 truncate max-w-[200px]">{insight.source}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{insight.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {insight.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Combustion Behavior & Flame Morphology */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-md mission-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1B2B3C] pb-2.5 mb-3">
              <div>
                <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                  Combustion Morphology
                </h3>
                <p className="text-xs text-slate-400">
                  Geometry breakdown across 29 verified runs.
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-[#0D1622] border border-[#1B2B3C]">
                24 μg / 5 1-g
              </span>
            </div>

            {/* Pie Chart of Flame Shapes */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={flame_shapes}
                    dataKey="count"
                    nameKey="flame_shape"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {flame_shapes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SHAPE_COLORS[index % SHAPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090F16',
                      borderColor: '#1B2B3C',
                      borderRadius: '0.375rem',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Stats */}
            <div className="space-y-1.5 mt-2">
              {flame_shapes.map((item, idx) => (
                <div
                  key={item.flame_shape}
                  className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-[#0D1622] border border-[#1B2B3C]"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: SHAPE_COLORS[idx % SHAPE_COLORS.length] }}
                    />
                    <span className="text-slate-300">{item.flame_shape}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>{item.count} runs</span>
                    <span className="text-cyan-400 font-semibold">{item.avg_temp_k || 1850} K</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-md bg-[#0D1622] border border-[#1B2B3C] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>PREDOMINANT GEOMETRY:</span>
            <span className="text-cyan-400 font-bold">SPHERICAL (62.1%)</span>
          </div>
        </div>
      </div>

      {/* ── 6. SECTION D: RECENT SCIENTIFIC RUNS TABLE ─────────────────────── */}
      <div className="p-4 sm:p-5 rounded-md mission-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#1B2B3C] pb-2.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                FLIGHT TELEMETRY
              </span>
              <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                Recent Empirical Microgravity Experiments
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified NASA Physical Sciences Informatics (PSI) &amp; NTRS records.
            </p>
          </div>
          <Link
            to="/combustion"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>All 29 Experiments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Experiment Records Table with Horizontal Scroll */}
        <div className="scientific-table-container">
          <table className="w-full text-left font-mono text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-[#1B2B3C] text-[10px] text-slate-400">
                <th className="py-2 px-3">EXP ID</th>
                <th className="py-2 px-3">SERIES / PLATFORM</th>
                <th className="py-2 px-3">FUEL &amp; CATEGORY</th>
                <th className="py-2 px-3">GRAVITY</th>
                <th className="py-2 px-3">BURNING RATE (K)</th>
                <th className="py-2 px-3">FLAME SHAPE</th>
                <th className="py-2 px-3">RISK LEVEL</th>
                <th className="py-2 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2B3C]/50 text-slate-300">
              {recent_experiments.slice(0, 5).map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-[#0D1622] transition-colors">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{exp.experiment_id}</td>
                  <td className="py-2.5 px-3">{exp.series} ({exp.mission_platform})</td>
                  <td className="py-2.5 px-3">{exp.fuel_type}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0D1622] border border-[#1B2B3C]">
                      {exp.gravity_level === 0 ? '10⁻⁶ g (μg)' : '1.0 g'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                    {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k} mm²/s` : 'N/A'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{exp.flame_shape || 'Spherical'}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        color: RISK_COLORS[exp.risk_level || 'MEDIUM'],
                        borderColor: `${RISK_COLORS[exp.risk_level || 'MEDIUM']}40`,
                        backgroundColor: `${RISK_COLORS[exp.risk_level || 'MEDIUM']}15`,
                      }}
                    >
                      {exp.risk_level || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to={`/combustion?id=${exp.experiment_id}`}
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
