import React, { useState } from 'react';
import { Newspaper, Calendar, ExternalLink, ArrowRight, X, Clock, Bookmark, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  title: string;
  category: 'Spaceflight Safety' | 'Combustion Science' | 'Artemis Missions' | 'ISS Research';
  date: string;
  readTime: string;
  author: string;
  source: string;
  summary: string;
  content: string;
  imageUrl: string;
  featured?: boolean;
}

const NASA_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'NEWS-01',
    title: 'NASA Glenn Researchers Uncover Novel Droplet Extinction Dynamics for Artemis Lunar Habitation',
    category: 'Artemis Missions',
    date: 'November 12, 2026',
    readTime: '4 min read',
    author: 'Combustion Science Branch',
    source: 'NASA Glenn Research Center (GRC)',
    imageUrl: '/hero-earth-space.jpg',
    featured: true,
    summary: 'New empirical datasets from the International Space Station Combustion Integrated Rack indicate that reduced gravity on the Moon (0.166 g) alters radiative flame standoff distances, creating unique fire suppression challenges for pressurized habitats.',
    content: `NASA combustion scientists analyzing flight telemetry from the Flame Extinction Experiment (FLEX) series have verified that partial gravity regimes—such as the lunar surface (1/6 g) and Martian surface (3/8 g)—exhibit hybrid combustion behaviors distinct from both Earth's 1-g and orbital 0-g.

In terrestrial gravity, buoyant convection rapidly replenishes oxidizer and sweeps away combustion byproducts. In microgravity, transport is dominated purely by slow molecular diffusion. At lunar gravity levels, however, weak convective currents interact with stagnant soot envelopes, shifting the critical oxygen index (LOI) required for flame sustainment.

These discoveries directly inform the environmental life support systems (ECLSS) and fire detection sensor suites currently being engineered for the Artemis Base Camp and Lunar Gateway.`
  },
  {
    id: 'NEWS-02',
    title: 'ISS CIR Completes Milestone Run: 50th Low-Temperature Cool Flame Sequence Observed',
    category: 'ISS Research',
    date: 'October 29, 2026',
    readTime: '3 min read',
    author: 'Physical Sciences Informatics Team',
    source: 'ISS US National Laboratory',
    imageUrl: '/spherical-flame.jpg',
    summary: 'The Multi-user Droplet Combustion Apparatus (MDCA) on the International Space Station has logged its 50th continuous observation of low-temperature alkane combustion following apparent thermal extinction.',
    content: `During recent investigations aboard the Destiny laboratory module, scientists confirmed that hydrocarbon droplets continue reacting invisibly at temperatures below 700 K after the initial visible flame front extinguishes.

The cool-flame phenomenon, initially thought to be an isolated laboratory curiosity, is now proven to be an inherent kinetic pathway for large-hydrocarbon fuels in diffusion-dominated spaceflight environments. Understanding these invisible reaction zones is vital for spacecraft thermal insulation safety and advanced internal combustion efficiency on Earth.`
  },
  {
    id: 'NEWS-03',
    title: 'Spacecraft Material Flammability Standards Updated for Elevated Exploration Atmospheres',
    category: 'Spaceflight Safety',
    date: 'October 15, 2026',
    readTime: '5 min read',
    author: 'NASA Safety Center',
    source: 'NASA-STD-6001B Technical Committee',
    imageUrl: '/spherical-flame.jpg',
    summary: 'NASA updates flammability screening protocols for exploration cabin atmospheres operating at 56 kPa (8.2 psia) with 32% oxygen, optimizing astronaut extravehicular prebreathe protocols without escalating ignition risk.',
    content: `To minimize the hours astronauts must spend breathing pure oxygen prior to spacewalks, modern exploration architectures utilize reduced chamber pressure combined with elevated oxygen percentages (30% to 34% O2).

However, combustion experiments in drop towers demonstrate that increased oxygen partial pressure accelerates flame spread rates by up to 2.4x across common spaceflight polymers. The revised standards mandate strict upward flammability screening and enhanced local smoke detection geometry.`
  },
  {
    id: 'NEWS-04',
    title: 'Autonomous AI Integration: Real-Time Flame Kinetics Diagnostics Deployed to Ground Stations',
    category: 'Combustion Science',
    date: 'September 28, 2026',
    readTime: '3 min read',
    author: 'Space Apps Aerospace Team',
    source: 'FlameLens AI Collaboration',
    imageUrl: '/hero-earth-space.jpg',
    summary: 'FlameLens AI introduces automated d²-law regression and multi-modal flame standoff tracking to analyze drop tower camera feeds instantaneously, reducing data pipeline latency from weeks to seconds.',
    content: `By coupling classical Spalding droplet regression equations with Google Gemini 2.5 Flash intelligence and SQLite FTS5 vector retrieval, FlameLens enables flight controllers to extract instantaneous burning rate constants (K) directly from ISS CIR sensor streams.`
  }
];

export const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const featuredArticle = NASA_NEWS_ARTICLES.find(a => a.featured) || NASA_NEWS_ARTICLES[0];
  const regularArticles = NASA_NEWS_ARTICLES.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="page-container space-y-8">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <Newspaper className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA AEROSPACE & COMBUSTION SCIENCE DISPATCH</span>
          </div>
          <h1 className="page-title">Science & Mission News</h1>
          <p className="page-subtitle">
            Editorial coverage, scientific breakthroughs, and fire safety briefings from NASA flight campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#AAB6CA]">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
          <span>NASA News Feed Active</span>
        </div>
      </div>

      {/* ── FEATURED STORY BANNER ────────────────────────────────────────── */}
      <div
        onClick={() => setSelectedArticle(featuredArticle)}
        className="group cursor-pointer rounded-2xl overflow-hidden bg-[#07111F] border border-[rgba(120,165,255,0.22)] hover:border-[#2F82FF] hover:shadow-[0_0_35px_rgba(47,130,255,0.35)] transition-all grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden bg-[#02050C]">
          <img
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#07111F] via-transparent to-transparent opacity-85" />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1769FF] text-white text-xs font-semibold shadow-[0_0_12px_rgba(23,105,255,0.8)]">
            FEATURED DISPATCH
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-[#69B7FF]">
              <span className="font-semibold">{featuredArticle.category}</span>
              <span>•</span>
              <span className="text-[#78869C]">{featuredArticle.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#69B7FF] transition-colors leading-tight">
              {featuredArticle.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#AAB6CA] line-clamp-4 leading-relaxed">
              {featuredArticle.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-[rgba(120,165,255,0.14)] flex items-center justify-between text-xs text-[#78869C]">
            <span>{featuredArticle.source}</span>
            <span className="text-[#2F82FF] group-hover:text-white font-medium flex items-center space-x-1.5 transition-colors">
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* ── RECENT STORIES GRID ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
          <span>Recent Dispatches & Bulletins</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {regularArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#07111F] border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_22px_rgba(47,130,255,0.3)] transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#02050C]">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#69B7FF] border border-white/10">
                  {article.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] text-[#78869C] mb-1.5">
                    <Calendar className="w-3 h-3 text-[#2F82FF]" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#69B7FF] transition-colors leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[#AAB6CA] mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs text-[#78869C]">
                  <span className="truncate max-w-[150px]">{article.source}</span>
                  <span className="text-[#2F82FF] font-medium flex items-center space-x-1">
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ARTICLE MODAL VIEW ───────────────────────────────────────────── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#07111F] border border-[rgba(120,165,255,0.35)] rounded-2xl shadow-[0_0_60px_rgba(35,112,255,0.4)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(120,165,255,0.18)] flex items-center justify-between bg-[#101B30]/60">
              <span className="text-xs font-mono text-[#69B7FF]">{selectedArticle.category}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#78869C] font-mono">
                  <span>Published: {selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span className="text-white">{selectedArticle.source}</span>
                </div>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm text-[#E2E8F0] space-y-4 leading-relaxed font-sans">
                {selectedArticle.content.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-[rgba(120,165,255,0.15)] bg-[#0C182B] flex items-center justify-between text-xs">
              <span className="text-[#78869C]">NASA Space Apps Challenge 2026 • Challenge 08</span>
              <Link
                to={`/copilot?q=${encodeURIComponent(selectedArticle.title)}`}
                onClick={() => setSelectedArticle(null)}
                className="btn-primary text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Discuss with AI Copilot
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
