"""
FlameLens AI — Pydantic Schemas
All request/response models. Frontend TypeScript interfaces must mirror these.
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


# ── Experiment ────────────────────────────────────────────────────────────────

class ExperimentBase(BaseModel):
    experiment_id: str
    series: str
    title: str
    fuel_type: str
    gravity_level: float
    platform: str
    year: Optional[int] = None
    oxygen_pct: Optional[float] = None
    pressure_kpa: Optional[float] = None
    diluent: Optional[str] = None
    ambient_temp_k: Optional[float] = None
    flow_velocity: Optional[float] = None
    droplet_diam_mm: Optional[float] = None
    burning_rate_k: Optional[float] = None
    flame_standoff: Optional[float] = None
    flame_temp_k: Optional[float] = None
    flame_shape: Optional[str] = None
    soot_level: Optional[str] = None
    soot_ppm: Optional[float] = None
    flame_duration_s: Optional[float] = None
    extinction_type: Optional[str] = None
    loi_pct: Optional[float] = None
    key_finding: Optional[str] = None
    citation: str
    citation_url: Optional[str] = None


class ExperimentOut(ExperimentBase):
    id: int
    model_config = {"from_attributes": True}


class ExperimentList(BaseModel):
    total: int
    items: List[ExperimentOut]


# ── Risk Score ────────────────────────────────────────────────────────────────

class RiskScoreOut(BaseModel):
    experiment_id: str
    title: str
    fuel_type: str
    platform: str
    risk_score: float = Field(..., ge=0, le=100)
    risk_level: str                  # LOW / MEDIUM / HIGH / CRITICAL
    flammability_factor: Optional[float] = None
    thermal_factor: Optional[float] = None
    burning_rate_factor: Optional[float] = None
    soot_factor: Optional[float] = None
    suppression_factor: Optional[float] = None
    methodology_notes: str
    confidence_level: str            # high / medium / low
    uncertainty_pct: float
    formula: str


class RiskRankingOut(BaseModel):
    total: int
    rankings: List[RiskScoreOut]
    methodology_summary: str


# ── Analysis ──────────────────────────────────────────────────────────────────

class ExtinctionPoint(BaseModel):
    experiment_id: str
    oxygen_pct: float
    pressure_kpa: float
    fuel_type: str
    extinguished: bool
    citation: str


class BurnRatePoint(BaseModel):
    experiment_id: str
    fuel_type: str
    burning_rate_k: float
    droplet_diam_mm: Optional[float]
    oxygen_pct: Optional[float]
    gravity_level: float
    platform: str


class GravityComparisonPoint(BaseModel):
    experiment_id: str
    fuel_type: str
    gravity_level: float
    flame_shape: Optional[str]
    burning_rate_k: Optional[float]
    flame_temp_k: Optional[float]
    flame_standoff: Optional[float]


class AnalysisResponse(BaseModel):
    chart_type: str
    title: str
    description: str
    data: list
    x_axis: str
    y_axis: str
    units: dict
    source_count: int
    citation_note: str


# ── Comparison ────────────────────────────────────────────────────────────────

class CompareRequest(BaseModel):
    ids: List[str] = Field(..., min_length=2, max_length=5)


class ComparisonVariable(BaseModel):
    variable: str
    label: str
    unit: str
    values: dict[str, Optional[float | str]]


class ComparisonOut(BaseModel):
    experiments: List[ExperimentOut]
    variables: List[ComparisonVariable]
    key_differences: List[str]
    scientific_note: str


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1500)
    session_id: Optional[str] = None
    mode: Optional[str] = Field("SCIENTIFIC_RESEARCH", description="Research Mode: SCIENTIFIC_RESEARCH | SPACECRAFT_FIRE_SAFETY | EXPERIMENTAL_DATA_ANALYSIS")
    history: Optional[List[Dict[str, str]]] = None


class CitationRef(BaseModel):
    doc_id: str
    title: str
    authors: Optional[str] = None
    year: Optional[int] = None
    url: Optional[str] = None
    category: Optional[str] = None
    institution: Optional[str] = None
    relevance_score: Optional[float] = None
    snippet: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[CitationRef]
    confidence: str
    session_id: str
    model: str
    mode: str = "SCIENTIFIC_RESEARCH"
    tokens_used: Optional[int] = None
    disclaimer: str = (
        "This answer is synthesized by FlameLens AI using authentic NASA flight research archives "
        "(FLEX, ACME, CFI, BASS, SoFIE) and historical mishap dossiers. All physical claims cite verified sources. "
        "It is an intelligence aid and does not replace empirical NASA flight qualification testing."
    )


class ChatHistoryItem(BaseModel):
    role: str
    content: str
    sources_used: Optional[List[str]] = None
    created_at: str


# ── Library ───────────────────────────────────────────────────────────────────

class KnowledgeDocOut(BaseModel):
    id: int
    doc_id: str
    title: str
    authors: Optional[str] = None
    year: Optional[int] = None
    source: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    citation: Optional[str] = None
    url: Optional[str] = None


# ── Reports ───────────────────────────────────────────────────────────────────

class ReportRequest(BaseModel):
    experiment_ids: List[str]
    include_risk: bool = True
    include_comparison: bool = True
    include_charts_data: bool = True
    report_title: Optional[str] = None


class ReportOut(BaseModel):
    report_id: str
    title: str
    generated_at: str
    experiment_count: int
    markdown_content: str
    disclaimer: str


# ── Stats (Dashboard) ─────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_experiments: int
    series_count: int
    fuel_types_count: int
    platforms: List[str]
    year_range: dict
    avg_risk_score: float
    high_risk_count: int
    series_breakdown: List[dict]
    fuel_breakdown: List[dict]
    platform_breakdown: List[dict]
