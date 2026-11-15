import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Filter,
  ArrowRight,
  GitCompare,
  Flame,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Experiment } from '../types';
import { STATIC_EXPERIMENTS } from '../data/staticData';

export const Experiments: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [gravityFilter, setGravityFilter] = useState<'all' | '0' | '1'>('all');
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getExperiments({
      fuel: fuelFilter || undefined,
      search: search || undefined,
      limit: 100
    })
      .then(res => {
        let exps = res.experiments || [];
        if (gravityFilter === '0') {
          exps = exps.filter(e => e.gravity_level === 0);
        } else if (gravityFilter === '1') {
          exps = exps.filter(e => e.gravity_level === 1);
        }
        setExperiments(exps);
        setLoading(false);
      })
      .catch(() => {
        let exps = STATIC_EXPERIMENTS as Experiment[];
        if (fuelFilter) {
          exps = exps.filter(e => e.fuel_type.toLowerCase().includes(fuelFilter.toLowerCase()));
        }
        if (search) {
          exps = exps.filter(e =>
            e.experiment_id.toLowerCase().includes(search.toLowerCase()) ||
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.fuel_type.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (gravityFilter === '0') {
          exps = exps.filter(e => e.gravity_level === 0);
        } else if (gravityFilter === '1') {
          exps = exps.filter(e => e.gravity_level === 1);
        }
        setExperiments(exps);
        setLoading(false);
      });
  }, [fuelFilter, gravityFilter, search]);

  const fuels = ['All', 'n-Heptane', 'Methanol', 'n-Decane', 'Methane', 'Ethylene'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#272727] tracking-tight">
            Experiments Repository
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B6B6B] mt-0.5">
            Empirical combustion measurements from NASA Glenn Drop Towers and ISS CIR flight campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8A8A]">
          <span className="w-2 h-2 rounded-full bg-[#10A37F]" />
          <span>{experiments.length} Experiments Verified</span>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by experiment ID, fuel, or platform..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-[8px] text-[13px] text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#242424]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center space-x-1 bg-[#F7F7F8] p-1 border border-[#E5E5E5] rounded-[8px] text-xs">
            <button
              onClick={() => setGravityFilter('all')}
              className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                gravityFilter === 'all' ? 'bg-white text-[#272727] shadow-xs' : 'text-[#6B6B6B] hover:text-[#272727]'
              }`}
            >
              All Gravities
            </button>
            <button
              onClick={() => setGravityFilter('0')}
              className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                gravityFilter === '0' ? 'bg-white text-[#272727] shadow-xs' : 'text-[#6B6B6B] hover:text-[#272727]'
              }`}
            >
              0g Microgravity
            </button>
            <button
              onClick={() => setGravityFilter('1')}
              className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
                gravityFilter === '1' ? 'bg-white text-[#272727] shadow-xs' : 'text-[#6B6B6B] hover:text-[#272727]'
              }`}
            >
              1g Terrestrial
            </button>
          </div>

          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value === 'All' ? '' : e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[8px] text-xs text-[#272727] focus:outline-none focus:ring-1 focus:ring-[#242424]"
          >
            {fuels.map(f => (
              <option key={f} value={f === 'All' ? '' : f}>{f} Fuel</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── HIGH DENSITY TABLE ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E5E5] rounded-[10px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#E5E5E5] text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-mono">Experiment ID</th>
                <th className="py-2.5 px-4">Fuel & Droplet Size</th>
                <th className="py-2.5 px-4">Environment</th>
                <th className="py-2.5 px-4 font-mono">Pressure</th>
                <th className="py-2.5 px-4 font-mono">Burn Rate K</th>
                <th className="py-2.5 px-4 font-mono">Extinction Mode</th>
                <th className="py-2.5 px-4">Platform</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#8A8A8A]">
                    Loading experiment datasets...
                  </td>
                </tr>
              ) : experiments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#8A8A8A]">
                    No experiments match the selected criteria.
                  </td>
                </tr>
              ) : (
                experiments.map((exp) => (
                  <tr
                    key={exp.id || exp.experiment_id}
                    onClick={() => setSelectedExp(exp)}
                    className="hover:bg-[#F9F9FA] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-[#B86B39]">
                      {exp.experiment_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#272727]">{exp.fuel_type}</div>
                      <div className="text-[11px] font-mono text-[#8A8A8A]">
                        d₀ = {exp.initial_fuel_diameter_mm ? `${exp.initial_fuel_diameter_mm.toFixed(2)} mm` : '1.50 mm'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#555555]">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium mr-1.5 ${
                        exp.gravity_level === 0 ? 'bg-[#F8F1EC] text-[#B86B39] border border-[#EBDAD0]' : 'bg-[#F0F0F0] text-[#555555]'
                      }`}>
                        {exp.gravity_level === 0 ? '0g' : '1g'}
                      </span>
                      <span>{exp.ambient_o2_percent ?? 21}% O₂</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#555555]">
                      {exp.chamber_pressure_kpa ? `${(exp.chamber_pressure_kpa / 101.325).toFixed(2)} atm` : '1.00 atm'}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-[#272727]">
                      {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B6B6B]">
                      {exp.extinction_mode || 'Radiative'}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8A8A8A]">
                      {exp.mission_platform || exp.series || 'ISS CIR'}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/combustion?experimentId=${exp.experiment_id}`}
                          title="Open in Flame Analysis"
                          className="px-2 py-1 text-xs font-medium text-[#272727] hover:text-[#B86B39] hover:bg-[#F0F0F0] rounded transition-colors"
                        >
                          Analyze
                        </Link>
                        <Link
                          to={`/analysis?expA=${exp.experiment_id}`}
                          title="Compare with another experiment"
                          className="px-2 py-1 text-xs font-medium text-[#6B6B6B] hover:text-[#272727] hover:bg-[#F0F0F0] rounded transition-colors"
                        >
                          Compare
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EXPERIMENT DETAIL MODAL ──────────────────────────────────────── */}
      {selectedExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-[#E5E5E5] rounded-[12px] shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#E5E5E5] bg-[#F7F7F8] flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-[#B86B39]">
                  {selectedExp.experiment_id}
                </span>
                <h3 className="text-base font-semibold text-[#272727] mt-1">
                  {selectedExp.title || `${selectedExp.fuel_type} Combustion Test`}
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  Platform: {selectedExp.mission_platform || 'ISS CIR'} • Series: {selectedExp.series}
                </p>
              </div>
              <button
                onClick={() => setSelectedExp(null)}
                className="p-1 rounded text-[#8A8A8A] hover:text-[#272727] hover:bg-[#EAEAEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Gravity</span>
                  <span className="font-semibold text-[#272727] mt-0.5 block font-mono">
                    {selectedExp.gravity_level === 0 ? '0g (Microgravity)' : '1g'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Oxygen (O₂)</span>
                  <span className="font-semibold text-[#272727] mt-0.5 block font-mono">
                    {selectedExp.ambient_o2_percent ?? 21}%
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Burn Rate K</span>
                  <span className="font-semibold text-[#B86B39] mt-0.5 block font-mono">
                    {selectedExp.burning_rate_constant_k ? `${selectedExp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8A8A8A] block">Flame Temp</span>
                  <span className="font-semibold text-[#272727] mt-0.5 block font-mono">
                    {selectedExp.peak_flame_temperature_k ? `${selectedExp.peak_flame_temperature_k} K` : '—'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide mb-1.5">
                  Scientific Observation
                </h4>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs text-[#333333] leading-relaxed">
                  {selectedExp.key_finding || 'Isolated droplet combustion showing classical d²-law regression with spherical flame standoff geometry.'}
                </div>
              </div>

              {selectedExp.citation && (
                <div className="text-[11px] text-[#8A8A8A] font-mono">
                  Citation: {selectedExp.citation}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E5E5E5] bg-[#F7F7F8] flex items-center justify-between">
              <button
                onClick={() => {
                  const id = selectedExp.experiment_id;
                  setSelectedExp(null);
                  navigate(`/copilot?q=${encodeURIComponent(`Explain the combustion behavior and findings of experiment ${id}`)}`);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#242424] text-white hover:bg-[#383838] rounded-[6px] text-xs font-medium transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI About This Test</span>
              </button>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/combustion?experimentId=${selectedExp.experiment_id}`}
                  className="px-3 py-1.5 bg-white border border-[#E5E5E5] hover:bg-[#EAEAEA] text-[#272727] rounded-[6px] text-xs font-medium transition-colors"
                >
                  Analyze Kinetics
                </Link>
                <button
                  onClick={() => setSelectedExp(null)}
                  className="px-3 py-1.5 text-xs text-[#6B6B6B] hover:text-[#272727]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
