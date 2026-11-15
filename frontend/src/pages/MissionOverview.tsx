import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  MessageSquare,
  FlaskConical,
  Flame,
  ShieldAlert,
  BookOpen,
  GitCompare,
  CheckCircle2,
  ExternalLink,
  ChevronRight
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
      .catch(err => {
        console.warn('Using verified static dataset for overview:', err);
      });
  }, []);

  const safeData = data || (STATIC_DASHBOARD_DATA as unknown as DashboardData);
  const telemetry = safeData.telemetry || STATIC_DASHBOARD_DATA.telemetry;
  const recent_experiments = safeData.recent_experiments || STATIC_DASHBOARD_DATA.recent_experiments || [];

  const suggestedPrompts = [
    "How does the d²-law burning rate constant change in microgravity?",
    "Compare soot formation: 1g buoyancy vs microgravity spherical diffusion",
    "What causes cool flame oscillations in n-heptane droplets?",
    "Review flammability limits in 30% oxygen spacecraft atmospheres"
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* ── 1. CHATGPT-STYLE HERO GREETING & COMPOSER ───────────────────── */}
      <div className="pt-4 pb-2 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#F8F1EC] border border-[#EBDAD0] text-[12px] font-medium text-[#B86B39]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B86B39]" />
          <span>NASA Space Apps Challenge 2026 • Challenge 08: Flame in Freefall</span>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#272727] tracking-tight">
            Explore microgravity combustion research.
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#6B6B6B] leading-relaxed">
            Query empirical NASA flight datasets, analyze droplet burning kinetics without buoyant convection, and evaluate spacecraft fire safety.
          </p>
        </div>

        {/* Central Search / Research Composer */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white border border-[#E5E5E5] rounded-[14px] shadow-xs hover:border-[#D4D4D4] focus-within:border-[#242424] focus-within:ring-1 focus-within:ring-[#242424] transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about microgravity flame behavior or search datasets..."
              className="w-full pl-4 pr-12 py-3.5 bg-transparent text-[14px] text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute right-2.5 p-2 rounded-[10px] bg-[#242424] text-white hover:bg-[#383838] disabled:opacity-30 disabled:hover:bg-[#242424] transition-colors"
              aria-label="Send query to AI Research Assistant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggested Prompts Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-1">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-left text-[12px] text-[#555555] bg-[#F7F7F8] hover:bg-[#EFEFEF] hover:text-[#272727] border border-[#E5E5E5] rounded-[8px] px-3 py-1.5 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. SCIENTIFIC DATASET METRICS ROW ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px]">
          <div className="text-[12px] font-medium text-[#8A8A8A]">Verified Experiments</div>
          <div className="text-2xl font-semibold text-[#272727] mt-1 font-mono">
            {telemetry?.total_experiments || STATIC_EXPERIMENTS.length}
          </div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">
            {telemetry?.microgravity_experiments || 31} microgravity flight tests
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px]">
          <div className="text-[12px] font-medium text-[#8A8A8A]">Research Papers</div>
          <div className="text-2xl font-semibold text-[#272727] mt-1 font-mono">
            {telemetry?.total_documents || 28}
          </div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">
            NASA NTRS & peer-reviewed literature
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px]">
          <div className="text-[12px] font-medium text-[#8A8A8A]">Flight Investigations</div>
          <div className="text-2xl font-semibold text-[#272727] mt-1 font-mono">
            4
          </div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5 font-mono">
            FLEX • ACME • BASS-II • CIR
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px]">
          <div className="text-[12px] font-medium text-[#8A8A8A]">Regression Fit</div>
          <div className="text-2xl font-semibold text-[#B86B39] mt-1 font-mono">
            R² &gt; 0.98
          </div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">
            Classical d²-law droplet kinetics
          </div>
        </div>
      </div>

      {/* ── 3. FEATURED EXPERIMENTS REPOSITORY TABLE ──────────────────────── */}
      <div className="bg-white border border-[#E5E5E5] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#272727]">
              Verified Microgravity Flight Experiments
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Empirical measurements from ISS Combustion Integrated Rack (CIR) & Drop Towers
            </p>
          </div>
          <Link
            to="/experiments"
            className="inline-flex items-center space-x-1 text-xs font-medium text-[#272727] hover:text-[#B86B39] transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F8] border-b border-[#E5E5E5] text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-mono">ID</th>
                <th className="py-2.5 px-4">Fuel</th>
                <th className="py-2.5 px-4">Environment</th>
                <th className="py-2.5 px-4 font-mono">Burn Rate K</th>
                <th className="py-2.5 px-4 font-mono">Extinction</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[13px]">
              {recent_experiments.slice(0, 6).map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-[#F9F9FA] transition-colors">
                  <td className="py-2.5 px-4 font-mono text-xs font-semibold text-[#272727]">
                    {exp.experiment_id}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#272727]">
                    {exp.fuel_type}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-[#6B6B6B]">
                    {exp.gravity_level === 0 ? '0g (Microgravity)' : '1g (Normal)'} • {exp.ambient_o2_percent ?? 21}% O₂
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs text-[#272727]">
                    {exp.burning_rate_constant_k ? `${exp.burning_rate_constant_k.toFixed(3)} mm²/s` : '—'}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-[#6B6B6B]">
                    {exp.extinction_mode || 'Radiative'}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-[#8A8A8A]">
                    {exp.series || 'NASA CIR'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      to={`/combustion?experimentId=${exp.experiment_id}`}
                      className="inline-flex items-center space-x-1 text-xs font-medium text-[#272727] hover:text-[#B86B39] transition-colors"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. SCIENTIFIC PRINCIPLES & CORE PHENOMENA ─────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#272727]">
            Fundamental Microgravity Combustion Physics
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Key physical mechanisms observed when gravitational buoyant convection is suppressed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 hover:border-[#D4D4D4] transition-colors">
            <div className="w-7 h-7 rounded-[6px] bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center text-[#B86B39]">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#272727]">
              Spherical Symmetry
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Without buoyancy, hot combustion products do not rise. Oxygen diffuses radially inward, yielding perfectly spherical flames with steady standoff ratios ($r_f/r_d$).
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 hover:border-[#D4D4D4] transition-colors">
            <div className="w-7 h-7 rounded-[6px] bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center text-[#B86B39]">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#272727]">
              Cool Flame Phenomenon
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              First verified during NASA's FLEX experiments: after hot flame extinction (~1500 K), alkane droplets continue burning invisibly via low-temperature chemical kinetics (~600–800 K).
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[10px] space-y-2 hover:border-[#D4D4D4] transition-colors">
            <div className="w-7 h-7 rounded-[6px] bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center text-[#B86B39]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#272727]">
              Radiative Extinction Limits
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Because diffusion rates are slow, residence times are long. Radiative heat loss from accumulated soot shells frequently cools the flame below chemical extinction limits before fuel burnout.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. QUICK NAVIGATION SHORTCUTS ─────────────────────────────────── */}
      <div className="p-5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#272727]">
            Ready to explore detailed combustion analytics?
          </h3>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Test custom droplet kinetics, compare flight experiments, or ask the AI Research Assistant.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/combustion"
            className="px-3.5 py-2 text-xs font-medium text-[#272727] bg-white border border-[#E5E5E5] rounded-[7px] hover:bg-[#EAEAEA] transition-colors"
          >
            Flame Analysis
          </Link>
          <Link
            to="/copilot"
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#242424] hover:bg-[#383838] rounded-[7px] transition-colors"
          >
            Open AI Chat
          </Link>
        </div>
      </div>
    </div>
  );
};
