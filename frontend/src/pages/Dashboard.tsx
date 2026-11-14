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
  AlertTriangle
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
  Cell
} from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { Link } from 'react-router-dom';

const SHAPE_COLORS = ['#06B6D4', '#14B8A6', '#F59E0B', '#EF4444'];
const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard load failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-cyan-400">
        <Flame className="w-8 h-8 animate-bounce text-cyan-400" />
        <p className="tracking-widest">RETRIEVING NASA FLIGHT TELEMETRY...</p>
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

  const { telemetry, flame_shapes, burning_rates, recent_experiments, key_insights, risk_breakdown } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Mission Header */}
      <div className="p-6 rounded-xl nasa-card border border-space-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-cyan-950/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Planetary Insignia"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_18px_rgba(6,182,212,0.6)] flex-shrink-0 animate-pulse"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
                  NASA SPACE APPS 2026
                </span>
                <span className="text-xs font-mono text-slate-400">CHALLENGE 08: FLAME IN FREEFALL</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight">
                Microgravity Combustion Scientific Intelligence
              </h1>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Synthesizing empirical combustion telemetry from the International Space Station Combustion Integrated Rack (CIR) and NASA Glenn Research Center drop towers to generate mission-critical fire safety insights.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/assistant"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-mono font-medium tracking-wider flex items-center space-x-2 shadow-glow-cyan transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH AI ASSISTANT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl nasa-card border border-space-700">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">VERIFIED RUNS</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-mono font-bold text-slate-100">{telemetry.total_experiments}</p>
          <div className="mt-0.5 text-[10px] font-mono text-cyan-400 truncate">
            {telemetry.microgravity_experiments} in µg • {telemetry.ground_reference_experiments} in 1-g
          </div>
        </div>

        <div className="p-3.5 rounded-xl nasa-card border border-space-700">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">FLIGHT RESEARCH</span>
            <Layers className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <p className="text-xl font-mono font-bold text-slate-100">{telemetry.total_documents}</p>
          <div className="mt-0.5 text-[10px] font-mono text-teal-400 truncate">
            {telemetry.total_sources} NASA Portals
          </div>
        </div>

        <Link to="/incidents" className="p-3.5 rounded-xl nasa-card border border-space-700 hover:border-rose-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase group-hover:text-rose-300">HISTORICAL FIRES</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-mono font-bold text-rose-400">
            {telemetry.historical_incidents || 3}
          </p>
          <div className="mt-0.5 text-[10px] font-mono text-slate-400 group-hover:text-rose-300 flex items-center justify-between">
            <span>Apollo / Mir Archives</span>
            <ChevronRight className="w-3 h-3 text-rose-400" />
          </div>
        </Link>

        <Link to="/analysis" className="p-3.5 rounded-xl nasa-card border border-space-700 hover:border-cyan-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase group-hover:text-cyan-300">D² TIME SERIES</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-mono font-bold text-cyan-300">
            {telemetry.d2_timeseries_datasets || 4}
          </p>
          <div className="mt-0.5 text-[10px] font-mono text-slate-400 group-hover:text-cyan-300 flex items-center justify-between">
            <span>Empirical Droplets</span>
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </div>
        </Link>

        <div className="p-3.5 rounded-xl nasa-card border border-space-700">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">CRITICAL RISKS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-mono font-bold text-rose-400">{telemetry.critical_risk_materials}</p>
          <div className="mt-0.5 text-[10px] font-mono text-slate-400 truncate">
            Low LOI Polymers
          </div>
        </div>

        <div className="p-3.5 rounded-xl nasa-card border border-space-700">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">COOL FLAMES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-mono font-bold text-amber-400">{telemetry.cool_flames_observed}</p>
          <div className="mt-0.5 text-[10px] font-mono text-amber-300 truncate">
            Invisible Thermal Zone
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burning Rate Benchmark Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl nasa-card border border-space-700 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-100">
                Droplet Burning Rate Constant K (-dD²/dt)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Empirical D² law burn rate (mm²/s) across microgravity & 1-g experiments
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-space-700">
              FLEX / FLEX-2
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={burning_rates} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="experiment_id" stroke="#64748B" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1325', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#06B6D4' }}
                />
                <Bar dataKey="burning_rate_constant_k" name="Burning Rate K (mm²/s)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flame Geometry Distribution */}
        <div className="p-5 rounded-xl nasa-card border border-space-700 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100">
              Flame Geometry in Freefall
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Absence of buoyancy creates spherical symmetry
            </p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flame_shapes}
                  dataKey="count"
                  nameKey="flame_shape"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {flame_shapes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SHAPE_COLORS[index % SHAPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1325', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {flame_shapes.map((item, idx) => (
              <div key={item.flame_shape} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SHAPE_COLORS[idx % SHAPE_COLORS.length] }} />
                  <span>{item.flame_shape}</span>
                </div>
                <span className="text-slate-400">{item.count} runs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flight Research Insights Banner Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-slate-200">
            Critical Flight Safety Findings (ISS CIR / MSG)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">PEER-REVIEWED NASA DISCOVERIES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {key_insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-xl nasa-card border border-space-700 flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-space-800 text-cyan-400 border border-space-700">
                  {insight.series}
                </span>
                <h4 className="text-xs font-semibold text-slate-100 leading-snug">
                  {insight.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {insight.summary}
                </p>
              </div>
              <p className="text-[10px] font-mono text-slate-500 border-t border-space-800 pt-2">
                {insight.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Spaceflight Fire Incidents Alert Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/40 via-space-900 to-space-900 border border-rose-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400 mt-0.5">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700">
                NASA SAFETY ARCHIVE
              </span>
              <span className="text-xs font-mono text-slate-400">APOLLO 1 • APOLLO 13 • MIR 1997</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Historical Spacecraft Fire Incidents & Lessons Learned
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              Review documented oxygen fire hazards, catastrophic ignition triggers, materials flammability failures, and the engineering reforms governing modern human missions.
            </p>
          </div>
        </div>

        <Link
          to="/incidents"
          className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700 text-rose-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          <span>EXPLORE DOSSIERS</span>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </Link>
      </div>

      {/* Recent Experiments Table Preview */}
      <div className="p-5 rounded-xl nasa-card border border-space-700 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100">
              Verified NASA Combustion Experiment Records
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Empirical flight runs with traceable citations and sensor telemetry
            </p>
          </div>
          <Link
            to="/analysis"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>VIEW ALL ({telemetry.total_experiments})</span>
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
                    <Link to={`/analysis?id=${exp.experiment_id}`} className="hover:underline">
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
                      <span className="text-teal-400">0.0 g (µg)</span>
                    ) : (
                      <span className="text-slate-400">1.0 g</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">{exp.flame_shape || 'N/A'}</td>
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
