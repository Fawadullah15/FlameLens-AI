import React, { useState } from 'react';
import { Search, Image as ImageIcon, X, ExternalLink, Download, Sparkles, Flame, Orbit, Layers, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlameImageItem {
  id: string;
  title: string;
  category: 'Spherical Flames' | 'ISS CIR Facility' | 'Extinction & Soot' | 'Drop Tower Tests';
  imageUrl: string;
  fuel: string;
  gravity: string;
  source: string;
  description: string;
  burnRateK?: number;
  standoffRatio?: number;
  experimentId: string;
}

const NASA_IMAGE_GALLERY: FlameImageItem[] = [
  {
    id: 'IMG-001',
    title: 'Pure Spherical Diffusion Flame Envelope in Microgravity',
    category: 'Spherical Flames',
    imageUrl: '/spherical-flame.jpg',
    fuel: 'Methanol (CH3OH)',
    gravity: '0.0001 g (ISS CIR Destiny Lab)',
    source: 'NASA Physical Sciences Informatics (PSI-FLEX-01)',
    description: 'Isolated droplet burning in quiescent microgravity. Natural buoyant convection is suppressed, establishing a perfectly radially symmetric spherical blue flame front.',
    burnRateK: 0.672,
    standoffRatio: 6.5,
    experimentId: 'FLEX-001'
  },
  {
    id: 'IMG-002',
    title: 'n-Heptane Droplet Combustion with Soot Shell Luminescence',
    category: 'Extinction & Soot',
    imageUrl: '/spherical-flame.jpg',
    fuel: 'n-Heptane (C7H16)',
    gravity: '0.0001 g (ISS CIR MDCA)',
    source: 'NASA Glenn Research Center Combustion Science',
    description: 'Soot agglomerates accumulate between droplet and flame front due to thermophoretic forces, emitting intense radiant thermal loss prior to cool-flame transition.',
    burnRateK: 0.748,
    standoffRatio: 7.2,
    experimentId: 'FLEX-002'
  },
  {
    id: 'IMG-003',
    title: 'ISS Combustion Integrated Rack (CIR) Core Chamber Diagnostics',
    category: 'ISS CIR Facility',
    imageUrl: '/hero-earth-space.jpg',
    fuel: 'Chamber Optical Diagnostic Array',
    gravity: 'Low Earth Orbit (400 km)',
    source: 'ISS US Destiny Laboratory Module',
    description: 'The Combustion Integrated Rack (CIR) features a 100-liter multi-user chamber equipped with high-speed digital schlieren cameras, radiometers, and gas analysis systems.',
    experimentId: 'CIR-MDCA'
  },
  {
    id: 'IMG-004',
    title: 'NASA Glenn 2.2-Second Drop Tower Freefall Flame Ignition',
    category: 'Drop Tower Tests',
    imageUrl: '/spherical-flame.jpg',
    fuel: 'Ethanol (C2H5OH)',
    gravity: '0.001 g (Drop Tower Freefall)',
    source: 'NASA Glenn Research Center (Cleveland, Ohio)',
    description: 'High-speed imaging captured during 24-meter freefall. The buoyant upward flame tip collapses into a spherical shell within 120 milliseconds of release.',
    burnRateK: 0.612,
    standoffRatio: 5.8,
    experimentId: 'GRC-DT-01'
  },
  {
    id: 'IMG-005',
    title: 'Cool Flame Low-Temperature Invisible Droplet Reaction',
    category: 'Extinction & Soot',
    imageUrl: '/spherical-flame.jpg',
    fuel: 'n-Decane (C10H22)',
    gravity: '0.0001 g (ISS CIR)',
    source: 'FLEX-2 Investigation (NASA PSI)',
    description: 'Following hot visible flame extinction at ~1550 K, low-temperature chemical kinetics sustain regression at ~650 K, invisible to human eye but verified via radiometers.',
    burnRateK: 0.320,
    standoffRatio: 4.1,
    experimentId: 'FLEX-003'
  },
  {
    id: 'IMG-006',
    title: 'NASA Spacecraft Fire Safety Flammability Assessment (Saffir)',
    category: 'Spherical Flames',
    imageUrl: '/hero-earth-space.jpg',
    fuel: 'Cotton-Fiberglass Fabric Blend',
    gravity: '0.0001 g (Cygnus Spacecraft)',
    source: 'Saffir Flight Experiment Series',
    description: 'Investigating real-scale flame growth across spacecraft cabin fabrics aboard an uncrewed Cygnus resupply vehicle prior to atmospheric re-entry.',
    experimentId: 'SAFFIR-01'
  }
];

export const ImagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<FlameImageItem | null>(null);

  const categories = ['All', 'Spherical Flames', 'ISS CIR Facility', 'Extinction & Soot', 'Drop Tower Tests'];

  const filteredImages = NASA_IMAGE_GALLERY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fuel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container space-y-6">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <ImageIcon className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA PHYSICAL SCIENCES INFORMATICS (PSI) ARCHIVES</span>
          </div>
          <h1 className="page-title">Microgravity Combustion Image Gallery</h1>
          <p className="page-subtitle">
            Optical diagnostics, high-speed camera frames, and flame chemiluminescence imagery from ISS CIR & Drop Towers.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#AAB6CA]">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
          <span>{filteredImages.length} High-Resolution Imagery Records</span>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY FILTERS ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78869C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter imagery by fuel, facility, or phenomenon..."
            className="input-standard input-with-icon w-full pl-10"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1 bg-[#101B30]/70 border border-[rgba(120,165,255,0.2)] rounded-xl text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1769FF] text-white font-semibold shadow-[0_0_10px_rgba(47,130,255,0.5)]'
                  : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── IMAGE GRID ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveImage(img)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-[#07111F] border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_25px_rgba(47,130,255,0.35)] transition-all flex flex-col"
          >
            {/* Image Preview with Aspect Ratio */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#02050C]">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-80" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#02050C]/80 backdrop-blur-md border border-[rgba(120,165,255,0.3)] text-[10px] font-mono text-[#69B7FF]">
                {img.category}
              </div>

              {/* Gravity Tag */}
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white/90">
                {img.gravity.split(' ')[0]}
              </div>
            </div>

            {/* Meta Information */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#69B7FF] transition-colors leading-snug">
                  {img.title}
                </h3>
                <p className="text-xs text-[#AAB6CA] mt-1 line-clamp-2 leading-relaxed">
                  {img.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs text-[#78869C]">
                <span>{img.fuel}</span>
                <span className="font-mono text-[11px] text-[#2F82FF] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── IMAGE DETAIL LIGHTBOX MODAL ──────────────────────────────────── */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#07111F] border border-[rgba(120,165,255,0.35)] rounded-2xl shadow-[0_0_60px_rgba(35,112,255,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[rgba(120,165,255,0.18)] flex items-center justify-between bg-[#101B30]/60">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#69B7FF]">{activeImage.id}</span>
                <span className="text-white font-semibold text-sm truncate max-w-md">{activeImage.title}</span>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Image Display */}
            <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Detailed Properties Panel */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                {activeImage.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[rgba(120,165,255,0.18)] text-xs">
                <div>
                  <div className="text-[#78869C]">Fuel System</div>
                  <div className="font-semibold text-white mt-0.5">{activeImage.fuel}</div>
                </div>
                <div>
                  <div className="text-[#78869C]">Gravity Regime</div>
                  <div className="font-semibold text-[#69B7FF] mt-0.5">{activeImage.gravity}</div>
                </div>
                {activeImage.burnRateK && (
                  <div>
                    <div className="text-[#78869C]">Burning Rate K</div>
                    <div className="font-mono font-semibold text-white mt-0.5">{activeImage.burnRateK} mm²/s</div>
                  </div>
                )}
                {activeImage.standoffRatio && (
                  <div>
                    <div className="text-[#78869C]">Standoff Rf/Rs</div>
                    <div className="font-mono font-semibold text-white mt-0.5">{activeImage.standoffRatio}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-[#78869C]">
                  Provenance: <strong className="text-white">{activeImage.source}</strong>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/combustion?experimentId=${activeImage.experimentId}`}
                    onClick={() => setActiveImage(null)}
                    className="btn-primary text-xs"
                  >
                    <Flame className="w-3.5 h-3.5 mr-1.5" />
                    Analyze Combustion Kinetics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
