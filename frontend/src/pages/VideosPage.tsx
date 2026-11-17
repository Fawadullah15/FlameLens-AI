import React, { useState } from 'react';
import { Search, Video, Play, X, ExternalLink, Clock, ShieldCheck, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoItem {
  id: string;
  title: string;
  platform: string;
  duration: string;
  thumbnailUrl: string;
  description: string;
  source: string;
  experimentId: string;
}

const NASA_VIDEOS: VideoItem[] = [
  {
    id: 'VID-001',
    title: 'ISS CIR FLEX Investigation: High-Speed Methanol Droplet Ignition',
    platform: 'ISS Destiny Laboratory',
    duration: '02:45',
    thumbnailUrl: '/spherical-flame.jpg',
    description: 'High-speed 1000 fps camera recording of pure spherical ignition, soot radiation buildup, and subsequent extinction without gravitational buoyant convection.',
    source: 'NASA Glenn Research Center / PSI Archive',
    experimentId: 'FLEX-001'
  },
  {
    id: 'VID-002',
    title: 'Cool Flame Transition in n-Heptane Droplets in Freefall',
    platform: '2.2-Second Drop Tower',
    duration: '01:30',
    thumbnailUrl: '/spherical-flame.jpg',
    description: 'Visualization of the sudden transition from visible hot combustion (~1600 K) to low-temperature second-stage chemical reaction (~650 K).',
    source: 'NASA Physical Sciences Informatics (PSI)',
    experimentId: 'FLEX-002'
  },
  {
    id: 'VID-003',
    title: 'Saffir Flight Experiment: Large-Scale Spacecraft Fabric Flammability',
    platform: 'Cygnus Spacecraft (Saffir-IV)',
    duration: '04:15',
    thumbnailUrl: '/hero-earth-space.jpg',
    description: 'In-flight investigation into flame spread across thick materials and cabin filters under low-speed airflow in orbital microgravity.',
    source: 'NASA Advanced Exploration Systems (AES)',
    experimentId: 'SAFFIR-01'
  },
  {
    id: 'VID-004',
    title: 'ACME Confined Combustion: Soot Shell Dynamics & Radiation Loss',
    platform: 'ISS CIR Chamber',
    duration: '03:10',
    thumbnailUrl: '/spherical-flame.jpg',
    description: 'Thermophoretic particle trapping within spherical flames, demonstrating radiant extinction limits in 30% oxygen exploration atmospheres.',
    source: 'NASA Glenn Research Center',
    experimentId: 'CFI-001'
  }
];

export const VideosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const filteredVideos = NASA_VIDEOS.filter((v) =>
    !searchQuery.trim() ||
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container space-y-6">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <Video className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA GLENN COMBUSTION SCIENCE FLIGHT TELEMETRY</span>
          </div>
          <h1 className="page-title">Microgravity Flight Experiments Video Library</h1>
          <p className="page-subtitle">
            High-speed video captures from the Combustion Integrated Rack (CIR), Zero-G parabolic flights, and drop towers.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#AAB6CA]">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
          <span>{filteredVideos.length} Documented Flight Sequences</span>
        </div>
      </div>

      {/* ── SEARCH INPUT ─────────────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78869C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter videos by experiment, mission, or facility..."
          className="input-standard input-with-icon w-full pl-10"
        />
      </div>

      {/* ── VIDEO CARDS GRID ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-[#07111F] border border-[rgba(120,165,255,0.18)] hover:border-[#2F82FF] hover:shadow-[0_0_25px_rgba(47,130,255,0.35)] transition-all flex flex-col"
          >
            {/* Thumbnail with Play Button Overlay */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#02050C]">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-black/40" />

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-13 h-13 rounded-full bg-[#1769FF]/90 group-hover:bg-[#2F82FF] text-white flex items-center justify-center shadow-[0_0_20px_rgba(47,130,255,0.8)] group-hover:scale-110 transition-all">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[11px] font-mono text-white">
                <Clock className="w-3 h-3 text-[#38BDF8]" />
                <span>{video.duration}</span>
              </div>

              {/* Platform Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#02050C]/80 backdrop-blur-md border border-[rgba(120,165,255,0.3)] text-[10px] font-mono text-[#69B7FF]">
                {video.platform}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-[#69B7FF] transition-colors leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-[#AAB6CA] mt-2 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[rgba(120,165,255,0.12)] flex items-center justify-between text-xs text-[#78869C]">
                <span>{video.source}</span>
                <span className="text-[#2F82FF] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1 font-medium">
                  <span>Watch Sequence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── VIDEO PLAYER MODAL ───────────────────────────────────────────── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#07111F] border border-[rgba(120,165,255,0.35)] rounded-2xl shadow-[0_0_60px_rgba(35,112,255,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(120,165,255,0.18)] flex items-center justify-between bg-[#101B30]/60">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-[#2F82FF]" />
                <h3 className="text-sm font-semibold text-white truncate max-w-md">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Mockup Screen */}
            <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeVideo.thumbnailUrl}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1769FF] flex items-center justify-center text-white shadow-[0_0_30px_#1769FF]">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div className="text-xs text-[#AAB6CA] font-mono">NASA CIR Camera Feed Simulation • 1000 FPS</div>
              </div>
            </div>

            {/* Video Info & Action Links */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                {activeVideo.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(120,165,255,0.14)]">
                <div className="text-xs text-[#78869C]">
                  Platform: <strong className="text-white">{activeVideo.platform}</strong>
                </div>
                <Link
                  to={`/combustion?experimentId=${activeVideo.experimentId}`}
                  onClick={() => setActiveVideo(null)}
                  className="btn-primary text-xs"
                >
                  <Flame className="w-3.5 h-3.5 mr-1.5" />
                  Analyze Experiment Kinetics
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
