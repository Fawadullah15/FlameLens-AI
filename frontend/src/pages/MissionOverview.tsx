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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';

const SHAPE_COLORS = ['#22D3EE', '#0891B2', '#F5B942', '#36D399'];
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#FF7139',
  MEDIUM: '#F5B942',
  LOW: '#36D399',
};

export const MissionOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Mission Overview load failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-cyan-400">
        <Flame className="w-8 h-8 animate-pulse text-cyan-400" />
        <p className="tracking-widest">RETRIEVING NASA MISSION TELEMETRY...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-400 font-mono text-sm">
        Failed to connect to backend telemetry stream.
      </div>
    );
  }

  const { telemetry, flame_shapes, recent_experiments, key_insights, risk_breakdown } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── 1. MISSION HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              NASA SPACE APPS CHALLENGE 2026
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              CHALLENGE 08: FLAME IN FREEFALL
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold">
              QUANTUMX RESEARCH TEAM
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight">
            Mission Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed mt-0.5">
            Understanding combustion behavior in microgravity through scientific intelligence.
          </p>
        </div>

        {/* Top Mission Control Countdown / Status HUD */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-[#0E1821] border border-[#1E3442] font-mono text-right">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ISS CIR TELEMETRY</span>
            </div>
            <div className="text-sm font-bold text-cyan-400 tracking-wider">
              ALT: 408 KM • 10⁻⁶ g
            </div>
          </div>

          <Link
            to="/copilot"
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg text-xs font-mono font-medium tracking-wider flex items-center space-x-2 shadow-glow-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LAUNCH COPILOT</span>
          </Link>
        </div>
      </div>

      {/* ── 2. MAIN SCIENTIFIC HERO SECTION ──────────────────────────────── */}
      <div className="rounded-xl overflow-hidden border border-[#1E3442] bg-[#0E1821] relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Flame Visualizer Panel */}
          <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[380px] bg-black flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E3442]">
            <img
              src="/spherical-flame.jpg"
              alt="NASA Microgravity Spherical Flame"
              className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
            />
            {/* Visual HUD Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1821] via-transparent to-black/40 pointer-events-none" />
            
            {/* Top Left Tag */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 font-mono">
              <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/50 text-[10px] tracking-wider font-semibold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                EMPIRICAL NASA FLIGHT OBSERVATION
              </span>
              <span className="text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-[#1E3442]">
                SPHERICAL DROPLET ENVELOPE (FLEX SERIES)
              </span>
            </div>

            {/* Bottom HUD Specs */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 font-mono text-[11px] bg-[#0A1118]/85 backdrop-blur-md p-3 rounded-lg border border-[#1E3442]">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-500 block text-[9px]">ENVIRONMENT</span>
                  <span className="text-cyan-400 font-semibold">ISS CIR • 10⁻⁶ g</span>
                </div>
                <div className="h-5 w-[1px] bg-[#1E3442]" />
                <div>
                  <span className="text-slate-500 block text-[9px]">GEOMETRY</span>
                  <span className="text-slate-200">Pure Spherical Ring</span>
                </div>
                <div className="h-5 w-[1px] bg-[#1E3442]" />
                <div>
                  <span className="text-slate-500 block text-[9px]">DOMINANT MECHANISM</span>
                  <span className="text-emerald-400">Radial Diffusion</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[9px]">DATA STATUS</span>
                <span className="text-cyan-300 font-semibold">VERIFIED EMPIRICAL</span>
              </div>
            </div>
          </div>

          {/* Right Hero Overview & Scientific Context */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0E1821] to-[#0A1118]">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  RESEARCH CONTEXT & PHENOMENOLOGY
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-tight leading-snug">
                Symmetric Spherical Combustion in Buoyancy-Free Space
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                On Earth, hot combustion gases rise due to natural thermal buoyancy, elongating flames into vertical teardrops. In microgravity, buoyancy is eliminated (<span className="text-cyan-300 font-mono">10⁻⁶ g</span>). Oxygen is transported exclusively by slow molecular diffusion, creating stable, spherical reaction zones with significantly cooler boundaries and extended residence times.
              </p>

              <div className="p-3 rounded-lg bg-[#05090D] border border-[#1E3442] space-y-2 text-xs font-mono">
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
                  <span className="text-emerald-400 font-semibold">Radiative & Cool Flame</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E3442]">
              <Link
                to="/combustion"
                className="p-2.5 rounded-lg bg-[#13212C] hover:bg-space-750 border border-[#1E3442] hover:border-cyan-500/50 text-xs font-mono text-slate-200 flex items-center justify-between transition-colors group"
              >
                <span>D² Kinetics Lab</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                to="/reports"
                className="p-2.5 rounded-lg bg-[#13212C] hover:bg-space-750 border border-[#1E3442] hover:border-cyan-500/50 text-xs font-mono text-slate-200 flex items-center justify-between transition-colors group"
              >
                <span>Export Briefing</span>
                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. RESEARCH METRICS GRID ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">DATASETS INDEXED</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{telemetry.total_experiments}</p>
          <div className="mt-1 text-[10px] font-mono text-cyan-400 truncate">
            {telemetry.microgravity_experiments} in μg • {telemetry.ground_reference_experiments} in 1-g
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">PAPERS CATALOGED</span>
            <Layers className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{telemetry.total_documents}</p>
          <div className="mt-1 text-[10px] font-mono text-teal-400 truncate">
            {telemetry.total_sources} NASA Portals
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">REPOSITORIES</span>
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{telemetry.total_sources}</p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            PSI • NTRS • GRC
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">D² REGRESSIONS</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{telemetry.d2_timeseries_datasets || 4}</p>
          <div className="mt-1 text-[10px] font-mono text-amber-400 truncate">
            R² ≥ 0.99 Linear Fit
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">ACCIDENT DOSSIERS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{telemetry.historical_incidents || 3}</p>
          <div className="mt-1 text-[10px] font-mono text-rose-400 truncate">
            Apollo 1, 13, Mir
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">AVG RISK SCORE</span>
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-cyan-400">{telemetry.average_risk_score}/100</p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            {telemetry.critical_risk_materials} Critical Materials
          </div>
        </div>
      </div>

      {/* ── 4. SECTION C: EARTH VS MICROGRAVITY COMPARISON MATRIX ─────────── */}
      <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3442] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                SCIENTIFIC COMPARISON
              </span>
              <h3 className="font-display font-semibold text-base text-slate-100">
                Combustion Physics: Earth Normal Gravity (1-g) vs Microgravity (10⁻⁶ g)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing established fundamental transport principles from experiment-specific flight measurements.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            GOVERNING LAW: NAVIER-STOKES & FICK'S LAW
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E3442] text-[10px] text-slate-400">
                <th className="py-2.5 px-3">PHYSICAL PHENOMENON</th>
                <th className="py-2.5 px-3 text-slate-300">EARTH GRAVITY (1-g)</th>
                <th className="py-2.5 px-3 text-cyan-300">MICROGRAVITY (10⁻⁶ g)</th>
                <th className="py-2.5 px-3 text-emerald-400">SCIENTIFIC IMPACT FOR SPACEFLIGHT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3442]/60 text-slate-300">
              <tr className="hover:bg-[#13212C]/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">Buoyant Fluid Flow</td>
                <td className="py-3 px-3">Strong buoyant convection (Gr &gt;&gt; 1)</td>
                <td className="py-3 px-3 text-cyan-300">Buoyancy suppressed (Gr ≈ 0)</td>
                <td className="py-3 px-3 text-slate-400">Transport becomes pure molecular diffusion</td>
              </tr>
              <tr className="hover:bg-[#13212C]/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">Flame Geometry</td>
                <td className="py-3 px-3">Elongated, flickering teardrop</td>
                <td className="py-3 px-3 text-cyan-300">Stable, symmetric spherical envelope</td>
                <td className="py-3 px-3 text-slate-400">Allows exact 1D spherical mathematical modeling</td>
              </tr>
              <tr className="hover:bg-[#13212C]/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">Burning Rate Constant (K)</td>
                <td className="py-3 px-3">Elevated (~0.95 mm²/s for heptane)</td>
                <td className="py-3 px-3 text-cyan-300">Reduced (~0.76 mm²/s for heptane)</td>
                <td className="py-3 px-3 text-slate-400">Longer droplet lifetime, slower consumption</td>
              </tr>
              <tr className="hover:bg-[#13212C]/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">Soot Accumulation</td>
                <td className="py-3 px-3">Carried upward into buoyant smoke plume</td>
                <td className="py-3 px-3 text-cyan-300">Trapped in concentric spherical shell</td>
                <td className="py-3 px-3 text-slate-400">High radiative heat loss; triggers cool flame transition</td>
              </tr>
              <tr className="hover:bg-[#13212C]/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">Smoke Detector Response</td>
                <td className="py-3 px-3">Rapid ceiling collection via buoyant thermal plume</td>
                <td className="py-3 px-3 text-rose-300 font-bold">No ceiling plume; relies strictly on air ventilation</td>
                <td className="py-3 px-3 text-rose-400">Significant alarm latency unless sensors sit in duct returns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. SECTIONS A & B: LATEST FINDINGS & COMBUSTION BEHAVIOR ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section A: Latest Research Findings */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3442] pb-3">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-100">
                Latest NASA Research Findings
              </h3>
              <p className="text-xs text-slate-400">
                Empirical takeaways synthesized across FLEX, ACME, and CFI flight missions.
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

          <div className="space-y-3">
            {key_insights.slice(0, 4).map((insight) => (
              <div
                key={insight.id}
                className="p-3.5 rounded-lg bg-[#0A1118] border border-[#1E3442] hover:border-cyan-500/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                    {insight.series}
                  </span>
                  <span className="text-slate-500">{insight.source}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{insight.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {insight.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Combustion Behavior & Flame Morphology */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3442] pb-3 mb-4">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-100">
                  Combustion Morphology
                </h3>
                <p className="text-xs text-slate-400">
                  Distribution of flame geometry across 29 verified runs.
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
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
                    paddingAngle={4}
                  >
                    {flame_shapes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SHAPE_COLORS[index % SHAPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1118',
                      borderColor: '#1E3442',
                      borderRadius: '0.5rem',
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
                  className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-[#0A1118] border border-[#1E3442]/60"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: SHAPE_COLORS[idx % SHAPE_COLORS.length] }}
                    />
                    <span className="text-slate-300">{item.flame_shape}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>{item.count} runs</span>
                    <span className="text-cyan-400 font-semibold">{item.avg_temp_k} K avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>PREDOMINANT SHAPE:</span>
            <span className="text-cyan-400 font-bold">SPHERICAL (62.1%)</span>
          </div>
        </div>
      </div>

      {/* ── 6. SECTION D: RECENT SCIENTIFIC ACTIVITY & HARDWARE READINESS ─── */}
      <div className="p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3442] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                FLIGHT TELEMETRY ARCHIVE
              </span>
              <h3 className="font-display font-semibold text-base text-slate-100">
                Recent Empirical Experiments & Flight Chamber Hardware
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live records pulled directly from NASA physical sciences informatics datasets.
            </p>
          </div>
          <Link
            to="/combustion"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Open Experiment Analyzer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Experiment Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E3442] text-[10px] text-slate-400">
                <th className="py-2.5 px-3">EXP ID</th>
                <th className="py-2.5 px-3">SERIES / MISSION</th>
                <th className="py-2.5 px-3">FUEL & CATEGORY</th>
                <th className="py-2.5 px-3">ENVIRONMENT</th>
                <th className="py-2.5 px-3">BURNING RATE (K)</th>
                <th className="py-2.5 px-3">FLAME SHAPE</th>
                <th className="py-2.5 px-3">RISK LEVEL</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3442]/50 text-slate-300">
              {recent_experiments.slice(0, 5).map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-[#13212C]/40 transition-colors">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{exp.experiment_id}</td>
                  <td className="py-2.5 px-3">{exp.series} ({exp.mission_platform})</td>
                  <td className="py-2.5 px-3">{exp.fuel_type}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0A1118] border border-[#1E3442]">
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
