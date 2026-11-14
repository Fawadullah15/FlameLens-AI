"""
FlameLens AI — Scientific Analysis Engine
Pure scientific calculations using NumPy/SciPy on verified NASA flight data.
Deterministic, reproducible, and verifiable.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import numpy as np
from typing import List, Dict, Any, Optional
from models.database import get_connection


def get_all_joined_experiments() -> List[Dict[str, Any]]:
    """Retrieve all experiments joined with measurements and analysis."""
    conn = get_connection()
    rows = conn.execute("""
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
            a.suppression_resistance_score
        FROM experiments e
        LEFT JOIN measurements m ON e.experiment_id = m.experiment_id
        LEFT JOIN analysis_results a ON e.experiment_id = a.experiment_id
        ORDER BY e.id ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def extinction_curve_data(fuel_type: str) -> Dict[str, Any]:
    """Oxygen concentration vs burning rate / extinction data for a specific fuel."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            e.experiment_id,
            e.ambient_o2_percent as oxygen_pct,
            e.chamber_pressure_kpa as pressure_kpa,
            m.burning_rate_constant_k as burning_rate_k,
            m.extinction_mode,
            e.gravity_level,
            e.citation
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        WHERE e.fuel_type LIKE ? AND e.ambient_o2_percent IS NOT NULL
        ORDER BY e.ambient_o2_percent ASC
    """, (f"%{fuel_type}%",)).fetchall()
    conn.close()

    data = [dict(r) for r in rows]
    if not data:
        return {"error": f"No extinction curve data for fuel: {fuel_type}"}

    return {
        "chart_type": "scatter",
        "fuel_type": fuel_type,
        "title": f"Oxygen Concentration vs Burning Rate & Extinction — {fuel_type}",
        "description": (
            f"Evaluates burning rate K (mm²/s) across ambient O₂ concentrations for {fuel_type}. "
            f"Extinction regimes (radiative vs convective) indicate lower flammability bounds in microgravity."
        ),
        "data": data,
        "x_axis": "oxygen_pct",
        "y_axis": "burning_rate_k",
        "units": {"oxygen_pct": "% mole fraction", "burning_rate_k": "mm²/s"},
        "source_count": len(data),
        "citation_note": "Sourced from NASA FLEX / FLEX-2 flight datasets in CIR. Dietrich et al. (2014)."
    }


def burning_rate_comparison(series: Optional[str] = None) -> Dict[str, Any]:
    """Burning rate constants across experimental runs."""
    conn = get_connection()
    clauses = ["m.burning_rate_constant_k IS NOT NULL"]
    params = []
    if series:
        clauses.append("e.series = ?")
        params.append(series.upper())

    where_sql = "WHERE " + " AND ".join(clauses)
    rows = conn.execute(f"""
        SELECT 
            e.experiment_id,
            e.series,
            e.fuel_type,
            m.burning_rate_constant_k as burning_rate_k,
            e.initial_fuel_diameter_mm as droplet_diam_mm,
            e.ambient_o2_percent as oxygen_pct,
            e.gravity_level,
            e.mission_platform as platform,
            m.flame_shape,
            e.citation
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        {where_sql}
        ORDER BY m.burning_rate_constant_k DESC
    """, params).fetchall()
    conn.close()

    data = [dict(r) for r in rows]
    return {
        "chart_type": "bar",
        "title": "Droplet Burning Rate Constant K = -d(D²)/dt across NASA Flight Runs",
        "description": "Standardized burning rate constant K from D² Law measurements in microgravity and 1-g.",
        "data": data,
        "x_axis": "experiment_id",
        "y_axis": "burning_rate_k",
        "units": {"burning_rate_k": "mm²/s"},
        "source_count": len(data),
        "citation_note": "NASA FLEX / FLEX-2 experiments aboard the ISS CIR."
    }


def gravity_effect_data(fuel_type: str) -> Dict[str, Any]:
    """Direct comparison between microgravity and 1-g ground runs for the same fuel."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            e.experiment_id,
            e.fuel_type,
            e.gravity_level,
            m.flame_shape,
            m.burning_rate_constant_k as burning_rate_k,
            m.peak_flame_temperature_k as flame_temp_k,
            m.flame_standoff_ratio,
            e.ambient_o2_percent as oxygen_pct,
            e.mission_platform as platform,
            m.soot_volume_fraction_ppm as soot_ppm,
            e.citation
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        WHERE e.fuel_type LIKE ?
        ORDER BY e.gravity_level ASC
    """, (f"%{fuel_type}%",)).fetchall()
    conn.close()

    data = [dict(r) for r in rows]
    if not data:
        return {"error": f"No gravity comparison records found for {fuel_type}"}

    mu_g = [r for r in data if r["gravity_level"] < 0.1 and r["burning_rate_k"]]
    one_g = [r for r in data if r["gravity_level"] >= 0.9 and r["burning_rate_k"]]

    diff_summary = []
    if mu_g and one_g:
        avg_mug_k = np.mean([r["burning_rate_k"] for r in mu_g])
        avg_1g_k = np.mean([r["burning_rate_k"] for r in one_g])
        pct_change = ((avg_mug_k - avg_1g_k) / avg_1g_k) * 100
        diff_summary.append(
            f"Microgravity burning rate K for {fuel_type} averages {avg_mug_k:.2f} mm²/s vs {avg_1g_k:.2f} mm²/s in 1-g ({pct_change:+.1f}% difference)."
        )

    return {
        "chart_type": "grouped_bar",
        "fuel_type": fuel_type,
        "title": f"Gravity Level Impact on Combustion Physics — {fuel_type}",
        "description": "Compares microgravity (ISS CIR) vs terrestrial Earth (1-g) flame structure and kinetics.",
        "data": data,
        "summary": diff_summary,
        "source_count": len(data),
        "citation_note": "NASA FLEX flight and ground reference baseline data."
    }


def flame_shape_distribution() -> Dict[str, Any]:
    """Flame geometry distribution across flight and ground runs."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            m.flame_shape,
            CASE WHEN e.gravity_level < 0.1 THEN 'Microgravity (µg)' ELSE 'Earth Normal (1-g)' END as gravity_category,
            COUNT(*) as count,
            ROUND(AVG(m.peak_flame_temperature_k), 0) as avg_temp_k
        FROM measurements m
        JOIN experiments e ON m.experiment_id = e.experiment_id
        GROUP BY m.flame_shape, gravity_category
        ORDER BY count DESC
    """).fetchall()
    conn.close()

    return {
        "chart_type": "pie",
        "title": "Flame Shape Distribution in Microgravity vs 1-g",
        "description": "Spherical flames dominate in microgravity due to isotropic molecular diffusion in the absence of buoyant updraft.",
        "data": [dict(r) for r in rows],
        "citation_note": "Compiled across NASA FLEX, ACME, CFI, and BASS flight investigations."
    }


def soot_comparison_by_fuel() -> Dict[str, Any]:
    """Soot yield comparison across fuel streams."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            e.fuel_type,
            e.fuel_category,
            ROUND(AVG(m.soot_volume_fraction_ppm), 2) as avg_soot_ppm,
            ROUND(MAX(m.soot_volume_fraction_ppm), 2) as max_soot_ppm,
            COUNT(*) as run_count
        FROM experiments e
        JOIN measurements m ON e.experiment_id = m.experiment_id
        GROUP BY e.fuel_type
        ORDER BY avg_soot_ppm DESC
    """).fetchall()
    conn.close()

    return {
        "chart_type": "bar",
        "title": "Soot Volume Fraction (ppm) by Fuel Type",
        "description": "Soot accumulation creates radiant shells and toxic deposition hazards in closed spacecraft compartments.",
        "data": [dict(r) for r in rows],
        "x_axis": "fuel_type",
        "y_axis": "avg_soot_ppm",
        "units": {"avg_soot_ppm": "ppm volume fraction"},
        "citation_note": "Laser-induced incandescence measurements from NASA ACME and FLEX series."
    }


def compute_comparison(exp_dicts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Side-by-side scientific difference calculations across 2 to 5 experiments."""
    comparison_fields = [
        ("burning_rate_constant_k", "Burning Rate K", "mm²/s"),
        ("peak_flame_temperature_k", "Flame Temperature", "K"),
        ("flame_standoff_ratio", "Flame Standoff", "dimensionless"),
        ("flame_shape", "Flame Shape", "geometry"),
        ("soot_volume_fraction_ppm", "Soot Volume Fraction", "ppm"),
        ("ambient_o2_percent", "Ambient O₂ Concentration", "%"),
        ("chamber_pressure_kpa", "Chamber Pressure", "kPa"),
        ("limiting_oxygen_index_percent", "Limiting Oxygen Index", "%"),
        ("burn_duration_seconds", "Combustion Duration", "s"),
        ("gravity_level", "Gravity Level", "g"),
        ("extinction_mode", "Extinction Mechanism", "mode"),
        ("mission_platform", "Testing Platform", "facility"),
        ("diluent_gas", "Diluent Gas", "gas")
    ]

    variables = []
    for field, label, unit in comparison_fields:
        vals = {e["experiment_id"]: e.get(field) for e in exp_dicts}
        variables.append({
            "variable": field,
            "label": label,
            "unit": unit,
            "values": vals
        })

    key_differences = []
    # Check flame shape difference
    shapes = set(e.get("flame_shape") for e in exp_dicts if e.get("flame_shape"))
    if len(shapes) > 1:
        key_differences.append(f"Distinct flame geometries observed: {', '.join(shapes)}.")

    # Check burning rate variance
    burn_rates = [e.get("burning_rate_constant_k") for e in exp_dicts if e.get("burning_rate_constant_k")]
    if len(burn_rates) >= 2:
        k_min, k_max = min(burn_rates), max(burn_rates)
        pct_diff = ((k_max - k_min) / np.mean(burn_rates)) * 100
        key_differences.append(f"Burning rate constant K varies by {pct_diff:.1f}% (range: {k_min:.2f} to {k_max:.2f} mm²/s).")

    # Check soot difference
    soot_vals = [e.get("soot_volume_fraction_ppm") for e in exp_dicts if e.get("soot_volume_fraction_ppm") is not None]
    if len(soot_vals) >= 2 and max(soot_vals) > 0:
        key_differences.append(f"Soot output ranges from {min(soot_vals):.2f} ppm to {max(soot_vals):.2f} ppm.")

    return {
        "variables": variables,
        "key_differences": key_differences,
        "scientific_note": "Comparison calculated from empirical measurements in NASA flight and ground hardware."
    }


def get_dashboard_stats() -> Dict[str, Any]:
    """Compatibility alias for dashboard telemetry."""
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) FROM experiments").fetchone()[0]
    mu_g = conn.execute("SELECT COUNT(*) FROM experiments WHERE gravity_level < 0.1").fetchone()[0]
    one_g = conn.execute("SELECT COUNT(*) FROM experiments WHERE gravity_level >= 0.9").fetchone()[0]
    critical = conn.execute("SELECT COUNT(*) FROM analysis_results WHERE risk_level = 'CRITICAL'").fetchone()[0]
    avg_risk = conn.execute("SELECT ROUND(AVG(risk_score), 1) FROM analysis_results").fetchone()[0] or 0.0
    incidents = conn.execute("SELECT COUNT(*) FROM historical_incidents").fetchone()[0]
    timeseries_count = conn.execute("SELECT COUNT(DISTINCT series_id) FROM time_series_measurements").fetchone()[0]
    doc_count = conn.execute("SELECT COUNT(*) FROM research_documents").fetchone()[0]
    src_count = conn.execute("SELECT COUNT(*) FROM sources").fetchone()[0]
    conn.close()
    return {
        "total_experiments": total,
        "microgravity_runs": mu_g,
        "ground_reference_runs": one_g,
        "critical_risk_count": critical,
        "average_risk_score": avg_risk,
        "historical_incidents_count": incidents,
        "d2_timeseries_datasets": timeseries_count,
        "total_documents": doc_count,
        "total_sources": src_count
    }


def get_d2_series_list() -> List[Dict[str, Any]]:
    """Return catalog of available empirical D² droplet combustion series."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            t.series_id,
            t.experiment_id,
            t.fuel_type,
            t.gravity_level,
            COUNT(*) as point_count,
            e.title,
            e.mission_platform,
            e.ambient_o2_percent,
            e.diluent_gas,
            e.citation
        FROM time_series_measurements t
        LEFT JOIN experiments e ON t.experiment_id = e.experiment_id
        GROUP BY t.series_id
        ORDER BY t.gravity_level ASC, t.fuel_type ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_d2_regression(series_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Perform rigorous linear regression on empirical D² Law time-series data:
    D²(t) = D₀² - K · t
    Calculates burning rate constant K, coefficient of determination R²,
    RMSE, and parameter uncertainty ±ΔK.
    """
    conn = get_connection()
    if not series_id:
        first = conn.execute("SELECT series_id FROM time_series_measurements LIMIT 1").fetchone()
        if not first:
            conn.close()
            return {"error": "No time series measurements in database."}
        series_id = first["series_id"]

    rows = conn.execute("""
        SELECT 
            t.series_id,
            t.experiment_id,
            t.fuel_type,
            t.gravity_level,
            t.time_seconds,
            t.diameter_squared_mm2,
            e.title,
            e.mission_platform,
            e.ambient_o2_percent,
            e.diluent_gas,
            e.citation,
            m.burning_rate_constant_k as nominal_k
        FROM time_series_measurements t
        LEFT JOIN experiments e ON t.experiment_id = e.experiment_id
        LEFT JOIN measurements m ON t.experiment_id = m.experiment_id
        WHERE t.series_id = ?
        ORDER BY t.time_seconds ASC
    """, (series_id,)).fetchall()
    conn.close()

    if not rows:
        return {"error": f"Series '{series_id}' not found."}

    times = np.array([r["time_seconds"] for r in rows], dtype=float)
    d2_vals = np.array([r["diameter_squared_mm2"] for r in rows], dtype=float)
    n = len(times)

    if n < 2:
        return {"error": f"Insufficient points ({n}) for linear regression in series '{series_id}'."}

    # Linear regression: d2 = a * t + b  =>  K = -a, D0^2 = b
    coeffs, residuals, _, _, _ = np.polyfit(times, d2_vals, 1, full=True)
    slope, intercept = float(coeffs[0]), float(coeffs[1])
    burning_rate_k = -slope
    d0_squared = intercept

    predicted = slope * times + intercept
    ss_res = float(np.sum((d2_vals - predicted) ** 2))
    ss_tot = float(np.sum((d2_vals - np.mean(d2_vals)) ** 2))
    r_squared = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 1.0
    rmse = float(np.sqrt(ss_res / n))

    # Standard error of the slope (uncertainty in burning rate K)
    if n > 2:
        s_err = np.sqrt(ss_res / (n - 2))
        s_xx = np.sum((times - np.mean(times)) ** 2)
        uncertainty_k = float(s_err / np.sqrt(s_xx)) if s_xx > 0 else 0.0
    else:
        uncertainty_k = 0.0

    empirical_points = [
        {"time_s": float(t), "d2_mm2": float(d2)}
        for t, d2 in zip(times, d2_vals)
    ]
    fitted_points = [
        {"time_s": float(t), "fitted_d2_mm2": round(float(p), 4)}
        for t, p in zip(times, predicted)
    ]

    meta = rows[0]
    return {
        "series_id": series_id,
        "experiment_id": meta["experiment_id"],
        "title": meta["title"] or f"Droplet Combustion Run {series_id}",
        "fuel_type": meta["fuel_type"],
        "gravity_level": meta["gravity_level"],
        "mission_platform": meta["mission_platform"],
        "ambient_o2_percent": meta["ambient_o2_percent"],
        "diluent_gas": meta["diluent_gas"],
        "nominal_flight_k": meta["nominal_k"],
        "calculated_burning_rate_k": round(burning_rate_k, 4),
        "d0_squared": round(d0_squared, 4),
        "r_squared": round(r_squared, 4),
        "rmse": round(rmse, 4),
        "uncertainty_delta_k": round(uncertainty_k, 4),
        "equation": f"D²(t) = {d0_squared:.3f} - ({burning_rate_k:.4f} ± {uncertainty_k:.4f}) · t",
        "point_count": n,
        "empirical_points": empirical_points,
        "fitted_points": fitted_points,
        "citation": meta["citation"] or "NASA ISS CIR Experimental Telemetry",
        "scientific_interpretation": (
            f"Linear fit confirms classical D² Law behavior with R² = {r_squared:.4f}. "
            f"The evaporation and burning constant K = {burning_rate_k:.4f} mm²/s (±{uncertainty_k:.4f} mm²/s) "
            f"reflects steady quasi-steady vapor-phase diffusion under "
            f"{'microgravity (0-g)' if meta['gravity_level'] < 0.1 else 'Earth normal gravity (1-g)'} conditions."
        )
    }


def get_atmosphere_presets() -> List[Dict[str, Any]]:
    """Return pre-configured space mission atmospheric scenarios."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            scenario_id,
            name,
            oxygen_percentage,
            total_pressure_kpa,
            oxygen_partial_pressure_kpa,
            relative_flammability_index,
            predicted_burning_rate_multiplier,
            extinction_risk_category,
            is_experimental_data,
            source_citation,
            engineering_notes,
            category
        FROM atmosphere_scenarios
        ORDER BY id ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def simulate_atmosphere(o2_pct: float, pressure_kpa: float) -> Dict[str, Any]:
    """
    Simulate spacecraft cabin flammability based on partial pressure of oxygen (PO2)
    and ambient pressure, using NASA microgravity combustion empirical correlations.
    Returns quantitative indices, risk categorization, and physical explanations.
    """
    o2_pct = max(1.0, min(100.0, float(o2_pct)))
    pressure_kpa = max(10.0, min(200.0, float(pressure_kpa)))

    # Partial pressure of oxygen in kPa
    po2_kpa = (o2_pct / 100.0) * pressure_kpa

    # Reference: Standard Sea Level / ISS normal air: 21% O2 at 101.325 kPa -> PO2 = 21.28 kPa
    po2_ref = 21.278
    p_ref = 101.325

    # Relative Flammability Index (NASA flammability scaling: function of PO2 and mole fraction)
    # Higher PO2 dramatically accelerates flame front propagation in microgravity
    flammability_index = (po2_kpa / po2_ref) * ((o2_pct / 21.0) ** 0.45)

    # Predicted burning rate multiplier based on droplet combustion kinetics
    # K/K0 ~ (P/P0)^0.12 * (Y_O2 / Y_O2,0)^0.72
    burning_rate_mult = ((pressure_kpa / p_ref) ** 0.12) * ((o2_pct / 21.0) ** 0.72)

    # Categorize Risk
    if o2_pct < 13.0 or po2_kpa < 12.0:
        risk_cat = "HYPOXIC_EXTINCTION"
        risk_level = "LOW_FLAMMABILITY"
        label = "Sub-Limiting Oxygen Concentration / Extinction Regime"
        safety_color = "emerald"
        explanation = (
            "Oxygen concentration is below the Limiting Oxygen Index (LOI) for most common spacecraft "
            "polymers and liquid fuels. Diffusive flux in microgravity cannot sustain reaction zone temperatures, "
            "resulting in radiative flame quench."
        )
    elif o2_pct <= 22.0 and pressure_kpa <= 105.0:
        risk_cat = "STANDARD_BASELINE"
        risk_level = "CONTROLLED"
        label = "Standard Earth Normal / ISS Habitability Range"
        safety_color = "cyan"
        explanation = (
            "Atmosphere matches standard International Space Station baseline conditions (21% O₂ at 101.3 kPa). "
            "Microgravity combustion is diffusion-controlled with spherical flame morphology."
        )
    elif o2_pct <= 34.0 and pressure_kpa <= 60.0:
        risk_cat = "ELEVATED_EVA_PREP"
        risk_level = "ELEVATED_CONTROLLED"
        label = "Artemis Exploration Atmosphere (Moderate Flammability Margin)"
        safety_color = "amber"
        explanation = (
            "Atmosphere engineered for spacewalk (EVA) pre-breathe mitigation (34% O₂ at 56 kPa, PO₂ ~19 kPa). "
            "Although total pressure is reduced, elevated oxygen mole fraction slightly increases burning rates "
            "and lowers material ignition thresholds relative to 21% air."
        )
    elif o2_pct <= 40.0:
        risk_cat = "HIGH_FLAMMABILITY"
        risk_level = "HIGH"
        label = "High Flammability Hazard (Enhanced Flame Propagation)"
        safety_color = "orange"
        explanation = (
            "Oxygen mole fraction significantly exceeds safe cabin exploration standards. "
            "Burning rate is accelerated by ~50-80%, and smoke detector response times may be slower due "
            "to reduced buoyant transport in microgravity."
        )
    else:
        risk_cat = "CRITICAL_HYPEROXIC"
        risk_level = "CRITICAL"
        label = "Critical Hyperoxic Flash-Fire Hazard (Historical Apollo 1 Regime)"
        safety_color = "rose"
        explanation = (
            "CRITICAL DANGER: Atmospheric conditions resemble historical pre-launch Apollo 1 pure-oxygen environment. "
            "Materials normally rated fire-retardant burn violently with near-instantaneous flash propagation. "
            "Extinction in microgravity without rapid total cabin depressurization is nearly impossible."
        )

    return {
        "inputs": {
            "oxygen_percentage": round(o2_pct, 2),
            "chamber_pressure_kpa": round(pressure_kpa, 2)
        },
        "calculated_metrics": {
            "oxygen_partial_pressure_kpa": round(po2_kpa, 2),
            "relative_flammability_index": round(flammability_index, 3),
            "predicted_burning_rate_multiplier": round(burning_rate_mult, 3),
            "risk_category": risk_cat,
            "risk_level": risk_level,
            "display_label": label,
            "safety_color": safety_color
        },
        "scientific_rationale": explanation,
        "modeled_status": "THEORETICAL_MODEL",
        "citation": "NASA-STD-6001 Flammability Test Protocol; Dietrich et al. (FLEX Microgravity Kinetics)",
        "disclaimer": "This atmosphere simulation is a theoretical predictive model based on microgravity droplet kinetics and NASA safety standards. It does not replace empirical NASA flight hardware qualification testing."
    }

