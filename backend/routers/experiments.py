"""
FlameLens AI — Experiments Router
Comprehensive NASA combustion flight experiment records joined with
sensor measurements, scientific risk scoring, and verified source citations.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/experiments", tags=["Combustion Experiments"])


@router.get("", response_model=Dict[str, Any])
def list_experiments(
    series: Optional[str] = Query(None, description="Filter by series (e.g. FLEX, ACME, CFI, BASS, SoFIE)"),
    fuel: Optional[str] = Query(None, description="Filter by fuel type (e.g. n-heptane, methane, ethylene)"),
    fuel_category: Optional[str] = Query(None, description="Filter by fuel category"),
    gravity: Optional[float] = Query(None, description="Filter by gravity level: 0.0 for microgravity, 1.0 for ground"),
    platform: Optional[str] = Query(None, description="Filter by mission platform"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level: LOW, MEDIUM, HIGH, CRITICAL"),
    search: Optional[str] = Query(None, description="Full-text search query"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    """
    List all verified NASA combustion experiments joined with high-precision
    measurements and deterministic risk rankings.
    """
    conn = get_connection()
    clauses: List[str] = []
    params: List[Any] = []

    if series:
        clauses.append("e.series = ?")
        params.append(series.upper())
    if fuel:
        clauses.append("e.fuel_type LIKE ?")
        params.append(f"%{fuel}%")
    if fuel_category:
        clauses.append("e.fuel_category = ?")
        params.append(fuel_category)
    if gravity is not None:
        if gravity < 0.1:
            clauses.append("e.gravity_level < 0.1")
        else:
            clauses.append("e.gravity_level >= 0.9")
    if platform:
        clauses.append("e.mission_platform LIKE ?")
        params.append(f"%{platform}%")
    if risk_level:
        clauses.append("a.risk_level = ?")
        params.append(risk_level.upper())
    if search:
        clauses.append("(e.title LIKE ? OR e.fuel_type LIKE ? OR e.key_finding LIKE ? OR e.experiment_id LIKE ?)")
        term = f"%{search}%"
        params.extend([term, term, term, term])

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    count_query = f"""
        SELECT COUNT(*) 
        FROM experiments e
        LEFT JOIN measurements m ON e.experiment_id = m.experiment_id
        LEFT JOIN analysis_results a ON e.experiment_id = a.experiment_id
        {where_sql}
    """
    total = conn.execute(count_query, params).fetchone()[0]

    data_query = f"""
        SELECT 
            e.id,
            e.experiment_id,
            e.series,
            e.title,
            e.mission_platform,
            e.fuel_type,
            e.fuel_category,
            e.gravity_level,
            e.ambient_o2_percent,
            e.chamber_pressure_kpa,
            e.ambient_temperature_k,
            e.diluent_gas,
            e.flow_velocity_cms,
            e.initial_fuel_diameter_mm,
            e.source_id,
            e.document_id,
            e.citation,
            e.page_citation,
            e.key_finding,
            e.verification_level,
            -- Measurements
            m.burning_rate_constant_k,
            m.peak_flame_temperature_k,
            m.flame_standoff_ratio,
            m.flame_shape,
            m.soot_volume_fraction_ppm,
            m.soot_yield_category,
            m.limiting_oxygen_index_percent,
            m.burn_duration_seconds,
            m.extinction_mode,
            m.cool_flame_observed,
            m.measurement_uncertainty_percent,
            -- Risk Analysis
            a.risk_score,
            a.risk_level,
            a.flammability_score,
            a.thermal_severity_score,
            a.soot_hazard_score,
            a.suppression_resistance_score,
            a.confidence_level
        FROM experiments e
        LEFT JOIN measurements m ON e.experiment_id = m.experiment_id
        LEFT JOIN analysis_results a ON e.experiment_id = a.experiment_id
        {where_sql}
        ORDER BY e.id ASC
        LIMIT ? OFFSET ?
    """
    rows = conn.execute(data_query, params + [limit, offset]).fetchall()
    conn.close()

    return {
        "total": total,
        "count": len(rows),
        "limit": limit,
        "offset": offset,
        "experiments": [dict(r) for r in rows]
    }


@router.get("/series", response_model=List[str])
def get_all_series():
    """List all NASA combustion series represented in database."""
    conn = get_connection()
    rows = conn.execute("SELECT DISTINCT series FROM experiments ORDER BY series").fetchall()
    conn.close()
    return [r[0] for r in rows]


@router.get("/fuels", response_model=List[str])
def get_all_fuels():
    """List all tested fuels."""
    conn = get_connection()
    rows = conn.execute("SELECT DISTINCT fuel_type FROM experiments ORDER BY fuel_type").fetchall()
    conn.close()
    return [r[0] for r in rows]


@router.get("/platforms", response_model=List[str])
def get_all_platforms():
    """List all testing platforms (ISS CIR, Drop Tower, Ground Reference)."""
    conn = get_connection()
    rows = conn.execute("SELECT DISTINCT mission_platform FROM experiments ORDER BY mission_platform").fetchall()
    conn.close()
    return [r[0] for r in rows]


@router.get("/{experiment_id}", response_model=Dict[str, Any])
def get_experiment_detail(experiment_id: str):
    """Retrieve complete parameters, raw sensor measurements, provenance, and research abstract."""
    conn = get_connection()
    row = conn.execute("""
        SELECT 
            e.*,
            m.burning_rate_constant_k,
            m.peak_flame_temperature_k,
            m.flame_standoff_ratio,
            m.flame_shape,
            m.soot_volume_fraction_ppm,
            m.soot_yield_category,
            m.limiting_oxygen_index_percent,
            m.burn_duration_seconds,
            m.extinction_mode,
            m.cool_flame_observed,
            m.measurement_uncertainty_percent,
            m.verification_notes,
            a.risk_score,
            a.risk_level,
            a.flammability_score,
            a.thermal_severity_score,
            a.soot_hazard_score,
            a.suppression_resistance_score,
            a.extinction_vulnerability_score,
            a.methodology,
            a.confidence_level,
            a.provenance_audit_trail,
            s.name as source_name,
            s.url as source_url,
            s.repository as source_repository,
            s.verification_status,
            d.title as document_title,
            d.authors as document_authors,
            d.publication_venue,
            d.abstract as document_abstract,
            d.doi_or_report_num
        FROM experiments e
        LEFT JOIN measurements m ON e.experiment_id = m.experiment_id
        LEFT JOIN analysis_results a ON e.experiment_id = a.experiment_id
        LEFT JOIN sources s ON e.source_id = s.source_id
        LEFT JOIN research_documents d ON e.document_id = d.doc_id
        WHERE e.experiment_id = ?
    """, (experiment_id,)).fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Experiment '{experiment_id}' not found.")

    exp_dict = dict(row)
    companions = conn.execute("""
        SELECT experiment_id, title, series, fuel_type, gravity_level, mission_platform
        FROM experiments
        WHERE experiment_id != ? AND (fuel_type = ? OR series = ?)
        LIMIT 4
    """, (experiment_id, exp_dict["fuel_type"], exp_dict["series"])).fetchall()

    conn.close()
    return {
        "experiment": exp_dict,
        "companion_experiments": [dict(c) for c in companions]
    }
