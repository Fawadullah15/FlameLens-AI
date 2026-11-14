/**
 * FlameLens AI — Frontend API Service Client
 * Connects React UI to FastAPI backend on localhost:8000.
 */
import axios from 'axios';
import {
  Experiment,
  DashboardData,
  Source,
  ResearchDocument,
  ComparisonResult,
  RiskRankingItem,
  CitationRef,
  HistoricalIncident,
  D2SeriesInfo,
  D2RegressionResult,
  AtmosphereScenario,
  AtmosphereSimulationResult,
  LibraryTaxonomy,
  AIMode,
  StreamMetadata,
} from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // 1. Health
  getHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },

  // 2. Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const res = await client.get('/dashboard');
    return res.data;
  },

  // 3. Experiments
  getExperiments: async (params?: {
    series?: string;
    fuel?: string;
    gravity?: number;
    risk_level?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; count: number; experiments: Experiment[] }> => {
    const res = await client.get('/experiments', { params });
    return res.data;
  },

  getExperimentDetail: async (id: string): Promise<{ experiment: Experiment; companion_experiments: any[] }> => {
    const res = await client.get(`/experiments/${id}`);
    return res.data;
  },

  getSeriesList: async (): Promise<string[]> => {
    const res = await client.get('/experiments/series');
    return res.data;
  },

  getFuelsList: async (): Promise<string[]> => {
    const res = await client.get('/experiments/fuels');
    return res.data;
  },

  // 4. Sources
  getSources: async (): Promise<Source[]> => {
    const res = await client.get('/sources');
    return res.data;
  },

  getSourceDetail: async (sourceId: string) => {
    const res = await client.get(`/sources/${sourceId}`);
    return res.data;
  },

  // 5. Research Library
  getPapers: async (params?: {
    category?: string;
    institution?: string;
    source_type?: string;
    series?: string;
    search?: string;
    limit?: number;
  }): Promise<{ total: number; papers: ResearchDocument[] }> => {
    const res = await client.get('/library/papers', { params });
    return res.data;
  },

  getLibraryTaxonomy: async (): Promise<LibraryTaxonomy> => {
    const res = await client.get('/library/categories');
    return res.data;
  },

  getPaperDetail: async (docId: string): Promise<{ document: ResearchDocument; linked_experiments: any[] }> => {
    const res = await client.get(`/library/papers/${docId}`);
    return res.data;
  },

  searchLibrary: async (q: string) => {
    const res = await client.get('/library/search', { params: { q } });
    return res.data;
  },

  // 6. Analysis & Physical Modeling
  getD2SeriesList: async (): Promise<D2SeriesInfo[]> => {
    const res = await client.get('/analysis/d2-series-list');
    return res.data;
  },

  getD2Regression: async (seriesId?: string): Promise<D2RegressionResult> => {
    const res = await client.get('/analysis/d2-regression', { params: { series_id: seriesId } });
    return res.data;
  },

  getAtmospherePresets: async (): Promise<AtmosphereScenario[]> => {
    const res = await client.get('/analysis/atmosphere-presets');
    return res.data;
  },

  simulateAtmosphere: async (payload: {
    oxygen_percentage: number;
    chamber_pressure_kpa: number;
  }): Promise<AtmosphereSimulationResult> => {
    const res = await client.post('/analysis/atmosphere-simulation', payload);
    return res.data;
  },

  getExtinctionCurve: async (fuel: string) => {
    const res = await client.get('/analysis/extinction-curve', { params: { fuel } });
    return res.data;
  },

  getBurningRates: async (series?: string) => {
    const res = await client.get('/analysis/burning-rates', { params: { series } });
    return res.data;
  },

  getGravityEffect: async (fuel: string) => {
    const res = await client.get('/analysis/gravity-effect', { params: { fuel } });
    return res.data;
  },

  getFlameShapes: async () => {
    const res = await client.get('/analysis/flame-shapes');
    return res.data;
  },

  getSootByFuel: async () => {
    const res = await client.get('/analysis/soot-by-fuel');
    return res.data;
  },

  // 7. Comparison
  compareExperiments: async (ids: string[]): Promise<ComparisonResult> => {
    const res = await client.post('/compare', { ids });
    return res.data;
  },

  suggestComparison: async (id: string) => {
    const res = await client.get(`/compare/suggest/${id}`);
    return res.data;
  },

  // 8. Risk Ranking
  getRiskRankings: async (params?: { min_score?: number; risk_level?: string; fuel_category?: string }): Promise<{
    total: number;
    methodology: string;
    rankings: RiskRankingItem[];
  }> => {
    const res = await client.get('/rank/all', { params });
    return res.data;
  },

  getRiskByFuel: async () => {
    const res = await client.get('/rank/by-fuel');
    return res.data;
  },

  // 9. AI Research Chat & Copilot
  sendChatMessage: async (
    question: string,
    sessionId?: string,
    mode: AIMode = 'SCIENTIFIC_RESEARCH',
    history?: any[]
  ): Promise<{
    answer: string;
    sources: CitationRef[];
    confidence: string;
    session_id: string;
    model: string;
    mode: string;
    tokens_used?: number;
    disclaimer: string;
  }> => {
    const res = await client.post('/chat', {
      question,
      session_id: sessionId,
      mode,
      history
    });
    return res.data;
  },

  streamChatMessage: async (
    payload: {
      question: string;
      session_id?: string;
      mode?: AIMode;
      history?: any[];
    },
    callbacks: {
      onMetadata?: (meta: StreamMetadata) => void;
      onChunk?: (text: string) => void;
      onDone?: () => void;
      onError?: (err: any) => void;
    },
    signal?: AbortSignal
  ) => {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Streaming not supported by browser environment');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.replace('event:', '').trim();
          } else if (trimmed.startsWith('data:') && currentEvent) {
            const dataStr = trimmed.replace('data:', '').trim();
            try {
              const parsed = JSON.parse(dataStr);
              if (currentEvent === 'metadata' && callbacks.onMetadata) {
                callbacks.onMetadata(parsed);
              } else if (currentEvent === 'chunk' && parsed.text && callbacks.onChunk) {
                callbacks.onChunk(parsed.text);
              } else if (currentEvent === 'error' && callbacks.onError) {
                callbacks.onError(parsed.error);
              } else if (currentEvent === 'done' && callbacks.onDone) {
                callbacks.onDone();
              }
            } catch (e) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
      if (callbacks.onDone) callbacks.onDone();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (callbacks.onDone) callbacks.onDone();
      } else {
        if (callbacks.onError) callbacks.onError(err);
      }
    }
  },

  // 10. Reports
  generateReport: async (payload: {
    experiment_ids: string[];
    report_title?: string;
    include_risk_breakdown?: boolean;
    include_sensor_telemetry?: boolean;
  }) => {
    const res = await client.post('/reports/generate', payload);
    return res.data;
  },

  // 11. Historical Spaceflight Incidents
  getIncidents: async (): Promise<HistoricalIncident[]> => {
    const res = await client.get('/incidents');
    return res.data;
  },

  getIncidentDetail: async (incidentId: string): Promise<HistoricalIncident> => {
    const res = await client.get(`/incidents/${incidentId}`);
    return res.data;
  },

  // 12. Ingest
  uploadFile: async (formData: FormData) => {
    const res = await client.post('/ingest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
