# FLAMELENS AI — REST API CONTRACTS & SCHEMAS (PHASE 03)
**Base URL:** `http://localhost:8000/api`  
**Swagger UI:** `http://localhost:8000/docs`  
**Redoc UI:** `http://localhost:8000/redoc`

---

## 1. System Health & Telemetry
### `GET /api/health`
- **Description:** Verifies database connectivity, operational status, and record counts across all engines.
- **Response `200 OK`:**
```json
{
  "status": "operational",
  "app": "FlameLens AI",
  "version": "1.0.0",
  "challenge": "NASA Space Apps 2026 — Flame in Freefall",
  "database": "connected",
  "verified_experiments_count": 29,
  "measurements_count": 29,
  "research_documents_count": 26,
  "sources_count": 28,
  "historical_incidents_count": 3,
  "d2_timeseries_datasets_count": 4,
  "rag_retrieval_engine": "SQLite FTS5 (BM25) + Gemini",
  "ai_enabled": true,
  "timestamp": "2026-11-14T14:00:00"
}
```

---

## 2. Spacecraft Fire Incidents (Historical Anomalies)
### `GET /api/incidents`
- **Description:** Returns all cataloged historical spaceflight fire incidents (Apollo 1, Apollo 13, Mir 1997).
- **Separation Policy:** Strictly isolated from controlled combustion experiments to prevent data contamination.

### `GET /api/incidents/{incident_id}`
- **Path Parameter:** `incident_id` (e.g. `INC-APOLLO-1`, `INC-APOLLO-13`, `INC-MIR-1997`)
- **Returns:**
  - `fire_environment`: Atmospheric conditions ($100\%$ O₂ at 115 kPa, cryogenic tanks, SFOG candle)
  - `ignition_source`: Physical electrical/chemical trigger
  - `materials_involved`: Combustible polymers and fluids
  - `consequences`: Mission losses and injuries
  - `documented_lessons_learned`: NASA-STD-6001 materials qualification, hatch designs, two-gas atmospheres
  - `relevance_to_modern_spacecraft`: Direct applications to Artemis, Gateway, and Commercial Crew
  - `nasa_reference_url`: Official NASA Safety Center / SMA links

---

## 3. Scientific Analysis & Physical Modeling
### `GET /api/analysis/d2-series-list`
- **Description:** Lists all available empirical droplet combustion time-series runs for D² Law evaluation.

### `GET /api/analysis/d2-regression`
- **Query Parameter:** `series_id` (e.g. `TS-FLEX-001`, `TS-REF-1G-HEPTANE`, `TS-FLEX-003`, `TS-FLEX-005`)
- **Returns:**
  - `calculated_burning_rate_k`: Slope $K = -d(D^2)/dt$ (mm²/s)
  - `d0_squared`: Initial diameter squared $D_0^2$ (mm²)
  - `r_squared`: Coefficient of determination $R^2$
  - `rmse`: Root Mean Square Error (mm²)
  - `uncertainty_delta_k`: Standard error of slope $\pm \Delta K$
  - `equation`: Formatted regression string
  - `empirical_points`: Array of `[{ time_s, d2_mm2 }]`
  - `fitted_points`: Array of `[{ time_s, fitted_d2_mm2 }]`
  - `scientific_interpretation`: Peer-reviewed physical explanation

### `GET /api/analysis/atmosphere-presets`
- **Description:** Pre-configured NASA exploration cabin atmospheres (ISS Normal, Artemis EVA 34% @ 56 kPa, Apollo 1 Pre-Launch, Mars Habitat, Hypoxic Margin).

### `POST /api/analysis/atmosphere-simulation`
- **Request Body:**
  ```json
  {
    "oxygen_percentage": 34.0,
    "chamber_pressure_kpa": 56.0
  }
  ```
- **Returns:**
  - `oxygen_partial_pressure_kpa`: $P_{O_2} = (O_2\% / 100) \times P_{total}$
  - `relative_flammability_index`: Scaled against standard 21% O₂ at 101.3 kPa
  - `predicted_burning_rate_multiplier`: $K/K_0$ from droplet kinetics power laws
  - `risk_category`: Hypoxic, Standard, Elevated EVA, High, or Hyperoxic Flash Fire
  - `modeled_status`: `THEORETICAL_MODEL` (Non-Flight Hardware Disclaimer)

### `GET /api/analysis/extinction-curve?fuel={fuel}`
- **Query Parameter:** `fuel` (e.g. `n-heptane`)

### `GET /api/analysis/burning-rates?series={series}`
- **Returns:** Droplet burning rate constant comparison across runs.

### `GET /api/analysis/gravity-effect?fuel={fuel}`
- **Returns:** Grouped comparisons between microgravity (0-g) and Earth normal (1-g).

---

## 4. NASA Research Library
### `GET /api/library/categories`
- **Description:** Returns scientific taxonomy counts across 10 categories, institutions (Glenn, Marshall, SMA, Spinoff, BPS), and source types.

### `GET /api/library/papers`
- **Query Parameters:**
  - `category`: Scientific category filter
  - `institution`: NASA center / organization filter
  - `source_type`: Portal / publication type
  - `series`: Series tag (`FLEX`, `ACME`, `CFI`, `BASS`, `SoFIE`)
  - `search`: Search query string
  - `limit`: Max records (default `50`)

### `GET /api/library/papers/{doc_id}`
- **Returns:** Full document dossier with `structured_sections`, `doi_references`, citation provenance, and linked experiments.

### `GET /api/library/search?q={query}`
- **Returns:** SQLite FTS5 BM25 ranked full-text search results with snippet highlighting.

---

## 5. Experiment Catalog & Details
### `GET /api/experiments`
- **Filtering:** By series, fuel, gravity (0-g vs 1-g), risk level, and keyword search.

### `GET /api/experiments/{id}`
- **Returns:** Complete single-experiment telemetry, raw measurements, flame shape, and companion experiment suggestions.

---

## 6. Experiment Comparison & Differences
### `POST /api/compare`
- **Request Body:** `{ "ids": ["FLEX-001", "REF-1G-HEPTANE"] }`
- **Returns:** Side-by-side values across 13 physical variables, percentage differences, and key physical differences.

---

## 7. Deterministic Fire Safety Risk Engine
### `GET /api/rank/all`
- **Query Parameters:** `risk_level`, `fuel_category`, `min_score`
- **Methodology:**
  $$\text{Risk} = (0.25 \times \text{Flammability} + 0.20 \times \text{Thermal} + 0.20 \times K + 0.20 \times \text{Soot} + 0.15 \times \text{Suppression}) \times 100$$
- **Note:** Deterministic formulation only. Never AI-hallucinated.

---

## 8. AI Research Assistant & Copilot (Live Gemini & RAG)
### `POST /api/chat`
- **Description:** Synchronous grounded synthesis query.
- **Request Body:**
  ```json
  {
    "question": "Why do flames become spherical in microgravity?",
    "session_id": "SES-01",
    "mode": "SCIENTIFIC_RESEARCH",
    "history": [{"role": "user", "content": "..."}]
  }
  ```
- **Supported Modes:**
  - `SCIENTIFIC_RESEARCH` (Mode A: Combustion kinetics, spherical symmetry, cool flames)
  - `SPACECRAFT_FIRE_SAFETY` (Mode B: Oxygen hazards, detection, Apollo/Mir lessons)
  - `EXPERIMENTAL_DATA_ANALYSIS` (Mode C: D² regressions, burning rate K, measurements)
- **Response `200 OK`:** Full JSON `ChatResponse` with structured sections, citations, and model details.

### `POST /api/chat/stream`
- **Description:** Server-Sent Events (SSE) streaming endpoint for live text generation.
- **Request Body:** Identical to `POST /api/chat`.
- **Event Protocol:**
  - `event: metadata`: Emits session ID, mode, and full array of retrieved citation objects.
  - `event: chunk`: Emits live text tokens as generated: `{"text": "..."}`.
  - `event: done`: Emits completion event: `{"status": "complete", "total_chars": 2450}`.
  - `event: error`: Emits on streaming interruption: `{"error": "..."}`.

### `GET /api/chat/history/{session_id}`
- **Returns:** Multi-turn conversation turns for the specified session.

### `DELETE /api/chat/history/{session_id}`
- **Description:** Clears conversation history for the specified session.

---

## 9. Mission Report Generation
### `POST /api/reports/generate`
- **Request Body:** `{ "experiment_ids": ["FLEX-001", "ACME-001", "CFI-001"], "report_title": "ISS Combustion Safety Audit" }`
- **Returns:** Publication-ready Markdown audit report with executive summary, empirical comparison tables, risk assessment, and NASA reference bibliography.
