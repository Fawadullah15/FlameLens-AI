"""Analysis router — scientific computations and chart data."""
from __future__ import annotations
import sys; sys.path.insert(0, "E:/pip-libs")

from fastapi import APIRouter, Query, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from services.analysis_engine import (
    extinction_curve_data,
    burning_rate_comparison,
    gravity_effect_data,
    flame_shape_distribution,
    soot_comparison_by_fuel,
    get_dashboard_stats,
    get_d2_series_list,
    get_d2_regression,
    get_atmosphere_presets,
    simulate_atmosphere,
)

router = APIRouter(prefix="/analysis", tags=["Analysis"])


class AtmosphereSimRequest(BaseModel):
    oxygen_percentage: float = Field(21.0, ge=1.0, le=100.0, description="Ambient O2 percentage")
    chamber_pressure_kpa: float = Field(101.3, ge=10.0, le=250.0, description="Chamber pressure in kPa")


@router.get("/dashboard-stats")
def dashboard_stats():
    return get_dashboard_stats()


@router.get("/d2-series-list")
def list_d2_series():
    """List available empirical droplet combustion runs for D² analysis."""
    return get_d2_series_list()


@router.get("/d2-regression")
def d2_regression(series_id: Optional[str] = Query(None, description="Time series ID (e.g. TS-FLEX-001)")):
    """Calculates linear regression of D²(t) = D₀² - K·t, returning K, R², RMSE, and uncertainty."""
    result = get_d2_regression(series_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/atmosphere-presets")
def atmosphere_presets():
    """List established NASA spacecraft atmosphere presets (Artemis, ISS, Apollo 1, Mars)."""
    return get_atmosphere_presets()


@router.post("/atmosphere-simulation")
def run_atmosphere_simulation(body: AtmosphereSimRequest):
    """Calculates flammability index, burning rate multiplier, and risk for custom cabin atmospheres."""
    return simulate_atmosphere(body.oxygen_percentage, body.chamber_pressure_kpa)


@router.get("/extinction-curve")
def extinction_curve(fuel: str = Query(..., description="Fuel type, e.g. n-heptane")):
    result = extinction_curve_data(fuel)
    if "error" in result:
        raise HTTPException(404, result["error"])
    return result


@router.get("/burning-rates")
def burning_rates(series: Optional[str] = Query(None)):
    return burning_rate_comparison(series)


@router.get("/gravity-effect")
def gravity_effect(fuel: str = Query(...)):
    result = gravity_effect_data(fuel)
    if "error" in result:
        raise HTTPException(404, result["error"])
    return result


@router.get("/flame-shapes")
def flame_shapes():
    return flame_shape_distribution()


@router.get("/soot-by-fuel")
def soot_by_fuel():
    return soot_comparison_by_fuel()
