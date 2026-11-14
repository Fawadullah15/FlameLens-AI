/**
 * FlameLens AI — Shared TypeScript Interfaces
 * Exactly mirrors backend SQLite schema & Pydantic response models.
 */

export interface Source {
  id: number;
  source_id: string;
  name: string;
  organization: string;
  repository: string;
  url: string | null;
  description: string | null;
  access_type: string;
  verification_status: string;
  linked_experiments_count?: number;
  linked_documents_count?: number;
}

export interface ResearchDocument {
  id: number;
  doc_id: string;
  source_id: string;
  title: string;
  authors: string | null;
  publication_year: number;
  publication_venue: string | null;
  doi_or_report_num: string | null;
  url: string | null;
  original_url?: string | null;
  abstract: string | null;
  full_text?: string;
  page_count: number;
  series_tags: string | null;
  category?: string;
  institution?: string;
  source_type?: string;
  ingestion_status?: string;
  structured_sections?: { heading: string; content: string }[];
  doi_references?: string[];
  extraction_method?: string;
  source_name?: string;
  source_repository?: string;
  verification_status?: string;
}

export interface Experiment {
  id: number;
  experiment_id: string;
  series: string;
  title: string;
  mission_platform: string;
  fuel_type: string;
  fuel_category: string;
  gravity_level: number;
  ambient_o2_percent: number | null;
  chamber_pressure_kpa: number | null;
  ambient_temperature_k: number | null;
  diluent_gas: string | null;
  flow_velocity_cms: number | null;
  initial_fuel_diameter_mm: number | null;
  source_id: string;
  document_id: string | null;
  citation: string;
  page_citation: string | null;
  key_finding: string | null;
  verification_level: string;

  // Joined Measurements
  burning_rate_constant_k?: number | null;
  peak_flame_temperature_k?: number | null;
  flame_standoff_ratio?: number | null;
  flame_shape?: string;
  soot_volume_fraction_ppm?: number | null;
  soot_yield_category?: string;
  limiting_oxygen_index_percent?: number | null;
  burn_duration_seconds?: number | null;
  extinction_mode?: string;
  cool_flame_observed?: number;
  measurement_uncertainty_percent?: number;
  verification_notes?: string;

  // Joined Risk Analysis
  risk_score?: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flammability_score?: number;
  thermal_severity_score?: number;
  soot_hazard_score?: number;
  suppression_resistance_score?: number;
  confidence_level?: string;
}

export interface DashboardTelemetry {
  total_experiments: number;
  total_documents: number;
  total_sources: number;
  historical_incidents?: number;
  d2_timeseries_datasets?: number;
  atmosphere_scenarios?: number;
  microgravity_experiments: number;
  ground_reference_experiments: number;
  critical_risk_materials: number;
  cool_flames_observed: number;
  average_risk_score: number;
}

export interface DashboardData {
  telemetry: DashboardTelemetry;
  series_distribution: { series: string; count: number }[];
  fuel_distribution: { fuel_category: string; count: number }[];
  category_distribution?: { category: string; count: number }[];
  historical_incidents_preview?: HistoricalIncidentPreview[];
  flame_shapes: { flame_shape: string; count: number; avg_temp_k: number; avg_soot_ppm: number }[];
  risk_breakdown: { risk_level: string; count: number }[];
  burning_rates: any[];
  recent_experiments: Experiment[];
  key_insights: {
    id: string;
    title: string;
    series: string;
    summary: string;
    source: string;
  }[];
}

export interface HistoricalIncident {
  id: number;
  incident_id: string;
  mission_name: string;
  date: string;
  spacecraft: string;
  location: string;
  summary: string;
  fire_environment: string;
  ignition_source: string;
  materials_involved: string;
  consequences: string;
  documented_lessons_learned: string;
  relevance_to_modern_spacecraft: string;
  nasa_reference_url: string;
  source_id?: string;
  source_name?: string;
  source_organization?: string;
  category: string;
}

export interface HistoricalIncidentPreview {
  incident_id: string;
  mission_name: string;
  date: string;
  spacecraft: string;
  consequences: string;
  fire_environment: string;
}

export interface D2SeriesInfo {
  series_id: string;
  experiment_id: string;
  fuel_type: string;
  gravity_level: number;
  point_count: number;
  title: string;
  mission_platform: string;
  ambient_o2_percent: number;
  diluent_gas: string;
  citation: string;
}

export interface D2RegressionResult {
  series_id: string;
  experiment_id: string;
  title: string;
  fuel_type: string;
  gravity_level: number;
  mission_platform: string;
  ambient_o2_percent: number;
  diluent_gas: string;
  nominal_flight_k?: number;
  calculated_burning_rate_k: number;
  d0_squared: number;
  r_squared: number;
  rmse: number;
  uncertainty_delta_k: number;
  equation: string;
  point_count: number;
  empirical_points: { time_s: number; d2_mm2: number }[];
  fitted_points: { time_s: number; fitted_d2_mm2: number }[];
  citation: string;
  scientific_interpretation: string;
}

export interface AtmosphereScenario {
  scenario_id: string;
  name: string;
  oxygen_percentage: number;
  total_pressure_kpa: number;
  oxygen_partial_pressure_kpa: number;
  relative_flammability_index: number;
  predicted_burning_rate_multiplier: number;
  extinction_risk_category: string;
  is_experimental_data: number;
  source_citation: string;
  engineering_notes: string;
  category: string;
}

export interface AtmosphereSimulationResult {
  inputs: {
    oxygen_percentage: number;
    chamber_pressure_kpa: number;
  };
  calculated_metrics: {
    oxygen_partial_pressure_kpa: number;
    relative_flammability_index: number;
    predicted_burning_rate_multiplier: number;
    risk_category: string;
    risk_level: string;
    display_label: string;
    safety_color: string;
  };
  scientific_rationale: string;
  modeled_status: string;
  citation: string;
  disclaimer: string;
}

export interface LibraryTaxonomy {
  categories: { category: string; count: number }[];
  institutions: { institution: string; count: number }[];
  source_types: { source_type: string; count: number }[];
}

export interface ComparisonVariable {
  variable: string;
  label: string;
  unit: string;
  values: Record<string, any>;
}

export interface ComparisonResult {
  experiments: Experiment[];
  variables: ComparisonVariable[];
  key_differences: string[];
  scientific_note: string;
}

export type AIMode = 'SCIENTIFIC_RESEARCH' | 'SPACECRAFT_FIRE_SAFETY' | 'EXPERIMENTAL_DATA_ANALYSIS';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: CitationRef[];
  timestamp: string;
  mode?: AIMode;
  status?: 'streaming' | 'complete' | 'error';
  model?: string;
  tokens_used?: number | null;
}

export interface CitationRef {
  doc_id: string;
  title: string;
  authors?: string | null;
  year?: number | null;
  url?: string | null;
  category?: string | null;
  institution?: string | null;
  relevance_score?: number;
  snippet?: string | null;
}

export interface StreamMetadata {
  session_id: string;
  mode: AIMode;
  sources: CitationRef[];
  disclaimer: string;
}

export interface RiskRankingItem {
  analysis_id: string;
  experiment_id: string;
  title: string;
  series: string;
  fuel_type: string;
  fuel_category: string;
  mission_platform: string;
  gravity_level: number;
  ambient_o2_percent: number;
  flame_shape: string;
  cool_flame_observed: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flammability_score: number;
  thermal_severity_score: number;
  soot_hazard_score: number;
  suppression_resistance_score: number;
  confidence_level: string;
  methodology: string;
  provenance_audit_trail: string;
}
