"""
FlameLens AI — Risk Ranking Router
Evidence-based fire safety scoring and flammability ranking.
All risk assessments are deterministic and transparent.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/rank", tags=["Fire Safety Risk Ranking"])

METHODOLOGY_EXPLANATION = (
    "Risk scores (0 to 100) are computed deterministically from empirical NASA flight measurements: "
    "risk = (0.25 × Flammability + 0.20 × ThermalSeverity + 0.20 × BurningRate + 0.20 × SootHazard + 0.15 × SuppressionResistance) × 100. "
    "Uncertainty bounds and sensor evasion factors (e.g. invisible cool flames) are explicitly incorporated. "
    "AI hallucination is strictly excluded from safety scores."
)


@router.get("/all", response_model=Dict[str, Any])
def get_all_rankings(
    min_score: float = Query(0.0, ge=0.0, le=100.0),
    risk_level: Optional[str] = Query(None, description="Filter: LOW, MEDIUM, HIGH, CRITICAL"),
    fuel_category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    """Retrieve all ranked experiments with component scores and confidence levels."""
    conn = get_connection()
    clauses = ["a.risk_score >= ?"]
    params: List[Any] = [min_score]

    if risk_level:
        clauses.append("a.risk_level = ?")
        params.append(risk_level.upper())
    if fuel_category:
        clauses.append("e.fuel_category = ?")
        params.append(fuel_category)

    where_sql = "WHERE " + " AND ".join(clauses)
    rows = conn.execute(f"""
        SELECT 
            a.analysis_id,
            a.experiment_id,
            e.title,
            e.series,
            e.fuel_type,
            e.fuel_category,
            e.mission_platform,
            e.gravity_level,
            e.ambient_o2_percent,
            m.flame_shape,
            m.cool_flame_observed,
            a.risk_score,
            a.risk_level,
            a.flammability_score,
            a.thermal_severity_score,
            a.soot_hazard_score,
            a.suppression_resistance_score,
            a.confidence_level,
            a.methodology,
            a.provenance_audit_trail
        FROM analysis_results a
        JOIN experiments e ON a.experiment_id = e.experiment_id
        JOIN measurements m ON a.experiment_id = m.experiment_id
        {where_sql}
        ORDER BY a.risk_score DESC
        LIMIT ?
    """, params + [limit]).fetchall()
    conn.close()

    return {
        "total": len(rows),
        "methodology": METHODOLOGY_EXPLANATION,
        "rankings": [dict(r) for r in rows]
    }


@router.get("/by-fuel")
def get_rank_by_fuel():
    """Rank fuel streams by average empirical risk score."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            e.fuel_type,
            e.fuel_category,
            ROUND(AVG(a.risk_score), 1) as avg_risk_score,
            ROUND(MAX(a.risk_score), 1) as max_risk_score,
            ROUND(MIN(a.risk_score), 1) as min_risk_score,
            COUNT(*) as test_count,
            GROUP_CONCAT(DISTINCT a.risk_level) as observed_risk_levels
        FROM analysis_results a
        JOIN experiments e ON a.experiment_id = e.experiment_id
        GROUP BY e.fuel_type
        ORDER BY avg_risk_score DESC
    """).fetchall()
    conn.close()

    return {
        "methodology": METHODOLOGY_EXPLANATION,
        "fuels": [dict(r) for r in rows]
    }


@router.get("/by-platform")
def get_rank_by_platform():
    """Rank testing environments (ISS CIR vs Drop Tower vs Ground)."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            e.mission_platform,
            ROUND(AVG(a.risk_score), 1) as avg_risk_score,
            ROUND(MAX(a.risk_score), 1) as max_risk_score,
            COUNT(*) as test_count
        FROM analysis_results a
        JOIN experiments e ON a.experiment_id = e.experiment_id
        GROUP BY e.mission_platform
        ORDER BY avg_risk_score DESC
    """).fetchall()
    conn.close()

    return {
        "platforms": [dict(r) for r in rows]
    }


@router.get("/{experiment_id}")
def get_single_risk_score(experiment_id: str):
    """Retrieve detailed breakdown of factors for one experiment."""
    conn = get_connection()
    row = conn.execute("""
        SELECT 
            a.*,
            e.title,
            e.series,
            e.fuel_type,
            e.mission_platform,
            e.citation,
            m.burning_rate_constant_k,
            m.peak_flame_temperature_k,
            m.flame_shape,
            m.soot_volume_fraction_ppm,
            m.limiting_oxygen_index_percent
        FROM analysis_results a
        JOIN experiments e ON a.experiment_id = e.experiment_id
        JOIN measurements m ON a.experiment_id = m.experiment_id
        WHERE a.experiment_id = ?
    """, (experiment_id,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Risk analysis for '{experiment_id}' not found.")

    return dict(row)
