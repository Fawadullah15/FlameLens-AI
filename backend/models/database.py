"""
FlameLens AI — NASA Microgravity Combustion Database Engine
SQLite Schema with FTS5 Full-Text Retrieval, Historical Incidents,
D² Time-Series Measurements & Atmosphere Simulation Scenarios.
NASA Space Apps 2026 | Challenge 08: Flame in Freefall
"""
from __future__ import annotations
import sqlite3
import os
from pathlib import Path
from config import DATABASE_URL


def get_connection() -> sqlite3.Connection:
    """Return a SQLite connection with row_factory set and WAL mode enabled."""
    db_path = Path(DATABASE_URL).resolve()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


SCHEMA_SQL = """
-- 1. SOURCES TABLE
CREATE TABLE IF NOT EXISTS sources (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id             TEXT UNIQUE NOT NULL,
    name                  TEXT NOT NULL,
    organization          TEXT NOT NULL DEFAULT 'NASA',
    repository            TEXT NOT NULL,
    url                   TEXT,
    description           TEXT,
    access_type           TEXT DEFAULT 'Open Access',
    verification_status   TEXT NOT NULL DEFAULT 'Verified Direct Source',
    category              TEXT DEFAULT 'Microgravity Combustion Experiments',
    institution           TEXT DEFAULT 'NASA',
    source_type           TEXT DEFAULT 'NASA Official Portal',
    created_at            TEXT DEFAULT (datetime('now'))
);

-- 2. RESEARCH DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS research_documents (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_id                TEXT UNIQUE NOT NULL,
    source_id             TEXT REFERENCES sources(source_id),
    title                 TEXT NOT NULL,
    authors               TEXT,
    publication_year      INTEGER,
    publication_venue     TEXT,
    doi_or_report_num     TEXT,
    url                   TEXT,
    abstract              TEXT,
    full_text             TEXT NOT NULL,
    page_count            INTEGER DEFAULT 1,
    series_tags           TEXT,
    extraction_method     TEXT DEFAULT 'PyMuPDF',
    category              TEXT DEFAULT 'Microgravity Combustion Experiments',
    source_type           TEXT DEFAULT 'NASA Publication',
    original_url          TEXT,
    institution           TEXT DEFAULT 'NASA',
    ingestion_status      TEXT DEFAULT 'VERIFIED_ACCESSIBLE',
    structured_sections_json TEXT,
    doi_references_json   TEXT,
    created_at            TEXT DEFAULT (datetime('now'))
);

-- 3. EXPERIMENTS TABLE
CREATE TABLE IF NOT EXISTS experiments (
    id                         INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id              TEXT UNIQUE NOT NULL,
    series                     TEXT NOT NULL,
    title                      TEXT NOT NULL,
    mission_platform           TEXT NOT NULL,
    fuel_type                  TEXT NOT NULL,
    fuel_category              TEXT NOT NULL,
    gravity_level              REAL NOT NULL,
    ambient_o2_percent         REAL,
    chamber_pressure_kpa       REAL,
    ambient_temperature_k      REAL,
    diluent_gas                TEXT DEFAULT 'N2',
    flow_velocity_cms          REAL DEFAULT 0.0,
    initial_fuel_diameter_mm   REAL,
    source_id                  TEXT REFERENCES sources(source_id),
    document_id                TEXT REFERENCES research_documents(doc_id),
    citation                   TEXT NOT NULL,
    page_citation              TEXT,
    key_finding                TEXT,
    verification_level         TEXT DEFAULT 'NASA Flight Hardware Verified',
    created_at                 TEXT DEFAULT (datetime('now'))
);

-- 4. MEASUREMENTS TABLE
CREATE TABLE IF NOT EXISTS measurements (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    measurement_id                   TEXT UNIQUE NOT NULL,
    experiment_id                    TEXT UNIQUE NOT NULL REFERENCES experiments(experiment_id) ON DELETE CASCADE,
    burning_rate_constant_k          REAL,
    peak_flame_temperature_k         REAL,
    flame_standoff_ratio             REAL,
    flame_shape                      TEXT NOT NULL,
    soot_volume_fraction_ppm         REAL,
    soot_yield_category              TEXT DEFAULT 'None',
    limiting_oxygen_index_percent    REAL,
    burn_duration_seconds            REAL,
    extinction_mode                  TEXT NOT NULL,
    cool_flame_observed              INTEGER DEFAULT 0,
    measurement_uncertainty_percent  REAL DEFAULT 5.0,
    verification_notes               TEXT,
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- 5. ANALYSIS RESULTS TABLE
CREATE TABLE IF NOT EXISTS analysis_results (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id                      TEXT UNIQUE NOT NULL,
    experiment_id                    TEXT UNIQUE NOT NULL REFERENCES experiments(experiment_id) ON DELETE CASCADE,
    fuel_type                        TEXT NOT NULL,
    risk_score                       REAL NOT NULL,
    risk_level                       TEXT NOT NULL,
    flammability_score               REAL NOT NULL,
    thermal_severity_score           REAL NOT NULL,
    soot_hazard_score                REAL NOT NULL,
    suppression_resistance_score     REAL NOT NULL,
    extinction_vulnerability_score   REAL NOT NULL,
    methodology                      TEXT NOT NULL,
    confidence_level                 TEXT NOT NULL,
    provenance_audit_trail           TEXT NOT NULL,
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- 6. CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS chat_history (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id                       TEXT NOT NULL,
    role                             TEXT NOT NULL,
    content                          TEXT NOT NULL,
    sources_used                     TEXT,
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- 7. HISTORICAL INCIDENTS TABLE (Spacecraft Fire Incidents)
CREATE TABLE IF NOT EXISTS historical_incidents (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id                      TEXT UNIQUE NOT NULL,
    mission_name                     TEXT NOT NULL,
    date                             TEXT NOT NULL,
    spacecraft                       TEXT NOT NULL,
    location                         TEXT NOT NULL,
    summary                          TEXT NOT NULL,
    fire_environment                 TEXT NOT NULL,
    ignition_source                  TEXT NOT NULL,
    materials_involved               TEXT NOT NULL,
    consequences                     TEXT NOT NULL,
    documented_lessons_learned       TEXT NOT NULL,
    relevance_to_modern_spacecraft   TEXT NOT NULL,
    nasa_reference_url               TEXT NOT NULL,
    source_id                        TEXT REFERENCES sources(source_id),
    category                         TEXT DEFAULT 'Spacecraft Fire Incidents',
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- 8. TIME SERIES MEASUREMENTS (D² Law Empirical Droplet Data)
CREATE TABLE IF NOT EXISTS time_series_measurements (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id                        TEXT NOT NULL,
    experiment_id                    TEXT NOT NULL REFERENCES experiments(experiment_id) ON DELETE CASCADE,
    fuel_type                        TEXT NOT NULL,
    gravity_level                    REAL NOT NULL,
    time_seconds                     REAL NOT NULL,
    diameter_squared_mm2             REAL NOT NULL,
    is_outlier                       INTEGER DEFAULT 0,
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- 9. ATMOSPHERE SCENARIOS (Atmospheric Flammability Modeling & Empirical Runs)
CREATE TABLE IF NOT EXISTS atmosphere_scenarios (
    id                               INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario_id                      TEXT UNIQUE NOT NULL,
    name                             TEXT NOT NULL,
    oxygen_percentage                REAL NOT NULL,
    total_pressure_kpa               REAL NOT NULL,
    oxygen_partial_pressure_kpa      REAL NOT NULL,
    relative_flammability_index      REAL NOT NULL,
    predicted_burning_rate_multiplier REAL NOT NULL,
    extinction_risk_category         TEXT NOT NULL,
    is_experimental_data             INTEGER DEFAULT 0,
    source_citation                  TEXT NOT NULL,
    engineering_notes                TEXT NOT NULL,
    category                         TEXT DEFAULT 'Oxygen Concentration Effects',
    created_at                       TEXT DEFAULT (datetime('now'))
);

-- FTS5 Full-Text Search Virtual Table for Research Documents, Experiments & Incidents
CREATE VIRTUAL TABLE IF NOT EXISTS research_fts USING fts5(
    doc_id,
    title,
    content,
    citation,
    tokenize = 'porter unicode61'
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_exp_series       ON experiments(series);
CREATE INDEX IF NOT EXISTS idx_exp_fuel         ON experiments(fuel_type);
CREATE INDEX IF NOT EXISTS idx_exp_gravity      ON experiments(gravity_level);
CREATE INDEX IF NOT EXISTS idx_exp_platform     ON experiments(mission_platform);
CREATE INDEX IF NOT EXISTS idx_meas_shape       ON measurements(flame_shape);
CREATE INDEX IF NOT EXISTS idx_meas_cool        ON measurements(cool_flame_observed);
CREATE INDEX IF NOT EXISTS idx_analysis_risk    ON analysis_results(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_level   ON analysis_results(risk_level);
CREATE INDEX IF NOT EXISTS idx_incidents_date   ON historical_incidents(date);
CREATE INDEX IF NOT EXISTS idx_timeseries_exp   ON time_series_measurements(experiment_id);
CREATE INDEX IF NOT EXISTS idx_atmosphere_scen  ON atmosphere_scenarios(scenario_id);
"""


def migrate_columns(conn: sqlite3.Connection) -> None:
    """Safely adds new columns to existing tables without data loss."""
    tables_to_columns = {
        "sources": [
            ("category", "TEXT DEFAULT 'Microgravity Combustion Experiments'"),
            ("institution", "TEXT DEFAULT 'NASA'"),
            ("source_type", "TEXT DEFAULT 'NASA Official Portal'")
        ],
        "research_documents": [
            ("category", "TEXT DEFAULT 'Microgravity Combustion Experiments'"),
            ("source_type", "TEXT DEFAULT 'NASA Publication'"),
            ("original_url", "TEXT"),
            ("institution", "TEXT DEFAULT 'NASA'"),
            ("ingestion_status", "TEXT DEFAULT 'VERIFIED_ACCESSIBLE'"),
            ("structured_sections_json", "TEXT"),
            ("doi_references_json", "TEXT")
        ]
    }

    for table, columns in tables_to_columns.items():
        cursor = conn.execute(f"PRAGMA table_info({table})")
        existing_cols = {row["name"] for row in cursor.fetchall()}
        for col_name, col_def in columns:
            if col_name not in existing_cols:
                try:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_def}")
                    print(f"[Migration] Added column '{col_name}' to table '{table}'")
                except Exception as e:
                    print(f"[Migration Error] {table}.{col_name}: {e}")
    conn.commit()


def init_db() -> None:
    """Initialize database tables, run schema migrations, and prepare FTS5 index."""
    conn = get_connection()
    conn.executescript(SCHEMA_SQL)
    migrate_columns(conn)
    conn.commit()
    conn.close()
    print("[FlameLens Database] SQLite tables, migrations, and FTS5 indices verified.")


if __name__ == "__main__":
    init_db()
