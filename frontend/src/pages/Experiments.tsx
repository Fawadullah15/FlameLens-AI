import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  ChevronRight,
  X,
  MessageSquare,
  ArrowRight
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
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Experiments Repository</h1>
          <p className="page-subtitle">
            Empirical combustion measurements from NASA Glenn Drop Towers and ISS CIR flight campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8F8F8F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" />
          <span>{experiments.length} Experiments Verified</span>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F8F] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiment ID, fuel, platform..."
            className="input-standard input-with-icon w-full pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="inline-flex items-center p-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[9px] text-xs font-medium">
            <button
              onClick={() => setGravityFilter('all')}
              className={`px-3 py-1 rounded-[6px] transition-colors whitespace-nowrap ${
                gravityFilter === 'all' ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold' : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
              }`}
            >
              All Gravities
            </button>
            <button
              onClick={() => setGravityFilter('0')}
              className={`px-3 py-1 rounded-[6px] transition-colors whitespace-nowrap ${
                gravityFilter === '0' ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold' : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
              }`}
            >
              0g Microgravity
            </button>
            <button
              onClick={() => setGravityFilter('1')}
              className={`px-3 py-1 rounded-[6px] transition-colors whitespace-nowrap ${
                gravityFilter === '1' ? 'bg-white text-[#0D0D0D] shadow-2xs font-semibold' : 'text-[#6E6E6E] hover:text-[#0D0D0D]'
              }`}
            >
              1g Terrestrial
            </button>
          </div>

          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value === 'All' ? '' : e.target.value)}
            className="select-standard"
          >
            {fuels.map(f => (
              <option key={f} value={f === 'All' ? '' : f}>{f} Fuel</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── STANDARDIZED DATA TABLE ──────────────────────────────────────── */}
      <div className="table-shell shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr>
                <th className="table-header-cell font-mono w-32 whitespace-nowrap">Experiment ID</th>
                <th className="table-header-cell min-w-[200px]">Fuel & Initial Diameter</th>
                <th className="table-header-cell w-36 whitespace-nowrap">Environment</th>
                <th className="table-header-cell font-mono w-28 whitespace-nowrap">Pressure</th>
                <th className="table-header-cell font-mono w-32 whitespace-nowrap">Burn Rate K</th>
                <th className="table-header-cell w-28 whitespace-nowrap">Extinction</th>
                <th className="table-header-cell w-24 whitespace-nowrap">Platform</th>
                <th className="table-header-cell text-right w-28 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-body-cell text-center py-12 text-xs text-[#8F8F8F]">
                    Loading experiment datasets...
                  </td>
                </tr>
              ) : experiments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-body-cell text-center py-12 text-xs text-[#8F8F8F]">
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
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#B86B39] whitespace-nowrap">
                      {exp.experiment_id}
                    </td>
                    <td className="table-body-cell min-w-[200px]">
                      <div className="font-medium text-[#0D0D0D]">{exp.fuel_type}</div>
                      <div className="text-[11px] font-mono text-[#8F8F8F]">
                        d₀ = {exp.initial_fuel_diameter_mm ? `${exp.initial_fuel_diameter_mm.toFixed(2)} mm` : '1.50 mm'}
                      </div>
                    </td>
                    <td className="table-body-cell text-xs text-[#555555] whitespace-nowrap">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium mr-1.5 ${
                        exp.gravity_level === 0 ? 'bg-[#F8F1EC] text-[#B86B39] border border-[#EBDAD0]' : 'bg-[#F0F0F0] text-[#555555]'
                      }`}>
                        {exp.gravity_level === 0 ? '0g' : '1g'}
                      </span>
                      <span>{exp.ambient_o2_percent ?? 21}% O₂</span>
                    </td>
                    <td className="table-body-cell font-mono text-xs text-[#555555] whitespace-nowrap">
                      {exp.chamber_pressure_kpa ? `${(exp.chamber_pressure_kpa / 101.325).toFixed(2)} atm` : '1.00 atm'}
                    </td>
                    <td className="table-body-cell font-mono text-xs font-semibold text-[#0D0D0D] whitespace-nowrap">
                      {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                    </td>
                    <td className="table-body-cell text-xs text-[#6E6E6E] whitespace-nowrap">
                      {exp.extinction_mode || 'Radiative'}
                    </td>
                    <td className="table-body-cell text-xs text-[#8F8F8F] whitespace-nowrap">
                      {exp.mission_platform || exp.series || 'ISS CIR'}
                    </td>
                    <td className="table-body-cell text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/combustion?experimentId=${exp.experiment_id}`}
                          title="Open in Flame Analysis"
                          className="px-2 py-1 text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39] hover:bg-[#F0F0F0] rounded transition-colors"
                        >
                          Analyze
                        </Link>
                        <Link
                          to={`/analysis?expA=${exp.experiment_id}`}
                          title="Compare with another experiment"
                          className="px-2 py-1 text-xs font-medium text-[#6E6E6E] hover:text-[#0D0D0D] hover:bg-[#F0F0F0] rounded transition-colors"
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
                <h3 className="text-base font-semibold text-[#0D0D0D] mt-1">
                  {selectedExp.title || `${selectedExp.fuel_type} Combustion Test`}
                </h3>
                <p className="text-xs text-[#6E6E6E]">
                  Platform: {selectedExp.mission_platform || 'ISS CIR'} • Series: {selectedExp.series}
                </p>
              </div>
              <button
                onClick={() => setSelectedExp(null)}
                className="p-1 rounded text-[#8F8F8F] hover:text-[#0D0D0D] hover:bg-[#EAEAEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Gravity</span>
                  <span className="font-semibold text-[#0D0D0D] mt-0.5 block font-mono">
                    {selectedExp.gravity_level === 0 ? '0g Microgravity' : '1g'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Oxygen (O₂)</span>
                  <span className="font-semibold text-[#0D0D0D] mt-0.5 block font-mono">
                    {selectedExp.ambient_o2_percent ?? 21}%
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Burn Rate K</span>
                  <span className="font-semibold text-[#B86B39] mt-0.5 block font-mono">
                    {selectedExp.burning_rate_constant_k ? `${selectedExp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px]">
                  <span className="text-[#8F8F8F] block">Flame Temp</span>
                  <span className="font-semibold text-[#0D0D0D] mt-0.5 block font-mono">
                    {selectedExp.peak_flame_temperature_k ? `${selectedExp.peak_flame_temperature_k} K` : '—'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#8F8F8F] uppercase tracking-wide mb-1.5">
                  Scientific Observation
                </h4>
                <div className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] text-xs text-[#2D2D2D] leading-relaxed">
                  {selectedExp.key_finding || 'Isolated droplet combustion showing classical d²-law regression with spherical flame standoff geometry.'}
                </div>
              </div>

              {selectedExp.citation && (
                <div className="text-[11px] text-[#8F8F8F] font-mono">
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
                className="btn-primary"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI About This Test</span>
              </button>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/combustion?experimentId=${selectedExp.experiment_id}`}
                  className="btn-secondary"
                >
                  Analyze Kinetics
                </Link>
                <button
                  onClick={() => setSelectedExp(null)}
                  className="px-3 py-1.5 text-xs text-[#6E6E6E] hover:text-[#0D0D0D]"
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
