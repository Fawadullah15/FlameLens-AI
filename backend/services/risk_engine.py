"""
FlameLens AI — Deterministic Risk Scoring Engine
Computes evidence-based fire safety risk scores from measured experimental data.
All computations are transparent — no black-box AI involved.

Risk Score Formula (0–100):
  risk = 0.25 × F_loi + 0.20 × F_temp + 0.20 × F_burn + 0.20 × F_soot + 0.15 × F_supp
"""
from __future__ import annotations
import math
from typing import Optional

FORMULA = (
    "risk_score = (0.25 × flammability_factor"
    " + 0.20 × thermal_factor"
    " + 0.20 × burning_rate_factor"
    " + 0.20 × soot_factor"
    " + 0.15 × suppression_factor) × 100"
)

# Reference maxima from published NASA experiment data
_MAX_BURN_RATE = 1.12   # mm²/s — FLEX He-diluent max
_MAX_TEMP_K    = 2200.0 # K     — 1-g ethylene reference max
_MIN_TEMP_K    = 300.0
_MAX_SOOT_PPM  = 10.2   # ppm   — ACME ethylene high-flow max
_LOI_NORMAL    = 21.0   # Earth atmosphere O2%
_LOI_MAX_RISKY = 10.0   # Minimum tested LOI in µg

# Suppression difficulty by diluent
_SUPPRESSION_DIFFICULTY = {
    "He": 0.3,   # He diluent = easier suppression (high conductivity)
    "N2": 0.5,   # N2 = moderate
    "CO2": 0.6,  # CO2 = harder (cool flames persist)
    None: 0.5,   # Unknown = moderate
}

# Platform inherent risk modifier
_PLATFORM_RISK = {
    "ISS": 0.0,
    "Drop Tower (NASA Glenn)": -0.05,
    "Ground (1-g reference)": -0.10,
}


def _clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, value))


def compute_risk_score(exp: dict) -> dict:
    """
    Compute a transparent risk score for one experiment.
    Returns a dict matching the risk_scores table schema.
    """
    fuel        = exp.get("fuel_type", "")
    loi         = exp.get("loi_pct")
    temp_k      = exp.get("flame_temp_k")
    burn_k      = exp.get("burning_rate_k")
    soot_ppm    = exp.get("soot_ppm")
    soot_level  = exp.get("soot_level", "")
    diluent     = exp.get("diluent")
    platform    = exp.get("platform", "ISS")
    gravity     = exp.get("gravity_level", 0.0)
    o2_pct      = exp.get("oxygen_pct", 21.0)
    ext_type    = exp.get("extinction_type", "")

    # ── Factor 1: Flammability (from LOI) ─────────────────────────────────
    if loi is not None:
        # Lower LOI = burns at lower O2 = more dangerous
        # Map: loi=10 → 1.0 (most risky), loi=21 → 0.0 (not risky)
        f_loi = _clamp((21.0 - loi) / (21.0 - _LOI_MAX_RISKY))
    else:
        f_loi = 0.5  # Unknown → moderate

    # Cool flames add extra risk (persist undetected)
    if ext_type == "cool-flame":
        f_loi = _clamp(f_loi + 0.15)

    # ── Factor 2: Thermal (flame temperature) ─────────────────────────────
    if temp_k is not None:
        f_temp = _clamp((temp_k - _MIN_TEMP_K) / (_MAX_TEMP_K - _MIN_TEMP_K))
    else:
        f_temp = 0.5

    # ── Factor 3: Burning Rate ────────────────────────────────────────────
    if burn_k is not None:
        f_burn = _clamp(burn_k / _MAX_BURN_RATE)
    else:
        # For jet flames (ACME) without K, estimate from soot level
        soot_map = {"none": 0.2, "low": 0.3, "medium": 0.5, "high": 0.75}
        f_burn = soot_map.get(soot_level, 0.4)

    # ── Factor 4: Soot ────────────────────────────────────────────────────
    if soot_ppm is not None and soot_ppm >= 0:
        if soot_ppm == 0:
            f_soot = 0.0
        else:
            f_soot = _clamp(math.log1p(soot_ppm) / math.log1p(_MAX_SOOT_PPM))
    else:
        soot_map = {"none": 0.0, "low": 0.2, "medium": 0.5, "high": 0.85}
        f_soot = soot_map.get(soot_level, 0.4)

    # ── Factor 5: Suppression Difficulty ─────────────────────────────────
    f_supp = _SUPPRESSION_DIFFICULTY.get(diluent, 0.5)
    # Microgravity is harder to suppress than 1-g
    if gravity < 0.1:
        f_supp = _clamp(f_supp + 0.15)

    # ── Platform modifier ─────────────────────────────────────────────────
    platform_mod = _PLATFORM_RISK.get(platform, 0.0)

    # ── Weighted sum ──────────────────────────────────────────────────────
    raw = (
        0.25 * f_loi
        + 0.20 * f_temp
        + 0.20 * f_burn
        + 0.20 * f_soot
        + 0.15 * f_supp
    )
    score = _clamp(raw + platform_mod) * 100.0

    # ── Risk level ────────────────────────────────────────────────────────
    if score >= 75:
        risk_level = "CRITICAL"
    elif score >= 55:
        risk_level = "HIGH"
    elif score >= 35:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # ── Confidence ────────────────────────────────────────────────────────
    known_fields = sum(1 for v in [loi, temp_k, burn_k, soot_ppm] if v is not None)
    if known_fields >= 3:
        confidence = "high"
        uncertainty = 8.0
    elif known_fields == 2:
        confidence = "medium"
        uncertainty = 15.0
    else:
        confidence = "low"
        uncertainty = 25.0

    methodology = (
        f"Flammability (LOI-based, weight=0.25): {f_loi:.3f} | "
        f"Thermal (flame temp, weight=0.20): {f_temp:.3f} | "
        f"Burning Rate (K constant, weight=0.20): {f_burn:.3f} | "
        f"Soot (log-normalized, weight=0.20): {f_soot:.3f} | "
        f"Suppression difficulty (diluent+gravity, weight=0.15): {f_supp:.3f} | "
        f"Platform modifier: {platform_mod:+.2f}"
    )

    return {
        "experiment_id":       exp["experiment_id"],
        "risk_score":          round(score, 2),
        "risk_level":          risk_level,
        "flammability_factor": round(f_loi, 4),
        "thermal_factor":      round(f_temp, 4),
        "burning_rate_factor": round(f_burn, 4),
        "soot_factor":         round(f_soot, 4),
        "suppression_factor":  round(f_supp, 4),
        "methodology_notes":   methodology,
        "confidence_level":    confidence,
        "uncertainty_pct":     uncertainty,
        "formula":             FORMULA,
    }
