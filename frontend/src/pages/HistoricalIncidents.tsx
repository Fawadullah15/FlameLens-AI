import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HistoricalIncident } from '../types';
import {
  Flame,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

export const HistoricalIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<HistoricalIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<HistoricalIncident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await api.getIncidents();
        setIncidents(data);
        if (data.length > 0) {
          setSelectedIncident(data[0]);
        }
      } catch (err: any) {
        console.error('Failed to load historical incidents:', err);
        setError('Failed to load NASA historical incident records.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-space-700">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              NASA FLIGHT SAFETY ARCHIVE
            </span>
            <span className="text-xs font-mono text-slate-400">SMA / MISHAP REPORTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Historical Spacecraft Fire Incidents
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Official post-incident investigations, environmental conditions, ignition triggers, and safety doctrine governing modern human spaceflight.
          </p>
        </div>
      </div>

      {/* Methodological Isolation Notice */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-amber-200/90">
          <span className="font-semibold text-amber-300 block mb-0.5">
            SCIENTIFIC PROVENANCE & SEPARATION OF OPERATIONAL DISASTERS:
          </span>
          In accordance with NASA Glenn and Space Apps standards, historical flight accidents (Apollo 1, Apollo 13, Mir 1997) are cataloged as operational safety dossiers. They are strictly isolated from controlled, microgravity combustion datasets (FLEX, ACME, CFI) to ensure mathematical and empirical integrity in flame kinetics equations.
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-slate-400">Retrieving NASA Mishap Investigation Dossiers...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incident Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Select Investigation ({incidents.length} Records)
            </h2>
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.incident_id === inc.incident_id;
              const isFatal = inc.incident_id === 'INC-APOLLO-1';

              return (
                <div
                  key={inc.incident_id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-space-800/90 border-cyan-500 shadow-glow-cyan'
                      : 'bg-space-900/60 border-space-700 hover:border-space-600 hover:bg-space-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-slate-400 border border-space-700">
                          {inc.incident_id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isFatal
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        }`}>
                          {isFatal ? 'CATASTROPHIC LOSS' : 'MISSION EMERGENCY'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300">
                        {inc.mission_name}
                      </h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {inc.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-space-800/80 pt-2.5">
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{inc.date}</span>
                    </div>
                    <div className="text-slate-400 text-right">
                      <span className="text-cyan-400">{inc.spacecraft}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Incident Deep-Dive Dossier */}
          {selectedIncident && (
            <div className="lg:col-span-7 space-y-5 bg-space-900/90 border border-space-700 rounded-xl p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b border-space-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400">{selectedIncident.incident_id}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{selectedIncident.location}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedIncident.mission_name}
                  </h2>
                </div>
                <a
                  href={selectedIncident.nasa_reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono transition-colors flex-shrink-0"
                >
                  <span>NASA Archive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Environmental Hazard Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-lg bg-space-850 border border-space-700/80">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                    ATMOSPHERIC FIRE ENVIRONMENT
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {selectedIncident.fire_environment}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-space-850 border border-space-700/80">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                    IGNITION MECHANISM
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {selectedIncident.ignition_source}
                  </p>
                </div>
              </div>

              {/* Combustible Materials & Consequences */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/40">
                  <span className="text-[10px] font-mono uppercase text-rose-400 block mb-1 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-rose-500" />
                    COMBUSTIBLE MATERIALS INVOLVED
                  </span>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {selectedIncident.materials_involved}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-space-850 border border-space-700/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    CONSEQUENCES & MISSION IMPACT
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedIncident.consequences}
                  </p>
                </div>
              </div>

              {/* Documented Lessons Learned */}
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/50 space-y-2">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-mono font-semibold uppercase">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  DOCUMENTED NASA LESSONS LEARNED & ENGINEERING REFORMS
                </div>
                <p className="text-xs text-teal-100/90 leading-relaxed whitespace-pre-line">
                  {selectedIncident.documented_lessons_learned}
                </p>
              </div>

              {/* Relevance to Modern Spacecraft */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-semibold uppercase">
                  <Info className="w-4 h-4 text-cyan-400" />
                  DIRECT RELEVANCE TO ARTEMIS, GATEWAY & COMMERCIAL CREW
                </div>
                <p className="text-xs text-cyan-100/90 leading-relaxed">
                  {selectedIncident.relevance_to_modern_spacecraft}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default HistoricalIncidents;
