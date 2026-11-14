"""
FlameLens AI — Dashboard Router
High-level scientific intelligence metrics, charts, and flight findings summary.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter
from typing import Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/dashboard", tags=["Dashboard Intelligence"])


@router.get("", response_model=Dict[str, Any])
def get_dashboard_summary():
    """Returns aggregated flight telemetry, statistics, and risk distributions."""
    conn = get_connection()

    # 1. Metric Counts
    total_experiments = conn.execute("SELECT COUNT(*) FROM experiments").fetchone()[0]
    total_documents = conn.execute("SELECT COUNT(*) FROM research_documents").fetchone()[0]
    total_sources = conn.execute("SELECT COUNT(*) FROM sources").fetchone()[0]
    historical_incidents = conn.execute("SELECT COUNT(*) FROM historical_incidents").fetchone()[0]
    d2_datasets = conn.execute("SELECT COUNT(DISTINCT series_id) FROM time_series_measurements").fetchone()[0]
    atmosphere_count = conn.execute("SELECT COUNT(*) FROM atmosphere_scenarios").fetchone()[0]
    microgravity_count = conn.execute("SELECT COUNT(*) FROM experiments WHERE gravity_level < 0.1").fetchone()[0]
    ground_ref_count = conn.execute("SELECT COUNT(*) FROM experiments WHERE gravity_level >= 0.9").fetchone()[0]
    critical_risk_count = conn.execute("SELECT COUNT(*) FROM analysis_results WHERE risk_level = 'CRITICAL'").fetchone()[0]
    cool_flame_count = conn.execute("SELECT COUNT(*) FROM measurements WHERE cool_flame_observed = 1").fetchone()[0]
    avg_risk = conn.execute("SELECT ROUND(AVG(risk_score), 1) FROM analysis_results").fetchone()[0] or 0.0

    # Category Breakdown from research documents
    cat_dist = conn.execute("""
        SELECT category, COUNT(*) as count 
        FROM research_documents 
        WHERE category IS NOT NULL 
        GROUP BY category 
        ORDER BY count DESC
    """).fetchall()

    # Recent Incidents Preview
    incidents_preview = conn.execute("""
        SELECT incident_id, mission_name, date, spacecraft, consequences, fire_environment
        FROM historical_incidents
        ORDER BY date ASC
    """).fetchall()

    # 2. Series Breakdown
    series_dist = conn.execute("""
        SELECT series, COUNT(*) as count 
        FROM experiments 
        GROUP BY series 
        ORDER BY count DESC
    """).fetchall()

    # 3. Fuel Category Distribution
    fuel_cat_dist = conn.execute("""
        SELECT fuel_category, COUNT(*) as count 
        FROM experiments 
        GROUP BY fuel_category 
        ORDER BY count DESC
    """).fetchall()

    # 4. Flame Shapes in Microgravity vs Ground
    flame_shapes = conn.execute("""
        SELECT m.flame_shape, COUNT(*) as count,
               ROUND(AVG(m.peak_flame_temperature_k), 0) as avg_temp_k,
               ROUND(AVG(m.soot_volume_fraction_ppm), 2) as avg_soot_ppm
        FROM measurements m
        JOIN experiments e ON m.experiment_id = e.experiment_id
        GROUP BY m.flame_shape
        ORDER BY count DESC
    """).fetchall()

    # 5. Risk Severity Breakdown
    risk_breakdown = conn.execute("""
        SELECT risk_level, COUNT(*) as count
        FROM analysis_results
        GROUP BY risk_level
        ORDER BY CASE risk_level 
            WHEN 'CRITICAL' THEN 1 
            WHEN 'HIGH' THEN 2 
            WHEN 'MEDIUM' THEN 3 
            WHEN 'LOW' THEN 4 
            ELSE 5 END
    """).fetchall()

    # 6. Burning Rate Benchmark (Droplet fuels: K constant)
    burning_rates = conn.execute("""
        SELECT e.experiment_id, e.fuel_type, e.gravity_level, e.ambient_o2_percent,
               m.burning_rate_constant_k, m.flame_shape, e.mission_platform
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        WHERE m.burning_rate_constant_k IS NOT NULL
        ORDER BY m.burning_rate_constant_k DESC
        LIMIT 10
    """).fetchall()

    # 7. Recent Verified Experiments Preview
    recent_experiments = conn.execute("""
        SELECT e.experiment_id, e.series, e.title, e.fuel_type, e.gravity_level,
               e.mission_platform, m.flame_shape, a.risk_score, a.risk_level, e.citation
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        JOIN analysis_results a ON e.experiment_id = a.experiment_id
        ORDER BY e.id ASC
        LIMIT 6
    """).fetchall()

    # 8. Key Flight Safety Insights
    key_insights = [
        {
            "id": "INSIGHT-01",
            "title": "Spherical Flame Geometry & Purely Diffusive Transport",
            "series": "FLEX / FLEX-2",
            "summary": "In microgravity, absence of buoyant convection keeps flames perfectly spherical. Oxygen delivery is diffusion-limited, reducing burning rates by ~20-25% while extending droplet combustion lifetime significantly.",
            "source": "Dietrich et al. (2014), Prog. Energy Combust. Sci."
        },
        {
            "id": "INSIGHT-02",
            "title": "Cool Flame Combustion Regime (Undetected Risk)",
            "series": "CFI",
            "summary": "Low-temperature cool flames (550-750 K) burn invisibly for minutes following apparent hot flame extinction. Standard smoke and optical flame detectors fail to register them, producing toxic CO and formaldehyde.",
            "source": "Nayagam et al. (2012), Combust. Flame"
        },
        {
            "id": "INSIGHT-03",
            "title": "Soot Shell Barrier & Radiative Extinction",
            "series": "ACME",
            "summary": "Without buoyant venting, soot forms a dense concentric shell around the flame (soot volume fraction up to 8.3 ppm in ethylene). The shell radiates thermal energy away rapidly, driving premature radiative quenching.",
            "source": "Urban et al. (2019), NASA TM-2019-220207"
        },
        {
            "id": "INSIGHT-04",
            "title": "Exploration Cabin Atmosphere Flammability Surge",
            "series": "SoFIE / BASS",
            "summary": "Elevated oxygen environments (e.g., 34% O2 at 56 kPa for lunar EVA prep) cause materials that pass standard 21% O2 Earth testing to rapidly propagate flame with thick pre-heat thermal zones.",
            "source": "Ferkul et al. (2022) & Olson et al. (2015)"
        }
    ]

    conn.close()

    return {
        "telemetry": {
            "total_experiments": total_experiments,
            "total_documents": total_documents,
            "total_sources": total_sources,
            "historical_incidents": historical_incidents,
            "d2_timeseries_datasets": d2_datasets,
            "atmosphere_scenarios": atmosphere_count,
            "microgravity_experiments": microgravity_count,
            "ground_reference_experiments": ground_ref_count,
            "critical_risk_materials": critical_risk_count,
            "cool_flames_observed": cool_flame_count,
            "average_risk_score": avg_risk
        },
        "category_distribution": [dict(r) for r in cat_dist],
        "historical_incidents_preview": [dict(r) for r in incidents_preview],
        "series_distribution": [dict(r) for r in series_dist],
        "fuel_distribution": [dict(r) for r in fuel_cat_dist],
        "flame_shapes": [dict(r) for r in flame_shapes],
        "risk_breakdown": [dict(r) for r in risk_breakdown],
        "burning_rates": [dict(r) for r in burning_rates],
        "recent_experiments": [dict(r) for r in recent_experiments],
        "key_insights": key_insights
    }
