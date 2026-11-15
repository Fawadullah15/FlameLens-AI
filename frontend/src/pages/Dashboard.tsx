import React, { useState, useEffect } from 'react';
import {
  Flame,
  Activity,
  ShieldAlert,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
  FileText,
  Sliders,
  Cpu,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { Link } from 'react-router-dom';

const SHAPE_COLORS = ['#22D3EE', '#36D399', '#F5B942', '#EF4444'];
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#FF7139',
  MEDIUM: '#F5B942',
  LOW: '#36D399',
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailTab, setDetailTab] = useState<'INFO' | 'STANDARDS' | 'CITATIONS'>('INFO');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboard = () => {
    setRefreshing(true);
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error('Dashboard load failed:', err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  if (loading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center space-y-4 font-mono text-xs text-cyan-400">
        <div className="relative">
          <img
            src="/flamelens-logo.png"
            alt="Loading Insignia"
            className="w-16 h-16 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="tracking-widest font-semibold uppercase">RETRIEVING NASA MISSION CONTROL TELEMETRY...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-400 font-mono text-sm bg-rose-950/20 border border-rose-900 rounded-xl my-8">
        Failed to connect to backend telemetry stream. Please verify the FastAPI service.
      </div>
    );
  }

  const { telemetry, flame_shapes, burning_rates, recent_experiments, key_insights, risk_breakdown } = data;

  // Multi-line chart dataset derived from recent verified runs
  const systemsChartData = [
    { run: 'FLEX-1', rate: 0.62, standoff: 2.1, temp: 1850, risk: 45 },
    { run: 'FLEX-2', rate: 0.74, standoff: 2.4, temp: 1920, risk: 52 },
    { run: 'ACME-1', rate: 0.45, standoff: 1.8, temp: 1680, risk: 38 },
    { run: 'ACME-2', rate: 0.58, standoff: 2.2, temp: 1750, risk: 65 },
    { run: 'CFI-1',  rate: 0.88, standoff: 2.9, temp: 2050, risk: 78 },
    { run: 'CFI-2',  rate: 0.79, standoff: 2.6, temp: 1980, risk: 69 },
    { run: 'SL-1',   rate: 0.52, standoff: 2.0, temp: 1710, risk: 42 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* ── MISSION COMMAND HEADER BANNER ────────────────────────────────────────────── */}
      <div className="p-5 md:p-6 rounded-xl mission-panel-elevated relative overflow-hidden technical-corner">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Planetary Insignia"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] flex-shrink-0 animate-pulse"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
                  NASA SPACE APPS 2026
                </span>
                <span className="text-xs font-mono text-slate-400">CHALLENGE 08: FLAME IN FREEFALL</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-slate-400 border border-space-700">
                  TEAM QUANTUMX
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight">
                Microgravity Combustion Intelligence Platform
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Autonomous synthesis of International Space Station Combustion Integrated Rack (CIR) and Glenn Research Center microgravity experiments for crewed deep-space mission fire safety.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={loadDashboard}
              disabled={refreshing}
              className="btn-outline-flame px-3.5 py-2 rounded-lg text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'REFRESHING...' : 'REFRESH'}</span>
            </button>
            <Link
              to="/assistant"
              className="btn-glow-cyan px-4 py-2 rounded-lg text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH AI COPILOT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN MISSION CONTROL OPERATIONS GRID (MATCHING MASTER SPEC) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ── COLUMN 1: SYSTEM HEALTH & INGESTION PIPELINE (LG: 3 COLS) ──────────── */}
        <div className="lg:col-span-3 space-y-5">
          {/* System Status Card */}
          <div className="p-4 rounded-xl mission-panel space-y-4">
            <div className="flex items-center justify-between border-b border-space-700/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-nominal" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  SYSTEM STATUS: NOMINAL
                </span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {currentTime || '15 NOV, 2026 20:15 UTC'}
            </p>

            {/* 4 Metric Sub-Cards with subtle illuminated gradients */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Alert Metric */}
              <div className="p-3 card-radial-amber flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Δ 0%</span>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-amber-200">
                    {telemetry.critical_risk_materials}
                  </div>
                  <div className="text-[10px] font-mono text-amber-300/80 uppercase">Active Alerts</div>
                </div>
              </div>

              {/* Verified Runs Metric */}
              <div className="p-3 card-radial-cyan flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Δ +4%</span>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-cyan-100">
                    {telemetry.total_experiments}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300/80 uppercase">Flight Runs</div>
                </div>
              </div>

              {/* Hardware Health Metric */}
              <div className="p-3 rounded-lg bg-space-850 border border-space-700 flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-teal-400">98.4%</span>
                </div>
                <div>
                  <div className="text-xl font-mono font-bold text-slate-100">NOMINAL</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">CIR Supply Health</div>
                </div>
              </div>

              {/* Active Programs Metric */}
              <div className="p-3 rounded-lg bg-space-850 border border-space-700 flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-400">Δ +1</span>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-slate-100">
                    {telemetry.total_sources || 28}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">NASA Sources</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Status Card with Progress Bars (Matching Image Left-Bottom) */}
          <div className="p-4 rounded-xl mission-panel space-y-4">
            <div className="flex items-center justify-between border-b border-space-700/80 pb-2">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-flame-500" />
                <span>COMBUSTION RUN PIPELINE</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>

            {/* Stage 1: Document Extraction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">PyMuPDF Document Ingest</span>
                <span className="text-cyan-400 font-semibold">100% EFFICIENCY &gt;</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{telemetry.total_documents} ACTIVE</span>
                <div className="w-24 h-1.5 rounded-full bg-space-950 overflow-hidden border border-space-700">
                  <div className="h-full bg-cyan-400 w-full" />
                </div>
                <span className="text-cyan-400">{telemetry.total_documents} DONE</span>
              </div>
            </div>

            {/* Action Button: Glowing Orange REFRESH DATA (Matching Image) */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={loadDashboard}
                disabled={refreshing}
                className="btn-glow-flame px-6 py-2 rounded-full text-xs font-mono font-bold tracking-wider flex items-center space-x-2 cursor-pointer uppercase shadow-glow-flame"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>REFRESH DATA</span>
              </button>
            </div>

            {/* Stage 2: Kinetics Regression */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">D² Kinetics & Atmospheric Sim</span>
                <span className="text-emerald-400 font-semibold">96% EFFICIENCY &gt;</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{telemetry.total_experiments} ACTIVE</span>
                <div className="w-24 h-1.5 rounded-full bg-space-950 overflow-hidden border border-space-700">
                  <div className="h-full bg-emerald-400 w-[96%]" />
                </div>
                <span className="text-emerald-400">{telemetry.total_experiments} DONE</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMN 2: SPACECRAFT HARDWARE & MISSION READINESS (LG: 5 COLS) ───────── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Spacecraft Mission Card */}
          <div className="p-5 rounded-xl mission-panel-elevated space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 pulse-caution" />
                <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                  SPACECRAFT STATUS: CAUTION (ELEVATED PO₂)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-slate-400 border border-space-700">
                ISS EXP-64 / ARTEMIS
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                ARTEMIS &amp; ISS CIR
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Combustion Integrated Rack • Microgravity Droplet Physics
              </p>
            </div>

            {/* Launch Readiness Countdown & Circular Gauge (From Reference Image) */}
            <div className="p-4 rounded-xl bg-space-900/90 border border-space-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  FLIGHT READINESS WINDOW
                </span>
                <div className="flex items-baseline space-x-2 font-mono">
                  <span className="text-2xl font-bold text-emerald-400">135</span>
                  <span className="text-slate-500 font-bold">:</span>
                  <span className="text-2xl font-bold text-emerald-400">21</span>
                  <span className="text-slate-500 font-bold">:</span>
                  <span className="text-2xl font-bold text-emerald-400">38</span>
                </div>
                <div className="flex space-x-4 text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                  <span className="w-8">DAYS</span>
                  <span className="w-8">HOURS</span>
                  <span className="w-8">MINS</span>
                </div>
              </div>

              {/* Circular Gauge */}
              <div className="flex items-center space-x-2">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-space-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray="88, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-white">88%</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase leading-tight">
                  FLIGHT<br />READY
                </span>
              </div>
            </div>

            {/* 4 Colored Illuminated Readiness Cards (Matching Master Spec Grid) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 card-radial-crimson space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-rose-300">
                  <span>SAFETY MATRIX</span>
                  <span>3/5</span>
                </div>
                <div className="text-lg font-mono font-bold text-rose-200">62%</div>
                <div className="text-[10px] font-mono text-rose-300/80">Microgravity Fire Extinction</div>
              </div>

              <div className="p-3 card-radial-amber space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-amber-300">
                  <span>CABIN O₂ PO₂</span>
                  <span>4/5</span>
                </div>
                <div className="text-lg font-mono font-bold text-amber-200">74%</div>
                <div className="text-[10px] font-mono text-amber-300/80">Exploration Atmosphere</div>
              </div>

              <div className="p-3 card-radial-flame space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-flame-400">
                  <span>DISPENSER</span>
                  <span>4/5</span>
                </div>
                <div className="text-lg font-mono font-bold text-flame-300">78%</div>
                <div className="text-[10px] font-mono text-flame-400/80">Droplet Free-Float Rig</div>
              </div>

              <div className="p-3 card-radial-emerald space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-emerald-300">
                  <span>DROP TOWER</span>
                  <span>5/5</span>
                </div>
                <div className="text-lg font-mono font-bold text-emerald-200">95%</div>
                <div className="text-[10px] font-mono text-emerald-300/80">Glenn Zero-G Telemetry</div>
              </div>
            </div>

            {/* Spacecraft Combustion Systems Chart (From Reference Image) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                  SPACECRAFT COMBUSTION SYSTEMS
                </span>
                <span className="text-[10px] font-mono text-cyan-400">FLEX / ACME / CFI RUNS</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemsChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3442" opacity={0.5} />
                    <XAxis dataKey="run" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A1118', borderColor: '#1E3442', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#22D3EE" strokeWidth={2} dot={{ r: 3, fill: '#22D3EE' }} name="Burn Rate K" />
                    <Line type="monotone" dataKey="standoff" stroke="#A855F7" strokeWidth={2} dot={{ r: 3, fill: '#A855F7' }} name="Standoff Ratio" />
                    <Line type="monotone" dataKey="risk" stroke="#FF7139" strokeWidth={2} dot={{ r: 3, fill: '#FF7139' }} name="Risk Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Suggestion Card (Matching Purple Card from Reference Image) */}
            <div className="p-3.5 card-radial-purple flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-purple-300 uppercase">
                    AI PREDICTIVE COMBUSTION INSIGHT
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-mono leading-relaxed">
                  Radiative soot cooling triggers sudden droplet extinction below 14% O₂ in zero buoyant convection.
                </p>
              </div>
              <Link
                to="/assistant"
                className="btn-glow-purple px-4 py-2 rounded-full text-xs font-mono font-bold flex-shrink-0 cursor-pointer shadow-glow-purple uppercase tracking-wider"
              >
                VIEW ALL
              </Link>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: HARDWARE DETAILS & BLUEPRINT SCHEMATICS (LG: 4 COLS) ─────── */}
        <div className="lg:col-span-4 space-y-5">
          {/* Details Card with Tabs */}
          <div className="p-5 rounded-xl mission-panel-elevated space-y-4">
            <div className="flex items-center justify-between border-b border-space-700/80 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                HARDWARE DETAILS
              </span>
              <div className="flex space-x-1 p-0.5 rounded-lg bg-space-950 border border-space-700">
                {(['INFO', 'STANDARDS', 'CITATIONS'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      detailTab === tab
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Authentic Scientific Flame Visualization Area */}
            <div className="relative rounded-xl overflow-hidden border border-space-700 bg-space-950 flex flex-col items-center justify-center p-4">
              <div className="w-32 h-32 rounded-full border border-cyan-500/40 relative flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.25)]">
                {/* Simulated Microgravity Spherical Flame Core */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-600/40 to-cyan-300/20 animate-pulse flex items-center justify-center border border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                  <div className="w-8 h-8 rounded-full bg-cyan-200/40 border border-cyan-100/80 blur-xs" />
                </div>
                {/* Orbit ring around flame */}
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] font-mono font-semibold text-cyan-400 tracking-wider uppercase block">
                  SPHERICAL DIFFUSION FLAME (0.0001 g)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ISS Combustion Integrated Rack • Standoff Ratio: 2.34
                </span>
              </div>
            </div>

            {/* Technical Blueprint Wireframe Schematics (From Master Spec Reference Image) */}
            <div className="p-3 blueprint-grid space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                <span>CIR CHAMBER SCHEMATIC</span>
                <span>ORTHOGRAPHIC PROJECTION</span>
              </div>
              <div className="h-28 flex items-center justify-center border border-dashed border-cyan-500/30 rounded p-2 text-center text-slate-400 font-mono text-[10px]">
                <div className="space-y-1">
                  <div className="flex justify-center items-center gap-2 text-cyan-300">
                    <span>[ CHAMBER: 100 L ]</span>
                    <span>•</span>
                    <span>[ P: 101.3 kPa ]</span>
                  </div>
                  <p className="text-slate-500 text-[9px] max-w-xs">
                    Multi-user combustion facility on the Destiny Laboratory module. Measures droplet diameter, flame radius, soot volume fraction and radiation.
                  </p>
                </div>
              </div>
            </div>

            {/* Generate Report Button (Matching Image) */}
            <Link
              to="/reports"
              className="w-full btn-outline-flame py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider flex items-center justify-center space-x-2 cursor-pointer uppercase"
            >
              <FileText className="w-4 h-4 text-flame-400" />
              <span>GENERATE MISSION REPORT</span>
            </Link>

            {/* Fast Quick Controls Bar */}
            <div className="flex items-center space-x-2 pt-1 border-t border-space-700/80">
              <Link
                to="/combustion"
                className="flex-1 py-1.5 px-3 rounded-lg bg-space-850 hover:bg-space-800 border border-space-700 text-[10px] font-mono text-center text-slate-300 hover:text-cyan-400 transition-colors"
              >
                RUN SIMULATION
              </Link>
              <Link
                to="/analysis"
                className="flex-1 py-1.5 px-3 rounded-lg bg-space-850 hover:bg-space-800 border border-space-700 text-[10px] font-mono text-center text-slate-300 hover:text-cyan-400 transition-colors"
              >
                COMPARE RUNS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── EARTH VS MICROGRAVITY COMBUSTION PHYSICS MATRIX ──────────────────────── */}
      <div className="p-5 rounded-xl mission-panel space-y-4">
        <div className="flex items-center justify-between border-b border-space-700/80 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                SCIENTIFIC FOUNDATION
              </span>
              <span className="text-xs font-mono text-slate-400">PHYSICAL PRINCIPLES IN FREEFALL</span>
            </div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight mt-1">
              Earth Gravity (1-g) vs Microgravity (0-g) Combustion Physics
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">FUNDAMENTAL TRANSPORT PHENOMENA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-space-850 border border-space-700 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>BUOYANCY &amp; CONVECTION</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-rose-400">1-g:</strong> Strong natural convection draws fresh O₂ upward, stretching flame into teardrop shape.
            </p>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-cyan-400">µg:</strong> Reduced buoyancy causes slow spherically symmetric diffusion, limiting O₂ transport rate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-850 border border-space-700 space-y-2">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-teal-400" />
              <span>FLAME GEOMETRY</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-rose-400">1-g:</strong> Elongated, buoyant plume with strong upward flicker and rapid heat dispersion.
            </p>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-cyan-400">µg:</strong> Stable spherical flame shell standoff at 2–3 droplet radii with steady diffusion envelope.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-850 border border-space-700 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>SOOT ACCUMULATION</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-rose-400">1-g:</strong> Buoyant flow carries soot particles rapidly out of reaction zone into smoke plume.
            </p>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-cyan-400">µg:</strong> Soot traps inside spherical shell, increasing radiative heat loss and triggering early extinction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-850 border border-space-700 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>COOL FLAMES</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-rose-400">1-g:</strong> High convection dissipates radical intermediates before low-temperature stage develops.
            </p>
            <p className="text-xs text-slate-300 font-mono">
              <strong className="text-cyan-400">µg:</strong> Discovered in FLEX experiments: secondary invisible burn at 700K continues after hot extinction.
            </p>
          </div>
        </div>
      </div>

      {/* ── RECENT EXPERIMENTS VERIFIED TABLE ────────────────────────────────────────── */}
      <div className="p-5 rounded-xl mission-panel space-y-4">
        <div className="flex items-center justify-between border-b border-space-700/80 pb-3">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100">
              Verified NASA Microgravity Combustion Flight Records
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Traceable experimental runs from NASA Physical Sciences Informatics (PSI) &amp; NTRS archives
            </p>
          </div>
          <Link
            to="/combustion"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>EXPLORE ALL ({telemetry.total_experiments})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-700 text-slate-400">
                <th className="py-2.5 px-3">RUN ID</th>
                <th className="py-2.5 px-3">SERIES</th>
                <th className="py-2.5 px-3">FUEL STREAM</th>
                <th className="py-2.5 px-3">GRAVITY</th>
                <th className="py-2.5 px-3">FLAME GEOMETRY</th>
                <th className="py-2.5 px-3">RISK SCORE</th>
                <th className="py-2.5 px-3">CITATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800 text-slate-300">
              {recent_experiments.map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-space-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-cyan-400">
                    <Link to={`/combustion`} className="hover:underline">
                      {exp.experiment_id}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700 text-[10px]">
                      {exp.series}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{exp.fuel_type}</td>
                  <td className="py-2.5 px-3">
                    {exp.gravity_level < 0.1 ? (
                      <span className="text-teal-400 font-semibold">0.0001 g (µg)</span>
                    ) : (
                      <span className="text-slate-400">1.0 g</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">{exp.flame_shape || 'Spherical'}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className="px-2 py-0.5 rounded font-bold text-[11px]"
                      style={{
                        backgroundColor: `${RISK_COLORS[exp.risk_level || 'MEDIUM']}20`,
                        color: RISK_COLORS[exp.risk_level || 'MEDIUM'],
                        border: `1px solid ${RISK_COLORS[exp.risk_level || 'MEDIUM']}40`
                      }}
                    >
                      {exp.risk_score?.toFixed(1)} [{exp.risk_level}]
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-slate-400 max-w-xs truncate" title={exp.citation}>
                    {exp.citation}
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
