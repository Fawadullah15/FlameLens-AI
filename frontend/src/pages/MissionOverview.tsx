import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  FlaskConical,
  Flame,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { STATIC_DASHBOARD_DATA, STATIC_EXPERIMENTS } from '../data/staticData';

export const MissionOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData>(STATIC_DASHBOARD_DATA as unknown as DashboardData);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        if (res && res.telemetry && typeof res !== 'string') {
          setData(res);
        }
      })
      .catch(() => {});
  }, []);

  const safeData = data || (STATIC_DASHBOARD_DATA as unknown as DashboardData);
  const telemetry = safeData.telemetry || STATIC_DASHBOARD_DATA.telemetry;
  const recent_experiments = safeData.recent_experiments || STATIC_DASHBOARD_DATA.recent_experiments || [];

  const suggestedPrompts = [
    "How does the d²-law burning rate change in microgravity?",
    "Compare soot formation: normal gravity vs microgravity",
    "Explain cool flame oscillations in n-heptane droplets",
    "Review flammability limits in 30% oxygen spacecraft cabins"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/copilot?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePromptClick = (prompt: string) => {
    navigate(`/copilot?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* ── 1. CHATGPT-STYLE HERO GREETING & COMPOSER ───────────────────── */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="FlameLens Q Insignia"
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0D0D0D] tracking-tight">
            Explore microgravity combustion.
          </h1>
          <p className="text-[15px] text-[#6E6E6E] max-w-xl mx-auto leading-relaxed">
            Query empirical NASA flight data, investigate droplet burning kinetics without buoyant convection, and assess spacecraft fire safety.
          </p>
        </div>

        {/* Central Composer Input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center bg-white border border-[#E5E5E5] rounded-[24px] shadow-xs hover:border-[#CCCCCC] focus-within:border-[#0D0D0D] focus-within:ring-1 focus-within:ring-[#0D0D0D] transition-all p-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about droplet kinetics, soot radiation, or fire safety..."
              className="w-full pl-4 pr-12 py-3 bg-transparent text-[14px] text-[#0D0D0D] placeholder:text-[#8F8F8F] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="p-2.5 rounded-full bg-[#0D0D0D] text-white hover:bg-[#333333] disabled:opacity-20 disabled:hover:bg-[#0D0D0D] transition-colors shrink-0"
              aria-label="Send query"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-left text-[12px] text-[#555555] bg-[#F7F7F8] hover:bg-[#EFEFEF] hover:text-[#0D0D0D] border border-[#E5E5E5] rounded-[8px] px-3 py-1.5 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. DATASET SUMMARY BAR (CALM TYPOGRAPHY, NO GAUDY BOXES) ───────── */}
      <div className="py-4 border-y border-[#EBEBEB] flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <div className="text-xl font-semibold text-[#0D0D0D] font-mono">
            {telemetry?.total_experiments || STATIC_EXPERIMENTS.length}
          </div>
          <div className="text-[11px] text-[#8F8F8F] mt-0.5">Verified Experiments</div>
        </div>
        <div className="h-6 w-px bg-[#E5E5E5] hidden sm:block" />
        <div>
          <div className="text-xl font-semibold text-[#0D0D0D] font-mono">
            {telemetry?.total_documents || 28}
          </div>
          <div className="text-[11px] text-[#8F8F8F] mt-0.5">NASA Technical Papers</div>
        </div>
        <div className="h-6 w-px bg-[#E5E5E5] hidden sm:block" />
        <div>
          <div className="text-xl font-semibold text-[#0D0D0D] font-mono">
            4
          </div>
          <div className="text-[11px] text-[#8F8F8F] mt-0.5">Flight Programs (CIR, FLEX, ACME, BASS)</div>
        </div>
        <div className="h-6 w-px bg-[#E5E5E5] hidden sm:block" />
        <div>
          <div className="text-xl font-semibold text-[#B86B39] font-mono">
            R² &gt; 0.98
          </div>
          <div className="text-[11px] text-[#8F8F8F] mt-0.5">d²-Law Kinetic Fit</div>
        </div>
      </div>

      {/* ── 3. RECENT FLIGHT EXPERIMENTS TABLE ───────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0D0D0D] tracking-tight">
              Verified Flight Investigations
            </h2>
            <p className="text-xs text-[#6E6E6E] mt-0.5">
              Empirical measurements from ISS Combustion Integrated Rack (CIR) & Drop Towers
            </p>
          </div>
          <Link
            to="/experiments"
            className="inline-flex items-center space-x-1 text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39] transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="border border-[#E5E5E5] rounded-[8px] overflow-hidden">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#E5E5E5] text-[11px] font-medium text-[#8F8F8F] uppercase">
                <th className="py-2 px-3 font-mono">ID</th>
                <th className="py-2 px-3">Fuel</th>
                <th className="py-2 px-3">Gravity & Environment</th>
                <th className="py-2 px-3 font-mono">Burn Rate K</th>
                <th className="py-2 px-3 font-mono">Extinction</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {recent_experiments.slice(0, 5).map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-[#F9F9FA] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs font-semibold text-[#0D0D0D]">
                    {exp.experiment_id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#0D0D0D]">
                    {exp.fuel_type}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#6E6E6E]">
                    {exp.gravity_level === 0 ? '0g Microgravity' : '1g Terrestrial'} • {exp.ambient_o2_percent ?? 21}% O₂
                  </td>
                  <td className="py-2.5 px-3 font-mono text-xs text-[#B86B39] font-medium">
                    {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#6E6E6E]">
                    {exp.extinction_mode || 'Radiative'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to={`/combustion?experimentId=${exp.experiment_id}`}
                      className="text-xs font-medium text-[#0D0D0D] hover:text-[#B86B39] transition-colors"
                    >
                      Analyze →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. SCIENTIFIC PRINCIPLES (TYPOGRAPHY FOCUSED, NO CARD OVERLOAD) ─── */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-base font-semibold text-[#0D0D0D] tracking-tight">
            Fundamental Microgravity Combustion Physics
          </h2>
          <p className="text-xs text-[#6E6E6E] mt-0.5">
            Key physical mechanisms observed when gravitational buoyant convection is suppressed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Spherical Symmetry
            </h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              Without buoyant up-drafts, hot gas expands isotropically. Oxygen diffuses radially inward, yielding steady spherical flame fronts with stable standoff ratios ($r_f/r_d \approx 6.5$).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Cool Flame Kinetics
            </h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              First discovered during the FLEX investigation: following visible hot flame extinction (~1500 K), alkane droplets continue burning invisibly via low-temperature chemical kinetics (~600–800 K).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Radiative Extinction Limits
            </h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              Due to slow diffusion velocities and longer residence times, accumulated soot shells radiate heat outward, cooling the flame below chemical extinction limits before fuel burnout.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. CLEAN FOOTER NOTE ─────────────────────────────────────────── */}
      <div className="pt-8 border-t border-[#EBEBEB] text-center text-xs text-[#8F8F8F]">
        NASA Space Apps Challenge 2026 • Challenge 08: Flame in Freefall • Team QuantumX
      </div>
    </div>
  );
};
