import React from 'react';
import { Link } from 'react-router-dom';
import {
  Orbit,
  Globe,
  Rocket,
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FlaskConical,
  BookOpen,
  ChevronRight,
  Compass,
  Cpu
} from 'lucide-react';

export const SciencePage: React.FC = () => {
  const scienceDisciplines = [
    {
      title: 'Microgravity Space Science',
      badge: 'Zero-Buoyancy Physics',
      icon: Flame,
      desc: 'Investigate how molecular diffusion supersedes buoyant thermal lift in orbit, producing pure spherical symmetry and low-temperature cool flames.',
      link: '/combustion',
      metrics: '42 Flight Datasets • CIR & Drop Towers'
    },
    {
      title: 'NASA Flight Missions & CIR',
      badge: 'Orbital Campaigns',
      icon: Rocket,
      desc: 'Explore the major NASA microgravity combustion flight programs: FLEX (Flame Extinction), ACME (Advanced Combustion via Microgravity Experiments), and Saffir.',
      link: '/experiments',
      metrics: 'ISS Destiny Lab • Saffir Cygnus'
    },
    {
      title: 'Earth & Planetary Atmospheres',
      badge: 'Exploration Cabin Physics',
      icon: Globe,
      desc: 'Simulate flammability limits and burning rate multipliers across variable cabin pressures (56–101 kPa) and oxygen concentrations (21–34% O2).',
      link: '/combustion?tab=atmosphere',
      metrics: 'NASA-STD-6001B Flammability Matrix'
    },
    {
      title: 'Stellar Astronomy & Thermodynamics',
      badge: 'Astrophysical Kinetics',
      icon: Orbit,
      desc: 'Examine radiatively driven flame extinction, thermophoretic soot shell trapping, and blackbody radiative emission profiles in quiescent spaceflight environments.',
      link: '/analysis',
      metrics: 'Kinetics Regression R² > 0.98'
    },
    {
      title: 'Spacecraft Fire Safety & Mishap Archives',
      badge: 'Human Safety Engineering',
      icon: ShieldAlert,
      desc: 'Historical lessons from Apollo 1, Mir Kvant-1, and STS-107, coupled with deterministic risk models (0–100) across 40+ spacecraft fuels.',
      link: '/safety',
      metrics: 'Historical Case Studies & Hazard Index'
    },
    {
      title: 'NASA Technical Reports & Peer Review',
      badge: 'NTRS & PSI Archives',
      icon: BookOpen,
      desc: 'Access peer-reviewed research papers, technical reports, and combustion science literature from NASA Glenn, USRA, and university partner laboratories.',
      link: '/library',
      metrics: 'NASA PSI & NTRS Repositories'
    }
  ];

  const fundamentalLaws = [
    {
      name: 'Spalding d²-Law for Droplet Regression',
      formula: 'd²(t) = d₀² - K · t',
      desc: 'Under zero buoyancy, liquid fuel droplets regress linearly with time. The burning rate constant K represents the rate of mass loss driven solely by radial molecular diffusion.'
    },
    {
      name: 'Oxygen Partial Pressure Flammability Criterion',
      formula: 'PO₂ = (O₂% / 100) · P_chamber',
      desc: 'Spacecraft cabin fire risk scales with oxygen partial pressure. While total pressure may be reduced to 56 kPa, elevating O₂ to 32% maintains sea-level equivalent PO₂ (18 kPa).'
    },
    {
      name: 'Radiative Soot Shell Extinction Threshold',
      formula: 'q_rad ≥ q_chemical_release',
      desc: 'Because diffusion velocities are small in microgravity, residence time increases, accumulating soot shells whose thermal radiation can quench the flame before fuel burnout.'
    }
  ];

  return (
    <div className="page-container space-y-10">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <Orbit className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA PHYSICAL SCIENCES RESEARCH INFORMATICS</span>
          </div>
          <h1 className="page-title">Science Discovery Portal</h1>
          <p className="page-subtitle">
            Exploring fundamental combustion kinetics, fluid dynamics, and spacecraft life support physics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/copilot" className="btn-primary text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Ask Scientific Copilot</span>
          </Link>
        </div>
      </div>

      {/* ── 6 CORE SCIENTIFIC DISCIPLINES ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scienceDisciplines.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.link}
              className="group p-6 rounded-2xl bg-[#07111F] border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_25px_rgba(47,130,255,0.3)] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1769FF]/15 border border-[rgba(120,165,255,0.25)] flex items-center justify-center text-[#2F82FF] group-hover:scale-105 group-hover:bg-[#1769FF]/25 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#101B30] text-[#69B7FF] border border-[rgba(120,165,255,0.2)]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-[#69B7FF] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-[#AAB6CA] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs text-[#78869C]">
                <span className="font-mono text-[11px]">{item.metrics}</span>
                <span className="text-[#2F82FF] group-hover:text-white flex items-center space-x-1 font-medium transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── MATHEMATICAL & PHYSICAL FOUNDATIONS ──────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Fundamental Equations Governing Microgravity Flames
          </h2>
          <p className="text-xs text-[#AAB6CA] mt-1">
            Empirical physical formulations verified across NASA Glenn Drop Towers and ISS flight runs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {fundamentalLaws.map((law, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#07111F]/90 border border-[rgba(120,165,255,0.18)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">{law.name}</h4>
                <div className="p-3 rounded-lg bg-[#02050C] border border-[rgba(120,165,255,0.25)] font-mono text-xs text-[#38BDF8] text-center shadow-[inset_0_0_10px_rgba(47,130,255,0.1)]">
                  {law.formula}
                </div>
                <p className="text-xs text-[#AAB6CA] leading-relaxed pt-1">
                  {law.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[rgba(120,165,255,0.1)] text-right">
                <Link
                  to="/combustion"
                  className="text-xs font-medium text-[#2F82FF] hover:text-[#69B7FF] inline-flex items-center space-x-1"
                >
                  <span>Launch Simulator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
