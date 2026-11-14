"""
FlameLens AI — FastAPI Scientific Intelligence Engine
NASA Space Apps 2026 | Challenge 08: Flame in Freefall
Mounts all REST routers, database lifecycle, and FTS5 search.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import CORS_ORIGINS, GEMINI_API_KEY
from models.database import init_db, get_connection
from routers import (
    experiments,
    sources,
    dashboard,
    ingest,
    analysis,
    comparison,
    ranking,
    chat,
    library,
    reports,
    incidents
)

app = FastAPI(
    title="FlameLens AI — Microgravity Combustion Intelligence",
    description=(
        "NASA Space Apps 2026: Flame in Freefall. "
        "A scientific intelligence platform that summarizes, analyzes, compares, and ranks "
        "NASA microgravity combustion experiments (FLEX, ACME, CFI, BASS, SoFIE) to deliver fire-safety insights for space missions."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Router Registration ──────────────────────────────────────────────────────
API_PREFIX = "/api"
app.include_router(experiments.router, prefix=API_PREFIX)
app.include_router(sources.router,     prefix=API_PREFIX)
app.include_router(dashboard.router,   prefix=API_PREFIX)
app.include_router(ingest.router,      prefix=API_PREFIX)
app.include_router(analysis.router,    prefix=API_PREFIX)
app.include_router(comparison.router,  prefix=API_PREFIX)
app.include_router(ranking.router,     prefix=API_PREFIX)
app.include_router(chat.router,        prefix=API_PREFIX)
app.include_router(library.router,     prefix=API_PREFIX)
app.include_router(reports.router,     prefix=API_PREFIX)
app.include_router(incidents.router,   prefix=API_PREFIX)


# ── Health Endpoint ──────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    """System health verification and scientific database status."""
    try:
        conn = get_connection()
        exp_count = conn.execute("SELECT COUNT(*) FROM experiments").fetchone()[0]
        meas_count = conn.execute("SELECT COUNT(*) FROM measurements").fetchone()[0]
        doc_count = conn.execute("SELECT COUNT(*) FROM research_documents").fetchone()[0]
        src_count = conn.execute("SELECT COUNT(*) FROM sources").fetchone()[0]
        incident_count = conn.execute("SELECT COUNT(*) FROM historical_incidents").fetchone()[0]
        timeseries_count = conn.execute("SELECT COUNT(DISTINCT series_id) FROM time_series_measurements").fetchone()[0]
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
        exp_count, meas_count, doc_count, src_count, incident_count, timeseries_count = 0, 0, 0, 0, 0, 0

    return {
        "status": "operational",
        "app": "FlameLens AI",
        "version": "1.0.0",
        "challenge": "NASA Space Apps 2026 — Flame in Freefall",
        "database": db_status,
        "verified_experiments_count": exp_count,
        "measurements_count": meas_count,
        "research_documents_count": doc_count,
        "sources_count": src_count,
        "historical_incidents_count": incident_count,
        "d2_timeseries_datasets_count": timeseries_count,
        "rag_retrieval_engine": "SQLite FTS5 (BM25) + Gemini",
        "ai_enabled": bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here"),
        "timestamp": datetime.now().isoformat()
    }


@app.get("/")
def root():
    return {
        "app": "FlameLens AI",
        "challenge": "NASA Space Apps 2026 — Flame in Freefall",
        "status": "operational",
        "api_documentation": "/docs",
        "health_check": "/api/health"
    }


# ── Startup Lifecycle ────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    print("[FlameLens Server] Checking database schema & seed status...")
    init_db()
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM experiments").fetchone()[0]
    conn.close()
    if count == 0:
        print("[FlameLens Server] Seeding verified NASA flight research...")
        from data.seed_verified_nasa import seed_verified_data
        seed_verified_data()
        from data.merge_experiments import merge_all
        merge_all()
    print(f"[FlameLens Server] Ready. Verified flight experiments: {count}")
