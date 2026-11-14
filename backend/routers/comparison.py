"""
FlameLens AI — Comparison Router
Scientific side-by-side comparative analysis of NASA combustion experiments.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from models.database import get_connection
from services.analysis_engine import compute_comparison

router = APIRouter(prefix="/compare", tags=["Experiment Comparison"])


class CompareRequest(BaseModel):
    ids: List[str] = Field(..., min_length=2, max_length=5)


@router.post("", response_model=Dict[str, Any])
def compare_experiments(req: CompareRequest):
    """Perform side-by-side comparison across 2 to 5 selected experiments."""
    conn = get_connection()
    placeholders = ",".join(["?"] * len(req.ids))
    rows = conn.execute(f"""
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
        WHERE e.experiment_id IN ({placeholders})
    """, req.ids).fetchall()
    conn.close()

    if len(rows) < 2:
        raise HTTPException(
            status_code=400,
            detail=f"At least 2 valid experiment IDs required for comparison. Found {len(rows)} matching records."
        )

    exp_dicts = [dict(r) for r in rows]
    comparison = compute_comparison(exp_dicts)

    return {
        "experiments": exp_dicts,
        "variables": comparison["variables"],
        "key_differences": comparison["key_differences"],
        "scientific_note": comparison["scientific_note"]
    }


@router.get("/suggest/{experiment_id}")
def suggest_companions(experiment_id: str):
    """Suggest scientifically relevant experiments for comparative pairing."""
    conn = get_connection()
    base = conn.execute("SELECT * FROM experiments WHERE experiment_id = ?", (experiment_id,)).fetchone()
    if not base:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Base experiment '{experiment_id}' not found.")

    base_dict = dict(base)
    # Suggest: same fuel at different gravity, same series, or same category
    suggestions = conn.execute("""
        SELECT experiment_id, title, series, fuel_type, gravity_level, mission_platform, key_finding
        FROM experiments
        WHERE experiment_id != ? 
          AND (fuel_type = ? OR series = ? OR gravity_level != ?)
        LIMIT 5
    """, (experiment_id, base_dict["fuel_type"], base_dict["series"], base_dict["gravity_level"])).fetchall()
    conn.close()

    return {
        "base_experiment": base_dict,
        "suggestions": [dict(s) for s in suggestions]
    }
