import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Mic,
  MicOff,
  Camera,
  Rocket,
  Image as ImageIcon,
  FlaskConical,
  Newspaper,
  Orbit,
  ArrowRight,
  X,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { STATIC_EXPERIMENTS, STATIC_DOCUMENTS } from '../data/staticData';

// ── SOCIAL MEDIA VECTOR ICONS ───────────────────────────────────────────────

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// ── 4 DETAILED DOCK CARD VISUALS (EXACT TO REFERENCE) ───────────────────────

const EarthVisual: React.FC = () => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden shadow-[0_0_15px_rgba(56,189,248,0.5)]">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="earthAtmosphere" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#1E40AF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="earthOcean" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="45%" stopColor="#1D4ED8" />
          <stop offset="85%" stopColor="#0F172A" />
        </radialGradient>
        <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      {/* Base Ocean */}
      <circle cx="50" cy="50" r="48" fill="url(#earthOcean)" />
      {/* Continents */}
      <path
        d="M 32 30 Q 42 25 48 35 Q 52 42 45 52 Q 38 58 30 50 Z M 52 22 Q 62 18 70 26 Q 72 38 62 42 Q 54 35 52 22 Z M 58 55 Q 68 52 72 65 Q 65 78 55 72 Q 50 62 58 55 Z M 25 60 Q 32 62 30 75 Q 22 72 25 60 Z"
        fill="#15803D"
        opacity="0.9"
      />
      {/* Mountains */}
      <path
        d="M 40 32 Q 46 28 50 36 M 60 25 Q 64 22 68 28"
        stroke="#A16207"
        strokeWidth="2"
        fill="none"
        opacity="0.75"
      />
      {/* Swirling Clouds */}
      <path
        d="M 20 40 Q 35 32 55 42 Q 75 52 82 45 Q 65 48 45 38 Q 28 35 20 40 Z M 30 65 Q 50 58 70 70 Q 55 75 35 72 Z M 48 20 Q 60 15 72 22 Q 58 24 48 20 Z"
        fill="#FFFFFF"
        opacity="0.7"
        filter="url(#cloudBlur)"
      />
      {/* Atmospheric Rim & Specular Glow */}
      <circle cx="50" cy="50" r="48" fill="url(#earthAtmosphere)" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.95" />
    </svg>
  </div>
);

const ArtemisVisual: React.FC = () => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Tilted Lunar Orbit Track */}
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="22"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
        transform="rotate(-25 50 50)"
      />
      {/* Distant celestial node */}
      <circle cx="28" cy="62" r="5" fill="#64748B" opacity="0.5" />
      {/* Spacecraft System */}
      <g transform="rotate(-25 50 50)">
        {/* Left solar wings */}
        <line x1="20" y1="46" x2="42" y2="48" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="20" y1="54" x2="42" y2="52" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
        {/* Right solar wings */}
        <line x1="58" y1="48" x2="80" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="58" y1="52" x2="80" y2="54" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
        {/* Solar gridlines */}
        <line x1="26" y1="44" x2="26" y2="56" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" />
        <line x1="34" y1="45" x2="34" y2="55" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" />
        <line x1="66" y1="45" x2="66" y2="55" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" />
        <line x1="74" y1="44" x2="74" y2="56" stroke="#93C5FD" strokeWidth="0.8" opacity="0.8" />
        {/* Central Orion Service & Command Module */}
        <rect x="43" y="46" width="14" height="8" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <polygon points="57,47 64,50 57,53" fill="#F8FAFC" />
        <polygon points="43,48 39,47 39,53 43,52" fill="#64748B" />
        {/* Blue engine glow */}
        <circle cx="38" cy="50" r="2.5" fill="#38BDF8" className="animate-pulse" />
      </g>
    </svg>
  </div>
);

const SolarVisual: React.FC = () => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
    <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-md pointer-events-none" />
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="sunCore" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <radialGradient id="sunFlare" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#F97316" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer Corona Flare */}
      <circle cx="50" cy="50" r="46" fill="url(#sunFlare)" />
      {/* Plasma Loops */}
      <path
        d="M 50 6 Q 54 14 50 18 M 88 40 Q 82 46 92 52 M 65 90 Q 56 84 52 92 M 12 55 Q 18 50 10 44 M 22 22 Q 28 30 20 34"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* Sun Core */}
      <circle cx="50" cy="50" r="34" fill="url(#sunCore)" />
      {/* Granules */}
      <circle cx="42" cy="40" r="5" fill="#DC2626" opacity="0.35" />
      <circle cx="58" cy="52" r="4" fill="#DC2626" opacity="0.35" />
      <circle cx="48" cy="60" r="3" fill="#DC2626" opacity="0.3" />
    </svg>
  </div>
);

const UniverseVisual: React.FC = () => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Concentric Tilted Orbital Ellipses */}
      <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.45" />
      <ellipse cx="50" cy="50" rx="34" ry="13" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.65" />
      <ellipse cx="50" cy="50" rx="20" ry="8" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.45" />
      {/* Central Star */}
      <circle cx="50" cy="50" r="4.5" fill="#FEF08A" />
      {/* Orbiting Planets */}
      <circle cx="33" cy="46" r="2" fill="#E2E8F0" />
      {/* Gas Giant with Ring */}
      <g transform="translate(68, 56)">
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="none" stroke="#93C5FD" strokeWidth="1" />
        <circle cx="0" cy="0" r="3.5" fill="#38BDF8" />
      </g>
      <circle cx="18" cy="42" r="2.5" fill="#94A3B8" />
    </svg>
  </div>
);

// ── MAIN MISSION OVERVIEW COMPONENT ──────────────────────────────────────────

export const MissionOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; type: string; url: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      if (transcript.trim()) {
        navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      try {
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      try {
        recognition.stop();
      } catch {}
    }

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [isListening, navigate]);

  const toggleVoiceSearch = () => {
    setIsListening(prev => !prev);
  };

  // Real auto-suggestions based on user query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches: Array<{ title: string; type: string; url: string }> = [];

    // Check verified experiments
    STATIC_EXPERIMENTS.forEach(exp => {
      if (
        exp.fuel_type.toLowerCase().includes(q) ||
        exp.title.toLowerCase().includes(q) ||
        exp.experiment_id.toLowerCase().includes(q)
      ) {
        matches.push({
          title: `${exp.experiment_id}: ${exp.fuel_type} (${exp.gravity_level === 0 ? '0g Microgravity' : '1g'})`,
          type: 'Experiment',
          url: `/experiments?search=${encodeURIComponent(exp.fuel_type)}`
        });
      }
    });

    // Check research documents
    STATIC_DOCUMENTS.forEach(doc => {
      if (doc.title.toLowerCase().includes(q) || (doc.abstract && doc.abstract.toLowerCase().includes(q))) {
        matches.push({
          title: doc.title,
          type: 'Technical Paper',
          url: `/library?doc=${doc.doc_id}`
        });
      }
    });

    // Common scientific topics
    const topics = [
      { name: 'd²-law Droplet Burning Kinetics', type: 'Physical Model', url: '/combustion' },
      { name: 'Cool Flame Low-Temperature Oscillations', type: 'Phenomenon', url: '/copilot?q=Explain+cool+flame+kinetics' },
      { name: 'Soot Radiation & Standoff Ratio in Microgravity', type: 'Theory', url: '/combustion' },
      { name: 'Spacecraft Cabin Oxygen Flammability Limits (32% O2)', type: 'Fire Safety', url: '/safety' }
    ];

    topics.forEach(t => {
      if (t.name.toLowerCase().includes(q)) {
        matches.push({ title: t.name, type: t.type, url: t.url });
      }
    });

    setSuggestions(matches.slice(0, 6));
  }, [searchQuery]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 5 Quick Access Shortcuts (exact order and labels from reference image)
  const shortcuts = [
    { label: 'NASA Missions', icon: Rocket, to: '/experiments?series=FLEX' },
    { label: 'Space Images', icon: ImageIcon, to: '/images' },
    { label: 'Scientific Research', icon: FlaskConical, to: '/science' },
    { label: 'Latest News', icon: Newspaper, to: '/news' },
    { label: 'Explore Space', icon: Orbit, to: '/experiments' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden select-none isolate bg-[#02050C]">
      {/* ── 1. CINEMATIC EARTH FROM SPACE HERO BACKGROUND ─────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Background Image: High-resolution Earth from orbit with glowing atmospheric horizon & moon */}
        <img
          src="/hero-earth-space.jpg"
          alt="Planet Earth from Orbit in Space"
          className="w-full h-full object-cover object-[center_30%] select-none"
        />

        {/* Deep space top vignette to ensure 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02050C]/85 via-[#02050C]/25 to-transparent pointer-events-none" />

        {/* Central sunrise corona flare */}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(255,245,210,0.35)_0%,rgba(47,130,255,0.25)_45%,transparent_75%)] blur-2xl pointer-events-none" />

        {/* Ambient bottom glow */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#02050C]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── 2. MAIN CENTER HERO CONTENT: LOGO, SLOGAN, SEARCH, SHORTCUTS & 4 DOCK CARDS ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-3 sm:pt-6 pb-4 sm:pb-6 max-w-6xl mx-auto w-full relative z-10">
        
        {/* Central Brand Identity: NASA Meatball | FlameLens Dual Lockup */}
        <div className="relative flex flex-col items-center mb-5 sm:mb-7 text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Subtle angled 3D orbital ellipse ring looping behind the lockup */}
          <div className="absolute -inset-14 sm:-inset-24 pointer-events-none -z-10 flex items-center justify-center">
            <svg viewBox="0 0 1000 350" className="w-[850px] sm:w-[1050px] h-[300px] overflow-visible opacity-55">
              <defs>
                <linearGradient id="orbitRingGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1769FF" stopOpacity="0.05" />
                  <stop offset="30%" stopColor="#2F82FF" stopOpacity="0.5" />
                  <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.95" />
                  <stop offset="80%" stopColor="#1769FF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2F82FF" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <ellipse
                cx="500"
                cy="175"
                rx="460"
                ry="115"
                fill="none"
                stroke="url(#orbitRingGlow)"
                strokeWidth="1.8"
                transform="rotate(-11 500 175)"
              />
            </svg>
          </div>

          {/* NASA Meatball + Divider + FlameLens Lockup */}
          <div className="flex items-center space-x-5 sm:space-x-7">
            {/* NASA Meatball Logo */}
            <div className="relative group">
              <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-[radial-gradient(circle,rgba(47,130,255,0.65)_0%,rgba(23,105,255,0.3)_50%,transparent_75%)] blur-xl group-hover:bg-[radial-gradient(circle,rgba(47,130,255,0.85)_0%,rgba(23,105,255,0.45)_50%,transparent_75%)] transition-all duration-500" />
              <img
                src="/nasa-logo.svg"
                alt="NASA Insignia"
                className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_0_35px_rgba(47,130,255,0.95)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Vertical Divider Line */}
            <div className="h-16 sm:h-24 md:h-28 w-[1.5px] bg-white/25 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />

            {/* FlameLens Futuristic Wordmark */}
            <div className="flex flex-col items-start justify-center text-left">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_0_25px_rgba(47,130,255,0.5)]">
                FlameLens
              </h1>
            </div>
          </div>

          {/* Slogan Statement: EXPLORE • DISCOVER • KNOW */}
          <div className="mt-3 sm:mt-4 text-[12px] sm:text-[14px] md:text-[16px] font-medium tracking-[0.38em] text-[#CBD5E1] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] px-2">
            <span>EXPLORE</span>
            <span className="mx-2.5 sm:mx-4 text-[#2F82FF] drop-shadow-[0_0_8px_#2F82FF]">•</span>
            <span>DISCOVER</span>
            <span className="mx-2.5 sm:mx-4 text-[#2F82FF] drop-shadow-[0_0_8px_#2F82FF]">•</span>
            <span>KNOW</span>
          </div>
        </div>

        {/* ── 3. MASSIVE HORIZONTAL SEARCH BAR (EXACT REFERENCE REPRODUCTION) ── */}
        <div ref={containerRef} className="w-full max-w-4xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className={`
              relative w-full h-[76px] sm:h-[84px] md:h-[86px]
              rounded-full flex items-center px-4 sm:px-6 md:px-7
              bg-[rgba(16,30,58,0.7)] backdrop-blur-2xl
              border transition-all duration-300
              ${
                isFocused
                  ? 'border-[#2F82FF] shadow-[0_0_35px_rgba(47,130,255,0.65),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                  : 'border-[rgba(120,165,255,0.38)] shadow-[0_0_30px_rgba(35,112,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-[rgba(120,165,255,0.6)]'
              }
            `}
          >
            {/* Left Search Icon */}
            <div className="shrink-0 mr-3 sm:mr-5 text-white/90">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>

            {/* Central Large Text Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search anything on the web..."
              className="flex-1 bg-transparent border-none text-[17px] sm:text-[20px] md:text-[22px] font-normal text-white placeholder:text-[#78869C] focus:outline-none min-w-0"
              autoComplete="off"
            />

            {/* Clear Input Button (visible when text is entered) */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-[#78869C] hover:text-white transition-colors mr-1 sm:mr-2"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Right-Side Utility Controls & Arrow Button */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* Voice Search (Microphone) */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-2 sm:p-2.5 rounded-full transition-all ${
                  isListening
                    ? 'text-[#2F82FF] bg-[#2F82FF]/20 shadow-[0_0_15px_#2F82FF] animate-pulse'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={isListening ? 'Listening... Speak query' : 'Voice Search'}
                aria-label="Voice Search"
              >
                {isListening ? (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#38BDF8]" />
                ) : (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Image Search (Camera) */}
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Search by flame image or spectra"
                aria-label="Visual Search"
              >
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Vertical Separator */}
              <div className="h-7 sm:h-8 w-px bg-white/20 mx-1 sm:mx-2" />

              {/* Prominent Circular Bright-Blue Search Button WITH RIGHT ARROW */}
              <button
                type="submit"
                disabled={isSearching}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1769FF] hover:bg-[#2F82FF] text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_24px_rgba(47,130,255,0.75)] hover:shadow-[0_0_32px_rgba(47,130,255,1)] hover:scale-105 active:scale-95 shrink-0"
                aria-label="Submit Search"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </form>

          {/* Real Search Suggestions Dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute top-full mt-3 inset-x-2 sm:inset-x-4 bg-[#07111F]/95 backdrop-blur-2xl border border-[rgba(120,165,255,0.25)] rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(35,112,255,0.3)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#78869C] border-b border-[rgba(120,165,255,0.14)] mb-1 flex items-center justify-between">
                <span>NASA Verified Recommendations</span>
                <span>Press Enter to search</span>
              </div>
              <div className="space-y-1">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsFocused(false);
                      navigate(s.url);
                    }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#101B30] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Search className="w-4 h-4 text-[#78869C] group-hover:text-[#2F82FF] shrink-0" />
                      <span className="text-[14px] text-white group-hover:text-[#69B7FF] truncate">
                        {s.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1769FF]/15 text-[#69B7FF] border border-[rgba(120,165,255,0.2)] shrink-0 ml-2">
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 4. QUICK ACCESS SHORTCUTS (5 HORIZONTAL BALANCED PILLS) ───────── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6 w-full max-w-4xl">
          {shortcuts.map((sc, index) => {
            const Icon = sc.icon;
            return (
              <Link
                key={index}
                to={sc.to}
                className="
                  flex items-center space-x-2 sm:space-x-2.5
                  px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                  bg-[rgba(16,28,52,0.65)] backdrop-blur-xl
                  border border-[rgba(120,165,255,0.22)]
                  hover:border-[#2F82FF] hover:bg-[rgba(23,105,255,0.22)]
                  hover:shadow-[0_0_20px_rgba(47,130,255,0.4)]
                  hover:-translate-y-0.5 transition-all duration-200
                "
              >
                <Icon className="w-4 h-4 text-white/90 shrink-0" />
                <span className="text-[13px] sm:text-[14px] font-medium text-white tracking-tight whitespace-nowrap">
                  {sc.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── 5. LOWER DISCOVERY CAROUSEL DOCK (THE 4 CARDS ROW) ─────────────── */}
        <div className="w-full max-w-6xl mt-5 sm:mt-7 rounded-2xl bg-[rgba(10,20,40,0.72)] backdrop-blur-2xl border border-[rgba(120,165,255,0.22)] shadow-[0_12px_45px_rgba(0,0,0,0.7)] p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(120,165,255,0.15)]">
          {/* Card 1: Earth */}
          <div
            onClick={() => navigate('/science')}
            className="flex items-center space-x-3.5 px-3 py-2.5 sm:py-1 group cursor-pointer hover:bg-white/[0.04] rounded-xl transition-all"
            title="Explore Earth Science"
          >
            <EarthVisual />
            <div className="min-w-0">
              <div className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">Earth</div>
              <div className="text-[12px] sm:text-[13px] text-[#94A3B8] truncate">Our Home Planet</div>
              <div className="text-[12px] sm:text-[13px] font-medium text-[#2F82FF] group-hover:text-[#69B7FF] flex items-center space-x-1 mt-0.5">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 2: Artemis II */}
          <div
            onClick={() => navigate('/experiments?series=FLEX')}
            className="flex items-center space-x-3.5 px-3 py-2.5 sm:py-1 group cursor-pointer hover:bg-white/[0.04] rounded-xl transition-all"
            title="View Artemis II Mission Telemetry"
          >
            <ArtemisVisual />
            <div className="min-w-0">
              <div className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">Artemis II</div>
              <div className="text-[12px] sm:text-[13px] text-[#94A3B8] truncate">Next Moon Mission</div>
              <div className="text-[12px] sm:text-[13px] font-medium text-[#2F82FF] group-hover:text-[#69B7FF] flex items-center space-x-1 mt-0.5">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 3: Solar Activity */}
          <div
            onClick={() => navigate('/combustion')}
            className="flex items-center space-x-3.5 px-3 py-2.5 sm:py-1 group cursor-pointer hover:bg-white/[0.04] rounded-xl transition-all"
            title="Analyze Solar Flare Telemetry"
          >
            <SolarVisual />
            <div className="min-w-0">
              <div className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">Solar Activity</div>
              <div className="text-[12px] sm:text-[13px] text-[#94A3B8] truncate">Current Conditions</div>
              <div className="text-[12px] sm:text-[13px] font-medium text-[#2F82FF] group-hover:text-[#69B7FF] flex items-center space-x-1 mt-0.5">
                <span>View Data</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 4: Explore the Universe */}
          <div
            onClick={() => navigate('/copilot')}
            className="flex items-center space-x-3.5 px-3 py-2.5 sm:py-1 group cursor-pointer hover:bg-white/[0.04] rounded-xl transition-all"
            title="Launch AI Scientific Copilot"
          >
            <UniverseVisual />
            <div className="min-w-0">
              <div className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">Explore the Universe</div>
              <div className="text-[12px] sm:text-[13px] text-[#94A3B8] truncate">With FlameLens</div>
              <div className="text-[12px] sm:text-[13px] font-medium text-[#2F82FF] group-hover:text-[#69B7FF] flex items-center space-x-1 mt-0.5">
                <span>Start Exploring</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 6. MINIMAL BOTTOM FOOTER (EXACT MATCH TO REFERENCE) ────────────── */}
      <footer className="relative z-10 px-4 sm:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#AAB6CA]">
        {/* Left: Small NASA Logo + FlameLens + Tagline */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/nasa-logo.svg" alt="NASA" className="w-6 h-6 object-contain" />
            <span className="text-[14px] font-semibold text-white">FlameLens</span>
          </Link>
          <span className="hidden sm:inline text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#94A3B8] uppercase">
            A NASA POWERED SEARCH EXPERIENCE
          </span>
        </div>

        {/* Right: Policy Links & Social Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center space-x-3 text-[11px] text-[#AAB6CA]">
            <Link to="/library" className="hover:text-white transition-colors">About</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/settings" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/copilot" className="hover:text-white transition-colors">Help</Link>
          </div>

          {/* Social Media Icons matching reference */}
          <div className="flex items-center space-x-3 text-white/80">
            <a href="https://youtube.com/nasa" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors" title="NASA YouTube">
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com/nasa" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors" title="NASA on X">
              <XIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://linkedin.com/company/nasa" target="_blank" rel="noopener noreferrer" className="hover:text-[#60A5FA] transition-colors" title="NASA LinkedIn">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://github.com/nasa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="NASA GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ── 7. VISUAL IMAGE SEARCH MODAL ───────────────────────────────────── */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#07111F] border border-[rgba(120,165,255,0.3)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.35)] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[rgba(120,165,255,0.18)] pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#2F82FF]" />
                <h3 className="text-base font-semibold text-white">Visual Flame Search</h3>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#AAB6CA]">
              Upload microgravity combustion imagery, drop-tower schlieren footage, or spherical flame photos to locate matching NASA CIR flight telemetry.
            </p>

            <div className="border-2 border-dashed border-[rgba(120,165,255,0.3)] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#2F82FF] transition-colors bg-[#101B30]/40">
              <Upload className="w-10 h-10 text-[#2F82FF] mb-3 animate-pulse" />
              <div className="text-sm font-medium text-white mb-1">Drop flame imagery or browse file</div>
              <div className="text-[11px] text-[#78869C]">Supports PNG, JPG, WebP, FITS spectra (up to 25MB)</div>
              <button
                onClick={() => {
                  setIsImageModalOpen(false);
                  navigate('/images');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#1769FF] hover:bg-[#2F82FF] text-white text-xs font-medium transition-colors"
              >
                Browse Combustion Gallery
              </button>
            </div>

            <div className="bg-[#101B30]/60 rounded-xl p-3 border border-[rgba(120,165,255,0.15)] flex items-start space-x-2.5 text-xs text-[#AAB6CA]">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <span>Direct integration with NASA Physical Sciences Informatics (PSI) image repository.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
